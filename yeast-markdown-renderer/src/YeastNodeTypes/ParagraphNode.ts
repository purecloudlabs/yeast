import { MarkdownRenderer } from '../MarkdownRenderer';
import { ParagraphNode } from 'yeast-core';

const TILDE_REGEX = /\~(\S.+?)\~/gi;

export default function renderParagraphNode(node: ParagraphNode, renderer: MarkdownRenderer) {
	const children = renderer.renderComponents(node.children).join('').split('\n');
	let finalString = '';
	const indentation = '\t';
	children.forEach((child, index) => {
		child = child.replace(TILDE_REGEX, (_, p1) => `\\~${p1}\\~`);
		if (index !== children.length - 1) finalString += `${indentation.repeat(node.indentation)}${child}\n`;
		else if (index === children.length - 1 && child.length !== 0) finalString += `${indentation.repeat(node.indentation)}${child}`;
	});
	return `\n${finalString}\n`;
}
