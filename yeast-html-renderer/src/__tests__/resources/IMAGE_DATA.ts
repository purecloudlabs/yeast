export const IMAGE_DATA_AST = {
	type: 'document',
	title: 'Default Page Title',
	children: [
		{ type: 'paragraph', children: [{ type: 'image', src: '/images/yeti.png', title: 'Title Text', alt: 'Alt Text' }], indentation: 0 },
	],
};

export const IMAGE_DATA_MARKDOWN = ` ---
title: Default Page Title
---

![Title Text](/images/yeti.png "Alt Text")
    
`;
