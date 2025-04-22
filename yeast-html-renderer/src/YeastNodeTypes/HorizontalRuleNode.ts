import { HorizontalRuleNode } from 'yeast-core';

import { HTMLRenderer } from '../HTMLRenderer';

export default function renderHorizontalRuleNode(node: HorizontalRuleNode, renderer: HTMLRenderer): HTMLElement {
	// Create element for node
	const element = renderer.document.createElement('hr');

	// Return element
	return element;
}
