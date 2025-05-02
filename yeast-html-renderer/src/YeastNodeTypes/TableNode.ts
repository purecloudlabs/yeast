import { TableNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderTableNode(node: TableNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('table');

	// Render header
	let headerOffset = 0;
	if (node.children.length > 1 && node.children[0].header) {
		headerOffset = 1;
		const header = renderer.document.createElement('thead');
		header.append(...renderer.renderComponents([node.children[0]]));
		element.append(header);
	}

	// Render body
	const body = renderer.document.createElement('tbody');
	element.append(body);
	body.append(...renderer.renderComponents(node.children.slice(headerOffset)));

	// Return element
	return element;
}
