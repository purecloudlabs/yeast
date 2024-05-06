import { BlockParserPlugin, YeastParser, BlockParserPluginResult, YeastNodeFactory } from 'yeast-core';

const HEADING_REGEX = /^\s*?(#{1,7})[^\S\r\n]*(.+?)[^\S\r\n]*#*[^\S\r\n]*(?:\n|$)([\s\S]*)$/i;

/**
 * HeadingParserPlugin consumes a block of text and parses it for inline content.
 */
export class HeadingParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		// 0: source
		// 1: heading markers
		// 2: heading text
		// 3: the rest of the text
		const match = text.match(HEADING_REGEX);
		if (!match) return;

		const node = YeastNodeFactory.CreateHeadingNode();
		// Count the number of octothorpes
		node.level = match[1].length;
		// Transform heading text to lowercase alphanumeric with slugs replacing other chars
		node.id = match[2].replace(/[^a-z0-9]/gi, '-').toLowerCase();
		// Parse remaining text for inline content
		node.children = parser.parseInline(match[2]);

		return {
			remainingText: match[3],
			nodes: [node],
		};
	}
}
