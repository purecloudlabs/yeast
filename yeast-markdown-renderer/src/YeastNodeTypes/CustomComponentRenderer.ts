import { YeastChild, isYeastNode, isYeastTextNode, YeastNode, isInlineCustomComponentNode, InlineCustomComponentNode } from 'yeast-core';
import { fragment } from 'xmlbuilder2';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import type { MarkdownRenderer } from '../MarkdownRenderer';

/**
 * Properties never written as attributes of an inline custom component: the node structure, the inline marker
 * and YEAST's diff bookkeeping (see YeastNode in yeast-core).
 */
const INLINE_SKIPPED_PROPERTIES = new Set([
	'type',
	'children',
	'inline',
	// `text` would make yeast-core treat the node as text, and the parser keeps a tag with a text attribute as text
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

// The grammar the parser accepts (yeast-markdown-parser, InlineCustomComponentPlugin)
const VALID_TAG_NAME = /^[A-Za-z][\w-]*$/;
const VALID_ATTRIBUTE_NAME = /^[A-Za-z_][\w-]*$/;
const RESERVED_ATTRIBUTE_NAMES = new Set(['type', 'inline', 'children', 'text', '__proto__']);

/** True when the tag could be parsed back: the type and every written attribute name follow the parser's grammar */
const canWriteAsInlineTag = (node: InlineCustomComponentNode): boolean => {
	if (!VALID_TAG_NAME.test(node.type)) return false;
	return Object.keys(node).every(
		(property) =>
			INLINE_SKIPPED_PROPERTIES.has(property) ||
			node[property] === undefined ||
			node[property] === null ||
			typeof node[property] === 'function' ||
			(VALID_ATTRIBUTE_NAME.test(property) && !RESERVED_ATTRIBUTE_NAMES.has(property))
	);
};

const escapeAttributeValue = (value: string): string =>
	value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/\r/g, '&#13;').replace(/\n/g, '&#10;');

const stringifyAttributeValue = (value: unknown): string => (typeof value === 'object' ? JSON.stringify(value) : String(value));

/**
 * Writes an inline custom component in place, on one line: `<yeastInline:Name attr="value" />`, or the open tag,
 * the rendered inline children and the close tag when it has children.
 */
function renderInlineCustomComponent(node: InlineCustomComponentNode, renderer: MarkdownRenderer): string {
	let attributes = '';
	for (const property of Object.keys(node)) {
		const value = node[property];
		if (INLINE_SKIPPED_PROPERTIES.has(property) || value === undefined || value === null || typeof value === 'function') continue;
		attributes += ` ${property}="${escapeAttributeValue(stringifyAttributeValue(value))}"`;
	}

	const tagName = `yeastInline:${node.type}`;
	if (!node.children || node.children.length === 0) return `<${tagName}${attributes} />`;

	const children = renderer.renderComponents(node.children).join('');
	return `<${tagName}${attributes}>${children}</${tagName}>`;
}

export default function renderCustomComponent(node: YeastChild, renderer?: MarkdownRenderer): string {
	if (!isYeastNode(node) && !isYeastTextNode(node)) return;
	// Inline nodes need the renderer for their children; without one they keep the block (XML) output below.
	if (renderer && isInlineCustomComponentNode(node) && canWriteAsInlineTag(node)) return renderInlineCustomComponent(node, renderer);
	const root = fragment();

	const buildTree = (node: YeastChild, parent: XMLBuilder) => {
		if (!node) return;
		if (isYeastTextNode(node)) {
			parent.txt(node.text).up();
			return;
		}

		const typedNode = node as YeastNode;

		let elemProps = {};
		for (const property in typedNode) {
			if (property !== 'type' && property !== 'children' && property !== 'text') {
				elemProps[property] = typedNode[property];
			}
		}
		let elem = elemProps ? parent.ele(`yeast:${typedNode.type}`, elemProps) : parent.ele(`yeast:${typedNode.type}`);

		if (typedNode.children) {
			for (const child of typedNode.children) {
				buildTree(child as YeastNode, elem);
			}
		}
	};

	buildTree(node, root);
	return `\n${root.end({ prettyPrint: true })}\n`;
}
