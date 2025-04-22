import { HTMLRenderer } from '../HTMLRenderer';
import { ParagraphNode, TableCellNode, YeastBlockNodeTypes, YeastChild, YeastInlineNodeTypes } from 'yeast-core';

export default function renderTableCellNode(node: TableCellNode, renderer: HTMLRenderer) {
	const isYeastNodeType = (node: YeastChild, type: YeastBlockNodeTypes | YeastInlineNodeTypes | string): boolean => {
		return node.hasOwnProperty('type') && (node as { type: string }).type.toLowerCase() === type.toLowerCase();
	};

	let children = node.children;
	// Ignore paragraph when rendering cell's children
	if (children.length === 1 && isYeastNodeType(children[0], YeastBlockNodeTypes.Paragraph)) {
		children = (children[0] as ParagraphNode).children;
	}
	return ` ${renderer.renderComponents(children).join('').replace(/\|/g, `\\|`)} |`;
}
