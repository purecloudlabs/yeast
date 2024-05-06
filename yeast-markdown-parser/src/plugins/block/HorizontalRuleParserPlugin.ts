import { BlockParserPlugin, YeastParser, BlockParserPluginResult, YeastNodeFactory } from 'yeast-core';

const ASTERISKS_REGEX = /^\s*?(\*{3,})\n?([\s\S]*)/i;
const HYPHEN_REGEX = /^\s*?(-{3,})\n?([\s\S]*)/i;
const UNDERSCORE_REGEX = /^\s*?(_{3,})\n?([\s\S]*)/i;

export class HorizontalRuleParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		const match = text.match(ASTERISKS_REGEX) || text.match(UNDERSCORE_REGEX) || text.match(HYPHEN_REGEX);
		if (!match) return;

		const node = YeastNodeFactory.CreateHorizontalRuleNode();

		return {
			remainingText: match[2],
			nodes: [node],
		};
	}
}
