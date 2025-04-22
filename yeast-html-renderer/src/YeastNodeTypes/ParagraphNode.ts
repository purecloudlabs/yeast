import { ParagraphNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderParagraphNode(node: ParagraphNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('p');

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
