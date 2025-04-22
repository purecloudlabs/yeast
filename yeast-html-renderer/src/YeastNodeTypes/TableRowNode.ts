import { HTMLRenderer } from '../HTMLRenderer';
import { TableRowNode } from 'yeast-core';

export default function renderTableRowNode(node: TableRowNode, renderer: HTMLRenderer) {
	return `|${renderer.renderComponents(node.children).join('')}\n`;
}
