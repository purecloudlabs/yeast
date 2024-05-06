import { MarkdownRenderer } from '../MarkdownRenderer';
import { ContentGroupNode } from 'yeast-core';

export default function renderContentGroupNode(node: ContentGroupNode, renderer: MarkdownRenderer) {
	return `\n${renderer.renderComponents(node.children).join('').trim()}\n%%%\n`;
}
