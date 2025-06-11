import { InlineTokenizerPlugin, Token, YeastNodeFactory, YeastParser } from 'yeast-core';

const STRIKETHROUGH_REGEX = /~(\S.+?)~/gi;

/**
 * StrikethroughPlugin tokenizes basic markdown syntax for strikethrough text.
 */
export class InlineStrikeThroughPlugin implements InlineTokenizerPlugin {
    tokenize(text: string, parser: YeastParser): void | Token[] {
        const tokens: Token[] = [];
		var node, startPos;
        for (const match of text.matchAll(STRIKETHROUGH_REGEX)) {
            if(text.charAt(match.index - 1) === '\\' && text.charAt(match.index + match[0].length - 2) === '\\'){
                node = YeastNodeFactory.CreateText();
				node.text = text.substring(match.index, match.index + match[0].length - 2);
				node.text += '~'
				startPos = match.index - 1
            }else{
                node = YeastNodeFactory.CreateStrikethroughNode();
                node.children = parser.parseInline(match[1]);
				startPos = match.index
            }
			tokens.push({
				start: startPos,
				end: match.index + match[0].length,
				from: 'InlineStrikeThroughPlugin',
				nodes: [node],
            });
            
        }
        return tokens;
    }
}