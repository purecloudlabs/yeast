export const UNDEFINED_DATA_MARKDOWN = `---
title: Undefined children
---





child of paragraph

#   `;

export const UNDEFINED_DATA_AST = {
	type: 'document',
	title: 'Undefined children',
	children: [
		{ type: 'paragraph', children: undefined, indentation: undefined },
		{ type: 'paragraph' },
		{ type: 'paragraph', indentation: undefined, children: [{ text: 'child of paragraph' }] },
		{
			type: 'heading',
			level: 1,
			id: 'level-1-heading',
			children: undefined,
		},
	],
};
