import {
	BlockParserPlugin,
	YeastParser,
	BlockParserPluginResult,
	ContentGroupItemNode,
	ContentGroupType,
	YeastNodeFactory,
} from 'yeast-core';

const TAB_REGEX = /^\s*%{3,}[^\S\r\n]*(.+)/i;
const END_TAB_REGEX = /^%{3,}\s*$/i;
const PlACEHOLDER_TITLE = 'TITLE';

export class ContentGroupParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		const match = TAB_REGEX.exec(text);
		if (!match) return;

		let lines: string[];
		let endBlockIndex: number;
		let tabs: any = [];
		let title = '';
		let groupType = '';
		let rootGroupType;
		let tabIndex = -1;
		const itemNodes: ContentGroupItemNode[] = [];

		lines = text.split('\n');

		for (let i = 0; i < lines.length; i++) {
			//New Title?
			const titleMatch = TAB_REGEX.exec(lines[i]);

			if (titleMatch) {
				let attrs: any = {};
				try {
					//Parse JSON
					attrs = JSON.parse(titleMatch[1].trim());
					if (typeof attrs !== 'object') {
						throw 'Invalid JSON type';
					}
					if (attrs.format === undefined) {
						attrs.format = ContentGroupType.tabbedContent; //Default
					}
					//set placeholder title if none is provided
					if (attrs.title === undefined || attrs.title.trim() === '') {
						title = PlACEHOLDER_TITLE;
					} else {
						title = attrs.title.trim();
					}
					groupType = attrs.format;
					if (!rootGroupType) {
						rootGroupType = groupType;
					}
				} catch (err) {
					//Only title was provided
					attrs = {};
					attrs.format = ContentGroupType.tabbedContent;
					groupType = attrs.format;
					if (!rootGroupType) {
						rootGroupType = groupType;
					}
					if (titleMatch[1] === undefined || titleMatch[1].trim() === '') {
						return;
					}

					title = titleMatch[1].trim();
				}

				tabIndex++;

				tabs[tabIndex] = {
					groupType: attrs.format,
					content: '',
					title: title,
				};
				continue;
			}

			// End of block?
			const endMatch = END_TAB_REGEX.exec(lines[i]);
			if (endMatch) {
				endBlockIndex = i + 1;
				break;
			}

			if (title) {
				tabs[tabIndex].content += lines[i] + '\n';
			}
		}

		//Invalid content group syntax
		if (!endBlockIndex) {
			return;
		}

		for (const t of tabs) {
			const itemNode = YeastNodeFactory.CreateContentGroupItemNode();
			itemNode.groupType = t.groupType;
			itemNode.title = t.title;
			itemNode.children = parser.parseBlock(t.content);
			itemNodes.push(itemNode);
		}

		const remainingText = lines.slice(endBlockIndex);

		const node = YeastNodeFactory.CreateContentGroupNode();
		node.children = [...itemNodes];
		node.groupType = rootGroupType as ContentGroupType;

		return {
			remainingText: remainingText.join('\n'),
			nodes: [node],
		};
	}
}
