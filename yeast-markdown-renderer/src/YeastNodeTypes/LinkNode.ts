import { MarkdownRenderer } from '../MarkdownRenderer';
import { LinkNode } from 'yeast-core';

export default function renderLinkNode(node: LinkNode, renderer: MarkdownRenderer) {
	if (node.title) {
		return `[${renderer.renderComponents(node.children).join('')}](${node.href} "${node.title}")`;
	}
	return `[${renderer.renderComponents(node.children).join('')}](${node.href})`;
}
