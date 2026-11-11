import { InlineCustomComponentNode, isYeastTextNode, YeastChild } from 'yeast-core';

import { HTMLRenderer, RenderedNode } from '../HTMLRenderer';

// Properties that are never written as attributes: the node's structure, the inline marker
// and the YEAST internal/diff properties (see YeastNode and YeastText in yeast-core).
const SKIPPED_PROPERTIES = new Set([
	'type',
	'children',
	'inline',
	'text',
	'__proto__',
	'hasDiff',
	'diffType',
	'diffMods',
	'diffPivots',
	'isTextModification',
	'containsDiff',
	'diffSource',
	'oldNodePath',
	'newNodePath',
]);

// Plain text of the children: text nodes concatenated, formatting dropped, nothing added between them.
function plainText(nodes: YeastChild[] | undefined): string {
	if (!Array.isArray(nodes)) return '';
	return nodes
		.map((child) => {
			if (!child) return '';
			const childNodes = (child as any).children;
			if (Array.isArray(childNodes) && childNodes.length > 0) return plainText(childNodes);
			return isYeastTextNode(child) && typeof child.text === 'string' ? child.text : '';
		})
		.join('');
}

// Same escaping as the React and markdown fallbacks, so the tag shown is well formed and identical across renderers
function attributeValue(value: any): string {
	const text = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
	return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/\r/g, '&#13;').replace(/\n/g, '&#10;');
}

// The raw tag as written in markdown: <yeastInline:Name attr="value" /> or <yeastInline:Name attr="value">text</yeastInline:Name>
export function formatInlineCustomComponentTag(node: InlineCustomComponentNode): string {
	let attributes = '';
	for (const property of Object.keys(node)) {
		if (SKIPPED_PROPERTIES.has(property)) continue;
		const value = node[property];
		if (value === undefined || value === null || typeof value === 'function') continue;
		attributes += ` ${property}="${attributeValue(value)}"`;
	}

	const tagName = `yeastInline:${node.type}`;
	if (!Array.isArray(node.children) || node.children.length === 0) return `<${tagName}${attributes} />`;
	return `<${tagName}${attributes}>${plainText(node.children)}</${tagName}>`;
}

// Fallback for an unregistered inline custom component: inline code showing the raw tag, so it stays inside its paragraph.
export default function renderInlineCustomComponent(node: InlineCustomComponentNode, renderer: HTMLRenderer): RenderedNode {
	const codeElement = renderer.document.createElement('code');
	codeElement.textContent = formatInlineCustomComponentTag(node);
	return codeElement;
}
