import {
	InlineTokenizerPlugin,
	Token,
	YeastParser,
	YeastNodeFactory,
	YeastInlineNode,
	YeastInlineNodeTypes,
	YeastInlineChild,
} from 'yeast-core';

/**
 * These expressions look for text between the various emphasis marker types with the following caveats:
 * - the beginning of the match is the beginning of the string or not an escape slash
 * - the next character is the opening marker
 * - the first character after the opening marker is not whitespace
 * - the last character before the closing marker is not whitespace
 */
const ITALICS_REGEX_UNDERSCORES = /(?:^|([^\\]))_(?:(\\_|[^\\\s][^_\s]?)_|((?:\\_|\S)(?:\\_|[^_])*?[^\s\\])_)/gi;
const ITALICS_REGEX_ASTERISKS = /(?:^|([^\\]))\*(?:(\\\*|[^\\\s][^\*\s]?)\*|((?:\\\*|\S)(?:\\\*|[^\*])*?[^\s\\])\*)/gi;
const BOLD_REGEX_UNDERSCORES = /(?:^|([^\\]))__(?:(\\_|[^\\\s][^_\s]?)__|((?:\\_|\S)(?:\\_|[^_])*?[^\s\\])__)/gi;
const BOLD_REGEX_ASTERISKS = /(?:^|([^\\]))\*\*(?:(\\\*|[^\\\s][^\*\s]?)\*\*|((?:\\\*|\S)(?:\\\*|[^\*])*?[^\s\\])\*\*)/gi;

/**
 * InlineEmphasisPlugin tokenizes basic markdown syntax for italic text (i.e. underscore).
 */
export class InlineEmphasisPlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];

		/**
		 * match[1] -> preceding character
		 * match[2] -> encased text (1 char)
		 * match[3] -> encased text (2+ chars)
		 */
		const parseMatch = (match: RegExpMatchArray, nodeType: YeastInlineNodeTypes) => {
			if (match.length < 4 || (!match[2] && !match[3])) return;
			const startOffset = (match[1] || '').length;
			let node = YeastNodeFactory.Create(nodeType) as YeastInlineNode;
			node.children = parser.parseInline(match[2] || match[3]);
			tokens.push({
				start: match.index + startOffset,
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

		return tokens;
	}
}
