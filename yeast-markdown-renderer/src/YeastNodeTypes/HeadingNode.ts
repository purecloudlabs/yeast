import { MarkdownRenderer } from '../MarkdownRenderer';
import { HeadingNode } from 'yeast-core';

export default function renderHeadingNode(node: HeadingNode, renderer: MarkdownRenderer) {
	const content = renderer.renderComponents(node.children).join('').replace(/#/g, `\\#`);
	switch (node.level) {
		case 1: {
			return `\n# ${content} \n`;
		}
		case 2: {
			return `\n## ${content} \n`;
		}
		case 3: {
			return `\n### ${content} \n`;
		}
		case 4: {
			return `\n#### ${content} \n`;
		}
		case 5: {
			return `\n##### ${content} \n`;
		}
		case 6: {
			return `\n###### ${content} \n`;
		}
		case 7: {
			return `\n####### ${content} \n`;
		}
	}
}
