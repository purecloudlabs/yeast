import { ContentGroupItemNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderContentGroupItemNode(node: ContentGroupItemNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('div');
	if (node.title) {
		const title = renderer.document.createElement('p');
		title.textContent = node.title;
		element.append(title);
	}
	if (node.groupType) {
		element.classList.add(`content-group-${node.groupType}`);
	}

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
