import { MarkdownRenderer } from '../MarkdownRenderer';
import { ImageNode } from 'yeast-core';

export default function renderImageNode(node: ImageNode, renderer: MarkdownRenderer) {
	return `![${node.title || ''}](${node.src} "${node.alt || ''}")`;
}
