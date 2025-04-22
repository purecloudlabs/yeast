import { CalloutNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderCalloutNode(node: CalloutNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('div');
	element.classList.add('callout');
	if (node.alertType) element.classList.add(`callout-${node.alertType}`);
	if (node.title) {
		const title = renderer.document.createElement('p');
		title.textContent = node.title;
		element.append(title);
	}

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
