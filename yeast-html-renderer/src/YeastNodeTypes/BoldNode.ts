import { HTMLRenderer } from '../HTMLRenderer';
import { BoldNode } from 'yeast-core';

export default function renderBoldNode(node: BoldNode, renderer: HTMLRenderer) {
	return `**${renderer.renderComponents(node.children).join('').trim()}**`;
}
