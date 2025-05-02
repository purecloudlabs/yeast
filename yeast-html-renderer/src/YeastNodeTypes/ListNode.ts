import { ListNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderListNode(node: ListNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement(node.ordered ? 'ol' : 'ul');
	if (node.ordered && node.start) element.setAttribute('start', node.start.toString());

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
