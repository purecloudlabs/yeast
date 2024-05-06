import { MarkdownRenderer } from '../MarkdownRenderer';
import { BlockquoteNode } from 'yeast-core';

export default function renderBlockquoteNode(node: BlockquoteNode, renderer: MarkdownRenderer) {
	let blockQuoteItems = node.children
		.map((item) => {
			return `${renderer.renderComponents([item]).join('')}`;
		})
		.join('')
		.trim();

	let children = blockQuoteItems.split('\n');

	let blockQuoteString = '';

	for (let index = 0; index < children.length; index++) {
		if (index == children.length - 1) {
			blockQuoteString += `> ${children[index]}`;
		} else blockQuoteString += `> ${children[index]}\n`;
	}
	return `\n${blockQuoteString}\n`;
}
