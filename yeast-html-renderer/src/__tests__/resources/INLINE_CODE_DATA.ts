export const INLINE_CODE_MARKDOWN = `---
title: Default Page Title
---

This is some text with \`inline code\`.

To make inline code, put a backtick (\`\`\`\`\`) around it.

Double backticks \`\`escape \`single backticks\` in the text\`\`.
`;

export const INLINE_CODE_AST = {
	type: 'document',
	title: 'Default Page Title',
	children: [
		{
			type: 'paragraph',
			children: [{ text: 'This is some text with ' }, { type: 'inlinecode', children: [{ text: 'inline code' }] }, { text: '.' }],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{ text: 'To make inline code, put a backtick (' },
				{ type: 'inlinecode', children: [{ text: '`' }] },
				{ text: ') around it.' },
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{ text: 'Double backticks ' },
				{ type: 'inlinecode', children: [{ text: 'escape `single backticks` in the text' }] },
				{ text: '.' },
			],
			indentation: 0,
		},
	],
};
