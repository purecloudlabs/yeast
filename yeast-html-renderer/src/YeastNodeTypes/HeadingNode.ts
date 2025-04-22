import { HeadingNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderHeadingNode(node: HeadingNode, renderer: HTMLRenderer) {
	// Create element for node
	let level = node.level;
	if (!level || isNaN(level)) {
		level = 1;
	} else {
		if (level < 1) level = 1;
		if (level > 7) level = 7;
	}
	const element = renderer.document.createElement(level === 7 ? 'span' : `h${level}`);
	if (level === 7) element.className = 'h7';

	// Render children
	element.append(...renderer.renderComponents(node.children));

	// Return element
	return element;
}
