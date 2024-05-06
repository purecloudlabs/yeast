import parseIndentation from '../../plugins/util/IndentationParser';
import { BlockParserPlugin, YeastParser, BlockParserPluginResult, YeastNodeFactory } from 'yeast-core';

const CALLOUT_REGEX = /^(\s*):{3,}(.*)\n([\s\S]+?\n)\s*:{3,}\n?([\s\S]*)/i;

function filterIndentation(textContent: RegExpMatchArray) {
	const sliceIndex = textContent[0].indexOf(textContent[0].trim());
	const splitText = textContent[3].split(/(\r?\n){1,}/).filter((element) => element && !element.includes('\n') && !element.includes('\r')); //split regex matches one or more newline
	let fullText = '';
	for (let text of splitText) {
		fullText += text.substring(sliceIndex) + '\n\n';
	}
	textContent[3] = fullText;
}

export class CalloutParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		const match = text.match(CALLOUT_REGEX);
		if (!match) return;

		const indentation = parseIndentation(match[1]).indentation;
		if (indentation) {
			filterIndentation(match);
		}

		let attrs: any = {};
		try {
			attrs = JSON.parse(match[2]);
		} catch (err) {
			attrs.alert = match[2] || 'vanilla';
		}

		if (attrs.alert) {
			switch (attrs.alert.toLowerCase()) {
				case 'error':
				case 'danger': {
					attrs.alert = 'critical';
					break;
				}
				case 'vanilla':
				case 'secondary':
				case 'primary': {
					attrs.alert = 'info';
					break;
				}
				default: {
					attrs.alert = attrs.alert.toLowerCase();
				}
			}
		}

		const node = YeastNodeFactory.CreateCalloutNode();
		node.children = parser.parseBlock(match[3]);
		node.alertType = (attrs.alert || '').toLowerCase();
		node.title = attrs.title;
		node.autoCollapse = attrs.autoCollapse;
		node.collapsible = attrs.collapsible;
		node.indentation = indentation;

		return {
			remainingText: match[4],
			nodes: [node],
		};
	}
}
