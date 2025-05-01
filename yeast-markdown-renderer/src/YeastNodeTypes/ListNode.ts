import { MarkdownRenderer } from '../MarkdownRenderer';
import { ListNode } from 'yeast-core';

export default function renderListNode(node: ListNode, renderer: MarkdownRenderer) {
	let indentation = '\t';
	let level = node.level !== undefined ? node.level : 0;
	if (node.ordered) {
		let orderedItems = node.children.map((item, index) => {
			if (item.type === 'list') return renderer.renderComponents([item]);
			return `${indentation.repeat(level)}${node.start !== undefined ? node.start + index : index}. ${renderer
				.renderComponents([item])
				.join('')}\n`;
		});
		if (level > 0) return orderedItems.join('');
		return `\n${orderedItems.join('')}`;
	}
	let items = node.children.map((item) => {
		if (item.type === 'list') return renderer.renderComponents([item]);
		return `${indentation.repeat(level)}- ${renderer.renderComponents([item]).join()}\n`;
	});
	if (level > 0) return items.join('');
	return `\n${items.join('')}`;
}
