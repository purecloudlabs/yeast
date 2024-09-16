import {
	InlineTokenizerPlugin,
	Token,
	YeastParser,
	YeastNodeFactory,
	YeastInlineNode,
	YeastInlineNodeTypes,
	YeastInlineChild,
} from 'yeast-core';

const ITALICS_REGEX_UNDERSCORES = /(\\?)(_)([^\s_]|\S.*?\S)(\\?)(_)/gi;
const ITALICS_REGEX_ASTERISKS = /(\\?)(\*)([^\s_]|\S.*?\S)(\\?)(\*)/gi;
const BOLD_REGEX_UNDERSCORES = /(\\?)(__)([^\s_]|\S.*?\S)(\\?)(__)/gi;
const BOLD_REGEX_ASTERISKS = /(\\?)(\*\*)([^\s_]|\S.*?\S)(\\?)(\*\*)/gi;

/**
 * InlineEmphasisPlugin tokenizes basic markdown syntax for italic text (i.e. underscore).
 */
export class InlineEmphasisPlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];

		/**
		 * match[1] -> (optional) escape slash
		 * match[2] -> opening characters
		 * match[3] -> encased text
		 * match[4] -> (optional) escape slash
		 * match[5] -> closing characters
		 */
		const parseMatch = (match: RegExpMatchArray, nodeType: YeastInlineNodeTypes) => {
			let node: YeastInlineChild;
			if (match.length == 6 && match[1] && match[4]) {
				node = YeastNodeFactory.CreateText();
				node.text = `${match[2]}${match[3]}${match[5]}`;
			} else {
				node = YeastNodeFactory.Create(nodeType) as YeastInlineNode;
				node.children = parser.parseInline(match[3]);
			}
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
