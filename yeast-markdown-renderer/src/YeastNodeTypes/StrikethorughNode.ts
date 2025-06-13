import { MarkdownRenderer } from '../MarkdownRenderer';
import { StrikethroughNode } from 'yeast-core';

export default function renderStrikethroughode(node: StrikethroughNode, renderer: MarkdownRenderer) {
	console.log(node.children)
	return `~~${renderer.renderComponents(node.children).join('').replace(/~/g, `\\~`)}~~`;
}
