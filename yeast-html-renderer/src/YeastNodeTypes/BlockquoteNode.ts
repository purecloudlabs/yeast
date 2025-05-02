import { BlockquoteNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderBlockquoteNode(node: BlockquoteNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('blockquote');

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
