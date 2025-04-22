import { HTMLRenderer } from '../HTMLRenderer';
import { LinkNode } from 'yeast-core';

export default function renderLinkNode(node: LinkNode, renderer: HTMLRenderer) {
	if (node.title) {
		return `[${renderer.renderComponents(node.children).join('')}](${node.href} "${node.title}")`;
	}
	return `[${renderer.renderComponents(node.children).join('')}](${node.href})`;
}
