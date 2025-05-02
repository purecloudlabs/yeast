import { StrikethroughNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderStrikethroughode(node: StrikethroughNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('s');

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
