import { ContentGroupItemNode, ContentGroupType } from 'yeast-core';
import { HTMLRenderer } from '../HTMLRenderer';

export default function renderContentGroupItemNode(node: ContentGroupItemNode, renderer: HTMLRenderer) {
	const jsonOptions = { title: node.title, type: node.groupType };
	if (node.groupType && node.groupType === ContentGroupType.tabbedContent)
		return `%%% ${node.title}\n${renderer.renderComponents(node.children).join('')}\n`;
	return `%%% ${JSON.stringify(jsonOptions)}\n${renderer.renderComponents(node.children).join('')}\n`;
}
