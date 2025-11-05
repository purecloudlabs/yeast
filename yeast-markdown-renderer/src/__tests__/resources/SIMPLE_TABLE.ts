/**
 * This markdown document and AST are exactly equivalent and are expected to remain so after parsing/rendering in both directions.
 */

export const SIMPLE_TABLE_MARKDOWN = `---
title: Default Page Title
---

## Table Test Document 

This document exists to test tables. Oh look! Here's one now:

| Left Aligned | Centered | Right Aligned |
| :--- | :---: | ---: |
| Left 1 | Center 1 | Right 1 |
| Left 2 **looooong** text | Center 2 _looooong_ text | Right 2 \`looooong\` text |
| Left 3 | Center 3 | Right 3 |
`;

export const SIMPLE_TABLE_AST = {
	type: 'document',
	title: 'Default Page Title',
	children: [
		{ type: 'heading', children: [{ text: 'Table Test Document' }], level: 2, id: 'table-test-document' },
		{ type: 'paragraph', children: [{ text: "This document exists to test tables. Oh look! Here's one now:" }], indentation: 0 },
		{
			type: 'table',
			children: [
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ type: 'paragraph', children: [{ text: 'Left Aligned' }], indentation: 0 }], align: 'left' },
						{ type: 'tablecell', children: [{ type: 'paragraph', children: [{ text: 'Centered' }], indentation: 0 }], align: 'center' },
						{ type: 'tablecell', children: [{ type: 'paragraph', children: [{ text: 'Right Aligned' }], indentation: 0 }], align: 'right' },
					],
					header: true,
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ type: 'paragraph', children: [{ text: 'Left 1' }], indentation: 0 }], align: 'left' },
						{ type: 'tablecell', children: [{ type: 'paragraph', children: [{ text: 'Center 1' }], indentation: 0 }], align: 'center' },
						{ type: 'tablecell', children: [{ type: 'paragraph', children: [{ text: 'Right 1' }], indentation: 0 }], align: 'right' },
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [{ text: 'Left 2 ' }, { type: 'bold', children: [{ text: 'looooong' }] }, { text: ' text' }],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [{ text: 'Center 2 ' }, { type: 'italic', children: [{ text: 'looooong' }] }, { text: ' text' }],
									indentation: 0,
								},
							],
							align: 'center',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [{ text: 'Right 2 ' }, { type: 'inlinecode', children: [{ text: 'looooong' }] }, { text: ' text' }],
									indentation: 0,
								},
							],
							align: 'right',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ type: 'paragraph', children: [{ text: 'Left 3' }], indentation: 0 }], align: 'left' },
						{ type: 'tablecell', children: [{ type: 'paragraph', children: [{ text: 'Center 3' }], indentation: 0 }], align: 'center' },
						{ type: 'tablecell', children: [{ type: 'paragraph', children: [{ text: 'Right 3' }], indentation: 0 }], align: 'right' },
					],
				},
			],
			indentation: 0,
			align: 'L|C|R',
		},
	],
};
