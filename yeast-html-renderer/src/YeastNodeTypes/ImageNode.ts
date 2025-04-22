import { HTMLRenderer } from '../HTMLRenderer';
import { ImageNode } from 'yeast-core';

export default function renderImageNode(node: ImageNode, renderer: HTMLRenderer) {
	return `![${node.title || ''}](${node.src} "${node.alt || ''}")`;
}
