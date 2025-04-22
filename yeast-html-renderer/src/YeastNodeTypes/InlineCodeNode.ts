import { InlineCodeNode, scrapeText } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderInlineCodeNode(node: InlineCodeNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('code');

	// Get text
	element.append(scrapeText(node));

	// Return element
	return element;
}
