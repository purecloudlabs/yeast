import parseIndentation from '../../plugins/util/IndentationParser';
import { BlockParserPlugin, YeastParser, BlockParserPluginResult, YeastNodeFactory } from 'yeast-core';

interface BlockCodeAttributes {
	title?: string;
	maxHeight?: string;
	autoCollapse?: boolean;
	language?: string;
	showLineNumbers?: boolean;
	noCollapse?: boolean;
	indentatation?: number;
	tabsToSpaces?: number;
}

const BACKTICK_BLOCKCODE_REGEX = /^(?:\s*\n)*([ \t]*)`{3,}(.*)\n([\s\S]+?)\n\s*`{3,}.*(?:\n|$)\n?([\s\S]*)/i;
const LITERAL_BACKTICK_BLOCKCODE_REGEX = /^(?:\s*\n)*([ \t]*)`{4,}(.*)\n([\s\S]+?)\n\s*`{4,}.*(?:\n|$)\n?([\s\S]*)/i;
const TILDE_BLOCKCODE_REGEX = /^(?:\s*\n)*([ \t]*)~{3,}(.*)\n([\s\S]+?)\n\s*~{3,}.*(?:\n|$)\n?([\s\S]*)/i;
const LITERAL_TILDE_BLOCKCODE_REGEX = /^(?:\s*\n)*([ \t]*)~{4,}(.*)\n([\s\S]+?)\n\s*~{4,}.*(?:\n|$)\n?([\s\S]*)/i;
const INLINE_LANGUAGE_MATCH_REGEX = /^#!(.*)\s*/i;

export class CodeParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		console.log('TEXT', text)
		let match = text.match(LITERAL_BACKTICK_BLOCKCODE_REGEX);
		if (!match) match = text.match(LITERAL_TILDE_BLOCKCODE_REGEX);
		if (!match) match = text.match(BACKTICK_BLOCKCODE_REGEX);
		if (!match) match = text.match(TILDE_BLOCKCODE_REGEX);

		if (!match) return;

		// Determine indentation
		const fenceIndentation = parseIndentation(match[1]).indentation;

		let attrs: BlockCodeAttributes = {};
		try {
			attrs = JSON.parse(match[2]);
		} catch (err) {
			attrs.language = match[2] || '';
		}

		let indentation = 0;
		if (match[1]) {
			indentation = match[1].length;
		}

		let code = match[3];

		// Identify and strip inline language from first line. E.g. #!json
		const inlineLanguageMatch = code.match(INLINE_LANGUAGE_MATCH_REGEX);
		if (inlineLanguageMatch) {
			attrs.language = inlineLanguageMatch[1].trim();
			code = code.substring(inlineLanguageMatch[0].length);
		}

		if (indentation > 0) {
			const lines = code.split('\n');
			code = '';
			lines.forEach((line) => {
				if (line.length === indentation) return (code += '\n');
				code += line.substring(indentation) + '\n';
			});
		}

		// Check for language aliases
		switch ((attrs.language || '').toLowerCase()) {
			case 'sh': {
				attrs.language = 'shell';
				break;
			}
			default: {
				break;
			}
		}

		// Convert tabs to spaces
		if (attrs.tabsToSpaces) {
			let spaces = '';
			for (let i = 0; i < attrs.tabsToSpaces; i++) {
				spaces += ' ';
			}
			code = code.replace(/\t/gi, spaces);
		}

		// Replace escaped code fence markers
		code = code.replace(/^(\s*)\\([`~]{3,}.*$)/gm, '$1$2');

		const node = YeastNodeFactory.CreateBlockCodeNode();
		node.value = code;
		node.language = attrs.language;
		node.noCollapse = attrs.noCollapse;
		node.title = attrs.title;
		node.showLineNumbers = attrs.showLineNumbers;
		node.noCollapse = attrs.noCollapse;
		node.indentation = fenceIndentation;

		return {
			remainingText: match[4],
			nodes: [node],
		};
	}
}
