import { InlineTokenizerPlugin, YeastParser, Token, YeastNodeFactory, BlockParserPlugin, BlockParserPluginResult } from 'yeast-core';

const IMAGE_REGEX = /^\s*(.*)!\[([^\[\]]*)\]\((.+?)(?:\s["'](.*?)["'])?\)(.*)(?:\n|$)([\s\S]*)/i;

export class ImageParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		/**
		 * Look for image matches in the first line of text. This process will also handle images found inline, and will
		 * parse the text before and after the image as separate block elements.
		 * [1] before text (not part of image)
		 * [2] title text
		 * [3] image src path
		 * [4] alt text
		 * [5] after text (not part of image)
		 * [6] remaining text (not on same line)
		 */
		const match = text.match(IMAGE_REGEX);
		if (!match || !match[3]) return;

		// Create this image node
		const imageNode = YeastNodeFactory.CreateImageNode();
		imageNode.title = match[2];
		imageNode.src = match[3];
		imageNode.alt = match[4];

		// Parse inline text encountered before and after the image
		const beforeNodes = parser.parseBlock(match[1]);
		const afterNodes = parser.parseBlock(match[5]);

		return {
			remainingText: match[6],
			nodes: [...beforeNodes, imageNode, ...afterNodes],
		};
	}
}
