import React, { useEffect, useState, useRef } from 'react';
import { TableNode, YeastBlockNodeTypes } from 'yeast-core';

import { ReactRenderer } from '../ReactRenderer';
import { useKey } from '../helpers/useKey';

import { DataTable, DataTableRow, DataTableCell } from 'genesys-react-components';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';

import '../styles/Table.scss';

interface IProps {
	node: TableNode;
	renderer: ReactRenderer;
}

export default function TableNodeRenderer(props: IProps) {
	const key = useKey();
	let headerRow;
	let rows;

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = diffRenderData ? `table-${key.current} ${diffRenderData.diffClass}` : '';
	
	const getContent = (node: any): string => {
		if (!node.children && !node.text) {
			return '';
		}
		if (!node.children) {
			return node.text;
		}

		let content = [];
		for (let index = 0; index < node.children.length; index++) {
			content.push(getContent(node.children[index]));
		}
		return content.join(' ');
	};

	if (props.node.children[0].header) {
		headerRow = { cells: [] };
		props.node.children[0].children.forEach((child) => {
			headerRow.cells.push({
				renderedContent: <>{props.renderer.renderComponents(child.children)}</>,
				content: getContent(child),
				align: child.align,
			});
		});
	}

	let tableRowsContent = headerRow ? props.node.children.slice(1) : props.node.children;
	if (props.node.children) {
		rows = [];
		tableRowsContent.forEach((row, i) => {
			if (row.type == YeastBlockNodeTypes.TableRow) {
				const rowDiffData: DiffRenderData = getDiffRenderData(row);
				let rowClass: string = rowDiffData ? rowDiffData.diffClass : '';
				let childRow = { cells: [] } as DataTableRow;
				if (rowClass) childRow.className = rowClass;
				
				row.children.forEach((childCell) => {
					const cellDiffData: DiffRenderData = getDiffRenderData(childCell);
					let cellDiffClass: string = cellDiffData ? cellDiffData.diffClass : '';
					let renderedContent: React.ReactNode;
					renderedContent = <>{props.renderer.renderComponents(childCell.children)}</>;
					const content = getContent(childCell);
					const cell: DataTableCell = {
						renderedContent,
						content: content.length == 0 ? 'default content' : content,
					}
					if (cellDiffClass) cell.className = cellDiffClass;
					if (childCell.align === 'left' || childCell.align ==='right' || childCell.align === 'center') {
						cell.align = childCell.align;
					}
					childRow.cells.push(cell);
				});
				rows.push(childRow);
			}
		});
	}
	return (
		<DataTable
			key={key.current}
			headerRow={headerRow}
			rows={rows}
			sortable={props.node.sortable}
			indentation={props.node.indentation}
			filterable={props.node.filterable}
			className={className}
		/>
	);
}
