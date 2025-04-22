import { HTMLRenderer } from '../HTMLRenderer';
import { ItalicNode } from 'yeast-core';

export default function renderItalicNode(node: ItalicNode, renderer: HTMLRenderer) {
	return `*${renderer.renderComponents(node.children).join('')}*`;
}
