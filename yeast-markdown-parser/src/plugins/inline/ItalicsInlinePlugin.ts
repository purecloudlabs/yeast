import { InlineTokenizerPlugin, Token, YeastParser, YeastNodeFactory } from 'yeast-core';

const ITALICS_REGEX = /_(\S.+?)_/gi;

/**
 * ItalicsInlinePlugin tokenizes basic markdown syntax for italic text (i.e. underscore).
 */
export class ItalicsInlinePlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];
		//Parse for underscore syntax
		for (const match of text.matchAll(ITALICS_REGEX)) {
			const node = YeastNodeFactory.CreateItalicNode();
			node.children = parser.parseInline(match[1]);
			tokens.push({
				start: match.index,
				end: match.index + match[0].length,
				from: 'ItalicsInlinePlugin',
				nodes: [node],
			});
		}

		//Parse for asterisk syntax
		const textArr = text.split('');
		let index = 0;
		while (index < textArr.length) {
			if (textArr[index] === '*' && textArr[index + 1] !== '*' && textArr[index + 1] !== ' ') {
				if (index >= 0 && textArr[index - 1] !== '*') {
					let italizedText = '';
					let startIndex = index;
					let isInvalidSyntax = false;
					do {
						if (textArr[index + 1]) {
							italizedText += textArr[++index];
						} else {
							//There was probably no closing tag
							isInvalidSyntax = true;
							break;
						}
					} while (textArr[index + 1] !== '*' && index < textArr.length);
					if (isInvalidSyntax) {
						index++;
						continue;
					}
					const node = YeastNodeFactory.CreateItalicNode();
					node.children = parser.parseInline(italizedText);
					tokens.push({
						start: startIndex,
						end: startIndex + italizedText.length + 2,
						from: 'ItalicsInlinePlugin',
						nodes: [node],
					});
					index++;
				}
			}
			index++;
		}
		return tokens;
	}
}
