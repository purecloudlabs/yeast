import { MarkdownRenderer } from '../MarkdownRenderer';
import { StrikethroughNode } from 'yeast-core';
import escapeOutsideInlineTags from './escapeOutsideInlineTags';

export default function renderStrikethroughode(node: StrikethroughNode, renderer: MarkdownRenderer) {
	return `~~${escapeOutsideInlineTags(renderer.renderComponents(node.children).join(''), (text) => text.replace(/~/g, `\\~`))}~~`;
}
