import { TableCellNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderTableCellNode(node: TableCellNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('td');
	if (node.align) element.style.textAlign = node.align;

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
