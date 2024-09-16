import { InlineTokenizerPlugin, Token, YeastParser, YeastNodeFactory, YeastInlineNode, YeastInlineNodeTypes } from 'yeast-core';

const ITALICS_REGEX_UNDERSCORES = /_([^\s_]|\S.*?\S)_/gi;
const ITALICS_REGEX_ASTERISKS = /\*([^\s_]|\S.*?\S)\*/gi;
const BOLD_REGEX_UNDERSCORES = /__([^\s_]|\S.*?\S)__/gi;
const BOLD_REGEX_ASTERISKS = /\*\*([^\s_]|\S.*?\S)\*\*/gi;

/**
 * InlineEmphasisPlugin tokenizes basic markdown syntax for italic text (i.e. underscore).
 */
export class InlineEmphasisPlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];
		const parseMatch = (match: RegExpMatchArray, nodeType: YeastInlineNodeTypes) => {
			const node = YeastNodeFactory.Create(nodeType) as YeastInlineNode;
			node.children = parser.parseInline(match[1]);
			tokens.push({
				start: match.index,
				end: match.index + match[0].length,
				from: 'InlineEmphasisPlugin',
				nodes: [node],
			});
		};

		// Parse for bold syntax -- this comes first because it's double characters
		for (const match of text.matchAll(BOLD_REGEX_UNDERSCORES)) {
			parseMatch(match, YeastInlineNodeTypes.Bold);
		}
		for (const match of text.matchAll(BOLD_REGEX_ASTERISKS)) {
			parseMatch(match, YeastInlineNodeTypes.Bold);
		}

		// Parse for italics syntax
		for (const match of text.matchAll(ITALICS_REGEX_UNDERSCORES)) {
			parseMatch(match, YeastInlineNodeTypes.Italic);
		}
		for (const match of text.matchAll(ITALICS_REGEX_ASTERISKS)) {
			parseMatch(match, YeastInlineNodeTypes.Italic);
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
