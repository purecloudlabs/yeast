import { MarkdownRenderer } from '../MarkdownRenderer';
import {
	TableNode,
	YeastInlineNodeTypes,
	YeastInlineNode,
	YeastNode,
	YeastChild,
	isYeastInlineNode,
	isYeastTextNode,
	YeastBlockNodeTypes,
	ParagraphNode,
} from 'yeast-core';
import renderCustomComponent from './CustomComponentRenderer';

export default function renderTableNode(node: TableNode, renderer: MarkdownRenderer) {
	const isInlineOnly = (nodes: YeastChild[]): boolean => {
		/**
		 * If it's not a known inline type and not text, it's not considered inline.
		 * This check uses "some" to only process until a truthy result is encountered. As such some=false means
		 * it is inline only and its return value must be negated.
		 */
		return !nodes.some((node) => !isYeastInlineNode(node) && !isYeastTextNode(node));
	};
	const isYeastNodeType = (node: YeastChild, type: YeastBlockNodeTypes | YeastInlineNodeTypes | string): boolean => {
		return node.hasOwnProperty('type') && (node as { type: string }).type.toLowerCase() === type.toLowerCase();
	};

	// Check if the table adheres to simple formatting requirements
	const isComplexTable = node.children.some((row) => {
		// Check each row's cells
		return row.children.some((cell) => {
			/**
			 * A simple cell is expected to contain a single paragraph with its children being inline nodes. A direct collection
			 * of inline nodes is also ok, though not expected.
			 */
			if (cell.children.length === 1 && isYeastNodeType(cell.children[0], YeastBlockNodeTypes.Paragraph)) {
				const paragraphNode = cell.children[0] as ParagraphNode;
				if (!paragraphNode.children) return false;
				return !isInlineOnly(paragraphNode.children);
			} else {
				// Fall back to checking the cell's contents directly if it wasn't a single paragraph node
				return !isInlineOnly(cell.children);
			}
		});
	});

	// Render table as a custom component
	if (isComplexTable) return renderCustomComponent(node);

	//setting align on column
	let alignStr = '|';
	if (node.align) {
		for (const alignChar of node.align.split('|')) {
			if (alignChar == 'R') {
				alignStr += ' ---: |';
			} else if (alignChar == 'L') {
				alignStr += ' :--- |';
			} else {
				alignStr += ' :---: |';
			}
		}

		const diff = node.children[0].children.length - node.align.split('|').length;
		if (diff > 0) {
			for (let index = diff; index < node.align.split('|').length; index++) {
				alignStr += ' :---: |';
			}
		}
	} else {
		for (let index = 0; index < node.children[0].children.length; index++) {
			alignStr += ' :---: |';
		}
	}

	// Proceed to render table simply

	if (node.children[0].header) {
		const indentation = '\t';

		//Add indentation to header
		const headerChildren = renderer.renderComponents([node.children[0]]).join('').split('\n');
		let headerVal = '';
		headerChildren.forEach((child) => {
			if (child.trim().length > 0) {
				headerVal += `${indentation.repeat(node.indentation)}${child}\n`;
			}
		});
		//add align column
		headerVal += `${indentation.repeat(node.indentation)}${alignStr}\n`;

		//add indentation to table body
		let finalVal = '';

		const children = renderer.renderComponents(node.children.slice(1)).join('').split('\n');
		children.forEach((child, index) => {
			if (index !== children.length - 1) finalVal += `${indentation.repeat(node.indentation)}${child}\n`;
			else if (index === children.length - 1 && child.length !== 0) finalVal += `${indentation.repeat(node.indentation)}${child}`;
		});

		return `\n${headerVal}${finalVal}`;
	} else {
		const indentation = '\t';
		let finalVal = `${indentation.repeat(node.indentation)}${alignStr}\n`; //start off with alignment
		const children = renderer.renderComponents(node.children).join('').split('\n');

		children.forEach((child) => {
			if (child.trim().length > 0) {
				finalVal += `${indentation.repeat(node.indentation)}${child}\n`;
			}
		});
		return `\n${finalVal}`;
	}
}
