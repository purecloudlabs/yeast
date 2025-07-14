import { v4 } from 'uuid';
import { CodeFence, AlertBlock, DxAccordionGroup, DxTabbedContent, DataTable, DxAccordion, DxTabPanel } from 'genesys-react-components';
import React, { useState, useEffect } from 'react';
import { DiffType, DiffSource, isYeastNode, YeastBlockNodeTypes, YeastInlineNodeTypes } from 'yeast-core';

// import { useRef } from 'react';
function useKey() {
    // Note: useRef was causing an error in React about hooks. Cause unclear.
    // return useRef<string>(uuidv4());
    return { current: v4() };
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = "/*** \n * Core colors\n ***/\n/*** \n * Component-specific properties \n ***/\n/*** \n * Theme definitions\n ***/\nbody .indent-1 {\n  margin-left: 30px;\n}\nbody .indent-2 {\n  margin-left: 60px;\n}\nbody .indent-3 {\n  margin-left: 90px;\n}\nbody .indent-4 {\n  margin-left: 120px;\n}\nbody .indent-5 {\n  margin-left: 150px;\n}\nbody .indent-6 {\n  margin-left: 180px;\n}\nbody .indent-7 {\n  margin-left: 210px;\n}\nbody .indent-8 {\n  margin-left: 240px;\n}\n\n.diff-added {\n  background-color: rgba(0, 187, 0, 0.4);\n}\n.diff-removed {\n  background-color: rgba(196, 0, 0, 0.4);\n}\n.diff-block-old {\n  margin: 40px 0 0 0;\n  padding: 40px 0;\n}\n.diff-block-new {\n  margin: 0 0 40px 0;\n  padding: 40px 0;\n}\n.diff-block-padding {\n  padding: 10px;\n}\n.diff-modified-old {\n  background-color: rgba(255, 173, 173, 0.4) !important;\n}\n.diff-modified-old-wrapper {\n  background-color: rgba(255, 173, 173, 0.4);\n}\n.diff-modified-new {\n  background-color: rgba(181, 255, 181, 0.4) !important;\n}\n.diff-modified-new-wrapper {\n  background-color: rgba(181, 255, 181, 0.4);\n}\n.diff-modified-full-wrapper {\n  display: flex;\n  gap: 0;\n  align-items: center;\n  justify-content: center;\n}";
styleInject(css_248z$1);

const addedClass = 'diff-added';
const removedClass = 'diff-removed';
const modifiedClassPrefix = 'diff-modified-';
// Interprets the diff data associated with a yeast node and returns css classes, strings, and react nodes for display.
function getDiffRenderData(diffNode) {
    if (!diffNode.hasDiff)
        return;
    // init
    const data = { diffClass: '' };
    // Class assignment for added/removed type is straightforward.
    if (diffNode.diffType === DiffType.Added)
        data.diffClass = addedClass;
    if (diffNode.diffType === DiffType.Removed)
        data.diffClass = removedClass;
    // Modification diff type requires more processing.
    const isModification = diffNode.diffType === DiffType.Modified;
    const isTextModification = diffNode.isTextModification;
    const containsDiff = diffNode.containsDiff;
    const areDiffPivotsPresent = diffNode.diffPivots && Object.keys(diffNode.diffPivots).length > 0;
    if (isModification) {
        // If the diff node includes text modifications, multiple node segments are needed for display
        if (isTextModification && areDiffPivotsPresent) {
            // Some node renderers require the rendered text modifications in string form, while others require nodes. Both are constructed here to be used as needed.
            const renderedNodes = {};
            const renderedStrings = {};
            /*
             * In a diff node, properties that have modified text contain the concatenation of the old and new string.
             * Diff mods contain the string index boundaries for the modified segments of the overall text of a modified property.
             * Diff pivots map a modified property to the string inded that separates the old and new segments of the concatenated string.
             * These are all used here to construct the appropriate node and string segments for displaying the diff.
             */
            for (const [prop, pivot] of Object.entries(diffNode.diffPivots)) {
                // If submodications occur within the modified text, pass them to the renderNodeSegments function for further processing.
                if (diffNode.diffMods && diffNode.diffMods[prop]) {
                    renderedNodes[prop] = React.createElement(React.Fragment, {}, ...renderNodeSegments(prop, diffNode.diffMods[prop], diffNode));
                }
                // Otherwise, just use the old and new strings in their entirety since no internal divisions are needed for diff display.
                else {
                    renderedNodes[prop] = React.createElement(React.Fragment, {}, React.createElement('span', { className: `${modifiedClassPrefix}old` }, diffNode[prop].substring(0, pivot)), React.createElement('span', { className: `${modifiedClassPrefix}new` }, diffNode[prop].substring(pivot + 1, diffNode[prop.length])));
                }
                // The string representation of modified text does not include css styling, so just split the old and new strings off of the concatenated string.
                renderedStrings[prop] = {
                    oldString: diffNode[prop].substring(0, pivot),
                    newString: diffNode[prop].substring(pivot + 1, diffNode[prop].length),
                };
            }
            // Append the rendered nodes and strings to the diff render data.
            data.renderedNodes = renderedNodes;
            data.renderedStrings = renderedStrings;
        }
        // If there is no text modification in either the node or its children, this is the right node depth at which to display the diff.
        else if (containsDiff === false) {
            if (diffNode.diffSource === DiffSource.Old) {
                data.diffClass = `${modifiedClassPrefix}old`;
            }
            if (diffNode.diffSource === DiffSource.New) {
                data.diffClass = `${modifiedClassPrefix}new`;
            }
        }
    }
    // Return the diff render data.
    return data;
}
// Interprets text modfication data to construct react nodes for displaying the diff.
function renderNodeSegments(prop, modAssignment, diffNode) {
    // init
    const { oldModData, newModData } = modAssignment;
    const oldSegments = [];
    const newSegments = [];
    const renderedSegments = [];
    // Process the old and new modification data.
    processModAssignment(oldModData, prop, diffNode, oldSegments, DiffSource.Old);
    processModAssignment(newModData, prop, diffNode, newSegments, DiffSource.New);
    // If both old and new segments are present, nest them both in an outer span element.
    if (oldSegments.length > 0 && newSegments.length > 0) {
        const oldWrapper = React.createElement('span', { className: `${modifiedClassPrefix}old-wrapper` }, ...oldSegments);
        const newWrapper = React.createElement('span', { className: `${modifiedClassPrefix}new-wrapper` }, ...newSegments);
        const fullWrapper = React.createElement('span', { className: `${modifiedClassPrefix}full-wrapper` }, oldWrapper, newWrapper);
        renderedSegments.push(fullWrapper);
    }
    // If only old segments are present, nest them in an outer span element.
    else if (oldSegments.length > 0) {
        const oldWrapper = React.createElement('span', { className: `${modifiedClassPrefix}old-wrapper` }, ...oldSegments);
        const fullWrapper = React.createElement('span', { className: `${modifiedClassPrefix}full-wrapper` }, oldWrapper);
        renderedSegments.push(fullWrapper);
    }
    // If only new segments are present, nest them in an outer span element.
    else if (newSegments.length > 0) {
        const newWrapper = React.createElement('span', { className: `${modifiedClassPrefix}new-wrapper` }, ...newSegments);
        const fullWrapper = React.createElement('span', { className: `${modifiedClassPrefix}full-wrapper` }, newWrapper);
        renderedSegments.push(fullWrapper);
    }
    return renderedSegments;
}
/*
 * Escape pure whitespace segments.
 * React nodes with inner text containing only whitespace need the whitespace escaped with the html space entity.
 * This ensures that the whitespace will display in the diff.
 */
function escapeHtmlWhitespace(s) {
    let escapedString = s;
    if (s.trim() === '') {
        escapedString = s.replace(/\s/g, '\u00A0');
    }
    return escapedString;
}
// Processes text modification data, creates and collects react nodes for displaying text diffs
function processModAssignment(modData, prop, diffNode, renderedSegments, diffSource) {
    // Initialize css class suffixes.
    let innerClassSuffix;
    let outerClassSuffix;
    if (diffSource === DiffSource.Old) {
        innerClassSuffix = 'removed';
        outerClassSuffix = 'old';
    }
    else {
        innerClassSuffix = 'added';
        outerClassSuffix = 'new';
    }
    /*
     * Initialize the start and end indices.
     * If processing modification data of text from the old node, start at 0 and stop at the diff pivot.
     * If processing the same from the new node, start at the diff pivot and stop at the end of the string.
     */
    let startIndex;
    let endIndex;
    if (diffSource === DiffSource.Old) {
        startIndex = 0;
        endIndex = diffNode.diffPivots[prop];
    }
    else {
        startIndex = diffNode.diffPivots[prop];
        endIndex = diffNode[prop].length;
    }
    // If no modification data is present, inject the entire segment into a span and return.
    if (modData.length === 0) {
        const postSegment = React.createElement('span', { className: `${modifiedClassPrefix}${outerClassSuffix}` }, escapeHtmlWhitespace(diffNode[prop].substring(startIndex, endIndex)));
        renderedSegments.push(postSegment);
        return;
    }
    // Process the modification data.
    for (let i = 0; i < modData.length; i++) {
        const isFirstModOffset = i === 0 && modData[0].startIndex > startIndex;
        // If there are characters before the first modification, treat those as the first segment.
        if (isFirstModOffset) {
            const preSegment = React.createElement('span', { className: `${modifiedClassPrefix}${outerClassSuffix}` }, escapeHtmlWhitespace(diffNode[prop].substring(startIndex, modData[0].startIndex)));
            renderedSegments.push(preSegment);
        }
        // Construct a node for the span indicated by the modification data.
        const segment = React.createElement('span', { className: `diff-${innerClassSuffix}` }, escapeHtmlWhitespace(diffNode[prop].substring(modData[i].startIndex, modData[i].endIndex)));
        renderedSegments.push(segment);
        const isLastMod = i === modData.length - 1;
        const isLastModOffset = modData[i].endIndex < diffNode[prop].length;
        const isConsecutive = !isLastMod && modData[i + 1].startIndex - modData[i].endIndex === 0;
        // If there are chars remaining after the last modification, treat those as the last segment.
        if (isLastMod && isLastModOffset) {
            const postSegment = React.createElement('span', { className: `${modifiedClassPrefix}${outerClassSuffix}` }, escapeHtmlWhitespace(diffNode[prop].substring(modData[i].endIndex, endIndex)));
            renderedSegments.push(postSegment);
        }
        // If this is not the last modification, and there are chars between the current and next mod, add a segment for those gap chars.
        else if (!isConsecutive && !isLastMod) {
            const postSegmentEndIndex = modData[i + 1].startIndex;
            const postSegment = React.createElement('span', { className: `${modifiedClassPrefix}${outerClassSuffix}` }, escapeHtmlWhitespace(diffNode[prop].substring(modData[i].endIndex, postSegmentEndIndex)));
            renderedSegments.push(postSegment);
        }
    }
}
/*
 * Splits a diff node with text modifications into before and after nodes.
 * This is needed under the following circumstances
 * 1) A diff node has a text modification on a property where classes/nodes cannot be injected to display the diff side-by-side.
 * 2) As a result, the node will be split and displayed as before and after nodes to show modification on the whole node instead of just the localized text diff.
 * 3) Sometimes, this method fails because the node contains children with text modification that are displayed side-by-side, and thus there are duplicate text mods (in both before and after nodes).
 * 4) To combat that case, this function is used to split those inner child text mods and segregate them to the before and after nodes.
 */
function separateDiffChildren(node) {
    var _a;
    // init
    let children = node.children;
    const oldChildren = [];
    const newChildren = [];
    // Iterate throught the child nodes.
    if (children && children.length > 0) {
        for (const child of children) {
            // Make an "old" and "new" copy of the unified diff node.
            let oldChild = Object.assign({}, child);
            let newChild = Object.assign({}, child);
            // If the child has or contains text modifications, further processing is needed.
            if (child.hasDiff && (child.isTextModification || child.containsDiff)) {
                // init
                const mods = child.diffMods;
                const pivots = child.diffPivots;
                const oldModDiffMap = {};
                const newModDiffMap = {};
                const rebasedPivots = {};
                // If the child has a text modification at the current level, commence splitting.
                const shouldProcess = child.isTextModification && mods && ((_a = Object.keys(mods)) === null || _a === void 0 ? void 0 : _a.length) > 0;
                if (shouldProcess) {
                    // Iterate through the diff mods.
                    for (const [textProp, modData] of Object.entries(mods)) {
                        // Obtain the matching pivot index separated the old and new strings.
                        const pivot = pivots[textProp] || 0;
                        // Segregate the old and new strings.
                        const oldString = child[textProp].substring(0, pivot);
                        const newString = child[textProp].substring(pivot);
                        /*
                         * The modification data for the separated diff nodes is going to be processed again downstream by the getDiffRenderData function when the child nodes are rendered.
                         * Therefore, the modification data for the new node needs to be rebased by subtracting each index by the pivot, and the pivot becomes 0.
                         * That's because the old and new strings are no longer concatenated.
                         * The old modification data oesn't need the same adjustment, because the old string comes first in the concatenated string.
                         */
                        rebasedPivots[textProp] = 0;
                        let oldData = modData.oldModData;
                        let newData = modData.newModData.map((data) => {
                            const rebasedData = Object.assign({}, data);
                            rebasedData.startIndex = data.startIndex - pivot;
                            rebasedData.endIndex = data.endIndex - pivot;
                            return rebasedData;
                        });
                        // The old node only needs the old mod data.
                        let oldAssignment = {
                            oldModData: oldData,
                            newModData: [],
                        };
                        // The new node only needs the old mod data.
                        let newAssignment = {
                            oldModData: [],
                            newModData: newData,
                        };
                        // append data
                        oldModDiffMap[textProp] = oldAssignment;
                        newModDiffMap[textProp] = newAssignment;
                        oldChild[textProp] = oldString;
                        newChild[textProp] = newString;
                    }
                    // append data
                    oldChild.diffMods = oldModDiffMap;
                    oldChild.diffPivots = pivots;
                    newChild.diffMods = newModDiffMap;
                    newChild.diffPivots = rebasedPivots;
                }
                // If the current child has no text modification, but contains a text modification within its children, recursively call the function to process them.
                if (isYeastNode(child)) {
                    const separatedChildren = separateDiffChildren(child);
                    if (separatedChildren.oldChildren)
                        oldChild.children = separatedChildren.oldChildren;
                    if (separatedChildren.newChildren)
                        newChild.children = separatedChildren.newChildren;
                }
            }
            // append
            oldChildren.push(oldChild);
            newChildren.push(newChild);
        }
    }
    // Return the separated children.
    return {
        oldChildren,
        newChildren,
    };
}

function BlockCodeNodeRenderer(props) {
    let oldTitle = props.node.title;
    let newTitle = props.node.title;
    let oldValue = props.node.value;
    let newValue = props.node.value;
    let className = '';
    const diffRenderData = getDiffRenderData(props.node);
    if (diffRenderData) {
        className += `diff-block-padding ${diffRenderData.diffClass}`;
        if (diffRenderData.renderedStrings) {
            if (diffRenderData.renderedStrings['title']) {
                oldTitle = diffRenderData.renderedStrings['title'].oldString;
                newTitle = diffRenderData.renderedStrings['title'].newString;
            }
            if (diffRenderData.renderedStrings['value']) {
                oldValue = diffRenderData.renderedStrings['value'].oldString;
                newValue = diffRenderData.renderedStrings['value'].newString;
            }
        }
    }
    const key = useKey();
    let value = props.node.value;
    if (props.node.tabsToSpaces) {
        let spaces = ' ';
        spaces = spaces.repeat(props.node.tabsToSpaces);
        value = props.node.value.replace(/\t/gi, spaces);
    }
    const indentation = props.node.indentation ? props.node.indentation.toString() : '';
    return diffRenderData && diffRenderData.renderedStrings ? (React.createElement(React.Fragment, null,
        React.createElement(CodeFence, { key: key.current, value: oldValue, language: props.node.language, title: oldTitle, autoCollapse: props.node.autoCollapse, noCollapse: props.node.noCollapse, showLineNumbers: props.node.showLineNumbers, indentation: indentation, className: "diff-modified-old diff-block-old" }),
        React.createElement(CodeFence, { key: key.current, value: newValue, language: props.node.language, title: newTitle, autoCollapse: props.node.autoCollapse, noCollapse: props.node.noCollapse, showLineNumbers: props.node.showLineNumbers, indentation: indentation, className: "diff-modified-new diff-block-new" }))) : (React.createElement(CodeFence, { key: key.current, value: value, language: props.node.language, title: props.node.title, autoCollapse: props.node.autoCollapse, noCollapse: props.node.noCollapse, showLineNumbers: props.node.showLineNumbers, indentation: indentation, className: className }));
}

function BlockQuoteNodeRenderer(props) {
    const key = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    let className = diffRenderData ? diffRenderData.diffClass : '';
    return React.createElement("blockquote", { key: key.current, className: className }, props.renderer.renderComponents(props.node.children));
}

function BoldNodeRenderer(props) {
    const key = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    let className = diffRenderData ? diffRenderData.diffClass : '';
    return React.createElement("strong", { key: key.current, className: className }, props.renderer.renderComponents(props.node.children));
}

function CalloutNodeRenderer(props) {
    const key = useKey();
    let oldTitle = props.node.title;
    let newTitle = props.node.title;
    let oldDiffChildren = [];
    let newDiffChildren = [];
    const diffRenderData = getDiffRenderData(props.node);
    let className = props.node.className || '';
    if (diffRenderData) {
        className += ' diff-block-padding';
        if (diffRenderData.renderedStrings && diffRenderData.renderedStrings['title']) {
            const { oldChildren, newChildren } = separateDiffChildren(props.node);
            oldDiffChildren = oldChildren;
            newDiffChildren = newChildren;
            oldTitle = diffRenderData.renderedStrings['title'].oldString;
            newTitle = diffRenderData.renderedStrings['title'].newString;
        }
    }
    return diffRenderData && diffRenderData.renderedStrings
        ? (React.createElement(React.Fragment, null,
            React.createElement(AlertBlock, { key: key.current, alertType: props.node.alertType, title: oldTitle, collapsible: props.node.collapsible, autoCollapse: props.node.autoCollapse, indentation: props.node.indentation, className: `${className} diff-modified-old diff-block-old` }, props.renderer.renderComponents(oldDiffChildren)),
            React.createElement(AlertBlock, { key: key.current, alertType: props.node.alertType, title: newTitle, collapsible: props.node.collapsible, autoCollapse: props.node.autoCollapse, indentation: props.node.indentation, className: `${className} diff-modified-new diff-block-new` }, props.renderer.renderComponents(newDiffChildren)))) : (React.createElement(AlertBlock, { key: key.current, alertType: props.node.alertType, title: props.node.title, collapsible: props.node.collapsible, autoCollapse: props.node.autoCollapse, indentation: props.node.indentation, className: className }, props.renderer.renderComponents(props.node.children)));
}

function ContentGroupNodeRenderer(props) {
    const key = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    let className = diffRenderData ? diffRenderData.diffClass : '';
    if (props.node.groupType === 'accordion') {
        return (React.createElement("div", { className: className },
            React.createElement(DxAccordionGroup, { key: key.current }, props.renderer.renderComponents(props.node.children)),
            ";"));
    }
    else if (props.node.groupType === 'tabbedcontent') {
        return (React.createElement("div", { className: className },
            React.createElement(DxTabbedContent, { key: key.current }, props.renderer.renderComponents(props.node.children))));
    }
}

function HeadingNodeRenderer(props) {
    const key = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    let className = diffRenderData ? diffRenderData.diffClass : '';
    const level = props.node.level >= 1 && props.node.level <= 7 && props.node.level % 1 === 0 ? props.node.level : 1;
    if (level === 7) {
        return (React.createElement("span", { className: `h7 ${className}`, key: key.current, id: props.node.id }, props.renderer.renderComponents(props.node.children)));
    }
    else {
        return React.createElement(`h${level}`, { key: key.current, id: props.node.id, className }, props.renderer.renderComponents(props.node.children));
    }
}

function ImageNodeRenderer(props) {
    var _a, _b, _c;
    const key1 = useKey();
    const key2 = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    const className = diffRenderData ? diffRenderData.diffClass : '';
    let oldSrc = '';
    let newSrc = '';
    let oldAlt = '';
    let newAlt = '';
    let oldTitle = '';
    let newTitle = '';
    if (diffRenderData && diffRenderData.renderedStrings) {
        if (diffRenderData.renderedStrings['title']) {
            oldTitle = diffRenderData.renderedStrings['title'].oldString;
            newTitle = diffRenderData.renderedStrings['title'].newString;
        }
        else if ((_a = props.node) === null || _a === void 0 ? void 0 : _a.title) {
            oldTitle = props.node.title;
            newTitle = oldTitle;
        }
        if (diffRenderData.renderedStrings['alt']) {
            oldAlt = diffRenderData.renderedStrings['alt'].oldString;
            newAlt = diffRenderData.renderedStrings['alt'].newString;
        }
        else if ((_b = props.node) === null || _b === void 0 ? void 0 : _b.alt) {
            oldAlt = props.node.alt;
            newAlt = oldAlt;
        }
        if (diffRenderData.renderedStrings['src']) {
            oldSrc = diffRenderData.renderedStrings['src'].oldString;
            newSrc = diffRenderData.renderedStrings['src'].newString;
        }
        else if ((_c = props.node) === null || _c === void 0 ? void 0 : _c.src) {
            oldSrc = props.node.src;
            newSrc = oldSrc;
        }
    }
    return diffRenderData && diffRenderData.renderedStrings
        ? (React.createElement(React.Fragment, null,
            React.createElement("img", { key: key1.current, alt: oldAlt, src: oldSrc, title: oldTitle, className: className }),
            React.createElement("img", { key: key2.current, alt: newAlt, src: newSrc, title: newTitle, className: className })))
        : React.createElement("img", { key: key1.current, alt: props.node.alt, src: props.node.src, title: props.node.title, className: className });
}

function InlineCodeNodeRenderer(props) {
    const key = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    let className = diffRenderData ? diffRenderData.diffClass : '';
    return React.createElement("code", { key: key.current, className: className }, props.renderer.renderComponents(props.node.children));
}

function ItalicNodeRenderer(props) {
    const key = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    let className = diffRenderData ? diffRenderData.diffClass : '';
    return React.createElement("em", { className: className, key: key.current }, props.renderer.renderComponents(props.node.children));
}

function LinkNodeRenderer(props) {
    const key = useKey();
    let oldTitle = props.node.title;
    let newTitle = props.node.title;
    const diffRenderData = getDiffRenderData(props.node);
    if (diffRenderData && diffRenderData.renderedStrings) {
        if (diffRenderData.renderedStrings['title']) {
            oldTitle = diffRenderData.renderedStrings['title'].oldString;
            newTitle = diffRenderData.renderedStrings['title'].newString;
        }
    }
    const className = diffRenderData ? diffRenderData.diffClass : '';
    if (props.node.forceNewTab) {
        return diffRenderData && diffRenderData.renderedStrings
            ? (React.createElement(React.Fragment, null,
                React.createElement("a", { className: 'diff-modified-old', key: key.current, href: props.node.href, target: "_blank", rel: "noreferrer", title: oldTitle },
                    props.renderer.renderComponents(props.node.children),
                    " (TAB)"),
                React.createElement("a", { className: 'diff-modified-new', key: key.current, href: props.node.href, target: "_blank", rel: "noreferrer", title: newTitle },
                    props.renderer.renderComponents(props.node.children),
                    " (TAB)"))) : (React.createElement("a", { className: className, key: key.current, href: props.node.href, target: "_blank", rel: "noreferrer", title: props.node.title },
            props.renderer.renderComponents(props.node.children),
            " (TAB)"));
    }
    else {
        return (React.createElement("a", { key: key.current, href: props.node.href, title: props.node.title }, props.renderer.renderComponents(props.node.children)));
    }
}

function ListItemNodeRenderer(props) {
    const key = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    let className = diffRenderData ? diffRenderData.diffClass : '';
    return React.createElement("li", { key: key.current, className: className }, props.renderer.renderComponents(props.node.children));
}

function ListNodeRenderer(props) {
    const key = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    let className = diffRenderData ? diffRenderData.diffClass : '';
    /*
     * The explicit boolean check prevents the case where a custom node has ordered value "false" which evaluates as truthy.
     * Custom nodes get parsed from xml and the ordered property is parsed as a string.
     * This can happen because TypeScript types only exist at compile time.
     */
    if (props.node.ordered === true || props.node.ordered === 'true') {
        return (React.createElement("ol", { key: key.current, start: props.node.start || 1, className: className }, props.renderer.renderComponents(props.node.children)));
    }
    else {
        return React.createElement("ul", { key: key.current, className: className }, props.renderer.renderComponents(props.node.children));
    }
}

function ParagraphNodeRenderer(props) {
    const key = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    const baseClass = `${props.node.indentation && props.node.indentation > 0 ? ` indent-${props.node.indentation}` : ''}`;
    let className = diffRenderData ? baseClass + ' ' + diffRenderData.diffClass : baseClass;
    return (React.createElement("p", { className: className, key: key.current }, props.renderer.renderComponents(props.node.children)));
}

function StrikethroughNodeRenderer(props) {
    const key = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    let className = diffRenderData ? diffRenderData.diffClass : '';
    return React.createElement("s", { className: className, key: key.current }, props.renderer.renderComponents(props.node.children));
}

var css_248z = "/*** \n * Core colors\n ***/\n/*** \n * Component-specific properties \n ***/\n/*** \n * Theme definitions\n ***/\n.table-container {\n  margin: 40px 0;\n}\n.table-container .filter-container {\n  display: flex;\n  flex-flow: row nowrap;\n  gap: 8px;\n  width: 100%;\n  box-sizing: border-box;\n}\n.table-container .filter-container .filter-toggle {\n  color: var(--theme-core-link-color);\n  font-size: 12px;\n  line-height: 0;\n  margin: 6px 0 0 10px;\n  cursor: pointer;\n  align-self: flex-start;\n}\n.table-container .filter-container .filter-toggle:hover {\n  color: var(--theme-core-link-hover-color);\n}\n.table-container .table {\n  width: 100%;\n  margin: 0 30px 0 0;\n  color: var(--theme-datatable-text-color);\n  background-color: var(--theme-datatable-background-color);\n}\n.table-container .table td {\n  border-width: 0 0 1px 0;\n  border-style: solid;\n  border-color: var(--theme-datatable-border-color);\n  vertical-align: top;\n  min-width: 80px;\n}\n.table-container .table td p {\n  margin: 0;\n  min-width: 10%;\n}\n.table-container .table thead tr {\n  color: var(--theme-datatable-text-color);\n  font-weight: bold;\n  font-size: 14px;\n  line-height: 24px;\n}\n.table-container .table thead tr td {\n  padding: 0 10px;\n}\n.table-container .table thead tr td .header-container {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-flow: row nowrap;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 6px;\n  width: 100%;\n}\n.table-container .table thead tr td .header-container.align-center {\n  justify-content: center;\n}\n.table-container .table thead tr td .header-container.align-right {\n  justify-content: flex-end;\n}\n.table-container .table thead tr td .sort-numeric {\n  display: flex;\n  flex-flow: row nowrap;\n  gap: 8px;\n  align-items: center;\n}\n.table-container .table thead tr td .sort-numeric .dx-label {\n  max-width: 70px;\n}\n.table-container .table thead tr td .sort-date {\n  display: flex;\n  flex-flow: row nowrap;\n  gap: 8px;\n  align-items: center;\n}\n.table-container .table thead tr td .sort-date .date-filter {\n  max-width: 155px;\n}\n.table-container .table thead tr.filter-spacer {\n  height: 10px;\n}\n.table-container .table thead tr.filter-row {\n  background-color: var(--theme-datatable-filter-background-color);\n}\n.table-container .table thead tr.filter-row td {\n  border-width: 1px 0;\n  vertical-align: middle;\n}\n.table-container .table thead tr.filter-row td:first-child {\n  border-width: 1px 0 1px 1px;\n  border-radius: 4px 0 0 4px;\n}\n.table-container .table thead tr.filter-row td:last-child {\n  border-width: 1px 1px 1px 0;\n  border-radius: 0 4px 4px 0;\n}\n.table-container .table tbody tr {\n  font-size: 12px;\n  line-height: 20px;\n}\n.table-container .table tbody tr td {\n  padding: 16px 10px;\n}\n.table-container .table tbody tr td > div {\n  display: flex;\n  flex-flow: row nowrap;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 10px;\n}\n.table-container .table tbody tr td > div.align-center {\n  justify-content: center;\n}\n.table-container .table tbody tr td > div.align-right {\n  justify-content: flex-end;\n}\n.table-container .table tbody tr td > div .copy-button {\n  color: unset;\n}\n.table-container .table tbody tr td > div .icon {\n  line-height: 0;\n}\n.table-container .table tr td:first-child {\n  padding-left: 12px;\n}\n.table-container .table tr td:last-child {\n  padding-right: 12px;\n}\n.table-container.paginated .table {\n  margin-bottom: 10px;\n}\n.table-container.sortable .table thead tr td {\n  cursor: pointer;\n}\n.table-container.sortable .table thead tr td .sort-icon,\n.table-container.sortable .table thead tr td .filter-active-icon {\n  color: var(--theme-core-link-color);\n}\n.table-container.sortable .table thead tr td.unsorted .sort-icon {\n  visibility: hidden;\n}\n.table-container.sortable .table thead tr td:hover .sort-icon {\n  visibility: visible;\n}";
styleInject(css_248z);

function TableNodeRenderer(props) {
    const key = useKey();
    let headerRow;
    let rows;
    const diffRenderData = getDiffRenderData(props.node);
    let className = diffRenderData ? `table-${key.current} ${diffRenderData.diffClass}` : '';
    const getContent = (node) => {
        if (!node.children && !node.text) {
            return '';
        }
        if (!node.children) {
            return node.text;
        }
        let content = [];
        for (let index = 0; index < node.children.length; index++) {
            content.push(getContent(node.children[index]));
        }
        return content.join(' ');
    };
    if (props.node.children[0].header) {
        headerRow = { cells: [] };
        props.node.children[0].children.forEach((child) => {
            headerRow.cells.push({
                renderedContent: React.createElement(React.Fragment, null, props.renderer.renderComponents(child.children)),
                content: getContent(child),
                align: child.align,
            });
        });
    }
    let tableRowsContent = headerRow ? props.node.children.slice(1) : props.node.children;
    if (props.node.children) {
        rows = [];
        tableRowsContent.forEach((row, i) => {
            if (row.type == YeastBlockNodeTypes.TableRow) {
                const rowDiffData = getDiffRenderData(row);
                let rowClass = rowDiffData ? rowDiffData.diffClass : '';
                let childRow = { cells: [] };
                if (rowClass)
                    childRow.className = rowClass;
                row.children.forEach((childCell) => {
                    const cellDiffData = getDiffRenderData(childCell);
                    let cellDiffClass = cellDiffData ? cellDiffData.diffClass : '';
                    let renderedContent;
                    renderedContent = React.createElement(React.Fragment, null, props.renderer.renderComponents(childCell.children));
                    const content = getContent(childCell);
                    const cell = {
                        renderedContent,
                        content: content.length == 0 ? 'default content' : content,
                    };
                    if (cellDiffClass)
                        cell.className = cellDiffClass;
                    if (childCell.align === 'left' || childCell.align === 'right' || childCell.align === 'center') {
                        cell.align = childCell.align;
                    }
                    childRow.cells.push(cell);
                });
                rows.push(childRow);
            }
        });
    }
    return (React.createElement(DataTable, { key: key.current, headerRow: headerRow, rows: rows, sortable: props.node.sortable, indentation: props.node.indentation, filterable: props.node.filterable, className: className }));
}

function HorizontalRuleNodeRenderer(props) {
    const key = useKey();
    const diffRenderData = getDiffRenderData(props.node);
    let className = 'diff-block-padding';
    if (diffRenderData) {
        className += ` ${diffRenderData.diffClass}`;
        return (React.createElement("div", { className: className },
            React.createElement("hr", { key: key.current })));
    }
    return React.createElement("hr", { className: className, key: key.current });
}

const TILDE_REGEX = /\\~/g;
class ReactRenderer {
    constructor(customRenderers) {
        this.defaultRenderers = {
            [YeastBlockNodeTypes.Paragraph]: (node, renderer) => {
                return React.createElement(ParagraphNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastBlockNodeTypes.Heading]: (node, renderer) => {
                return React.createElement(HeadingNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastBlockNodeTypes.List]: (node, renderer) => {
                return React.createElement(ListNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastBlockNodeTypes.ListItem]: (node, renderer) => {
                return React.createElement(ListItemNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastInlineNodeTypes.Bold]: (node, renderer) => {
                return React.createElement(BoldNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastInlineNodeTypes.Italic]: (node, renderer) => {
                return React.createElement(ItalicNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastInlineNodeTypes.Code]: (node, renderer) => {
                return React.createElement(InlineCodeNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastBlockNodeTypes.Code]: (node, renderer) => {
                return React.createElement(BlockCodeNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastInlineNodeTypes.Link]: (node, renderer) => {
                return React.createElement(LinkNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastBlockNodeTypes.Callout]: (node, renderer) => {
                return React.createElement(CalloutNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastBlockNodeTypes.Table]: (node, renderer) => {
                return React.createElement(TableNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastInlineNodeTypes.Image]: (node, renderer) => {
                return React.createElement(ImageNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastBlockNodeTypes.HorizontalRule]: (node, renderer) => {
                return React.createElement(HorizontalRuleNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastBlockNodeTypes.Blockquote]: (node, renderer) => {
                return React.createElement(BlockQuoteNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastBlockNodeTypes.ContentGroup]: (node, renderer) => {
                return React.createElement(ContentGroupNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
            [YeastBlockNodeTypes.ContentGroupItem]: (node, renderer) => {
                if (node.groupType === 'accordion') {
                    return React.createElement(DxAccordion, { title: node.title }, renderer.renderComponents(node.children));
                }
                else if (node.groupType === 'tabbedcontent') {
                    return React.createElement(DxTabPanel, { title: node.title }, renderer.renderComponents(node.children));
                }
            },
            [YeastInlineNodeTypes.Strikethrough]: (node, renderer) => {
                return React.createElement(StrikethroughNodeRenderer, { key: v4(), node: node, renderer: renderer });
            },
        };
        this.customRenderers = customRenderers;
    }
    renderComponents(nodes) {
        if (!nodes)
            return;
        return nodes.map((node, i) => {
            // Render the node using custom renderers
            let rendered = this.renderComponent(node, this.customRenderers);
            if (!!rendered)
                return rendered;
            // Render the node using defaults
            rendered = this.renderComponent(node, this.defaultRenderers);
            if (!!rendered)
                return rendered;
            // Fallback to custom unhandled renderer
            if (!rendered && this.unhandledNodeRenderer) {
                rendered = this.unhandledNodeRenderer(node, this);
                if (!!rendered)
                    return rendered;
            }
            // Final fallback to default unhandled renderer
            if (node.text) {
                const diffRenderData = getDiffRenderData(node);
                const typedNode = node;
                const processedText = typedNode.text.replace(TILDE_REGEX, '~');
                return diffRenderData && diffRenderData.renderedNodes
                    ? React.createElement(React.Fragment, { key: i }, diffRenderData.renderedNodes['text'])
                    : React.createElement(React.Fragment, { key: i }, processedText);
            }
            else {
                console.warn('Unhandled node', node);
                return;
            }
        });
    }
    renderComponent(node, renderers) {
        if (!node || !renderers)
            return;
        // Untyped nodes aren't handled here
        if (!node.type)
            return;
        const typedNode = Object.assign({}, node);
        typedNode.children = typedNode.children || [];
        // Process renderers
        let component;
        Object.entries(renderers).some(([nodeType, plugin]) => {
            if (typedNode.type.toLowerCase() === nodeType.toLowerCase()) {
                component = plugin(node, this);
            }
            return !!component;
        });
        // Return whatever was assigned
        return component;
    }
}

function YeastNodeRenderer(props) {
    const key = useKey();
    const [renderer, setRenderer] = useState(new ReactRenderer(props.customRenderers));
    useEffect(() => {
        if (props.customRenderers === renderer.customRenderers)
            return;
        setRenderer(new ReactRenderer(props.customRenderers));
    }, [props.customRenderers]);
    return React.createElement(React.Fragment, { key: key.current }, renderer.renderComponents(props.nodes));
}

function YeastDocumentRenderer(props) {
    var _a, _b, _c;
    const diffRenderData = getDiffRenderData(props.ast);
    const classList = [];
    if (props.className)
        classList.push(props.className);
    if (diffRenderData)
        classList.push(diffRenderData.diffClass);
    const className = classList.join(' ').trim();
    let title = ((_a = props.ast) === null || _a === void 0 ? void 0 : _a.title) || '';
    let author;
    if ((_b = props.ast) === null || _b === void 0 ? void 0 : _b.author)
        author = props.ast.author;
    if (diffRenderData && diffRenderData.renderedNodes) {
        if (diffRenderData.renderedNodes['title']) {
            title = diffRenderData.renderedNodes['title'];
        }
        if (diffRenderData.renderedNodes['author']) {
            author = diffRenderData.renderedNodes['author'];
        }
    }
    return (React.createElement("div", { className: className },
        React.createElement("h1", null, title),
        author && React.createElement("h2", null, author),
        React.createElement(YeastNodeRenderer, { nodes: (_c = props.ast) === null || _c === void 0 ? void 0 : _c.children, customRenderers: props.customRenderers })));
}

export { ReactRenderer, YeastDocumentRenderer, YeastNodeRenderer, getDiffRenderData, useKey };
//# sourceMappingURL=index.js.map
