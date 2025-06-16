import { isYeastNode, isYeastTextNode, ContentGroupType, YeastBlockNodeTypes, isYeastInlineNode, YeastInlineNodeTypes } from 'yeast-core';
import { fragment } from 'xmlbuilder2';

function renderCustomComponent(node) {
    if (!isYeastNode(node) && !isYeastTextNode(node))
        return;
    const root = fragment();
    const buildTree = (node, parent) => {
        if (!node)
            return;
        if (isYeastTextNode(node)) {
            parent.txt(node.text).up();
            return;
        }
        const typedNode = node;
        let elemProps = {};
        for (const property in typedNode) {
            if (property !== 'type' && property !== 'children' && property !== 'text') {
                elemProps[property] = typedNode[property];
            }
        }
        let elem = elemProps ? parent.ele(`yeast:${typedNode.type}`, elemProps) : parent.ele(`yeast:${typedNode.type}`);
        if (typedNode.children) {
            for (const child of typedNode.children) {
                buildTree(child, elem);
            }
        }
    };
    buildTree(node, root);
    return `\n${root.end({ prettyPrint: true })}\n`;
}

const LITERAL_BACKTICK_REGEX = /((?:^|\n+)(?:\t+|\s+)*)(`{3})/ig;
const LITERAL_TILDE_REGEX = /((?:^|\n+)(?:\t+|\s+)*)(~{3})/ig;
function renderBlockCodeNode(node, renderer) {
    const jsonOptions = {
        title: node.title,
        language: node.language,
        autocollapse: node.autoCollapse,
        noCollapse: node.noCollapse,
        tabsToSpaces: node.tabsToSpaces,
        showLineNumbers: node.showLineNumbers,
    };
    const backtickEscapedVal = node.value.replace(LITERAL_BACKTICK_REGEX, '$1\\$2');
    const tildeEscapedVal = backtickEscapedVal.replace(LITERAL_TILDE_REGEX, '$1\\$2');
    const children = tildeEscapedVal.split('\n');
    let finalVal = '';
    const indentation = '\t';
    children.forEach((child, index) => {
        if (index !== children.length - 1)
            finalVal += `${indentation.repeat(node.indentation)}${child}\n`;
        else if (index === children.length - 1 && child.length !== 0)
            finalVal += `${indentation.repeat(node.indentation)}${child}`;
    });
    const hasOptions = Object.keys(node).some((key) => node[key] !== undefined && key !== 'language' && key !== 'type' && key !== 'value' && key !== 'indentation');
    if (!hasOptions)
        return `\n${indentation.repeat(node.indentation)}\`\`\`${node.language}\n${finalVal}\n${indentation.repeat(node.indentation)}\`\`\`\n`;
    return `\n${indentation.repeat(node.indentation)}\`\`\`${JSON.stringify(jsonOptions)}\n${tildeEscapedVal}\n${indentation.repeat(node.indentation)}\`\`\`\n`;
}

function renderBlockquoteNode(node, renderer) {
    let blockQuoteItems = node.children
        .map((item) => {
        return `${renderer.renderComponents([item]).join('')}`;
    })
        .join('')
        .trim();
    let children = blockQuoteItems.split('\n');
    let blockQuoteString = '';
    for (let index = 0; index < children.length; index++) {
        if (index == children.length - 1) {
            blockQuoteString += `> ${children[index]}`;
        }
        else
            blockQuoteString += `> ${children[index]}\n`;
    }
    return `\n${blockQuoteString}\n`;
}

function renderBoldNode(node, renderer) {
    return `**${renderer.renderComponents(node.children).join('').trim()}**`;
}

function renderCalloutNode(node, renderer) {
    const jsonOption = { alert: node.alertType, title: node.title, collapsible: node.collapsible, autoCollapse: node.autoCollapse };
    const hasOptions = Object.keys(node).some((key) => node[key] !== undefined && key !== 'alertType' && key !== 'type' && key !== 'children' && key !== 'indentation');
    const children = renderer.renderComponents(node.children).join('').trim().split('\n');
    let finalVal = '';
    const indentation = '\t';
    children.forEach((child, index) => {
        if (index !== children.length - 1)
            finalVal += `${indentation.repeat(node.indentation)}${child}\n`;
        else if (index === children.length - 1 && child.length !== 0)
            finalVal += `${indentation.repeat(node.indentation)}${child}`;
    });
    if (!hasOptions)
        return `\n${indentation.repeat(node.indentation)}:::${node.alertType}\n${finalVal}\n${indentation.repeat(node.indentation)}:::\n`;
    return `\n${indentation.repeat(node.indentation)}:::${JSON.stringify(jsonOption)}\n${finalVal}\n${indentation.repeat(node.indentation)}:::\n`;
}

function renderContentGroupItemNode(node, renderer) {
    const jsonOptions = { title: node.title, type: node.groupType };
    if (node.groupType && node.groupType === ContentGroupType.tabbedContent)
        return `%%% ${node.title}\n${renderer.renderComponents(node.children).join('')}\n`;
    return `%%% ${JSON.stringify(jsonOptions)}\n${renderer.renderComponents(node.children).join('')}\n`;
}

function renderContentGroupNode(node, renderer) {
    return `\n${renderer.renderComponents(node.children).join('').trim()}\n%%%\n`;
}

function renderHeadingNode(node, renderer) {
    const content = renderer.renderComponents(node.children).join('').replace(/#/g, `\\#`);
    switch (node.level) {
        case 1: {
            return `\n# ${content} \n`;
        }
        case 2: {
            return `\n## ${content} \n`;
        }
        case 3: {
            return `\n### ${content} \n`;
        }
        case 4: {
            return `\n#### ${content} \n`;
        }
        case 5: {
            return `\n##### ${content} \n`;
        }
        case 6: {
            return `\n###### ${content} \n`;
        }
        case 7: {
            return `\n####### ${content} \n`;
        }
    }
}

function renderHorizontalRuleNode() {
    return `\n\n --- \n\n`;
}

function renderImageNode(node, renderer) {
    return `![${node.title || ''}](${node.src} "${node.alt || ''}")`;
}

function renderInlineCodeNode(node, renderer) {
    const scrapeText = (node) => {
        let s = '';
        if (Array.isArray(node.children))
            s += node.children.map(scrapeText).join();
        if (node.text)
            s += node.text;
        return s;
    };
    let marker = '`';
    if (scrapeText(node).includes('`'))
        marker = '``';
    return `${marker}${renderer.renderComponents(node.children).join('')}${marker}`;
}

function renderItalicNode(node, renderer) {
    return `*${renderer.renderComponents(node.children).join('')}*`;
}

function renderLinkNode(node, renderer) {
    if (node.title) {
        return `[${renderer.renderComponents(node.children).join('')}](${node.href} "${node.title}")`;
    }
    return `[${renderer.renderComponents(node.children).join('')}](${node.href})`;
}

function renderListItemNode(node, renderer) {
    return `${renderer.renderComponents(node.children).join('')}`;
}

function renderListNode(node, renderer) {
    let indentation = '\t';
    let level = node.level !== undefined ? node.level : 0;
    if (node.ordered) {
        let orderedItems = node.children.map((item, index) => {
            if (item.type === 'list')
                return renderer.renderComponents([item]);
            return `${indentation.repeat(level)}${node.start !== undefined ? node.start + index : index + 1}. ${renderer
                .renderComponents([item])
                .join('')}\n`;
        });
        if (level > 0)
            return orderedItems.join('');
        return `\n${orderedItems.join('')}`;
    }
    let items = node.children.map((item) => {
        if (item.type === 'list')
            return renderer.renderComponents([item]);
        return `${indentation.repeat(level)}- ${renderer.renderComponents([item]).join()}\n`;
    });
    if (level > 0)
        return items.join('');
    return `\n${items.join('')}`;
}

const TILDE_REGEX = /\\~(\S.+?)\\~/gi;
function renderParagraphNode(node, renderer) {
    const children = renderer.renderComponents(node.children).join('').split('\n');
    let finalString = '';
    const indentation = '\t';
    children.forEach((child, index) => {
        for (const match of child.matchAll(TILDE_REGEX)) {
            child = child.replace(TILDE_REGEX, (match, p1) => {
                return `\\~${p1}\\~`;
            });
        }
        if (index !== children.length - 1)
            finalString += `${indentation.repeat(node.indentation)}${child}\n`;
        else if (index === children.length - 1 && child.length !== 0)
            finalString += `${indentation.repeat(node.indentation)}${child}`;
    });
    console.log(finalString);
    return `\n${finalString}\n`;
}

function renderStrikethroughode(node, renderer) {
    return `~~${renderer.renderComponents(node.children).join('').replace(/~/g, `\\~`)}~~`;
}

function renderTableCellNode(node, renderer) {
    const isYeastNodeType = (node, type) => {
        return node.hasOwnProperty('type') && node.type.toLowerCase() === type.toLowerCase();
    };
    let children = node.children;
    if (children.length === 1 && isYeastNodeType(children[0], YeastBlockNodeTypes.Paragraph)) {
        children = children[0].children;
    }
    return ` ${renderer.renderComponents(children).join('').replace(/\|/g, `\\|`)} |`;
}

function renderTableNode(node, renderer) {
    const isInlineOnly = (nodes) => {
        return !nodes.some((node) => !isYeastInlineNode(node) && !isYeastTextNode(node));
    };
    const isYeastNodeType = (node, type) => {
        return node.hasOwnProperty('type') && node.type.toLowerCase() === type.toLowerCase();
    };
    const isComplexTable = node.children.some((row) => {
        return row.children.some((cell) => {
            if (cell.children.length === 1 && isYeastNodeType(cell.children[0], YeastBlockNodeTypes.Paragraph)) {
                const paragraphNode = cell.children[0];
                if (!paragraphNode.children)
                    return false;
                return !isInlineOnly(paragraphNode.children);
            }
            else {
                return !isInlineOnly(cell.children);
            }
        });
    });
    if (isComplexTable)
        return renderCustomComponent(node);
    let alignStr = '|';
    if (node.align) {
        for (const alignChar of node.align.split('|')) {
            if (alignChar == 'R') {
                alignStr += ' ---: |';
            }
            else if (alignChar == 'L') {
                alignStr += ' :--- |';
            }
            else {
                alignStr += ' :---: |';
            }
        }
        const diff = node.children[0].children.length - node.align.split('|').length;
        if (diff > 0) {
            for (let index = diff; index < node.align.split('|').length; index++) {
                alignStr += ' :---: |';
            }
        }
    }
    else {
        for (let index = 0; index < node.children[0].children.length; index++) {
            alignStr += ' :---: |';
        }
    }
    if (node.children[0].header) {
        const indentation = '\t';
        const headerChildren = renderer.renderComponents([node.children[0]]).join('').split('\n');
        let headerVal = '';
        headerChildren.forEach((child) => {
            if (child.trim().length > 0) {
                headerVal += `${indentation.repeat(node.indentation)}${child}\n`;
            }
        });
        headerVal += `${indentation.repeat(node.indentation)}${alignStr}\n`;
        let finalVal = '';
        const children = renderer.renderComponents(node.children.slice(1)).join('').split('\n');
        children.forEach((child, index) => {
            if (index !== children.length - 1)
                finalVal += `${indentation.repeat(node.indentation)}${child}\n`;
            else if (index === children.length - 1 && child.length !== 0)
                finalVal += `${indentation.repeat(node.indentation)}${child}`;
        });
        return `\n${headerVal}${finalVal}`;
    }
    else {
        const indentation = '\t';
        let finalVal = `${indentation.repeat(node.indentation)}${alignStr}\n`;
        const children = renderer.renderComponents(node.children).join('').split('\n');
        children.forEach((child) => {
            if (child.trim().length > 0) {
                finalVal += `${indentation.repeat(node.indentation)}${child}\n`;
            }
        });
        return `\n${finalVal}`;
    }
}

function renderTableRowNode(node, renderer) {
    return `|${renderer.renderComponents(node.children).join('')}\n`;
}

class MarkdownRenderer {
    constructor(customRenderers) {
        this.defaultRenderers = {
            [YeastInlineNodeTypes.Bold]: (node, renderer) => {
                return renderBoldNode(node, renderer);
            },
            [YeastInlineNodeTypes.Code]: (node, renderer) => {
                return renderInlineCodeNode(node, renderer);
            },
            [YeastInlineNodeTypes.Italic]: (node, renderer) => {
                return renderItalicNode(node, renderer);
            },
            [YeastInlineNodeTypes.Link]: (node, renderer) => {
                return renderLinkNode(node, renderer);
            },
            [YeastInlineNodeTypes.Strikethrough]: (node, renderer) => {
                return renderStrikethroughode(node, renderer);
            },
            [YeastBlockNodeTypes.Paragraph]: (node, renderer) => {
                return renderParagraphNode(node, renderer);
            },
            [YeastBlockNodeTypes.Blockquote]: (node, renderer) => {
                return renderBlockquoteNode(node, renderer);
            },
            [YeastBlockNodeTypes.Callout]: (node, renderer) => {
                return renderCalloutNode(node, renderer);
            },
            [YeastBlockNodeTypes.Code]: (node, renderer) => {
                return renderBlockCodeNode(node);
            },
            [YeastBlockNodeTypes.ContentGroup]: (node, renderer) => {
                return renderContentGroupNode(node, renderer);
            },
            [YeastBlockNodeTypes.ContentGroupItem]: (node, renderer) => {
                return renderContentGroupItemNode(node, renderer);
            },
            [YeastBlockNodeTypes.Heading]: (node, renderer) => {
                return renderHeadingNode(node, renderer);
            },
            [YeastBlockNodeTypes.HorizontalRule]: () => {
                return renderHorizontalRuleNode();
            },
            [YeastInlineNodeTypes.Image]: (node, renderer) => {
                return renderImageNode(node);
            },
            [YeastBlockNodeTypes.List]: (node, renderer) => {
                return renderListNode(node, renderer);
            },
            [YeastBlockNodeTypes.ListItem]: (node, renderer) => {
                return renderListItemNode(node, renderer);
            },
            [YeastBlockNodeTypes.Table]: (node, renderer) => {
                return renderTableNode(node, renderer);
            },
            [YeastBlockNodeTypes.TableRow]: (node, renderer) => {
                return renderTableRowNode(node, renderer);
            },
            [YeastBlockNodeTypes.TableCell]: (node, renderer) => {
                return renderTableCellNode(node, renderer);
            },
        };
        this.customRenderers = customRenderers;
    }
    renderComponents(nodes) {
        if (!nodes)
            return;
        return nodes.map((node) => {
            let rendered = this.renderComponent(node, this.customRenderers);
            if (!!rendered)
                return rendered;
            rendered = this.renderComponent(node, this.defaultRenderers);
            if (rendered === '' || !!rendered)
                return rendered;
            if (!rendered && this.unhandledNodeRenderer) {
                rendered = this.unhandledNodeRenderer(node, this);
                if (!!rendered)
                    return rendered;
            }
            if (!rendered) {
                if (isYeastTextNode(node) && !isYeastNode(node)) {
                    const typedNode = node;
                    return typedNode.text;
                }
                else {
                    return renderCustomComponent(node);
                }
            }
        });
    }
    renderComponent(node, renderers) {
        if (!node || !renderers)
            return;
        if (!node.type)
            return;
        const typedNode = node;
        typedNode.children = typedNode.children || [];
        let markdownString;
        Object.entries(renderers).some(([nodeType, plugin]) => {
            if (typedNode.type === nodeType) {
                markdownString = plugin(node, this);
            }
            return !!markdownString;
        });
        return markdownString;
    }
    renderMarkdown(astDocument) {
        let documentChildren = this.renderComponents(astDocument.children).join('');
        let documentInfo = '---\n';
        Object.entries(astDocument).forEach(([key, value]) => {
            if (key !== 'children' && key !== 'type') {
                documentInfo += `${key}: ${value}\n`;
            }
        });
        documentInfo += '---\n';
        let markdownVal = '';
        markdownVal += documentInfo + documentChildren;
        return markdownVal;
    }
}

export { MarkdownRenderer };
//# sourceMappingURL=index.js.map
