import parseIndentation from '../../plugins/util/IndentationParser';
import {
	BlockParserPlugin,
	YeastParser,
	BlockParserPluginResult,
	ListNode,
	MockListItemNode,
	YeastNodeFactory,
	YeastBlockNodeTypes,
	YeastChild,
	isYeastNodeType,
	ParagraphNode,
} from 'yeast-core';

const LIST_ITEM_REGEX = /^(\s*)([-*+]|\d+[.)])\s*(.+)\s*$/;
const WHITESPACE_REGEX = /^\s*$/;
const areYouSureItsNotJustItalicRegex = /^\s*\*(?:[^* ].*\S|[^* ])\*/;
const areYouSureItsNotJustBoldRegex = /^\s*\*\*(?:[^* ].*\S|[^* ])\*\*/;
// Checks for the line starting with a floating point number
const areYouSureItsNotJustNumericRegex = /^\s*[0-9]+\.[0-9]+\s*/;
const startNumberRegex = /(\d+)/;

/**
 * ListParserPlugin parses list items
 */
export class ListParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		let lines = text.split('\n');

		let firstItemMarker;

		// Strip off preceding whitespace lines
		while (lines.length > 0 && lines[0].match(WHITESPACE_REGEX)) {
			lines.shift();
		}

		// Process lines to find all consecutive list items
		const listItems: MockListItemNode[] = [];
		let abort = false;
		let lastChance = false;
		while (lines.length > 0 && !abort) {
			const line = lines[0];
			// See if this line is a list item
			// 0: source
			// 1: indentation whitespace
			// 2: marker
			// 3: item text
			const match = line.match(LIST_ITEM_REGEX);
			if (!match) {
				// Special handling
				if (lastChance) {
					// No match again
					abort = true;
					continue;
				}
				// Check for blank line
				if (line.match(WHITESPACE_REGEX)) {
					// Since it's just whitespace, go ahead and remove it. Just once though. Last chance!
					lines.shift();
					lastChance = true;
				} else {
					abort = true;
				}
				continue;
			}

			// Recover from a blank line
			lastChance = false;

			// Abort if it's just bold or italic and not a list
			if (
				areYouSureItsNotJustBoldRegex.exec(line) ||
				areYouSureItsNotJustItalicRegex.exec(line) ||
				areYouSureItsNotJustNumericRegex.exec(line)
			) {
				abort = true;
				continue;
			}

			// We're handling this line as a list item, so remove it
			lines.shift();

			// Parse content as block, but strip paragraph container. The list item is the container.
			let children: YeastChild[] = parser.parse(match[3]).children;
			if (
				children.length === 1 &&
				(isYeastNodeType(children[0], YeastBlockNodeTypes.Paragraph) || isYeastNodeType(children[0], YeastBlockNodeTypes.PseudoParagraph))
			) {
				children = (children[0] as ParagraphNode).children;
			}

			// Add the item to the list
			const listItem = {
				type: YeastBlockNodeTypes.ListItem,
				level: parseIndentation(match[1]).indentation,
				marker: match[2],
				children,
			} as MockListItemNode;

			if (!firstItemMarker) {
				firstItemMarker = match[2];
			}

			listItems.push(listItem);
		}

		if (listItems.length === 0) return;

		// Create root node
		const node = YeastNodeFactory.CreateListNode();
		node.level = 0;
		node.children = [];

		//set the start number if the list begins with a numeric marker
		let numericMarkerMatch = startNumberRegex.exec(firstItemMarker);
		if (numericMarkerMatch) {
			let numericmarkerStart = parseInt(numericMarkerMatch[1]);
			node.start = numericmarkerStart && numericmarkerStart >= 1 ? numericmarkerStart : 1;
			node.ordered = true;
		}

		// Recursively assign items to the list
		processListItems(listItems, node);

		return {
			remainingText: lines.join('\n'),
			nodes: [node],
		};
	}
}

// processListItems recursively generates nested lists by mutating the input values
function processListItems(items: MockListItemNode[], targetNode: ListNode) {
	// Add items
	do {
		// Indentation increased, create sublist and call recursively
		if (items[0].level > targetNode.level) {
			const subList = YeastNodeFactory.CreateListNode();
			subList.level = targetNode.level + 1;
			subList.children = [];

			let numericMarkerMatch = startNumberRegex.exec(items[0].marker);
			if (numericMarkerMatch) {
				subList.ordered = true;
			}

			targetNode.children.push(subList);
			processListItems(items, subList);
		}
		// Indentation decreased, abort this loop and return to the parent
		else if (items[0].level < targetNode.level) {
			return;
		}
		// Same level, add to this node
		else {
			//Set marker to undefined because it is not a property of ListItemNode
			const i = items.shift();
			i.marker = undefined;
			targetNode.children.push(i);
		}
	} while (items.length > 0);
}
