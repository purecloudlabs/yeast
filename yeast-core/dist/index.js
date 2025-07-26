class YeastParser {
    constructor() {
        this.blockPlugins = [];
        this.inlinePlugins = [];
        this.postprocessors = [];
    }
    registerRootPlugin(plugin) {
        this.rootPlugin = plugin;
    }
    registerBlockPlugin(plugin) {
        this.blockPlugins.push(plugin);
    }
    clearBlockPlugins() {
        this.blockPlugins = [];
    }
    registerInlinePlugin(plugin) {
        this.inlinePlugins.push(plugin);
    }
    clearInlinePlugins() {
        this.inlinePlugins = [];
    }
    registerPostProcessorPlugin(plugin) {
        this.postprocessors.push(plugin);
    }
    clearPostProcessorPlugins() {
        this.postprocessors = [];
    }
    parse(text) {
        if (!this.rootPlugin)
            throw Error('Parse failure: Root plugin not set');
        const result = this.rootPlugin.parse(text);
        let rootAst = result.document;
        rootAst.children = this.parseBlock(result.remainingText);
        rootAst = this.postProcess(rootAst);
        return rootAst;
    }
    parseBlock(text) {
        let children = [];
        let remainingText = text;
        let pluginNumber = 0;
        while (true) {
            if (!remainingText || remainingText.trim() === '')
                break;
            if (pluginNumber >= this.blockPlugins.length)
                break;
            const result = this.blockPlugins[pluginNumber].parse(remainingText, this);
            if (result && result.nodes && result.nodes.length > 0) {
                remainingText = result.remainingText;
                children = children.concat(result.nodes);
                pluginNumber = 0;
            }
            else {
                pluginNumber++;
            }
        }
        return children;
    }
    parseInline(text) {
        let children = [];
        let tokens = [];
        tokens = this.inlinePlugins.map((plugin) => plugin.tokenize(text, this) || []).flat(1);
        tokens = tokens.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
        let lastEnd = 0;
        tokens.forEach((token) => {
            if (token.start < lastEnd) {
                return;
            }
            const plainText = text.substring(lastEnd, token.start);
            if (plainText) {
                children.push({
                    text: plainText,
                });
            }
            children = children.concat(token.nodes);
            lastEnd = token.end;
        });
        const plainText = text.substring(lastEnd, text.length);
        if (plainText) {
            children.push({ text: plainText });
        }
        return children;
    }
    postProcess(document) {
        this.postprocessors.forEach((postProcessorPlugin) => {
            document = postProcessorPlugin.parse(document, this);
        });
        return document;
    }
}

class YeastNodeFactory {
    Create(type, attributes) {
        switch (type) {
            case YeastBlockNodeTypes.Blockquote: {
                const node = {
                    type: YeastBlockNodeTypes.Blockquote,
                    children: [],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.Callout: {
                const node = {
                    type: YeastBlockNodeTypes.Callout,
                    children: [],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.Code: {
                const node = {
                    type: YeastBlockNodeTypes.Code,
                    children: [],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.ContentGroup: {
                const node = {
                    type: YeastBlockNodeTypes.ContentGroup,
                    children: [],
                    groupType: ContentGroupType.tabbedContent,
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.ContentGroupItem: {
                const node = {
                    type: YeastBlockNodeTypes.ContentGroupItem,
                    groupType: ContentGroupType.tabbedContent,
                    children: [],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.Document: {
                const node = {
                    type: YeastBlockNodeTypes.Document,
                    children: [],
                    title: 'New Document',
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.Heading: {
                const node = {
                    type: YeastBlockNodeTypes.Heading,
                    children: [],
                    level: 1,
                    id: '',
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.HorizontalRule: {
                const node = {
                    type: YeastBlockNodeTypes.HorizontalRule,
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.List: {
                const node = {
                    type: YeastBlockNodeTypes.List,
                    children: [],
                    ordered: false,
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.ListItem: {
                const node = {
                    type: YeastBlockNodeTypes.ListItem,
                    children: [],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.Paragraph: {
                const node = {
                    type: YeastBlockNodeTypes.Paragraph,
                    children: [this.CreateText()],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.Table: {
                const node = {
                    type: YeastBlockNodeTypes.Table,
                    children: [],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.TableRow: {
                const node = {
                    type: YeastBlockNodeTypes.TableRow,
                    children: [],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastBlockNodeTypes.TableCell: {
                const node = {
                    type: YeastBlockNodeTypes.TableCell,
                    children: [this.CreateParagraphNode()],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastInlineNodeTypes.Bold: {
                const node = {
                    type: YeastInlineNodeTypes.Bold,
                    children: [],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastInlineNodeTypes.Italic: {
                const node = {
                    type: YeastInlineNodeTypes.Italic,
                    children: [],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastInlineNodeTypes.Link: {
                const node = {
                    type: YeastInlineNodeTypes.Link,
                    children: [],
                    href: '',
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastInlineNodeTypes.Strikethrough: {
                const node = {
                    type: YeastInlineNodeTypes.Strikethrough,
                    children: [],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastInlineNodeTypes.Code: {
                const node = {
                    type: YeastInlineNodeTypes.Code,
                    children: [],
                };
                applyAttributes(node, attributes);
                return node;
            }
            case YeastInlineNodeTypes.Image: {
                const node = {
                    type: YeastInlineNodeTypes.Image,
                    src: '',
                    alt: '',
                };
                applyAttributes(node, attributes);
                return node;
            }
            case 'text': {
                return { text: (attributes === null || attributes === void 0 ? void 0 : attributes.text) || '' };
            }
            default: {
                return;
            }
        }
    }
    CreateBlockquoteNode(from) {
        return this.Create(YeastBlockNodeTypes.Blockquote, from);
    }
    CreateCalloutNode(from) {
        return this.Create(YeastBlockNodeTypes.Callout, from);
    }
    CreateBlockCodeNode(from) {
        return this.Create(YeastBlockNodeTypes.Code, from);
    }
    CreateContentGroupNode(from) {
        return this.Create(YeastBlockNodeTypes.ContentGroup, from);
    }
    CreateContentGroupItemNode(from) {
        return this.Create(YeastBlockNodeTypes.ContentGroupItem, from);
    }
    CreateDocumentNode(from) {
        return this.Create(YeastBlockNodeTypes.Document, from);
    }
    CreateHeadingNode(from) {
        return this.Create(YeastBlockNodeTypes.Heading, from);
    }
    CreateImageNode(from) {
        return this.Create(YeastInlineNodeTypes.Image, from);
    }
    CreateHorizontalRuleNode(from) {
        return this.Create(YeastBlockNodeTypes.HorizontalRule, from);
    }
    CreateListNode(from) {
        return this.Create(YeastBlockNodeTypes.List, from);
    }
    CreateListItemNode(from) {
        return this.Create(YeastBlockNodeTypes.ListItem, from);
    }
    CreateParagraphNode(from) {
        return this.Create(YeastBlockNodeTypes.Paragraph, from);
    }
    CreateTableNode(from) {
        return this.Create(YeastBlockNodeTypes.Table, from);
    }
    CreateTableWithStructure(rows, columns) {
        const newTable = this.Create(YeastBlockNodeTypes.Table);
        while (newTable.children.length < rows) {
            newTable.children.push(this.CreateTableRowWithCells(columns));
        }
        return newTable;
    }
    CreateTableRowNode(from) {
        return this.Create(YeastBlockNodeTypes.TableRow, from);
    }
    CreateTableRowWithCells(columns) {
        const newRow = this.Create(YeastBlockNodeTypes.TableRow);
        while (newRow.children.length < columns) {
            newRow.children.push(this.CreateTableCellNode());
        }
        return newRow;
    }
    CreateTableCellNode(from) {
        return this.Create(YeastBlockNodeTypes.TableCell, from);
    }
    CreateBoldNode(from) {
        return this.Create(YeastInlineNodeTypes.Bold, from);
    }
    CreateItalicNode(from) {
        return this.Create(YeastInlineNodeTypes.Italic, from);
    }
    CreateLinkNode(from) {
        return this.Create(YeastInlineNodeTypes.Link, from);
    }
    CreateStrikethroughNode(from) {
        return this.Create(YeastInlineNodeTypes.Strikethrough, from);
    }
    CreateInlineCodeNode(from) {
        return this.Create(YeastInlineNodeTypes.Code, from);
    }
    CreateText(from) {
        return this.Create('text', from);
    }
}
var YeastNodeFactory$1 = new YeastNodeFactory();
const RESERVED_ATTR_NAMES = ['type'];
function applyAttributes(node, attributes) {
    if (!attributes)
        return;
    Object.entries(attributes)
        .filter(([key, value]) => !RESERVED_ATTR_NAMES.includes(key.toLowerCase()))
        .forEach(([key, value]) => (node[key] = value));
}

function mapAnchorPath(anchorPath, oldNode, newNode) {
    const oldTargetNode = navigateToNodeByPath(oldNode, Number(anchorPath));
    if (!oldTargetNode) {
        return { oldPath: anchorPath, newPath: undefined, isOrphaned: true };
    }
    const newPathIndices = findCorrespondingPath(oldTargetNode, newNode);
    if (newPathIndices === null) {
        console.log('newPathIndices is null, returning orphaned');
        return { oldPath: anchorPath, newPath: undefined, isOrphaned: true };
    }
    const newPath = newPathIndices;
    return {
        oldPath: anchorPath,
        newPath,
        isOrphaned: false,
    };
}
function navigateToNodeByPath(root, anchorPath) {
    let currentNode = root;
    if (!currentNode.children || anchorPath >= currentNode.children.length) {
        return null;
    }
    currentNode = currentNode.children[anchorPath];
    return currentNode;
}
function findCorrespondingPath(oldTargetNode, newNode) {
    if (!newNode.children)
        return null;
    for (let i = 0; i < newNode.children.length; i++) {
        const newChild = newNode.children[i];
        const diffChildren = diffInner(oldTargetNode.children || [], newChild.children || []);
        console.log(diffChildren);
        const { isMatch } = isNodeMatch(oldTargetNode, newChild, diffChildren);
        console.log(isMatch);
        if (isMatch) {
            return i;
        }
    }
    return null;
}
function getWordBoundaries(s, wordPos) {
    let boundaries = {};
    let temp = s;
    let tempStartIdx = 0;
    for (let i = 0; i <= wordPos; i++) {
        const wordStart = temp.search(/[^\s]/);
        let sliceIdx = temp.slice(wordStart).search(/\s/);
        let wordEnd;
        if (sliceIdx === -1) {
            wordEnd = s.length;
        }
        else {
            wordEnd = sliceIdx + wordStart;
        }
        if (i === wordPos) {
            boundaries.wordStart = tempStartIdx + wordStart;
            boundaries.wordEnd = sliceIdx === -1 ? wordEnd : tempStartIdx + wordEnd;
        }
        temp = s.slice(tempStartIdx + wordEnd);
        tempStartIdx += wordEnd;
    }
    return boundaries;
}
function calculateSpaceDiff(oldString, newString, oldIdx, newIdx, oldWords, newWords) {
    let oldSpace;
    let newSpace;
    let spaceDiffType = DiffType.Modified;
    let oldPrevBounds;
    let oldNextBounds;
    let newPrevBounds;
    let newNextBounds;
    const isInitSpaceDiff = oldIdx === 0 && newIdx === 0;
    if (isInitSpaceDiff) {
        oldNextBounds = getWordBoundaries(oldString, oldIdx);
        newNextBounds = getWordBoundaries(newString, newIdx);
        const isAdded = oldNextBounds.wordStart === 0 && newNextBounds.wordStart > 0;
        const isRemoved = oldNextBounds.wordStart > 0 && newNextBounds.wordStart === 0;
        if (isAdded) {
            spaceDiffType = DiffType.Added;
        }
        if (isRemoved) {
            spaceDiffType = DiffType.Removed;
        }
        return {
            spaceDiff: newNextBounds.wordStart - oldNextBounds.wordStart,
            spaceDiffType,
        };
    }
    const isOutOfBounds = oldIdx >= oldWords.length && newIdx >= newWords.length;
    if (isOutOfBounds) {
        const lastOldWordBounds = getWordBoundaries(oldString, oldWords.length - 1);
        const lastNewWordBounds = getWordBoundaries(newString, newWords.length - 1);
        const oldDiff = oldString.length - lastOldWordBounds.wordEnd;
        const newDiff = newString.length - lastNewWordBounds.wordEnd;
        const isAdded = oldDiff === 0 && newDiff > 0;
        const isRemoved = oldDiff > 0 && newDiff === 0;
        if (isAdded) {
            spaceDiffType = DiffType.Added;
        }
        if (isRemoved) {
            spaceDiffType = DiffType.Removed;
        }
        return {
            spaceDiff: newDiff - oldDiff,
            spaceDiffType,
        };
    }
    oldPrevBounds = getWordBoundaries(oldString, oldIdx - 1);
    oldNextBounds = getWordBoundaries(oldString, oldIdx);
    newPrevBounds = getWordBoundaries(newString, newIdx - 1);
    newNextBounds = getWordBoundaries(newString, newIdx);
    oldSpace = oldNextBounds.wordStart - oldPrevBounds.wordEnd;
    newSpace = newNextBounds.wordStart - newPrevBounds.wordEnd;
    return {
        spaceDiff: newSpace - oldSpace,
        spaceDiffType,
    };
}
function addSpaceMod(s, boundaries, idx, mods, diffSource, diffType) {
    let startIndex = 0;
    let endIndex = boundaries.wordStart;
    if (idx > 0) {
        const prevOldBounds = getWordBoundaries(s, idx - 1);
        startIndex = prevOldBounds.wordEnd;
    }
    mods.push({
        startIndex: startIndex,
        endIndex: endIndex,
        diffSource,
        modSubtype: diffType,
    });
}
function addMod(s, words, wordPos, mods, boundaries, modSubtype, diffSource, spaceDiff, initSpaceDiff) {
    let endIndex = s.length;
    let startIndex = boundaries.wordStart;
    if (wordPos + 1 < words.length) {
        const preMatchBoundaries = getWordBoundaries(s, wordPos);
        const matchBoundaries = getWordBoundaries(s, wordPos + 1);
        if (spaceDiff) {
            endIndex = matchBoundaries.wordStart - 1;
        }
        else {
            endIndex = preMatchBoundaries.wordEnd;
        }
        if (initSpaceDiff) {
            startIndex = 0;
        }
    }
    mods.push({
        startIndex,
        endIndex,
        diffSource,
        modSubtype,
    });
}
function getModificationData(_oldString, _newString) {
    const oldString = _oldString || '';
    const newString = _newString || '';
    const oldMods = [];
    const newMods = [];
    let oldIdx = 0;
    let newIdx = 0;
    const oldWords = oldString.split(' ').filter((word) => word);
    const newWords = newString.split(' ').filter((word) => word);
    while (oldIdx < oldWords.length && newIdx < newWords.length) {
        const oldBoundaries = getWordBoundaries(oldString, oldIdx);
        const newBoundaries = getWordBoundaries(newString, newIdx);
        let nextOldIndex = oldIdx + 1;
        let nextNewIndex = newIdx + 1;
        let modificationSubtype;
        if (oldWords[oldIdx] !== newWords[newIdx]) {
            const { diffType, nextNewIdx, nextOldIdx, oldMatchIdx, newMatchIdx } = getDiffData(oldIdx, newIdx, oldWords, newWords);
            modificationSubtype = diffType;
            if (nextOldIdx)
                nextOldIndex = nextOldIdx;
            if (nextNewIdx)
                nextNewIndex = nextNewIdx;
            const oldDiffEndIdx = (oldMatchIdx || nextOldIdx || oldIdx + 1) - 1;
            const newDiffEndIdx = (newMatchIdx || nextNewIdx || newIdx + 1) - 1;
            const { spaceDiff } = calculateSpaceDiff(oldString, newString, oldDiffEndIdx + 1, newDiffEndIdx + 1, oldWords, newWords);
            let initSpaceDiff = 0;
            const isFirstWord = oldIdx === 0 && newIdx === 0;
            if (isFirstWord) {
                const initDiff = calculateSpaceDiff(oldString, newString, 0, 0, oldWords, newWords);
                initSpaceDiff = initDiff.spaceDiff;
            }
            if (modificationSubtype === DiffType.Added) {
                addMod(newString, newWords, newDiffEndIdx, newMods, newBoundaries, DiffType.Added, DiffSource.New, spaceDiff, initSpaceDiff);
            }
            if (modificationSubtype === DiffType.Removed) {
                addMod(oldString, oldWords, oldDiffEndIdx, oldMods, oldBoundaries, DiffType.Removed, DiffSource.Old, spaceDiff, initSpaceDiff);
            }
            if (modificationSubtype === DiffType.Modified) {
                addMod(oldString, oldWords, oldDiffEndIdx, oldMods, oldBoundaries, DiffType.Modified, DiffSource.Old, spaceDiff, initSpaceDiff);
                addMod(newString, newWords, newDiffEndIdx, newMods, newBoundaries, DiffType.Modified, DiffSource.New, spaceDiff, initSpaceDiff);
            }
        }
        else {
            let { spaceDiff, spaceDiffType } = calculateSpaceDiff(oldString, newString, oldIdx, newIdx, oldWords, newWords);
            if (spaceDiff) {
                if (spaceDiffType === DiffType.Added) {
                    addSpaceMod(newString, newBoundaries, newIdx, newMods, DiffSource.New, DiffType.Added);
                }
                else if (spaceDiffType === DiffType.Removed) {
                    addSpaceMod(oldString, oldBoundaries, oldIdx, oldMods, DiffSource.Old, DiffType.Removed);
                }
                else {
                    addSpaceMod(oldString, oldBoundaries, oldIdx, oldMods, DiffSource.Old, DiffType.Modified);
                    addSpaceMod(newString, newBoundaries, newIdx, newMods, DiffSource.New, DiffType.Modified);
                }
            }
        }
        let isLast = newIdx === newWords.length - 1 && nextOldIndex < oldWords.length;
        let isNextOutOfBounds = nextNewIndex >= newWords.length && nextOldIndex < oldWords.length;
        const areRemainingWordsRemovals = isLast || isNextOutOfBounds;
        if (areRemainingWordsRemovals) {
            let startIndex;
            if (isLast) {
                startIndex = oldBoundaries.wordEnd;
            }
            else {
                const beforeNextBounds = getWordBoundaries(oldString, nextOldIndex - 1);
                startIndex = beforeNextBounds.wordEnd;
            }
            oldMods.push({
                startIndex,
                endIndex: oldString.length,
                diffSource: DiffSource.Old,
                modSubtype: DiffType.Removed,
            });
        }
        isLast = oldIdx === oldWords.length - 1 && nextNewIndex < newWords.length;
        isNextOutOfBounds = nextOldIndex >= oldWords.length && nextNewIndex < newWords.length;
        const areRemainingWordsAdditions = isLast || isNextOutOfBounds;
        if (areRemainingWordsAdditions) {
            let startIndex;
            if (isLast) {
                startIndex = newBoundaries.wordEnd;
            }
            else {
                const beforeNextBounds = getWordBoundaries(newString, nextNewIndex - 1);
                startIndex = beforeNextBounds.wordEnd;
            }
            newMods.push({
                startIndex,
                endIndex: newString.length,
                diffSource: DiffSource.New,
                modSubtype: DiffType.Added,
            });
        }
        oldIdx = nextOldIndex;
        newIdx = nextNewIndex;
    }
    let { spaceDiff, spaceDiffType } = calculateSpaceDiff(oldString, newString, oldWords.length, newWords.length, oldWords, newWords);
    if (spaceDiff) {
        const newLastBounds = getWordBoundaries(newString, newWords.length - 1);
        const oldLastBounds = getWordBoundaries(oldString, oldWords.length - 1);
        if (spaceDiffType === DiffType.Added) {
            newMods.push({
                startIndex: newLastBounds.wordEnd,
                endIndex: newString.length,
                diffSource: DiffSource.New,
                modSubtype: DiffType.Added,
            });
        }
        else if (spaceDiffType === DiffType.Removed) {
            oldMods.push({
                startIndex: oldLastBounds.wordEnd,
                endIndex: oldString.length,
                diffSource: DiffSource.Old,
                modSubtype: DiffType.Removed,
            });
        }
        else {
            oldMods.push({
                startIndex: oldLastBounds.wordEnd,
                endIndex: oldString.length,
                diffSource: DiffSource.Old,
                modSubtype: DiffType.Modified,
            });
            newMods.push({
                startIndex: newLastBounds.wordEnd,
                endIndex: newString.length,
                diffSource: DiffSource.New,
                modSubtype: DiffType.Modified,
            });
        }
    }
    const joinedOldMods = joinConsecutiveModData(oldMods, oldString, DiffSource.Old);
    const joinedNewMods = joinConsecutiveModData(newMods, newString, DiffSource.New);
    return {
        oldModData: joinedOldMods,
        newModData: joinedNewMods,
    };
}
function joinConsecutiveModData(mods, s, diffSource) {
    if (mods.length <= 1)
        return mods;
    const joinedMods = [];
    let consecutiveCount = 1;
    for (let i = 1; i < mods.length; i++) {
        const gap = s.substring(mods[i - 1].endIndex, mods[i].startIndex);
        let isConsecutive = gap.trim() === '' && mods[i - 1].modSubtype === mods[i].modSubtype;
        if (isConsecutive) {
            if (i === mods.length - 1) {
                const joinedStart = mods[i - consecutiveCount].startIndex;
                const joinedEnd = mods[i].endIndex;
                joinedMods.push({
                    startIndex: joinedStart,
                    endIndex: joinedEnd,
                    diffSource,
                    modSubtype: mods[i].modSubtype,
                });
            }
            consecutiveCount++;
        }
        else {
            const joinedStart = mods[i - consecutiveCount].startIndex;
            const joinedEnd = mods[i - 1].endIndex;
            joinedMods.push({
                startIndex: joinedStart,
                endIndex: joinedEnd,
                diffSource,
                modSubtype: mods[i - 1].modSubtype,
            });
            consecutiveCount = 1;
            if (i === mods.length - 1)
                joinedMods.push(mods[i]);
        }
    }
    return joinedMods;
}
function calculateDiffScores(testType, oldIdx, newIdx, oldEntities, newEntities) {
    let score = 0;
    let nextOldIdx;
    let nextNewIdx;
    let oIdxCopy;
    let nIdxCopy;
    let oldMatchIdx;
    let newMatchIdx;
    let matchFound = false;
    if (testType === DiffType.Modified) {
        oIdxCopy = oldIdx + 1;
        nIdxCopy = newIdx + 1;
    }
    if (testType === DiffType.Added) {
        oIdxCopy = oldIdx;
        nIdxCopy = newIdx + 1;
    }
    if (testType === DiffType.Removed) {
        oIdxCopy = oldIdx + 1;
        nIdxCopy = newIdx;
    }
    while (nIdxCopy < newEntities.length && oIdxCopy < oldEntities.length) {
        const { isMatch } = isEntityMatch(oldEntities[oIdxCopy], newEntities[nIdxCopy]);
        if (isMatch) {
            score++;
            nextOldIdx = oIdxCopy + 1;
            nextNewIdx = nIdxCopy + 1;
            if (!matchFound) {
                matchFound = true;
                oldMatchIdx = oIdxCopy;
                newMatchIdx = nIdxCopy;
            }
        }
        else {
            if (matchFound) {
                nextOldIdx = oIdxCopy;
                nextNewIdx = nIdxCopy;
                break;
            }
        }
        if (testType === DiffType.Modified) {
            nIdxCopy++;
            oIdxCopy++;
        }
        if (testType === DiffType.Added) {
            nIdxCopy++;
            if (matchFound)
                oIdxCopy++;
        }
        if (testType === DiffType.Removed) {
            oIdxCopy++;
            if (matchFound)
                nIdxCopy++;
        }
    }
    const scoreData = { score };
    if (nextOldIdx)
        scoreData.nextOldIdx = nextOldIdx;
    if (nextNewIdx)
        scoreData.nextNewIdx = nextNewIdx;
    if (oldMatchIdx)
        scoreData.oldMatchIdx = oldMatchIdx;
    if (newMatchIdx)
        scoreData.newMatchIdx = newMatchIdx;
    return scoreData;
}
function getDiffData(oldIdx, newIdx, oldEntities, newEntities) {
    var _a;
    const isLastOldEntity = oldIdx === oldEntities.length - 1;
    const isLastNewEntity = newIdx === newEntities.length - 1;
    let addedScore = 0;
    let nextOldIdxAdded;
    let nextNewIdxAdded;
    let oldMatchIdxAdded;
    let newMatchIdxAdded;
    let removedScore = 0;
    let nextOldIdxRemoved;
    let nextNewIdxRemoved;
    let oldMatchIdxRemoved;
    let newMatchIdxRemoved;
    let modifiedScore = 0;
    let nextOldIdxModified;
    let nextNewIdxModified;
    let oldMatchIdxModified;
    let newMatchIdxModified;
    if (isLastOldEntity && isLastNewEntity) {
        return {
            diffType: DiffType.Modified,
            nextOldIdx: oldIdx + 1,
            nextNewIdx: newIdx + 1,
        };
    }
    if (!isLastNewEntity) {
        const addedScoreData = calculateDiffScores(DiffType.Added, oldIdx, newIdx, oldEntities, newEntities);
        addedScore = addedScoreData.score;
        if (addedScoreData.nextOldIdx)
            nextOldIdxAdded = addedScoreData.nextOldIdx;
        if (addedScoreData.nextNewIdx)
            nextNewIdxAdded = addedScoreData.nextNewIdx;
        if (addedScoreData.oldMatchIdx)
            oldMatchIdxAdded = addedScoreData.oldMatchIdx;
        if (addedScoreData.newMatchIdx)
            newMatchIdxAdded = addedScoreData.newMatchIdx;
    }
    if (!isLastOldEntity) {
        const removedScoreData = calculateDiffScores(DiffType.Removed, oldIdx, newIdx, oldEntities, newEntities);
        removedScore = removedScoreData.score;
        if (removedScoreData.nextOldIdx)
            nextOldIdxRemoved = removedScoreData.nextOldIdx;
        if (removedScoreData.nextNewIdx)
            nextNewIdxRemoved = removedScoreData.nextNewIdx;
        if (removedScoreData.oldMatchIdx)
            oldMatchIdxRemoved = removedScoreData.oldMatchIdx;
        if (removedScoreData.newMatchIdx)
            newMatchIdxRemoved = removedScoreData.newMatchIdx;
    }
    if (!isLastOldEntity && !isLastNewEntity) {
        const modifiedScoreData = calculateDiffScores(DiffType.Modified, oldIdx, newIdx, oldEntities, newEntities);
        modifiedScore = modifiedScoreData.score;
        if (modifiedScoreData.nextOldIdx)
            nextOldIdxModified = modifiedScoreData.nextOldIdx;
        if (modifiedScoreData.nextNewIdx)
            nextNewIdxModified = modifiedScoreData.nextNewIdx;
        if (modifiedScoreData.oldMatchIdx)
            oldMatchIdxModified = modifiedScoreData.oldMatchIdx;
        if (modifiedScoreData.newMatchIdx)
            newMatchIdxModified = modifiedScoreData.newMatchIdx;
    }
    const isAllZeroScore = addedScore === 0 && removedScore === 0 && modifiedScore === 0;
    if (isAllZeroScore) {
        return {
            diffType: DiffType.Modified,
            nextOldIdx: oldIdx + 1,
            nextNewIdx: newIdx + 1,
        };
    }
    const addedScoreMap = { added: addedScore };
    const removedScoreMap = { removed: removedScore };
    const modifiedScoreMap = { modified: modifiedScore };
    const scores = [addedScoreMap, removedScoreMap, modifiedScoreMap];
    const descendingScores = scores.sort((prev, next) => {
        const prevVal = prev[Object.keys(prev)[0]];
        const nextVal = next[Object.keys(next)[0]];
        if (prevVal > nextVal) {
            return -1;
        }
        if (prevVal < nextVal) {
            return 1;
        }
        if (prevVal === nextVal) {
            return 0;
        }
    });
    const maxScore = descendingScores[0];
    const tiedScores = descendingScores.filter((score) => score[Object.keys(score)[0]] === maxScore[Object.keys(maxScore)[0]]);
    if (tiedScores.length > 1) {
        let containsModified = tiedScores.some((score) => {
            var _a;
            return (_a = Object.keys(score)) === null || _a === void 0 ? void 0 : _a.some((k) => k === 'modified');
        });
        let containsAdded = tiedScores.some((score) => {
            var _a;
            return (_a = Object.keys(score)) === null || _a === void 0 ? void 0 : _a.some((k) => k === 'added');
        });
        if (containsModified) {
            return {
                diffType: DiffType.Modified,
                nextOldIdx: nextOldIdxModified,
                nextNewIdx: nextNewIdxModified,
                oldMatchIdx: oldMatchIdxModified,
                newMatchIdx: newMatchIdxModified,
            };
        }
        else if (containsAdded) {
            return {
                diffType: DiffType.Added,
                nextOldIdx: nextOldIdxAdded,
                nextNewIdx: nextNewIdxAdded,
                oldMatchIdx: oldMatchIdxAdded,
                newMatchIdx: newMatchIdxAdded,
            };
        }
        else {
            return {
                diffType: DiffType.Removed,
                nextOldIdx: nextOldIdxRemoved,
                nextNewIdx: nextNewIdxRemoved,
                oldMatchIdx: oldMatchIdxRemoved,
                newMatchIdx: newMatchIdxRemoved,
            };
        }
    }
    const maxScoreKey = (_a = Object.keys(maxScore)) === null || _a === void 0 ? void 0 : _a[0];
    if (maxScoreKey === DiffType.Modified) {
        return {
            diffType: DiffType.Modified,
            nextOldIdx: nextOldIdxModified,
            nextNewIdx: nextNewIdxModified,
            oldMatchIdx: oldMatchIdxModified,
            newMatchIdx: newMatchIdxModified,
        };
    }
    if (maxScoreKey === DiffType.Added) {
        return {
            diffType: DiffType.Added,
            nextOldIdx: nextOldIdxAdded,
            nextNewIdx: nextNewIdxAdded,
            oldMatchIdx: oldMatchIdxAdded,
            newMatchIdx: newMatchIdxAdded,
        };
    }
    if (maxScoreKey === DiffType.Removed) {
        return {
            diffType: DiffType.Removed,
            nextOldIdx: nextOldIdxRemoved,
            nextNewIdx: nextNewIdxRemoved,
            oldMatchIdx: oldMatchIdxRemoved,
            newMatchIdx: newMatchIdxRemoved,
        };
    }
    return {
        diffType: DiffType.Modified,
        nextOldIdx: oldIdx + 1,
        nextNewIdx: newIdx + 1,
    };
}
function diffInner(oldNodes, newNodes) {
    let diffNodes = [];
    const areNodesEmpty = (!oldNodes || oldNodes.length === 0) && (!newNodes || newNodes.length === 0);
    const areOldNodesEmpty = (!oldNodes || oldNodes.length === 0) && newNodes && newNodes.length > 0;
    const areNewNodesEmpty = (!newNodes || newNodes.length === 0) && oldNodes && oldNodes.length > 0;
    if (areNodesEmpty) {
        return [];
    }
    if (areOldNodesEmpty) {
        diffNodes = newNodes.map((node) => {
            let diffChildren = [];
            const diffNode = structuredClone(node);
            diffNode.hasDiff = true;
            diffNode.diffType = DiffType.Added;
            if (node.children && node.children.length > 0) {
                diffChildren = diffInner(undefined, node.children);
                diffNode.children = diffChildren;
            }
            return diffNode;
        });
        return diffNodes;
    }
    if (areNewNodesEmpty) {
        diffNodes = oldNodes.map((node) => {
            let diffChildren = [];
            const diffNode = structuredClone(node);
            diffNode.hasDiff = true;
            diffNode.diffType = DiffType.Removed;
            if (node.children && node.children.length > 0) {
                diffChildren = diffInner(undefined, node.children);
                diffNode.children = diffChildren;
            }
            return diffNode;
        });
        return diffNodes;
    }
    let oldIdx = 0;
    let newIdx = 0;
    while (oldIdx < oldNodes.length || newIdx < newNodes.length) {
        let nextOldIdx = oldIdx + 1;
        let nextNewIdx = newIdx + 1;
        const oldNode = oldNodes[oldIdx];
        const newNode = newNodes[newIdx];
        let updatedChildren;
        let diffChildren = [];
        diffChildren = diffInner((oldNode === null || oldNode === void 0 ? void 0 : oldNode.children) || [], (newNode === null || newNode === void 0 ? void 0 : newNode.children) || []);
        const oldNodeExists = oldIdx < oldNodes.length;
        const newNodeExists = newIdx < newNodes.length;
        if (oldNodeExists && !newNodeExists) {
            updatedChildren = correctDiffChildren(oldNode.children, DiffType.Removed);
            for (let i = oldIdx; i < oldNodes.length; i++) {
                const diffNode = structuredClone(oldNodes[i]);
                diffNode.hasDiff = true;
                diffNode.diffType = DiffType.Removed;
                diffNode.children = correctDiffChildren(oldNodes[i].children, DiffType.Removed);
                diffNodes.push(diffNode);
            }
            break;
        }
        if (!oldNodeExists && newNodeExists) {
            updatedChildren = correctDiffChildren(newNode.children, DiffType.Added);
            for (let i = newIdx; i < newNodes.length; i++) {
                const diffNode = structuredClone(newNodes[i]);
                diffNode.hasDiff = true;
                diffNode.diffType = DiffType.Added;
                diffNode.children = correctDiffChildren(newNodes[i].children, DiffType.Added);
                diffNodes.push(diffNode);
            }
            break;
        }
        const { isMatch, isTextModification = false, textProperties } = isEntityMatch(oldNode, newNode, diffChildren);
        if (isMatch) {
            const diffNode = structuredClone(newNode);
            diffNode.hasDiff = false;
            diffNode.children = diffChildren;
            diffNodes.push(diffNode);
        }
        else {
            const diffData = getDiffData(oldIdx, newIdx, oldNodes, newNodes);
            nextOldIdx = diffData.nextOldIdx;
            nextNewIdx = diffData.nextNewIdx;
            if (diffData.diffType === DiffType.Added) {
                updatedChildren = correctDiffChildren(newNode.children, DiffType.Added);
                const diffNode = structuredClone(newNode);
                diffNode.diffType = DiffType.Added;
                diffNode.hasDiff = true;
                diffNode.children = updatedChildren;
                diffNodes.push(diffNode);
                if (diffData.newMatchIdx) {
                    for (let i = newIdx + 1; i <= diffData.newMatchIdx; i++) {
                        const addedNode = structuredClone(newNodes[i]);
                        if (i === diffData.newMatchIdx) {
                            addedNode.hasDiff = false;
                        }
                        else {
                            addedNode.hasDiff = true;
                            addedNode.diffType = DiffType.Added;
                        }
                        diffNodes.push(addedNode);
                    }
                    if (diffData.newMatchIdx + 1 < nextNewIdx) {
                        for (let i = diffData.newMatchIdx + 1; i < nextNewIdx; i++) {
                            const matchingNode = structuredClone(newNodes[i]);
                            matchingNode.hasDiff = false;
                            diffNodes.push(matchingNode);
                        }
                    }
                }
            }
            else if (diffData.diffType === DiffType.Removed) {
                updatedChildren = correctDiffChildren(oldNode.children, DiffType.Removed);
                const diffNode = structuredClone(oldNode);
                diffNode.diffType = DiffType.Removed;
                diffNode.hasDiff = true;
                diffNode.children = updatedChildren;
                diffNodes.push(diffNode);
                if (diffData.oldMatchIdx) {
                    for (let i = oldIdx + 1; i <= diffData.oldMatchIdx; i++) {
                        let removedNode;
                        if (i === diffData.oldMatchIdx) {
                            removedNode = structuredClone(oldNodes[i]);
                            removedNode.hasDiff = false;
                        }
                        else {
                            removedNode = structuredClone(oldNodes[i]);
                            removedNode.hasDiff = true;
                            removedNode.diffType = DiffType.Removed;
                        }
                        diffNodes.push(removedNode);
                    }
                    if (diffData.oldMatchIdx + 1 < nextOldIdx) {
                        for (let i = diffData.oldMatchIdx + 1; i < nextOldIdx; i++) {
                            const matchingNode = structuredClone(oldNodes[i]);
                            matchingNode.hasDiff = false;
                            diffNodes.push(matchingNode);
                        }
                    }
                }
            }
            else {
                nextOldIdx = oldIdx + 1;
                nextNewIdx = newIdx + 1;
                updatedChildren = diffChildren;
                let modData = {};
                let diffPivots = {};
                if (isTextModification && textProperties) {
                    const diffNode = structuredClone(newNode);
                    textProperties.forEach((prop) => {
                        var _a, _b;
                        const modAssignment = getModificationData(oldNode[prop], newNode[prop]);
                        modAssignment.newModData = (_a = modAssignment.newModData) === null || _a === void 0 ? void 0 : _a.map((md) => {
                            const updatedModData = structuredClone(md);
                            updatedModData.startIndex = oldNode[prop] ? md.startIndex + oldNode[prop].length + 1 : md.startIndex;
                            updatedModData.endIndex = oldNode[prop] ? md.endIndex + oldNode[prop].length + 1 : md.endIndex;
                            return updatedModData;
                        });
                        modData[prop] = modAssignment;
                        diffPivots[prop] = (_b = oldNode[prop]) === null || _b === void 0 ? void 0 : _b.length;
                        diffNode[prop] = `${oldNode[prop]} ${newNode[prop]}`;
                    });
                    diffNode.hasDiff = true;
                    diffNode.diffType = DiffType.Modified;
                    diffNode.isTextModification = true;
                    diffNode.children = updatedChildren;
                    diffNode.diffMods = modData;
                    diffNode.diffPivots = diffPivots;
                    diffNode.containsDiff = containsDiff(diffChildren);
                    diffNodes.push(diffNode);
                }
                else {
                    if (containsDiff(diffChildren) && oldNode.type === newNode.type) {
                        const diffNode = structuredClone(newNode);
                        diffNode.hasDiff = true;
                        diffNode.diffType = DiffType.Modified;
                        diffNode.children = updatedChildren;
                        diffNode.containsDiff = true;
                        diffNodes.push(diffNode);
                    }
                    else {
                        const oldDiffNode = structuredClone(oldNode);
                        oldDiffNode.hasDiff = true;
                        oldDiffNode.diffType = DiffType.Modified;
                        oldDiffNode.diffSource = DiffSource.Old;
                        oldDiffNode.containsDiff = false;
                        const newDiffNode = structuredClone(newNode);
                        newDiffNode.hasDiff = true;
                        newDiffNode.diffType = DiffType.Modified;
                        newDiffNode.diffSource = DiffSource.New;
                        newDiffNode.containsDiff = false;
                        diffNodes.push(oldDiffNode);
                        diffNodes.push(newDiffNode);
                    }
                }
            }
        }
        oldIdx = nextOldIdx;
        newIdx = nextNewIdx;
    }
    return diffNodes;
}
function containsDiff(children) {
    if (!children)
        return false;
    for (const child of children) {
        if (child.isTextModification || child.hasDiff)
            return true;
        if (isYeastNode(child) && child.children && child.children.length > 0) {
            const childrenContainInnerDiff = containsDiff(child.children);
            if (childrenContainInnerDiff)
                return true;
        }
    }
    return false;
}
function correctDiffChildren(children, diffType) {
    if (!children || children.length === 0)
        return [];
    return children.map((child) => {
        const updatedChild = structuredClone(child);
        updatedChild.hasDiff = true;
        updatedChild.diffType = diffType;
        if (child.diffMods)
            updatedChild.diffMods = {};
        if (child.diffPivots)
            updatedChild.diffPivots = {};
        if (child.children)
            updatedChild.children = correctDiffChildren(child.children, diffType);
        return updatedChild;
    });
}
function isEntityMatch(oldEntity, newEntity, diffChildren) {
    const isString = typeof oldEntity === 'string' && typeof newEntity === 'string';
    const areBothTextNodes = isYeastTextNode(oldEntity) && isYeastTextNode(newEntity);
    const isOldTextNodeOnly = !isYeastTextNode(oldEntity) && isYeastTextNode(newEntity);
    const isNewTextNodeOnly = isYeastTextNode(oldEntity) && !isYeastTextNode(newEntity);
    if (isString) {
        return { isMatch: oldEntity === newEntity };
    }
    if (areBothTextNodes) {
        const isMatch = oldEntity.text === newEntity.text;
        if (!isMatch) {
            return {
                isMatch,
                isTextModification: true,
                textProperties: ['text'],
            };
        }
        return { isMatch: oldEntity.text === newEntity.text };
    }
    if (isOldTextNodeOnly || isNewTextNodeOnly) {
        return { isMatch: false };
    }
    const children = diffChildren || diffInner(oldEntity.children, newEntity.children);
    return isNodeMatch(oldEntity, newEntity, children);
}
function isNodeMatch(oldNode, newNode, diffChildren) {
    var _a, _b;
    let isMatch = true;
    let isTextModification = false;
    let textProperties = [];
    const hasTypeChange = oldNode.type !== newNode.type;
    const hasChildDiff = diffChildren === null || diffChildren === void 0 ? void 0 : diffChildren.some((child) => child.hasDiff === true);
    const hasDiffNumChildren = ((_a = oldNode.children) === null || _a === void 0 ? void 0 : _a.length) !== ((_b = newNode.children) === null || _b === void 0 ? void 0 : _b.length);
    if (hasTypeChange || hasChildDiff || hasDiffNumChildren)
        isMatch = false;
    const areBothDocuments = oldNode.type === YeastBlockNodeTypes.Document && newNode.type === YeastBlockNodeTypes.Document;
    if (areBothDocuments) {
        const oldDoc = oldNode;
        const newDoc = newNode;
        const bothTitlesExist = !!oldDoc.title && !!newDoc.title;
        const oneTitleExists = (!oldDoc.title && !!newDoc.title) || (!!oldDoc.title && !newDoc.title);
        let doTitlesMatch = true;
        if (bothTitlesExist && oldDoc.title !== newDoc.title) {
            doTitlesMatch = false;
            isTextModification = true;
            textProperties.push('title');
        }
        if (oneTitleExists) {
            doTitlesMatch = false;
        }
        const bothAuthorsExist = !!oldDoc.title && !!newDoc.title;
        const oneAuthorExists = (!oldDoc.title && !!newDoc.title) || (!!oldDoc.title && !newDoc.title);
        let doAuthorsMatch = true;
        if (bothAuthorsExist && oldDoc.author !== newDoc.author) {
            doAuthorsMatch = false;
            isTextModification = true;
            textProperties.push('author');
        }
        if (oneAuthorExists) {
            doAuthorsMatch = false;
        }
        if (!doTitlesMatch || !doAuthorsMatch)
            isMatch = false;
    }
    const areBothImages = oldNode.type === YeastInlineNodeTypes.Image && newNode.type === YeastInlineNodeTypes.Image;
    if (areBothImages) {
        const oldImage = oldNode;
        const newImage = newNode;
        const bothTitlesExist = !!oldImage.title && !!newImage.title;
        const oneTitleExists = (!oldImage.title && !!newImage.title) || (!!oldImage.title && !newImage.title);
        let doTitlesMatch = true;
        if (bothTitlesExist && oldImage.title !== newImage.title) {
            doTitlesMatch = false;
            isTextModification = true;
            textProperties.push('title');
        }
        if (oneTitleExists) {
            doTitlesMatch = false;
        }
        const bothAltExist = !!oldImage.alt && !!newImage.alt;
        const oneAltExists = (!oldImage.alt && !!newImage.alt) || (!!oldImage.alt && !newImage.alt);
        let doAltMatch = true;
        if (bothAltExist && oldImage.alt !== newImage.alt) {
            doAltMatch = false;
            isTextModification = true;
            textProperties.push('alt');
        }
        if (oneAltExists) {
            doAltMatch = false;
        }
        const bothSrcExist = !!oldImage.src && !!newImage.src;
        const oneSrcExists = (!oldImage.src && !!newImage.src) || (!!oldImage.src && !newImage.src);
        let doSrcMatch = true;
        if (bothSrcExist && oldImage.src !== newImage.src) {
            doSrcMatch = false;
            isTextModification = true;
            textProperties.push('src');
        }
        if (oneSrcExists) {
            doSrcMatch = false;
        }
        if (!doTitlesMatch || !doAltMatch || !doSrcMatch)
            isMatch = false;
    }
    const areBothCodeBlocks = oldNode.type === YeastBlockNodeTypes.Code && newNode.type === YeastBlockNodeTypes.Code;
    if (areBothCodeBlocks) {
        const oldCode = oldNode;
        const newCode = newNode;
        const bothTitlesExist = !!oldCode.title && !!newCode.title;
        const oneTitleExists = (!oldCode.title && !!newCode.title) || (!!oldCode.title && !newCode.title);
        let doTitlesMatch = true;
        if (bothTitlesExist && oldCode.title !== newCode.title) {
            doTitlesMatch = false;
            isTextModification = true;
            textProperties.push('title');
        }
        if (oneTitleExists) {
            doTitlesMatch = false;
        }
        if (!doTitlesMatch)
            isMatch = false;
        if (oldCode.value !== newCode.value) {
            isTextModification = true;
            textProperties.push('value');
            isMatch = false;
        }
    }
    const areBothCalloutNodes = oldNode.type === YeastBlockNodeTypes.Callout && newNode.type === YeastBlockNodeTypes.Callout;
    if (areBothCalloutNodes) {
        const oldCallout = oldNode;
        const newCallout = newNode;
        const bothTitlesExist = !!oldCallout.title && !!newCallout.title;
        const oneTitleExists = (!oldCallout.title && !!newCallout.title) || (!!oldCallout.title && !newCallout.title);
        let doTitlesMatch = true;
        if (bothTitlesExist && oldCallout.title !== newCallout.title) {
            doTitlesMatch = false;
            isTextModification = true;
            textProperties.push('title');
        }
        if (oneTitleExists) {
            doTitlesMatch = false;
        }
        if (!doTitlesMatch)
            isMatch = false;
    }
    const areBothContentGroupItem = oldNode.type === YeastBlockNodeTypes.ContentGroupItem && newNode.type === YeastBlockNodeTypes.ContentGroupItem;
    if (areBothContentGroupItem) {
        const oldContentGroupItem = oldNode;
        const newContentGroupItem = newNode;
        const bothTitlesExist = !!oldContentGroupItem.title && !!newContentGroupItem.title;
        const oneTitleExists = (!oldContentGroupItem.title && !!newContentGroupItem.title) || (!!oldContentGroupItem.title && !newContentGroupItem.title);
        let doTitlesMatch = true;
        if (bothTitlesExist && oldContentGroupItem.title !== newContentGroupItem.title) {
            doTitlesMatch = false;
            isTextModification = true;
            textProperties.push('title');
        }
        if (oneTitleExists) {
            doTitlesMatch = false;
        }
        if (!doTitlesMatch)
            isMatch = false;
    }
    const entityMatchData = { isMatch, isTextModification };
    if (textProperties.length > 0)
        entityMatchData.textProperties = textProperties;
    return entityMatchData;
}
function diff(oldNode, newNode) {
    if (oldNode === undefined && newNode === undefined) {
        return undefined;
    }
    if (oldNode === undefined) {
        const diffNode = structuredClone(newNode);
        diffNode.hasDiff = true;
        diffNode.diffType = DiffType.Added;
        return diffNode;
    }
    if (newNode === undefined) {
        const diffNode = structuredClone(oldNode);
        diffNode.hasDiff = true;
        diffNode.diffType = DiffType.Removed;
        return diffNode;
    }
    const diffNode = structuredClone(newNode);
    const { isMatch, isTextModification = false, textProperties } = isNodeMatch(oldNode, newNode, []);
    if (!isMatch) {
        diffNode.hasDiff = true;
        diffNode.diffType = DiffType.Modified;
        if (isTextModification && textProperties) {
            const diffMods = {};
            let diffPivots = {};
            textProperties.forEach((prop) => {
                const modAssignment = getModificationData(oldNode[prop], newNode[prop]);
                diffMods[prop] = modAssignment;
            });
            diffNode.diffMods = diffMods;
            textProperties.forEach((prop) => {
                var _a, _b;
                const modAssignment = getModificationData(oldNode[prop], newNode[prop]);
                modAssignment.newModData = (_a = modAssignment.newModData) === null || _a === void 0 ? void 0 : _a.map((md) => {
                    const updatedModData = structuredClone(md);
                    updatedModData.startIndex = oldNode[prop] ? md.startIndex + oldNode[prop].length + 1 : md.startIndex;
                    updatedModData.endIndex = oldNode[prop] ? md.endIndex + oldNode[prop].length + 1 : md.endIndex;
                    return updatedModData;
                });
                diffMods[prop] = modAssignment;
                diffPivots[prop] = (_b = oldNode[prop]) === null || _b === void 0 ? void 0 : _b.length;
                diffNode[prop] = `${oldNode[prop]} ${newNode[prop]}`;
            });
            diffNode.hasDiff = true;
            diffNode.isTextModification = true;
            diffNode.diffType = DiffType.Modified;
            diffNode.diffMods = diffMods;
            diffNode.diffPivots = diffPivots;
        }
    }
    const diffChildren = diffInner(oldNode.children, newNode.children);
    diffNode.children = diffChildren;
    return diffNode;
}

var YeastBlockNodeTypes;
(function (YeastBlockNodeTypes) {
    YeastBlockNodeTypes["Blockquote"] = "blockquote";
    YeastBlockNodeTypes["Callout"] = "callout";
    YeastBlockNodeTypes["Code"] = "code";
    YeastBlockNodeTypes["ContentGroup"] = "contentgroup";
    YeastBlockNodeTypes["ContentGroupItem"] = "contentgroupitem";
    YeastBlockNodeTypes["Diff"] = "diff";
    YeastBlockNodeTypes["Document"] = "document";
    YeastBlockNodeTypes["Heading"] = "heading";
    YeastBlockNodeTypes["HorizontalRule"] = "horizontalrule";
    YeastBlockNodeTypes["List"] = "list";
    YeastBlockNodeTypes["ListItem"] = "listitem";
    YeastBlockNodeTypes["Paragraph"] = "paragraph";
    YeastBlockNodeTypes["PseudoParagraph"] = "pseudoParagraph";
    YeastBlockNodeTypes["Table"] = "table";
    YeastBlockNodeTypes["TableRow"] = "tablerow";
    YeastBlockNodeTypes["TableCell"] = "tablecell";
})(YeastBlockNodeTypes || (YeastBlockNodeTypes = {}));
var YeastInlineNodeTypes;
(function (YeastInlineNodeTypes) {
    YeastInlineNodeTypes["Bold"] = "bold";
    YeastInlineNodeTypes["Italic"] = "italic";
    YeastInlineNodeTypes["Link"] = "link";
    YeastInlineNodeTypes["Strikethrough"] = "strikethrough";
    YeastInlineNodeTypes["Code"] = "inlinecode";
    YeastInlineNodeTypes["Image"] = "image";
})(YeastInlineNodeTypes || (YeastInlineNodeTypes = {}));
var ContentGroupType;
(function (ContentGroupType) {
    ContentGroupType["accordion"] = "accordion";
    ContentGroupType["tabbedContent"] = "tabbedcontent";
})(ContentGroupType || (ContentGroupType = {}));
var DiffType;
(function (DiffType) {
    DiffType["Added"] = "added";
    DiffType["Modified"] = "modified";
    DiffType["Removed"] = "removed";
})(DiffType || (DiffType = {}));
var DiffSource;
(function (DiffSource) {
    DiffSource["Old"] = "old";
    DiffSource["New"] = "new";
})(DiffSource || (DiffSource = {}));
function isYeastNode(node) {
    return node.type !== undefined;
}
function isYeastInlineNode(node) {
    return Object.values(YeastInlineNodeTypes).includes(node.type);
}
function isYeastBlockNode(node) {
    return Object.values(YeastBlockNodeTypes).includes(node.type);
}
function isYeastTextNode(node) {
    return node.text !== undefined;
}
function isMockListItemNode(node) {
    return node.marker !== undefined;
}
function scrapeText(node) {
    let s = '';
    if (Array.isArray(node.children))
        s += node.children.map(scrapeText).join();
    if (node.text)
        s += node.text;
    return s;
}
function isYeastNodeType(node, type) {
    return node.hasOwnProperty('type') && node.type.toLowerCase() === type.toLowerCase();
}

export { ContentGroupType, DiffSource, DiffType, YeastBlockNodeTypes, YeastInlineNodeTypes, YeastNodeFactory$1 as YeastNodeFactory, YeastParser, diff, isMockListItemNode, isYeastBlockNode, isYeastInlineNode, isYeastNode, isYeastNodeType, isYeastTextNode, mapAnchorPath, scrapeText };
//# sourceMappingURL=index.js.map
