import { InlineTokenizerPlugin, Token, YeastParser, YeastNodeFactory } from 'yeast-core';

const TEXT_LINK_REGEX = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

export class InlineTextLinkPlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];

		//check for hyperlink in the text
		for (const match of text.matchAll(TEXT_LINK_REGEX)) {
			let linkText = match[0];
			let offset = 0;

			// Strip off trailing punctuation characters; they're probably not supposed to be part of the link
			let lastChar = linkText.substring(linkText.length - 1);
			while (['.', ',', '!', '?', ';'].includes(lastChar)) {
				linkText = linkText.substring(0, linkText.length - 1);
				lastChar = linkText.substring(linkText.length - 1);
				offset++;
			}

			// Create link node
			const node = YeastNodeFactory.CreateLinkNode();
			node.children = [{ text: linkText }];
			node.href = linkText;
			tokens.push({
				start: match.index,
				end: match.index + match[0].length - offset,
				from: 'InlineLinkPlugin',
				nodes: [node],
			});
		}
		return tokens;
	}
}
