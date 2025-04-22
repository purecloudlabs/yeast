import { ImageNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderImageNode(node: ImageNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('img');
	if (node.title) element.title = node.title;
	if (node.alt) element.alt = node.alt;
	element.src = node.src;

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
