import { BlockParserPlugin, YeastParser, BlockParserPluginResult, YeastNodeFactory } from 'yeast-core';

const BLOCKQUOTE_REGEX = /^\s*>[ \t]*(.+)*/i;

export class BlockquoteParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		const match = text.match(BLOCKQUOTE_REGEX);

		if (!match) return;

		let blockContent = '';

		const lines = text.trimStart().split('\n');
		let l = 0; //Line number
		while (lines[l] && lines[l].startsWith('>')) {
			const lineContent = lines[l].match(BLOCKQUOTE_REGEX)[1];
			//Standalone '>' should be parsed as a new line
			if (!lineContent || lineContent.trim() === '') {
				//Double new lines because the paragraph parser concatenate lines that are separated by `\n`
				blockContent += '\n\n';
			} else {
				blockContent += lineContent + ' ';
			}
			l++;
		}

		const node = YeastNodeFactory.CreateBlockquoteNode();
		node.children = parser.parseBlock(blockContent.trimEnd());

		return {
			remainingText: lines.slice(l).join('\n'),
			nodes: [node],
		};
	}
}
