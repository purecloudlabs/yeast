import { BlockParserPlugin, BlockParserPluginResult, ParagraphNode, YeastParser } from '../../../';

/**
 * LineParserPlugin parses out a line of content as a paragraph, inclusive of whitespace, and returns the remaining text.
 * This plugin is nonsense and is for testing purposes only.
 */
export class LineParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		const match = text.match(/^\n*(\s*.+?)\s*?(?:\n|$)+([\s\S]*)/i);
		if (!match) return;
		// console.log(match);
		return {
			remainingText: match[2],
			nodes: [
				{
					type: 'paragraph',
					children: parser.parseInline(match[1]),
				} as ParagraphNode,
			],
		};
	}
}
