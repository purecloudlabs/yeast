export default {
	type: 'document',
	title: 'Analytics API API',
	children: [
		{
			type: 'Paragraph',
			children: [{ text: "this text won't show because the node type doesn't match" }],
		},
		{ type: 'paragraph' },
		{ type: 'paragraph', indentation: 1, children: [{ text: '(end of document)' }] },
	],
};
