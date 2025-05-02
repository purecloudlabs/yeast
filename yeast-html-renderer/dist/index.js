import { isYeastNode, isYeastTextNode, scrapeText, YeastInlineNodeTypes, YeastBlockNodeTypes } from 'yeast-core';
import { JSDOM } from 'jsdom';
import { fragment } from 'xmlbuilder2';

function renderCustomComponent(node, renderer) {
    if (!isYeastNode(node) && !isYeastTextNode(node))
        return;
    const codeElement = renderer.document.createElement('code');
    const preElement = renderer.document.createElement('pre');
    preElement.appendChild(codeElement);
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
    codeElement.textContent = root.end({ prettyPrint: true });
    return preElement;
}

function renderBlockCodeNode(node, renderer) {
    const element = renderer.document.createElement('div');
    if (node.title) {
        const title = renderer.document.createElement('p');
        title.textContent = node.title;
        element.append(title);
    }
    const codeElement = renderer.document.createElement('code');
    const preElement = renderer.document.createElement('pre');
    preElement.appendChild(codeElement);
    element.appendChild(preElement);
    if (node.language) {
        codeElement.classList.add(`language-${node.language}`);
    }
    codeElement.append(node.value);
    return element;
}

function renderBlockquoteNode(node, renderer) {
    const element = renderer.document.createElement('blockquote');
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderBoldNode(node, renderer) {
    const element = renderer.document.createElement('strong');
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderCalloutNode(node, renderer) {
    const element = renderer.document.createElement('div');
    element.classList.add('callout');
    if (node.alertType)
        element.classList.add(`callout-${node.alertType}`);
    if (node.title) {
        const title = renderer.document.createElement('p');
        title.textContent = node.title;
        element.append(title);
    }
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderContentGroupItemNode(node, renderer) {
    const element = renderer.document.createElement('div');
    if (node.title) {
        const title = renderer.document.createElement('p');
        title.textContent = node.title;
        element.append(title);
    }
    if (node.groupType) {
        element.classList.add(`content-group-${node.groupType}`);
    }
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderContentGroupNode(node, renderer) {
    const element = renderer.document.createElement('div');
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderHeadingNode(node, renderer) {
    let level = node.level;
    if (!level || isNaN(level)) {
        level = 1;
    }
    else {
        if (level < 1)
            level = 1;
        if (level > 7)
            level = 7;
    }
    const element = renderer.document.createElement(level === 7 ? 'span' : `h${level}`);
    if (level === 7)
        element.className = 'h7';
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderHorizontalRuleNode(node, renderer) {
    const element = renderer.document.createElement('hr');
    return element;
}

function renderImageNode(node, renderer) {
    const element = renderer.document.createElement('img');
    if (node.title)
        element.title = node.title;
    if (node.alt)
        element.alt = node.alt;
    element.src = node.src;
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderInlineCodeNode(node, renderer) {
    const element = renderer.document.createElement('code');
    element.append(scrapeText(node));
    return element;
}

function renderItalicNode(node, renderer) {
    const element = renderer.document.createElement('i');
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderLinkNode(node, renderer) {
    const element = renderer.document.createElement('a');
    element.href = node.href;
    if (node.title)
        element.title = node.title;
    if (node.forceNewTab)
        element.target = '_blank';
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderListItemNode(node, renderer) {
    const element = renderer.document.createElement('li');
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderListNode(node, renderer) {
    const element = renderer.document.createElement(node.ordered ? 'ol' : 'ul');
    if (node.ordered && node.start)
        element.setAttribute('start', node.start.toString());
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderParagraphNode(node, renderer) {
    const element = renderer.document.createElement('p');
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderStrikethroughode(node, renderer) {
    const element = renderer.document.createElement('s');
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderTableCellNode(node, renderer) {
    const element = renderer.document.createElement('td');
    if (node.align)
        element.style.textAlign = node.align;
    element.append(...renderer.renderComponents(node.children));
    return element;
}

function renderTableNode(node, renderer) {
    const element = renderer.document.createElement('table');
    let headerOffset = 0;
    if (node.children.length > 1 && node.children[0].header) {
        headerOffset = 1;
        const header = renderer.document.createElement('thead');
        header.append(...renderer.renderComponents([node.children[0]]));
        element.append(header);
    }
    const body = renderer.document.createElement('tbody');
    element.append(body);
    body.append(...renderer.renderComponents(node.children.slice(headerOffset)));
    return element;
}

function renderTableRowNode(node, renderer) {
    const element = renderer.document.createElement('tr');
    element.append(...renderer.renderComponents(node.children));
    return element;
}

class HTMLRenderer {
    constructor(customRenderers) {
        this.document = new JSDOM(`...`).window.document;
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
                return renderBlockCodeNode(node, renderer);
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
            [YeastBlockNodeTypes.HorizontalRule]: (node, renderer) => {
                return renderHorizontalRuleNode(node, renderer);
            },
            [YeastInlineNodeTypes.Image]: (node, renderer) => {
                return renderImageNode(node, renderer);
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
            if (!!rendered)
                return rendered;
            if (!rendered && this.unhandledNodeRenderer) {
                rendered = this.unhandledNodeRenderer(node, this);
                if (!!rendered)
                    return rendered;
            }
            if (!rendered) {
                if (isYeastTextNode(node) && !isYeastNode(node)) {
                    return node.text;
                }
                else {
                    return renderCustomComponent(node, this);
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
        let nodeElement;
        const htmlRenderer = this;
        Object.entries(renderers).some(([nodeType, plugin]) => {
            if (typedNode.type === nodeType) {
                nodeElement = plugin(node, htmlRenderer);
            }
            return !!nodeElement;
        });
        return nodeElement;
    }
    renderHTML(astDocument) {
        let documentChildren = this.renderComponents(astDocument.children);
        return documentChildren;
    }
    renderHTMLString(astDocument) {
        return this.renderHTML(astDocument)
            .map((element) => (typeof element === 'string' ? element : element.outerHTML))
            .join('\n');
    }
}

export { HTMLRenderer };
//# sourceMappingURL=index.js.map
