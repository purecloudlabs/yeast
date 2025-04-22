import { HTMLRenderer } from '../HTMLRenderer';
import { isYeastBlockNode, ListItemNode } from 'yeast-core';

export default function renderListItemNode(node: ListItemNode, renderer: HTMLRenderer) {
	return `${renderer.renderComponents(node.children).join('')}`;
}
