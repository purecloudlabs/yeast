import { MarkdownRenderer } from '../MarkdownRenderer';
import { TableRowNode } from 'yeast-core';

export default function renderTableRowNode(node: TableRowNode, renderer: MarkdownRenderer) {
	return `|${renderer.renderComponents(node.children).join('')}\n`;
}
