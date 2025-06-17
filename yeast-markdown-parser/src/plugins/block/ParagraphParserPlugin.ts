import parseIndentation from '../../plugins/util/IndentationParser';
import {
	BlockParserPlugin,
	YeastParser,
	BlockParserPluginResult,
	YeastNodeFactory,
	PseudoParagraphNode,
	YeastBlockNodeTypes,
} from 'yeast-core';

const REMOVE_PRECEDING_NEWLINE_REGEX = /^\n*([\s\S]*)\s*/i;
const PIPE_REGEX = /\|/;

/**
 * The paragraph parser plugin functions by ingesting a block of text and generating a pseudoparagraph node for the initial line of the text.
 * Within the resulting AST document, there may be multiple pseudoparagraph nodes pertaining to a particular paragraph.
 * These nodes will be joined to form an actual paragraph node and parsed for inline content via the PostProcessorPlugin.
 * The rationale behind the paragraph parser plugin not processing the entire block of text is due to the allowance of single-line breaks between paragraph lines and between paragraphs and block content.
 * As a result, it is difficult to discern whether a line is part of a paragraph or block content.
 */
export class ParagraphParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		let isLastLine = false;
		const match = text.match(REMOVE_PRECEDING_NEWLINE_REGEX);
		if (!match) return;

		const lines = match[1].split('\n');

		const firstLine = lines.shift();
		//Check if next line is a new line.
		if (!lines[0] || lines[0].trim() === '') {
			isLastLine = true;
		}

		const nodeChild = YeastNodeFactory.CreateText();
		nodeChild.text = parseIndentation(firstLine).content;

		// pipe chars need escaping
		if(PIPE_REGEX.test(nodeChild.text)){
			PIPE_REGEX.lastIndex = 0;
			nodeChild.text.replace(PIPE_REGEX, '\|');
		}

		return {
			remainingText: lines.join('\n'),
			nodes: [
				{
					type: YeastBlockNodeTypes.PseudoParagraph,
					isLastLine: isLastLine,
					children: [nodeChild],
					indentation: parseIndentation(firstLine).indentation,
				} as PseudoParagraphNode,
			],
		};
	}
}
