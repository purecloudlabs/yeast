import { MarkdownRenderer } from '../MarkdownRenderer';
import { ParagraphNode } from 'yeast-core';

export default function renderParagraphNode(node: ParagraphNode, renderer: MarkdownRenderer) {
	const children = renderer.renderComponents(node.children).join('').split('\n');
	let finalString = '';
	const indentation = '\t';
	children.forEach((child, index) => {
		if(node.containsTextModification === true) {
			finalString += `${indentation.repeat(node.indentation)}\\~${child}\\~`;
		}else if (index !== children.length - 1) finalString += `${indentation.repeat(node.indentation)}${child}\n`;
		else if (index === children.length - 1 && child.length !== 0) finalString += `${indentation.repeat(node.indentation)}${child}`;
	});
	console.log(finalString)
	return `\n${finalString}\n`;
}
