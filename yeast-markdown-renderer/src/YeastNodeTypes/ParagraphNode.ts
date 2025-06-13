import { MarkdownRenderer } from '../MarkdownRenderer';
import { ParagraphNode } from 'yeast-core';

export default function renderParagraphNode(node: ParagraphNode, renderer: MarkdownRenderer) {
	const children = renderer.renderComponents(node.children).join('').split('\n');
	let finalString = '';
	const indentation = '\t';
	children.forEach((child, index) => {
		const escapedChild = child.replace(/(?<![\\])~/g, '\\~');
		
		if (index !== children.length - 1) finalString += `${indentation.repeat(node.indentation)}${escapedChild}\n`;
		else if (index === children.length - 1 && escapedChild.length !== 0) finalString += `${indentation.repeat(node.indentation)}${escapedChild}`;
	});
	return `\n${finalString}\n`;
}
