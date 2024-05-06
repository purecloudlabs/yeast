export const BLOCKQUOTE_DATA = {
	type: 'document',
	title: 'Testing Paragraph type in blockquote',
	author: 'yuri.yetina',
	children: [
		{
			type: 'blockquote',
			children: [
				{ type: 'paragraph', children: [{ text: 'paragraph node 1' }] },
				{ type: 'paragraph', children: [{ text: 'paragraph node 2' }] },
				{ type: 'paragraph', children: [{ text: 'paragraph node 3' }] },
			],
		},
		{
			type: 'blockquote',
			children: [
				{ text: 'paragraph node 1' },
				{ text: 'paragraph node 2' },
				{ text: 'paragraph node 3' },
				{ type: 'heading', level: 1, children: [{ text: 'heading node 1' }] },
			],
		},
	],
};
