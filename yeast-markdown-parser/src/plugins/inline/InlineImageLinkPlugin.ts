import { InlineTokenizerPlugin, YeastParser, Token, YeastNodeFactory } from 'yeast-core';

const IMAGE_LINK_REGEX = /\[[\t ]*!\[([^\[\]]*)\]\((.+?)(?:\s["'](.*?)["'])?\)\]\((.+?)(?:\s["'](.*?)["'])?\)/gi;

export class InlineImageLinkPlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];
		/**
		 * Look for images wrapped in a link
		 * [1] image title text
		 * [2] image src path
		 * [3] image alt text
		 * [4] link href
		 * [5] link title text
		 */
		for (const match of text.matchAll(IMAGE_LINK_REGEX)) {
			// Create this image node
			const imageNode = YeastNodeFactory.CreateImageNode();
			imageNode.title = match[1];
			imageNode.src = match[2];
			imageNode.alt = match[3];

			// Create link node
			const linkNode = YeastNodeFactory.CreateLinkNode();
			linkNode.href = match[4];
			linkNode.title = match[5];
			linkNode.children = [imageNode];

			tokens.push({
				start: match.index,
				end: match.index + match[0].length,
				from: 'InlineImageLinkParserPlugin',
				nodes: [linkNode],
			});
		}
		return tokens;
	}
}
