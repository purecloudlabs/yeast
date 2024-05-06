import { DocumentNode } from 'yeast-core';

export default {
	type: 'document',
	title: "A page's title",
	author: 'yuri.yeti',
	children: [
		{
			type: 'paragraph',
			children: [
				{
					type: 'strikethrough',
					children: [{ type: 'bold', children: [{ type: 'italic', children: [{ text: 'a bold strikethrough text' }] }] }],
				},
			],
		},
		{
			type: 'table',
			indentation: 0,
			headerRow: [
				{ type: 'tablerow', children: [{ type: 'tablecell', header: true, children: [{ text: 'Organization ID' }] }] },
				{ type: 'tablerow', children: [{ type: 'tablecell', header: true, children: [{ text: 'Org Code' }] }] },
			],
			children: [
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: '34565' }] },
						{ type: 'tablecell', children: [{ type: 'inlinecode', children: [{ text: 'console.log' }] }] },
					],
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: '6545' }] },
						{ type: 'tablecell', children: [{ type: 'inlinecode', children: [{ text: 'alert()' }] }] },
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
			headerRow: [
				{ type: 'tablerow', children: [{ type: 'tablecell', header: true, children: [{ text: 'Org ID' }] }] },
				{ type: 'tablerow', children: [{ type: 'tablecell', header: true, children: [{ text: 'Org Code' }] }] },
			],
			children: [
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: '34333' }] },
						{ type: 'tablecell', children: [{ type: 'code', value: 'block console.log()', language: 'java' }] },
					],
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: '7777' }] },
						{ type: 'tablecell', children: [{ type: 'code', value: 'block alert()', language: 'c' }] },
					],
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: '0101' }] },
						{
							type: 'tablecell',
							children: [{ type: 'code', value: 'block printd()', language: 'python' }],
						},
					],
				},
			],
		},
	],
} as DocumentNode;
