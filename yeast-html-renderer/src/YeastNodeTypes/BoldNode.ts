import { BoldNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderBoldNode(node: BoldNode, renderer: HTMLRenderer): HTMLElement {
	// Create element for node
	const element = renderer.document.createElement('strong');

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
