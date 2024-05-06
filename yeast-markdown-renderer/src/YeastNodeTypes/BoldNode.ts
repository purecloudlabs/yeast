import { MarkdownRenderer } from '../MarkdownRenderer';
import { BoldNode } from 'yeast-core';

export default function renderBoldNode(node: BoldNode, renderer: MarkdownRenderer) {
	return `**${renderer.renderComponents(node.children).join('').trim()}**`;
}
