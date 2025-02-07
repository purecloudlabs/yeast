import { MarkdownRenderer } from '../MarkdownRenderer';
import { BlockCodeNode } from 'yeast-core';

// Matches case when codeblock content is a literal codeblock example
const LITERAL_BACKTICK_REGEX = /((?:^|\n+)(?:\t+|\s+)*)(`{3})/ig;
const LITERAL_TILDE_REGEX = /((?:^|\n+)(?:\t+|\s+)*)(~{3})/ig;

export default function renderBlockCodeNode(node: BlockCodeNode, renderer: MarkdownRenderer) {
	const jsonOptions = {
		title: node.title,
		language: node.language,
		autocollapse: node.autoCollapse,
		noCollapse: node.noCollapse,
		tabsToSpaces: node.tabsToSpaces,
		showLineNumbers: node.showLineNumbers,
	};
	const backtickEscapedVal = node.value.replace(LITERAL_BACKTICK_REGEX, '$1\\$2');
	const tildeEscapedVal = backtickEscapedVal.replace(LITERAL_TILDE_REGEX, '$1\\$2');
	const children = tildeEscapedVal.split('\n');
	let finalVal = '';
	const indentation = '\t';
	children.forEach((child, index) => {
		if (index !== children.length - 1) finalVal += `${indentation.repeat(node.indentation)}${child}\n`;
		else if (index === children.length - 1 && child.length !== 0) finalVal += `${indentation.repeat(node.indentation)}${child}`;
	});

	const hasOptions = Object.keys(node).some(
		(key) => node[key] !== undefined && key !== 'language' && key !== 'type' && key !== 'value' && key !== 'indentation'
	);
	if (!hasOptions)
		return `\n${indentation.repeat(node.indentation)}\`\`\`${node.language}\n${finalVal}\n${indentation.repeat(node.indentation)}\`\`\`\n`;
	return `\n${indentation.repeat(node.indentation)}\`\`\`${JSON.stringify(jsonOptions)}\n${tildeEscapedVal}\n${indentation.repeat(
		node.indentation
	)}\`\`\`\n`;
}
