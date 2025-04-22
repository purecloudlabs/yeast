export const GENERAL_DATA = {
	type: 'document',
	title: 'Default Page Title',
	children: [
		{
			type: 'heading',
			children: [
				{
					text: 'Main Heading',
				},
			],
			level: 1,
			id: 'main-heading',
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Second Level Heading',
				},
			],
			level: 2,
			id: 'second-level-heading',
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Third Level Heading',
				},
			],
			level: 3,
			id: 'third-level-heading',
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Fourth Level Heading',
				},
			],
			level: 4,
			id: 'fourth-level-heading',
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Fifth Level Heading',
				},
			],
			level: 5,
			id: 'fifth-level-heading',
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Sixth Level Heading',
				},
			],
			level: 6,
			id: 'sixth-level-heading',
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Seventh Level Heading',
				},
			],
			level: 7,
			id: 'seventh-level-heading',
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'This is a paragraph with ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'bold text',
						},
					],
				},
				{
					text: ', ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'italic text',
						},
					],
				},
				{
					text: ', and ',
				},
				{
					type: 'bold',
					children: [
						{
							type: 'italic',
							children: [
								{
									text: 'bold italic',
								},
							],
						},
					],
				},
				{
					text: ' text.',
				},
			],
			indentation: 0,
		},
		{
			type: 'list',
			children: [
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Unordered list item 1',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Unordered list item 2',
						},
					],
				},
				{
					type: 'list',
					children: [
						{
							type: 'listitem',
							level: 1,
							children: [
								{
									text: 'Nested list item',
								},
							],
						},
						{
							type: 'listitem',
							level: 1,
							children: [
								{
									text: 'Another nested item',
								},
							],
						},
					],
					ordered: false,
					level: 1,
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Ordered list item 1',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Ordered list item 2',
						},
					],
				},
				{
					type: 'list',
					children: [
						{
							type: 'listitem',
							level: 1,
							children: [
								{
									text: 'Nested ordered item',
								},
							],
						},
						{
							type: 'listitem',
							level: 1,
							children: [
								{
									text: 'Another nested item',
								},
							],
						},
					],
					ordered: true,
					level: 1,
				},
			],
			ordered: false,
			level: 0,
		},
		{
			type: 'blockquote',
			children: [
				{
					type: 'paragraph',
					children: [
						{
							text: 'This is a blockquote It can span multiple lines',
						},
					],
					indentation: 0,
				},
			],
		},
		{
			type: 'code',
			children: [],
			value: '// This is a code block\nfunction hello(name: string) {\n    console.log(`Hello, ${name}!`);\n}',
			language: 'typescript',
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'This is an ',
				},
				{
					type: 'inlinecode',
					children: [
						{
							text: 'inline code',
						},
					],
				},
				{
					text: ' example.',
				},
			],
			indentation: 0,
		},
		{
			type: 'callout',
			children: [
				{
					type: 'paragraph',
					children: [
						{
							text: 'This is a ',
						},
						{
							type: 'italic',
							children: [
								{
									text: 'callout',
								},
							],
						},
						{
							text: '.',
						},
					],
					indentation: 0,
				},
				{
					type: 'paragraph',
					children: [
						{
							text: 'With a second line of text.',
						},
					],
					indentation: 0,
				},
			],
			alertType: 'info',
			indentation: 0,
		},
		{
			type: 'horizontalrule',
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'This is ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'Link text',
						},
					],
					href: 'https://example.com',
					title: 'Link',
				},
				{
					text: ' to go somewhere.',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'image',
					src: 'https://example.com/image.jpg',
					title: 'Image alt text',
				},
			],
			indentation: 0,
		},
		{
			type: 'table',
			children: [
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Table Header 1',
										},
									],
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
									children: [
										{
											text: 'Table Header 2',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
					header: true,
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Row 1 Cell 1',
										},
									],
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
									children: [
										{
											text: 'Row 1 Cell 2',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
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
									children: [
										{
											text: 'Row 2 Cell 1',
										},
									],
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
									children: [
										{
											text: 'Row 2 Cell 2',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
			],
			indentation: 0,
			align: 'L|L',
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'strikethrough',
					children: [
						{
							text: '~Strikethrough text',
						},
					],
				},
				{
					text: '~',
				},
			],
			indentation: 0,
		},
	],
};

export const GENERAL_DATA_STRING = `<h1>Main Heading</h1>
<h2>Second Level Heading</h2>
<h3>Third Level Heading</h3>
<h4>Fourth Level Heading</h4>
<h5>Fifth Level Heading</h5>
<h6>Sixth Level Heading</h6>
<span class="h7">Seventh Level Heading</span>
UNHANDLED: paragraph
UNHANDLED: list
UNHANDLED: blockquote
UNHANDLED: code
UNHANDLED: paragraph
UNHANDLED: callout
UNHANDLED: horizontalrule
UNHANDLED: paragraph
UNHANDLED: paragraph
UNHANDLED: table
UNHANDLED: paragraph`;
