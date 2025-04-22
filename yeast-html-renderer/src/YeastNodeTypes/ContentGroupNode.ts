import { HTMLRenderer } from '../HTMLRenderer';
import { ContentGroupNode } from 'yeast-core';

export default function renderContentGroupNode(node: ContentGroupNode, renderer: HTMLRenderer) {
	return `\n${renderer.renderComponents(node.children).join('').trim()}\n%%%\n`;
}
