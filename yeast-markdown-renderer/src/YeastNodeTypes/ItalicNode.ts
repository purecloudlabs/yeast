import { MarkdownRenderer } from '../MarkdownRenderer';
import { ItalicNode } from 'yeast-core';

export default function renderItalicNode(node: ItalicNode, renderer: MarkdownRenderer) {
	return `*${renderer.renderComponents(node.children).join('')}*`;
}
