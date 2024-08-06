import { YeastBlockNodeTypes, YeastNodeFactory, ContentGroupType, isYeastNodeType, YeastParser } from 'yeast-core';
import { parse } from 'yaml';
import { XMLParser } from 'fast-xml-parser';

const FRONTMATTER_REGEX = /^\s*-{3,}\s*?\n([\s\S]+?)\n-{3,}\s*?\n([\s\S]*)/i;
class FrontmatterParserPlugin {
    parse(text) {
        let newText = text;
        let document = {
            type: YeastBlockNodeTypes.Document,
            title: 'Default Page Title',
            children: [],
        };
        const match = text.match(FRONTMATTER_REGEX);
        if (match) {
            const yaml = parse(match[1]);
            Object.entries(yaml).forEach(([key, value]) => {
                if (value)
                    document[key] = value;
            });
            newText = match[2];
        }
        return {
            remainingText: newText,
            document,
        };
    }
}

const indentationRegex = /^([ \t]*)(.*?)[ \t]*(?:$|\n)/i;
function parseIndentation(line) {
    const match = indentationRegex.exec(line);
    let indentation = match ? match[1] : '';
    indentation = indentation.replace(/\t/g, '  ');
    return {
        indentation: Math.floor(indentation.length / 2),
        content: match ? match[2] : line,
    };
}

const REMOVE_PRECEDING_NEWLINE_REGEX = /^\n*([\s\S]*)\s*/i;
class ParagraphParserPlugin {
    parse(text, parser) {
        let isLastLine = false;
        const match = text.match(REMOVE_PRECEDING_NEWLINE_REGEX);
        if (!match)
            return;
        const lines = match[1].split('\n');
        const firstLine = lines.shift();
        if (!lines[0] || lines[0].trim() === '') {
            isLastLine = true;
        }
        const nodeChild = YeastNodeFactory.CreateText();
        nodeChild.text = parseIndentation(firstLine).content;
        return {
            remainingText: lines.join('\n'),
            nodes: [
                {
                    type: YeastBlockNodeTypes.PseudoParagraph,
                    isLastLine: isLastLine,
                    children: [nodeChild],
                    indentation: parseIndentation(firstLine).indentation,
                },
            ],
        };
    }
}

const ITALICS_REGEX = /_(\S.+?)_/gi;
class ItalicsInlinePlugin {
    tokenize(text, parser) {
        const tokens = [];
        for (const match of text.matchAll(ITALICS_REGEX)) {
            const node = YeastNodeFactory.CreateItalicNode();
            node.children = parser.parseInline(match[1]);
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                from: 'ItalicsInlinePlugin',
                nodes: [node],
            });
        }
        const textArr = text.split('');
        let index = 0;
        while (index < textArr.length) {
            if (textArr[index] === '*' && textArr[index + 1] !== '*' && textArr[index + 1] !== ' ') {
                if (index >= 0 && textArr[index - 1] !== '*') {
                    let italizedText = '';
                    let startIndex = index;
                    let isInvalidSyntax = false;
                    do {
                        if (textArr[index + 1]) {
                            italizedText += textArr[++index];
                        }
                        else {
                            isInvalidSyntax = true;
                            break;
                        }
                    } while (textArr[index + 1] !== '*' && index < textArr.length);
                    if (isInvalidSyntax) {
                        index++;
                        continue;
                    }
                    const node = YeastNodeFactory.CreateItalicNode();
                    node.children = parser.parseInline(italizedText);
                    tokens.push({
                        start: startIndex,
                        end: startIndex + italizedText.length + 2,
                        from: 'ItalicsInlinePlugin',
                        nodes: [node],
                    });
                    index++;
                }
            }
            index++;
        }
        return tokens;
    }
}

const BOLD_REGEX = /\*\*(\S.+?)\*\*/gi;
class BoldInlinePlugin {
    tokenize(text, parser) {
        const tokens = [];
        for (const match of text.matchAll(BOLD_REGEX)) {
            const node = YeastNodeFactory.CreateBoldNode();
            node.children = parser.parseInline(match[1]);
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                from: 'BoldInlinePlugin',
                nodes: [node],
            });
        }
        return tokens;
    }
}

const HEADING_REGEX = /^\s*?(#{1,7})[^\S\r\n]*(.+?)[^\S\r\n]*#*[^\S\r\n]*(?:\n|$)([\s\S]*)$/i;
class HeadingParserPlugin {
    parse(text, parser) {
        const match = text.match(HEADING_REGEX);
        if (!match)
            return;
        const node = YeastNodeFactory.CreateHeadingNode();
        node.level = match[1].length;
        node.id = match[2].replace(/[^a-z0-9]/gi, '-').toLowerCase();
        node.children = parser.parseInline(match[2]);
        return {
            remainingText: match[3],
            nodes: [node],
        };
    }
}

const LIST_ITEM_REGEX = /^(\s*)([-*+]|\d+[.)])\s*(.+)\s*$/;
const WHITESPACE_REGEX = /^\s*$/;
const areYouSureItsNotJustItalicRegex = /^\s*\*(?:[^* ].*\S|[^* ])\*/;
const areYouSureItsNotJustBoldRegex = /^\s*\*\*(?:[^* ].*\S|[^* ])\*\*/;
const areYouSureItsNotJustNumericRegex = /^\s*[0-9]+\.[0-9]+\s*/;
const startNumberRegex = /(\d+)/;
class ListParserPlugin {
    parse(text, parser) {
        let lines = text.split('\n');
        let firstItemMarker;
        while (lines.length > 0 && lines[0].match(WHITESPACE_REGEX)) {
            lines.shift();
        }
        const listItems = [];
        let abort = false;
        let lastChance = false;
        while (lines.length > 0 && !abort) {
            const line = lines[0];
            const match = line.match(LIST_ITEM_REGEX);
            if (!match) {
                if (lastChance) {
                    abort = true;
                    continue;
                }
                if (line.match(WHITESPACE_REGEX)) {
                    lines.shift();
                    lastChance = true;
                }
                else {
                    abort = true;
                }
                continue;
            }
            lastChance = false;
            if (areYouSureItsNotJustBoldRegex.exec(line) ||
                areYouSureItsNotJustItalicRegex.exec(line) ||
                areYouSureItsNotJustNumericRegex.exec(line)) {
                abort = true;
                continue;
            }
            lines.shift();
            const listItem = {
                type: YeastBlockNodeTypes.ListItem,
                level: parseIndentation(match[1]).indentation,
                marker: match[2],
                children: parser.parseInline(match[3]),
            };
            if (!firstItemMarker) {
                firstItemMarker = match[2];
            }
            listItems.push(listItem);
        }
        if (listItems.length === 0)
            return;
        const node = YeastNodeFactory.CreateListNode();
        node.level = 0;
        node.children = [];
        let numericMarkerMatch = startNumberRegex.exec(firstItemMarker);
        if (numericMarkerMatch) {
            let numericmarkerStart = parseInt(numericMarkerMatch[1]);
            node.start = numericmarkerStart && numericmarkerStart >= 1 ? numericmarkerStart : 1;
            node.ordered = true;
        }
        processListItems(listItems, node);
        return {
            remainingText: lines.join('\n'),
            nodes: [node],
        };
    }
}
function processListItems(items, targetNode) {
    do {
        if (items[0].level > targetNode.level) {
            const subList = YeastNodeFactory.CreateListNode();
            subList.level = targetNode.level + 1;
            subList.children = [];
            let numericMarkerMatch = startNumberRegex.exec(items[0].marker);
            if (numericMarkerMatch) {
                subList.ordered = true;
            }
            targetNode.children.push(subList);
            processListItems(items, subList);
        }
        else if (items[0].level < targetNode.level) {
            return;
        }
        else {
            const i = items.shift();
            i.marker = undefined;
            targetNode.children.push(i);
        }
    } while (items.length > 0);
}

const STRIKETHROUGH_REGEX = /~(\S.+?)~/gi;
class InlineStrikeThroughPlugin {
    tokenize(text, parser) {
        const tokens = [];
        for (const match of text.matchAll(STRIKETHROUGH_REGEX)) {
            const node = YeastNodeFactory.CreateStrikethroughNode();
            node.children = parser.parseInline(match[1]);
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                from: 'InlineStrikeThroughPlugin',
                nodes: [node],
            });
        }
        return tokens;
    }
}

class InlineCodePlugin {
    tokenize(text, parser) {
        const tokens = [];
        const textArr = text.split('');
        let index = 0;
        try {
            while (index < textArr.length) {
                if (textArr[index] === '`' && textArr[index + 1] !== '`' && textArr[index + 1] !== ' ') {
                    if (index >= 0 && textArr[index - 1] !== '`') {
                        let code = '';
                        let startIndex = index;
                        let isInvalidSyntax = false;
                        do {
                            if (textArr[index + 1]) {
                                code += textArr[++index];
                            }
                            else {
                                isInvalidSyntax = true;
                                break;
                            }
                        } while (textArr[index + 1] !== '`' && index < textArr.length);
                        if (isInvalidSyntax) {
                            index++;
                            continue;
                        }
                        const node = YeastNodeFactory.CreateInlineCodeNode();
                        node.children = [{ text: code }];
                        tokens.push({
                            start: startIndex,
                            end: startIndex + code.length + 2,
                            from: 'InlineCodePlugin',
                            nodes: [node],
                        });
                        index++;
                    }
                }
                if (textArr[index] === '`' && textArr[index + 1] === '`' && textArr[index + 2] !== ' ') {
                    let code = '';
                    let startIndex = index;
                    let isInvalidSyntax = false;
                    index += 1;
                    do {
                        if (textArr[index + 1]) {
                            code += textArr[++index];
                        }
                        else {
                            isInvalidSyntax = true;
                            break;
                        }
                    } while (!(textArr[index + 1] === '`' && textArr[index + 2] === '`') && index < textArr.length);
                    if (isInvalidSyntax) {
                        index++;
                        continue;
                    }
                    const node = YeastNodeFactory.CreateInlineCodeNode();
                    node.children = [{ text: code }];
                    tokens.push({
                        start: startIndex,
                        end: startIndex + code.length + 4,
                        from: 'InlineCodePlugin',
                        nodes: [node],
                    });
                    index += 2;
                }
                index++;
            }
        }
        catch (err) {
            console.log(err);
            console.log(text);
        }
        return tokens;
    }
}

const LINK_REGEX = /\[([^\[\]]*)\]\((.+?)(?:\s["'](.*?)["'])?\)/gi;
class InlineLinkPlugin {
    tokenize(text, parser) {
        const tokens = [];
        for (const match of text.matchAll(LINK_REGEX)) {
            if (text.charAt(match.index - 1) === '!') {
                continue;
            }
            const node = YeastNodeFactory.CreateLinkNode();
            if (match[1].length > 0) {
                node.children = parser.parseInline(match[1]);
            }
            else {
                node.children = [{ text: match[2] }];
            }
            node.href = match[2];
            node.title = match[3] || 'Link';
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                from: 'InlineLinkPlugin',
                nodes: [node],
            });
        }
        return tokens;
    }
}

const BACKTICK_BLOCKCODE_REGEX = /^(?:\s*\n)*([ \t]*)`{3,}(.*)\n([\s\S]+?)\n\s*`{3,}.*(?:\n|$)\n?([\s\S]*)/i;
const TILDE_BLOCKCODE_REGEX = /^(?:\s*\n)*([ \t]*)~{3,}(.*)\n([\s\S]+?)\n\s*~{3,}.*(?:\n|$)\n?([\s\S]*)/i;
const INLINE_LANGUAGE_MATCH_REGEX = /^#!(.*)\s*/i;
class CodeParserPlugin {
    parse(text, parser) {
        let match = text.match(BACKTICK_BLOCKCODE_REGEX);
        if (!match)
            match = text.match(TILDE_BLOCKCODE_REGEX);
        if (!match)
            return;
        const fenceIndentation = parseIndentation(match[1]).indentation;
        let attrs = {};
        try {
            attrs = JSON.parse(match[2]);
        }
        catch (err) {
            attrs.language = match[2] || '';
        }
        let indentation = 0;
        if (match[1]) {
            indentation = match[1].length;
        }
        let code = match[3];
        const inlineLanguageMatch = code.match(INLINE_LANGUAGE_MATCH_REGEX);
        if (inlineLanguageMatch) {
            attrs.language = inlineLanguageMatch[1].trim();
            code = code.substring(inlineLanguageMatch[0].length);
        }
        if (indentation > 0) {
            const lines = code.split('\n');
            code = '';
            lines.forEach((line) => {
                if (line.length === indentation)
                    return (code += '\n');
                code += line.substring(indentation) + '\n';
            });
        }
        switch ((attrs.language || '').toLowerCase()) {
            case 'sh': {
                attrs.language = 'shell';
                break;
            }
        }
        if (attrs.tabsToSpaces) {
            let spaces = '';
            for (let i = 0; i < attrs.tabsToSpaces; i++) {
                spaces += ' ';
            }
            code = code.replace(/\t/gi, spaces);
        }
        const node = YeastNodeFactory.CreateBlockCodeNode();
        node.value = code;
        node.language = attrs.language;
        node.noCollapse = attrs.noCollapse;
        node.title = attrs.title;
        node.showLineNumbers = attrs.showLineNumbers;
        node.noCollapse = attrs.noCollapse;
        node.indentation = fenceIndentation;
        code = code.replace(/^(\s*)\\([`~]{3,}.*$)/gm, '$1$2');
        return {
            remainingText: match[4],
            nodes: [node],
        };
    }
}

const CALLOUT_REGEX = /^(\s*):{3,}(.*)\n([\s\S]+?\n)\s*:{3,}\n?([\s\S]*)/i;
function filterIndentation(textContent) {
    const sliceIndex = textContent[0].indexOf(textContent[0].trim());
    const splitText = textContent[3].split(/(\r?\n){1,}/).filter((element) => element && !element.includes('\n') && !element.includes('\r'));
    let fullText = '';
    for (let text of splitText) {
        fullText += text.substring(sliceIndex) + '\n\n';
    }
    textContent[3] = fullText;
}
class CalloutParserPlugin {
    parse(text, parser) {
        const match = text.match(CALLOUT_REGEX);
        if (!match)
            return;
        const indentation = parseIndentation(match[1]).indentation;
        if (indentation) {
            filterIndentation(match);
        }
        let attrs = {};
        try {
            attrs = JSON.parse(match[2]);
        }
        catch (err) {
            attrs.alert = match[2] || 'vanilla';
        }
        if (attrs.alert) {
            switch (attrs.alert.toLowerCase()) {
                case 'error':
                case 'danger': {
                    attrs.alert = 'critical';
                    break;
                }
                case 'vanilla':
                case 'secondary':
                case 'primary': {
                    attrs.alert = 'info';
                    break;
                }
                default: {
                    attrs.alert = attrs.alert.toLowerCase();
                }
            }
        }
        const node = YeastNodeFactory.CreateCalloutNode();
        node.children = parser.parseBlock(match[3]);
        node.alertType = (attrs.alert || '').toLowerCase();
        node.title = attrs.title;
        node.autoCollapse = attrs.autoCollapse;
        node.collapsible = attrs.collapsible;
        node.indentation = indentation;
        return {
            remainingText: match[4],
            nodes: [node],
        };
    }
}

const BLOCKQUOTE_REGEX = /^\s*>[ \t]*(.+)*/i;
class BlockquoteParserPlugin {
    parse(text, parser) {
        const match = text.match(BLOCKQUOTE_REGEX);
        if (!match)
            return;
        let blockContent = '';
        const lines = text.trimStart().split('\n');
        let l = 0;
        while (lines[l] && lines[l].startsWith('>')) {
            const lineContent = lines[l].match(BLOCKQUOTE_REGEX)[1];
            if (!lineContent || lineContent.trim() === '') {
                blockContent += '\n\n';
            }
            else {
                blockContent += lineContent + ' ';
            }
            l++;
        }
        const node = YeastNodeFactory.CreateBlockquoteNode();
        node.children = parser.parseBlock(blockContent.trimEnd());
        return {
            remainingText: lines.slice(l).join('\n'),
            nodes: [node],
        };
    }
}

const ASTERISKS_REGEX = /^\s*?(\*{3,})\n?([\s\S]*)/i;
const HYPHEN_REGEX = /^\s*?(-{3,})\n?([\s\S]*)/i;
const UNDERSCORE_REGEX = /^\s*?(_{3,})\n?([\s\S]*)/i;
class HorizontalRuleParserPlugin {
    parse(text, parser) {
        const match = text.match(ASTERISKS_REGEX) || text.match(UNDERSCORE_REGEX) || text.match(HYPHEN_REGEX);
        if (!match)
            return;
        const node = YeastNodeFactory.CreateHorizontalRuleNode();
        return {
            remainingText: match[2],
            nodes: [node],
        };
    }
}

const TAB_REGEX = /^\s*%{3,}[^\S\r\n]*(.+)/i;
const END_TAB_REGEX = /^%{3,}\s*$/i;
const PlACEHOLDER_TITLE = 'TITLE';
class ContentGroupParserPlugin {
    parse(text, parser) {
        const match = TAB_REGEX.exec(text);
        if (!match)
            return;
        let lines;
        let endBlockIndex;
        let tabs = [];
        let title = '';
        let groupType = '';
        let rootGroupType;
        let tabIndex = -1;
        const itemNodes = [];
        lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const titleMatch = TAB_REGEX.exec(lines[i]);
            if (titleMatch) {
                let attrs = {};
                try {
                    attrs = JSON.parse(titleMatch[1].trim());
                    if (typeof attrs !== 'object') {
                        throw 'Invalid JSON type';
                    }
                    if (attrs.format === undefined) {
                        attrs.format = ContentGroupType.tabbedContent;
                    }
                    if (attrs.title === undefined || attrs.title.trim() === '') {
                        title = PlACEHOLDER_TITLE;
                    }
                    else {
                        title = attrs.title.trim();
                    }
                    groupType = attrs.format;
                    if (!rootGroupType) {
                        rootGroupType = groupType;
                    }
                }
                catch (err) {
                    attrs = {};
                    attrs.format = ContentGroupType.tabbedContent;
                    groupType = attrs.format;
                    if (!rootGroupType) {
                        rootGroupType = groupType;
                    }
                    if (titleMatch[1] === undefined || titleMatch[1].trim() === '') {
                        return;
                    }
                    title = titleMatch[1].trim();
                }
                tabIndex++;
                tabs[tabIndex] = {
                    groupType: attrs.format,
                    content: '',
                    title: title,
                };
                continue;
            }
            const endMatch = END_TAB_REGEX.exec(lines[i]);
            if (endMatch) {
                endBlockIndex = i + 1;
                break;
            }
            if (title) {
                tabs[tabIndex].content += lines[i] + '\n';
            }
        }
        if (!endBlockIndex) {
            return;
        }
        for (const t of tabs) {
            const itemNode = YeastNodeFactory.CreateContentGroupItemNode();
            itemNode.groupType = t.groupType;
            itemNode.title = t.title;
            itemNode.children = parser.parseBlock(t.content);
            itemNodes.push(itemNode);
        }
        const remainingText = lines.slice(endBlockIndex);
        const node = YeastNodeFactory.CreateContentGroupNode();
        node.children = [...itemNodes];
        node.groupType = rootGroupType;
        return {
            remainingText: remainingText.join('\n'),
            nodes: [node],
        };
    }
}

const CUSTOM_COMPONENT_REGEX = /^\s*(<(?:yeast|dxui):.*)([\s\S]*)$/i;
class CustomComponentParserPlugin {
    parse(text, parser) {
        const match = text.match(CUSTOM_COMPONENT_REGEX);
        if (!match)
            return;
        const parserOptions = {
            ignoreAttributes: false,
            allowBooleanAttributes: true,
            parseTagValue: false,
            preserveOrder: true,
            isArray: () => {
                return true;
            },
        };
        const xmlParser = new XMLParser(parserOptions);
        let xmlJson;
        let rawXml = '';
        let remainingText = '';
        try {
            xmlJson = xmlParser.parse(match[1], true);
            remainingText = match[2];
        }
        catch (err) {
            const lines = text.trim().split('\n');
            let i = 0;
            while (lines[i] && lines[i] !== '\n') {
                rawXml += lines[i] + '\n';
                i++;
            }
            remainingText = lines.splice(i + 1).join('\n');
            try {
                xmlJson = xmlParser.parse(rawXml, true);
            }
            catch (err) {
                return;
            }
        }
        const parseXmlJson = (parentNode, childrenArray) => {
            const children = [];
            for (const child of childrenArray) {
                let keys = Object.keys(child);
                if (keyExists(keys, 'yeast')) {
                    let childNode = {};
                    let componentName = '';
                    let rawKey = '';
                    keys.forEach((k) => {
                        if (k.includes('yeast')) {
                            componentName = k.split(':')[1];
                            childNode.type = componentName;
                            rawKey = k;
                        }
                        if (k.includes(':@')) {
                            for (const attr in child[':@']) {
                                const attribute = attr.slice(2);
                                childNode[attribute] = child[':@'][attr];
                            }
                        }
                    });
                    children.push(parseXmlJson(childNode, child[rawKey]));
                }
                else if (keyExists(keys, '#text')) {
                    parentNode.children = parser.parseBlock(child['#text']);
                }
            }
            if (children.length > 0) {
                if (!parentNode.children)
                    parentNode.children = [];
                parentNode.children = [...parentNode.children, ...children];
            }
            return parentNode;
        };
        let rootComponent = '';
        let rootComponentChildren = [];
        const node = {};
        const rootNode = xmlJson[0];
        for (const p in rootNode) {
            if (p.includes('yeast') || p.includes('dxui')) {
                rootComponent = p.split(':')[1];
                rootComponentChildren = rootNode[p];
            }
            if (p.includes(':@')) {
                for (const attr in rootNode[p]) {
                    const attribute = attr.slice(2);
                    node[attribute] = rootNode[p][attr];
                }
            }
        }
        node.type = rootComponent;
        return {
            remainingText: remainingText,
            nodes: rootComponentChildren.length === 0 ? [node] : [parseXmlJson(node, rootComponentChildren)],
        };
    }
}
const keyExists = (arr, key) => {
    return arr.find((k) => {
        return k.includes(key);
    });
};

const IS_TABLE = /^\s*(.+?)\s*\|\s*(.+)(?:\||$)/;
const IS_ALIGNMENT_ROW = /^.*\s*:*-+:*\s*\|\s*:*-+:*\s*\|{0,1}$/;
const ALIGNMENT_CELL = /^\s*\|{0,1}\s*(:*)-+(:*)\s*(?:\||$)/;
const CELL_CONTENT = /^\s*([^|\\]+?)\s*(\||\\\s*$|$)/;
const CELL_NORMALIZER = /^\s*\|{0,1}/;
const TABLE_CLASS = /^\s*\{:\s*class\s*=\s*["'](.+?)["']\s*\}/i;
class TableParserPlugin {
    parse(text, parser) {
        const tableNode = YeastNodeFactory.CreateTableNode();
        const lines = text.trim().split('\n');
        let l = 0;
        if (lines.length < 2 || !IS_TABLE.exec(lines[0]) || !IS_TABLE.exec(lines[1]))
            return;
        tableNode.indentation = parseIndentation(lines[0]).indentation;
        let alignment = parseAlignmentLine(lines[1]);
        if (alignment) {
            tableNode.children.push(parseLine(lines[0], alignment, parser));
            tableNode.children[0].header = true;
            l = 2;
        }
        else {
            alignment = parseAlignmentLine(lines[0]);
            if (alignment) {
                l = 1;
            }
        }
        if (alignment) {
            tableNode.align = abbreviateAlignment(alignment);
        }
        let rowElements;
        do {
            rowElements = parseLine(lines[l], alignment, parser);
            if (rowElements) {
                tableNode.children.push(rowElements);
                l++;
            }
        } while (rowElements);
        let tableClasses = TABLE_CLASS.exec(lines.length > l ? lines[l] : '');
        if (tableClasses) {
            tableClasses = tableClasses[1].split(' ');
            for (const c of tableClasses) {
                switch (c) {
                    case 'sortable':
                        tableNode.sortable = true;
                        break;
                    case 'filterable':
                        tableNode.filterable = true;
                        break;
                    case 'paginated':
                        tableNode.paginated = true;
                        break;
                }
            }
            l++;
        }
        return {
            remainingText: lines.slice(l, lines.length).join('\n'),
            nodes: [tableNode],
        };
    }
}
const parseLine = (line, alignment, parser) => {
    if (!IS_TABLE.exec(line))
        return;
    const row = YeastNodeFactory.CreateTableRowNode();
    row.children = [];
    let colspanColStart;
    let isCell = false;
    const lineContent = parseIndentation(line);
    let remainingLine = lineContent.content;
    let match = CELL_NORMALIZER.exec(remainingLine);
    if (match) {
        remainingLine = remainingLine.substring(match[0].length);
    }
    let columnNumber = -1;
    do {
        columnNumber++;
        if (remainingLine.startsWith('|')) {
            colspanColStart = colspanColStart || row.children.length - 1;
            row.children[colspanColStart].colspan = row.children[colspanColStart].colspan || 1;
            row.children[colspanColStart].colspan++;
            isCell = true;
            row.children.push(undefined);
            remainingLine = remainingLine.substring(1);
            continue;
        }
        const cellContentMatch = CELL_CONTENT.exec(remainingLine);
        isCell = cellContentMatch !== null;
        if (!isCell)
            continue;
        const cell = YeastNodeFactory.CreateTableCellNode();
        cell.children = parser.parseBlock(cellContentMatch[1]);
        if (cell.children.length === 0)
            cell.children.push(YeastNodeFactory.CreateParagraphNode());
        cell.align = alignment ? alignment[columnNumber] : 'left';
        row.children.push(cell);
        remainingLine = remainingLine.substring(cellContentMatch[0].length);
    } while (isCell);
    return row;
};
const parseAlignmentLine = (line) => {
    if (!IS_ALIGNMENT_ROW.exec(line))
        return;
    const alignment = [];
    let match;
    do {
        match = ALIGNMENT_CELL.exec(line);
        if (!match)
            continue;
        if (match[1] && match[2])
            alignment.push('center');
        else if (match[2])
            alignment.push('right');
        else
            alignment.push('left');
        line = line.substring(match[0].length);
    } while (match);
    return alignment;
};
const abbreviateAlignment = (alignments) => {
    return alignments
        .map((a) => {
        switch (a.charAt(0)) {
            case 'c':
                return 'C';
            case 'l':
                return 'L';
            case 'r':
                return 'R';
        }
    })
        .join('|');
};

class PsuedoParagraphScrubber {
    parse(astDoc, parser) {
        return joinAdjacentParagraphNode(astDoc, parser);
    }
}
const joinAdjacentParagraphNode = (node, parser) => {
    let paragraphNode = YeastNodeFactory.CreateParagraphNode();
    let paragraphText = '';
    for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].children && node.children[i].type !== YeastBlockNodeTypes.PseudoParagraph) {
            node.children[i] = joinAdjacentParagraphNode(node.children[i], parser);
        }
        if (node.children[i].type !== YeastBlockNodeTypes.PseudoParagraph) {
            continue;
        }
        if (node.children[i].isLastLine === false) {
            let j = i;
            let paragraphIndentation = 0;
            if (node.children[j].children[0].text.trim() === '') {
                paragraphIndentation = node.children[j + 1].indentation;
            }
            else {
                paragraphIndentation = node.children[j].indentation;
            }
            while (node.children[j] && node.children[j].isLastLine === false) {
                if (node.children[j].children[0].text.trim() === '') {
                    node.children.splice(j, 1);
                    if (node.children[j].isLastLine === true) {
                        i--;
                        break;
                    }
                    continue;
                }
                paragraphText += node.children[j].children[0].text + ' ';
                j++;
                if (node.children[j].isLastLine === true) {
                    paragraphText += node.children[j].children[0].text + ' ';
                    paragraphNode.children = parser.parseInline(paragraphText.trimEnd());
                    paragraphNode.indentation = paragraphIndentation;
                    node.children.splice(i, j - i + 1, paragraphNode);
                    paragraphNode = YeastNodeFactory.CreateParagraphNode();
                    paragraphText = '';
                    break;
                }
                else if (node.children[j].type !== YeastBlockNodeTypes.PseudoParagraph) {
                    paragraphNode.children = parser.parseInline(paragraphText.trimEnd());
                    paragraphNode.indentation = paragraphIndentation;
                    node.children.splice(i, j - i, paragraphNode);
                    paragraphNode = YeastNodeFactory.CreateParagraphNode();
                    paragraphText = '';
                    break;
                }
            }
        }
        else {
            paragraphText += node.children[i].children[0].text;
            paragraphNode.children = parser.parseInline(paragraphText);
            paragraphNode.indentation = node.children[i].indentation;
            if (paragraphText.trim() === '') {
                node.children.splice(i, 1);
                i--;
            }
            else {
                node.children.splice(i, 1, paragraphNode);
            }
            paragraphText = '';
            paragraphNode = YeastNodeFactory.CreateParagraphNode();
        }
    }
    return node;
};

class ParagraphDenester {
    parse(document, parser) {
        document.children = denest(document.children);
        return document;
    }
}
function denest(nodes) {
    let reprocess = false;
    do {
        reprocess = false;
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (isYeastNodeType(node, YeastBlockNodeTypes.Paragraph)) {
                const typedNode = node;
                if (typedNode.children &&
                    typedNode.children.length === 1 &&
                    isYeastNodeType(typedNode.children[0], YeastBlockNodeTypes.Paragraph)) {
                    nodes[i] = typedNode.children[0];
                    reprocess = true;
                    break;
                }
            }
        }
    } while (reprocess);
    nodes.forEach((node) => {
        if ('type' in node && 'children' in node) {
            node.children = denest(node.children);
        }
    });
    return nodes;
}

const TEXT_LINK_REGEX = /https:\/\/[^ )]+/gi;
class InlineTextLinkPlugin {
    tokenize(text, parser) {
        const tokens = [];
        for (const match of text.matchAll(TEXT_LINK_REGEX)) {
            const node = YeastNodeFactory.CreateLinkNode();
            const linkText = { text: match[0] };
            node.children = [linkText];
            node.href = match[0];
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                from: 'InlineLinkPlugin',
                nodes: [node],
            });
        }
        return tokens;
    }
}

const IMAGE_REGEX$1 = /!\[([^\[\]]*)\]\((.+?)(?:\s["'](.*?)["'])?\)/gi;
class InlineImagePlugin {
    tokenize(text, parser) {
        const tokens = [];
        for (const match of text.matchAll(IMAGE_REGEX$1)) {
            const node = YeastNodeFactory.CreateImageNode();
            node.title = match[1];
            node.src = match[2];
            node.alt = match[3];
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                from: 'InlineImagePlugin',
                nodes: [node],
            });
        }
        return tokens;
    }
}

const IMAGE_LINK_REGEX = /\[[\t ]*!\[([^\[\]]*)\]\((.+?)(?:\s["'](.*?)["'])?\)\]\((.+?)(?:\s["'](.*?)["'])?\)/gi;
class InlineImageLinkPlugin {
    tokenize(text, parser) {
        const tokens = [];
        for (const match of text.matchAll(IMAGE_LINK_REGEX)) {
            const imageNode = YeastNodeFactory.CreateImageNode();
            imageNode.title = match[1];
            imageNode.src = match[2];
            imageNode.alt = match[3];
            const linkNode = YeastNodeFactory.CreateLinkNode();
            linkNode.href = match[4];
            linkNode.title = match[5];
            linkNode.children = [imageNode];
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                from: 'InlineImageLinkParserPlugin',
                nodes: [linkNode],
            });
        }
        return tokens;
    }
}

class MarkdownParser extends YeastParser {
    constructor() {
        super();
        this.registerRootPlugin(new FrontmatterParserPlugin());
        this.registerPostProcessorPlugin(new PsuedoParagraphScrubber());
        this.registerPostProcessorPlugin(new ParagraphDenester());
        this.registerBlockPlugin(new HeadingParserPlugin());
        this.registerBlockPlugin(new HorizontalRuleParserPlugin());
        this.registerBlockPlugin(new CalloutParserPlugin());
        this.registerBlockPlugin(new CodeParserPlugin());
        this.registerBlockPlugin(new ContentGroupParserPlugin());
        this.registerBlockPlugin(new BlockquoteParserPlugin());
        this.registerBlockPlugin(new ListParserPlugin());
        this.registerBlockPlugin(new TableParserPlugin());
        this.registerBlockPlugin(new CustomComponentParserPlugin());
        this.registerBlockPlugin(new ParagraphParserPlugin());
        this.registerInlinePlugin(new InlineCodePlugin());
        this.registerInlinePlugin(new InlineStrikeThroughPlugin());
        this.registerInlinePlugin(new ItalicsInlinePlugin());
        this.registerInlinePlugin(new BoldInlinePlugin());
        this.registerInlinePlugin(new InlineImageLinkPlugin());
        this.registerInlinePlugin(new InlineImagePlugin());
        this.registerInlinePlugin(new InlineLinkPlugin());
        this.registerInlinePlugin(new InlineTextLinkPlugin());
    }
}

const IMAGE_REGEX = /^\s*(.*)!\[([^\[\]]*)\]\((.+?)(?:\s["'](.*?)["'])?\)(.*)(?:\n|$)([\s\S]*)/i;
class ImageParserPlugin {
    parse(text, parser) {
        const match = text.match(IMAGE_REGEX);
        if (!match || !match[3])
            return;
        const imageNode = YeastNodeFactory.CreateImageNode();
        imageNode.title = match[2];
        imageNode.src = match[3];
        imageNode.alt = match[4];
        const beforeNodes = parser.parseBlock(match[1]);
        const afterNodes = parser.parseBlock(match[5]);
        return {
            remainingText: match[6],
            nodes: [...beforeNodes, imageNode, ...afterNodes],
        };
    }
}

export { BlockquoteParserPlugin, BoldInlinePlugin, CalloutParserPlugin, CodeParserPlugin, ContentGroupParserPlugin, CustomComponentParserPlugin, FrontmatterParserPlugin, HeadingParserPlugin, HorizontalRuleParserPlugin, ImageParserPlugin, InlineCodePlugin, InlineImageLinkPlugin, InlineLinkPlugin, InlineStrikeThroughPlugin, ItalicsInlinePlugin, ListParserPlugin, MarkdownParser, ParagraphParserPlugin, TableParserPlugin };
//# sourceMappingURL=index.js.map
