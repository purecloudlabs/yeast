import { InlineTokenizerPlugin, Token, YeastParser, YeastNodeFactory } from 'yeast-core';

const TEXT_LINK_REGEX = /https:\/\/[^ )]+/gi;
export class InlineTextLinkPlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];

		//check for hyperlink in the text
		for (const match of text.matchAll(TEXT_LINK_REGEX)) {
			const node = YeastNodeFactory.CreateLinkNode();
			const linkText = { text: match[0] };

			node.children = [linkText];
			node.href = match[0];
			tokens.push({
				start: match.index,
				end: match.index + match[0].length,
				from: 'InlineLinkPlugin',
				nodes: [node],
			});
		}
		return tokens;
	}
}
