import { MarkdownRenderer } from '../MarkdownRenderer';
import { isYeastBlockNode, ListItemNode } from 'yeast-core';

export default function renderListItemNode(node: ListItemNode, renderer: MarkdownRenderer) {
	return `${renderer.renderComponents(node.children).join('')}`;
}
