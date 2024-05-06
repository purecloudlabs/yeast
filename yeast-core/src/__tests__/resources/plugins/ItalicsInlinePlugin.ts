import { InlineTokenizerPlugin, ItalicNode, Token, YeastInlineNodeTypes, YeastParser } from '../../../';

const BOLD_REGEX = /_(.+?)_/gi;

/**
 * ItalicsInlinePlugin naievely tokenizes basic markdown syntax for italic text (i.e. underscore).
 * This plugin is for testing purposes only.
 */
export class ItalicsInlinePlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		// console.log('ITALICS', text);
		const tokens: Token[] = [];
		for (const match of text.matchAll(BOLD_REGEX)) {
			// console.log('MATCH', match);
			tokens.push({
				start: match.index,
				end: match.index + match[0].length,
				from: 'ItalicsInlinePlugin',
				nodes: [
					{
						type: YeastInlineNodeTypes.Italic,
						children: parser.parseInline(match[1]),
					} as ItalicNode,
				],
			});
		}

		return tokens;
	}
}
