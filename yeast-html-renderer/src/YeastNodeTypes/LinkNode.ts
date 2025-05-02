import { LinkNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderLinkNode(node: LinkNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('a');
	element.href = node.href;
	if (node.title) element.title = node.title;
	if (node.forceNewTab) element.target = '_blank';

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
