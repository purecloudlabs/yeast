import { DocumentNode, TableCellNode, TableNode, TableRowNode } from 'yeast-core';

export default {
	type: 'document',
	title: 'Table Data',
	author: 'yuri.yeti',
	children: [
		{
			type: 'table',
			indentation: 0,
			headerRow: {
				type: 'tablerow',
				children: [
					{
						type: 'tablecell',
						header: true,
						children: [
							{ text: 'Organization ID' },
							{ text: ' Testing header' },
							{ type: 'inlinecode', children: [{ text: ' console.log' }, { text: ' printd()' }] },
						],
					},
				],
			},
			children: [
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: '34565' }] },
						{
							type: 'tablecell',
							children: [{ type: 'inlinecode', children: [{ text: 'console.log' }] }],
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: '6545' }] },
						{
							type: 'tablecell',
							children: [{ type: 'inlinecode', children: [{ text: 'alert()' }] }],
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: '0000' }] },
						{
							type: 'tablecell',
							children: [{ type: 'inlinecode', children: [{ text: 'printf()' }] }],
						},
					],
				},
			],
		},
		{
			type: 'table',
			indentation: 0,
			headerRow: {
				type: 'tablerow',
				children: [
					{
						type: 'tablecell',
						children: [{ text: 'Org Code' }],
					},
				],
			},
			children: [
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: 'Number' }] },
						{
							type: 'tablecell',

							children: [{ text: 'code' }],
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: '34333' }] },
						{
							type: 'tablecell',
							children: [{ type: 'code', value: 'console.log', language: 'java' }],
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: '0101' }] },
						{
							type: 'tablecell',
							children: [
								{
									type: 'code',
									value: 'printd()',
									language: 'python',
								},
							],
						},
					],
				},
			],
		} as TableNode,
	],
} as DocumentNode;
