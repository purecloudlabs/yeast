import { InlineTokenizerPlugin, Token, YeastParser, YeastNodeFactory } from 'yeast-core';

const BOLD_REGEX = /\*\*(\S.+?)\*\*/gi;

/**
 * BoldInlinePlugin tokenizes basic markdown syntax for bold text (i.e. double asterisks).
 */
export class BoldInlinePlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];
		for (const match of text.matchAll(BOLD_REGEX)) {
			const node = YeastNodeFactory.CreateBoldNode();
			node.children = parser.parseInline(match[1]);
			tokens.push({
				start: match.index,
				end: match.index + match[0].length,
				from: 'BoldInlinePlugin',
				nodes: [node],
			});
		}

		return tokens;
	}
}
