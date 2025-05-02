import { ContentGroupNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderContentGroupNode(node: ContentGroupNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('div');

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
