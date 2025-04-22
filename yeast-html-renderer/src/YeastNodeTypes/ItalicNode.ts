import { ItalicNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderItalicNode(node: ItalicNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('i');

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
