export const LIST_DATA = {
	type: 'document',
	title: 'Default Page Title',
	children: [
		{ type: 'heading', children: [{ text: 'Basic list' }], level: 1, id: 'basic-list' },
		{
			type: 'list',
			children: [
				{ type: 'listitem', children: [{ text: 'first item' }], level: 0 },
				{ type: 'listitem', children: [{ text: 'second' }], level: 0 },
				{
					type: 'list',
					children: [
						{ type: 'listitem', children: [{ text: 'first subsecond' }], level: 1 },
						{ type: 'listitem', children: [{ text: 'second subsecond' }], level: 1 },
					],
					ordered: false,
					level: 1,
				},
				{ type: 'listitem', children: [{ text: 'third' }], level: 0 },
			],
			ordered: false,
			level: 0,
		},
		{ type: 'heading', children: [{ text: 'Ordered List' }], level: 1, id: 'ordered-list' },
		{
			type: 'list',
			children: [
				{ type: 'listitem', children: [{ text: 'this' }], level: 0 },
				{ type: 'listitem', children: [{ text: 'is' }], level: 0 },
				{ type: 'listitem', children: [{ text: 'what' }], level: 0 },
				{
					type: 'list',
					children: [
						{ type: 'listitem', children: [{ text: 'nested' }], level: 1 },
						{ type: 'listitem', children: [{ text: 'lists' }], level: 1 },
						{
							type: 'list',
							children: [
								{
									type: 'listitem',
									children: [
										{
											type: 'bold',
											children: [{ text: 'look like' }],
										},
									],
									level: 2,
								},
								{
									type: 'listitem',
									children: [
										{
											type: 'inlinecode',
											children: [{ text: "console.log('code')" }],
										},
									],
									level: 2,
								},
							],
							ordered: true,
							level: 2,
							start: 1,
						},
					],
					ordered: false,
					level: 1,
					start: 6,
				},
			],
			ordered: true,
			level: 0,
			start: 0,
		},
	],
};

export const EMPTY_ITEM_LIST = {
	type: 'document',
	title: 'Default Page Title',
	children: [
		{
			type: 'list',
			children: [
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'item',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: ' ',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: '',
						},
					],
				},
			],
			ordered: false,
			level: 0,
		},
	],
};

export const EMPTY_ITEM_LIST_RESULT = `
- item
-  
- 
`;
