import { BlockParserPlugin, YeastParser, BlockParserPluginResult, YeastNodeFactory, YeastBlockNodeTypes, YeastText } from 'yeast-core';
import parseIndentation from '../../plugins/util/IndentationParser';

// Row has at least 2 cells: xxx|xxx
const IS_TABLE = /^\s*(.+?)\s*\|\s*(.+)(?:\||$)/;
// Row has at least 2 alignment cells: :---:|:---:
const IS_ALIGNMENT_ROW = /^.*\s*:*-+:*\s*\|\s*:*-+:*\s*\|{0,1}$/;
// Capture the left/right markers up to the next (pipe) or (EOL)
const ALIGNMENT_CELL = /^\s*\|{0,1}\s*(:*)-+(:*)\s*(?:\||$)/;
// Capture everything up to the next (pipe) or (row wrap and EOL) or (EOL)
const CELL_CONTENT = /^\s*((?:\\\||[^|])+?)\s*(\||\\\s*$|$)/;
// Used for replacing escaped pipes
const CELL_PIPE_FINDER = /\\\|/g;
// Expression to identify leading pipe for removal
const CELL_NORMALIZER = /^\s*\|{0,1}/;
// Capture table class spec
const TABLE_CLASS = /^\s*\{:\s*class\s*=\s*["'](.+?)["']\s*\}/i;

export class TableParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		const tableNode = YeastNodeFactory.CreateTableNode();

		const lines = (text.trim().split('\n')).map(line=> normalizePipeString(line));

		let l = 0;
		if (lines.length < 2 || !IS_TABLE.exec(lines[0]) || !IS_TABLE.exec(lines[1])) return;

		tableNode.indentation = parseIndentation(lines[0]).indentation;

		// Parse alignment and header
		let alignment = parseAlignmentLine(lines[1]);
		if (alignment) {
			// First row is header
			tableNode.children.push(parseLine(lines[0], alignment, parser));
			tableNode.children[0].header = true;
			l = 2;
		} else {
			alignment = parseAlignmentLine(lines[0]);
			// First row is alignment
			if (alignment) {
				l = 1;
			}
		}

		if (alignment) {
			tableNode.align = abbreviateAlignment(alignment);
		}

		let rowElements;
		do {
			rowElements = parseLine(lines[l], alignment, parser);
			if (rowElements) {
				// Add new row
				tableNode.children.push(rowElements);
				l++;
			}
		} while (rowElements);

		//Add table properties
		let tableClasses: any = TABLE_CLASS.exec(lines.length > l ? lines[l] : '');
		if (tableClasses) {
			tableClasses = tableClasses[1].split(' ');
			for (const c of tableClasses) {
				switch (c) {
					case 'sortable':
						tableNode.sortable = true;
						break;
					case 'filterable':
						tableNode.filterable = true;
						break;
					case 'paginated':
						tableNode.paginated = true;
						break;
				}
			}
			l++;
		}

		return {
			remainingText: lines.slice(l, lines.length).join('\n'),
			nodes: [tableNode],
		};
	}
}

const parseLine = (line: string, alignment: string[], parser: YeastParser) => {
	if (!IS_TABLE.exec(line)) return;
	const row = YeastNodeFactory.CreateTableRowNode();
	row.children = [];

	let isCell = false;

	// Prepare content and find indentation
	const lineContent = parseIndentation(line);
	let remainingLine = lineContent.content;

	// Normalize row start to remove leading pipe
	let match = CELL_NORMALIZER.exec(remainingLine);
	if (match) {
		remainingLine = remainingLine.substring(match[0].length);
	}

	// Parse cells
	let columnNumber = -1;
	do {
		columnNumber++;

		// Parse cell content
		const cellContentMatch = CELL_CONTENT.exec(remainingLine);
		isCell = cellContentMatch !== null;
		if (!isCell) continue;

		const cell = YeastNodeFactory.CreateTableCellNode();

		// Parse contents into cell
		cell.children = parser.parseBlock(cellContentMatch[1].replaceAll(CELL_PIPE_FINDER, '|'));
		// Lazy-init if cell was empty
		if (cell.children.length === 0) cell.children.push(YeastNodeFactory.CreateParagraphNode());

		// Determine alignment
		cell.align = alignment ? alignment[columnNumber] : 'left';

		// Add cell to row
		row.children.push(cell);

		// Remove matched content
		remainingLine = remainingLine.substring(cellContentMatch[0].length);
	} while (isCell);

	return row;
};

const parseAlignmentLine = (line: string) => {
	if (!IS_ALIGNMENT_ROW.exec(line)) return;

	const alignment: string[] = [];
	let match;
	do {
		// Parse cell content
		match = ALIGNMENT_CELL.exec(line);
		if (!match) continue;

		// Determine alignment
		if (match[1] && match[2]) alignment.push('center');
		else if (match[2]) alignment.push('right');
		else alignment.push('left');

		// Remove matched content
		line = line.substring(match[0].length);
	} while (match);

	return alignment;
};

const abbreviateAlignment = (alignments: string[]) => {
	return alignments
		.map((a) => {
			switch (a.charAt(0)) {
				case 'c':
					return 'C';
				case 'l':
					return 'L';
				case 'r':
					return 'R';
			}
		})
		.join('|');
};

//This function ensures unescaped pipes are surrounded by whitespace , to validate empty cells (i.e 'foo|bar||' becomes a row of 3 cells) and ensure pipes are not touching other characters
function normalizePipeString(input: string): string {
	//Replace escaped pipes (\|) with a placeholder to protect them during splitting
	const placeholder = "__ESCAPED_PIPE__"; 
	const escapedInput = input.replace(/\\\|/g, placeholder)

	//Split input string by unescaped pipes and retain the pipes 
	const normalized = escapedInput
		.split(/(\|)/)
		.map(part => part.replaceAll('|', ' | ').replaceAll(placeholder, '\\|'))
		.join('')
		.replace(/\s+/g, ' ')
		.trim();
	
	return normalized
}