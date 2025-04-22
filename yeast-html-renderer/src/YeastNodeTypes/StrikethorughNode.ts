import { HTMLRenderer } from '../HTMLRenderer';
import { StrikethroughNode } from 'yeast-core';

export default function renderStrikethroughode(node: StrikethroughNode, renderer: HTMLRenderer) {
	return `~~${renderer.renderComponents(node.children).join('').replace(/~/g, `\\~`)}~~`;
}
