import { InlineCustomComponentNode, YeastChild, isYeastTextNode } from 'yeast-core';

/** Inline custom component tag prefix, as written in markdown */
export const INLINE_TAG_PREFIX = 'yeastInline';

// Structural properties and YEAST internal/diff properties (see YeastNode in yeast-core); never written as attributes
const SKIPPED_PROPERTIES = new Set<string>([
	'type',
	'children',
	'inline',
	// The parser keeps a tag with a text attribute as text, and core would treat such a node as text
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

function escapeAttributeValue(value: string): string {
	// Same encoding as the markdown renderer writes (and the parser reads), so the tag shown is the tag saved
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/\r/g, '&#13;').replace(/\n/g, '&#10;');
}

function formatAttributeValue(value: unknown): string {
	if (typeof value === 'string') return value;
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}

/** Concatenates the text of the children, depth first, with no separator */
export function getPlainText(nodes: YeastChild[] | undefined): string {
	if (!Array.isArray(nodes)) return '';
	return nodes
		.map((node) => {
			if (!node) return '';
			if (isYeastTextNode(node)) return node.text || '';
			return getPlainText((node as { children?: YeastChild[] }).children);
		})
		.join('');
}

/**
 * Builds the raw tag text for an inline custom component, e.g. `<yeastInline:Icon name="x" />`,
 * or `<yeastInline:Badge color="blue">text</yeastInline:Badge>` when the node has children.
 * Children are written as plain text. The result is text, to be escaped by React.
 */
export function formatInlineCustomComponentTag(node: InlineCustomComponentNode): string {
	const tagName = `${INLINE_TAG_PREFIX}:${node.type}`;
	const attributes = Object.keys(node)
		.filter((property) => !SKIPPED_PROPERTIES.has(property))
		.filter((property) => node[property] !== undefined && node[property] !== null && typeof node[property] !== 'function')
		.map((property) => ` ${property}="${escapeAttributeValue(formatAttributeValue(node[property]))}"`)
		.join('');

	const hasChildren = Array.isArray(node.children) && node.children.length > 0;
	if (!hasChildren) return `<${tagName}${attributes} />`;
	return `<${tagName}${attributes}>${getPlainText(node.children)}</${tagName}>`;
}
