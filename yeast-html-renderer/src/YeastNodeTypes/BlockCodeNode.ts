import { BlockCodeNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderBlockCodeNode(node: BlockCodeNode, renderer: HTMLRenderer) {
	// Create element for node
	const element = renderer.document.createElement('div');
	if (node.title) {
		const title = renderer.document.createElement('p');
		title.textContent = node.title;
		element.append(title);
	}
	const codeElement = renderer.document.createElement('code');
	const preElement = renderer.document.createElement('pre');
	preElement.appendChild(codeElement);
	element.appendChild(preElement);
	if (node.language) {
		codeElement.classList.add(`language-${node.language}`);
	}

	// Render children
	codeElement.append(node.value);

	// Return element
	return element;
}
