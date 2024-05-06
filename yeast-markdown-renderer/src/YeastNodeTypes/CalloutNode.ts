import { MarkdownRenderer } from '../MarkdownRenderer';
import { CalloutNode } from 'yeast-core';

export default function renderCalloutNode(node: CalloutNode, renderer: MarkdownRenderer) {
	const jsonOption = { alert: node.alertType, title: node.title, collapsible: node.collapsible, autoCollapse: node.autoCollapse };
	const hasOptions = Object.keys(node).some(
		(key) => node[key] !== undefined && key !== 'alertType' && key !== 'type' && key !== 'children' && key !== 'indentation'
	);

	const children = renderer.renderComponents(node.children).join('').trim().split('\n');
	let finalVal = '';
	const indentation = '\t';
	children.forEach((child, index) => {
		if (index !== children.length - 1) finalVal += `${indentation.repeat(node.indentation)}${child}\n`;
		else if (index === children.length - 1 && child.length !== 0) finalVal += `${indentation.repeat(node.indentation)}${child}`;
	});
	if (!hasOptions)
		return `\n${indentation.repeat(node.indentation)}:::${node.alertType}\n${finalVal}\n${indentation.repeat(node.indentation)}:::\n`;
	return `\n${indentation.repeat(node.indentation)}:::${JSON.stringify(jsonOption)}\n${finalVal}\n${indentation.repeat(
		node.indentation
	)}:::\n`;
}
