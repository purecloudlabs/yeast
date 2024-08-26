import { InlineTokenizerPlugin, Token, YeastParser, YeastNodeFactory } from 'yeast-core';

const IMAGE_REGEX = /!\[([^\[\]]*)\]\((.+?)(?:\s["'](.*?)["'])?\)/gi;

export class InlineImagePlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];
		for (const match of text.matchAll(IMAGE_REGEX)) {
			/**
			 * Look for images
			 * [1] image title text
			 * [2] image src path
			 * [3] image alt text
			 */
			const node = YeastNodeFactory.CreateImageNode();
			node.title = match[1];
			node.src = match[2];
			node.alt = match[3];

			tokens.push({
				start: match.index,
				end: match.index + match[0].length,
				from: 'InlineImagePlugin',
				nodes: [node],
			});
		}
		return tokens;
	}
}
