export const TABLE_DATA = {
	author: 'yuri.yetina',
	type: 'document',
	title: 'Table data',
	children: [
		{
			type: 'table',
			indentation: 0,
			align: 'L|R',
			children: [
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: 'names' }] },
						{ type: 'tablecell', children: [{ text: 'use a | pipe character to | define the cells' }] },
					],
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: 'yeti' }] },
						{ type: 'tablecell', children: [{ text: 'genesys' }] },
					],
				},
			],
		},
		{
			type: 'table',
			indentation: 0,
			children: [
				{
					type: 'tablerow',
					header: true,
					children: [
						{
							type: 'bold',
							children: [
								{
									type: 'list',
									children: [
										{
											type: 'listitem',
											children: [{ text: 'list item 1' }],
										},
										{
											type: 'listitem',
											children: [{ text: 'list item 2' }],
										},
										{
											type: 'listitem',
											children: [{ text: 'list item 3' }],
										},
										,
									],
								},
							],
						},
						{ type: 'tablecell', children: [{ text: `yeti's org & number` }] },
					],
				},

				{
					type: 'tablerow',
					children: [{ type: 'tablecell', children: [{ text: 'yetina' }] }],
				},
			],
		},
		{
			type: 'table',
			indentation: 2,
			children: [
				{
					type: 'tablerow',
					header: true,
					children: [
						{ type: 'tablecell', children: [{ text: 'name' }] },
						{ type: 'tablecell', children: [{ text: 'org' }] },
						{ type: 'tablecell', children: [{ text: 'org #' }] },
					],
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: 'yetina' }] },
						{ type: 'tablecell', children: [{ text: 'genesys' }] },
						{ type: 'tablecell', children: [{ text: '0009' }] },
					],
				},
			],
		},
		{
			type: 'custom-comp',
			children: [{ text: 'dx-ui-text bro' }],
		},
	],
};


export const TABLE_DATA_WITH_CLASSES = {
	author: 'yuri.yetina',
	type: 'document',
	title: 'Table data',
	children: [
		{
			type: 'table',
			indentation: 0,
			align: 'L|R',
			sortable: true,
			filterable: true,
			paginated: true,
			children: [
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: 'names' }] },
						{ type: 'tablecell', children: [{ text: 'use a | pipe character to | define the cells' }] },
					],
				},
				{
					type: 'tablerow',
					children: [
						{ type: 'tablecell', children: [{ text: 'yeti' }] },
						{ type: 'tablecell', children: [{ text: 'genesys' }] },
					],
				},
			],
		},
	]
};