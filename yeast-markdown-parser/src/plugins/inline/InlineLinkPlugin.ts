import { InlineTokenizerPlugin, Token, YeastParser, YeastNodeFactory } from 'yeast-core';

const LINK_REGEX = /\[([^\[\]]*)\]\((.+?)(?:\s["'](.*?)["'])?\)/gi;

export class InlineLinkPlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];
		for (const match of text.matchAll(LINK_REGEX)) {
			//Don't process if it's an image
			if (text.charAt(match.index - 1) === '!') {
				continue;
			}
			const node = YeastNodeFactory.CreateLinkNode();
			//if alt text is empty use target as alt text
			if (match[1].length > 0) {
				node.children = parser.parseInline(match[1]);
			} else {
				node.children = [{ text: match[2] }];
			}

			node.href = match[2];
			node.title = match[3] || 'Link';
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
