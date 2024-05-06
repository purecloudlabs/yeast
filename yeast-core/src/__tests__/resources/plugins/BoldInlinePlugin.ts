import { BoldNode, InlineTokenizerPlugin, Token, YeastInlineNodeTypes, YeastParser } from '../../../';

const BOLD_REGEX = /\*\*(.+?)\*\*/gi;

/**
 * BoldInlinePlugin naievely tokenizes basic markdown syntax for bold text (i.e. double asterisks).
 * This plugin is for testing purposes only.
 */
export class BoldInlinePlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		// console.log('BOLD', text);
		const tokens: Token[] = [];
		for (const match of text.matchAll(BOLD_REGEX)) {
			// console.log('MATCH', match);
			tokens.push({
				start: match.index,
				end: match.index + match[0].length,
				from: 'BoldInlinePlugin',
				nodes: [
					{
						type: YeastInlineNodeTypes.Bold,
						children: parser.parseInline(match[1]),
					} as BoldNode,
				],
			});
		}

		return tokens;
	}
}
