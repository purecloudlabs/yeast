import { HTMLRenderer } from '../HTMLRenderer';
import { InlineCodeNode } from 'yeast-core';

export default function renderInlineCodeNode(node: InlineCodeNode, renderer: HTMLRenderer) {
	const scrapeText = (node: any): string => {
		let s = '';
		if (Array.isArray(node.children)) s += node.children.map(scrapeText).join();
		if (node.text) s += node.text;
		return s;
	};

	// Default to a single backtick as the marker
	let marker = '`';

	// If there are any backticks in the text, use double backticks to escape it
	if (scrapeText(node).includes('`')) marker = '``';

	// Render element
	return `${marker}${renderer.renderComponents(node.children).join('')}${marker}`;
}
