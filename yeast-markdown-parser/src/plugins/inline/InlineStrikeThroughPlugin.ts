import { InlineTokenizerPlugin, Token, YeastNodeFactory, YeastParser } from 'yeast-core';

const STRIKETHROUGH_REGEX = /~(\S.+?)~/gi;

/**
 * StrikethroughPlugin tokenizes basic markdown syntax for strikethrough text.
 */
export class InlineStrikeThroughPlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];
		for (const match of text.matchAll(STRIKETHROUGH_REGEX)) {
			const node = YeastNodeFactory.CreateStrikethroughNode();
			node.children = parser.parseInline(match[1]);
			tokens.push({
				start: match.index,
				end: match.index + match[0].length,
				from: 'InlineStrikeThroughPlugin',
				nodes: [node],
			});
		}

		return tokens;
	}
}
