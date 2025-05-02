import { ListItemNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderListItemNode(node: ListItemNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('li');

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
