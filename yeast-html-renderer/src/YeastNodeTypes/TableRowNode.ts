import { TableRowNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderTableRowNode(node: TableRowNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('tr');

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
