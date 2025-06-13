export const GENERAL_DATA = {
	type: 'document',
	title: "A page's title",
	className: 'main--container',
	children: [
		{
			type: 'paragraph',
			indentation: 0,
			children: [
				{
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi auctor est eget mollis pharetra. In pretium sagittis lectus, vitae commodo eros varius et. Curabitur aliquet, justo et maximus interdum, ex tortor vehicula erat, et varius nibh dolor ac velit. Pellentesque ultrices sapien vitae ante euismod, vel luctus orci blandit. Phasellus vel nibh a elit faucibus efficitur nec ac sapien. Pellentesque nec iaculis tellus. Proin elit augue, dapibus a neque a, condimentum fermentum est.',
				},
			],
		},
		{
			type: 'paragraph',
			indentation: 0,
			children: [
				{
					type: 'paragraph',
					children:[
						{text: '09:00'}
					]
				},
				{
					type: 'paragraph',
					children:[
						{text: '17:00|America/Los_Angeles", "08:30'}
					],
					containsTextModification: true
				},
				{
					type: 'paragraph',
					children:[
						{text: '12:30|\-05:00'}
					]
				}
			]
		},
		{
			type: 'heading',
			level: 1,
			id: 'level-1-heading',
			children: [{ text: 'A level 1 heading' }],
		},
		{
			type: 'heading',
			level: 2,
			id: 'level-2-heading',
			children: [{ text: 'A level 2 heading' }],
		},
		{
			type: 'heading',
			level: 3,
			id: 'level-3-heading',
			children: [{ text: 'A level 3 heading' }],
		},
		{
			type: 'heading',
			level: 4,
			id: 'level-4-heading',
			children: [{ text: 'A level 4 heading' }],
		},
		{
			type: 'heading',
			level: 5,
			id: 'level-5-heading',
			children: [{ text: 'A level 5 heading' }],
		},
		{
			type: 'heading',
			level: 6,
			id: 'level-6-heading',
			children: [{ text: 'A level 6 heading' }],
		},
		{
			type: 'heading',
			level: 7,
			id: 'level-7-heading',
			children: [{ text: 'A level 7 heading' }],
		},
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
		{
			type: 'list',
			ordered: true,
			start: 1,
			children: [
				{
					type: 'listitem',
					children: [{ text: 'ordered list item 1' }],
				},
				{
					type: 'listitem',
					children: [{ text: 'ordered list item 2' }],
				},
				{
					type: 'listitem',
					children: [{ text: 'ordered list item 3' }],
				},
				,
			],
		},
		{
			type: 'code',
			language: 'java',
			indentation: 2,
			value: "```\n// Code goes here\nString str = \"my string\";\n```",
		},
		{
			type: 'callout',
			title: 'Test warning',
			alertType: 'warning',
			indentation: 0,
			children: [
				{ type: 'paragraph', children: [{ text: 'warning you' }] },
				{ type: 'paragraph', children: [{ text: 'warning you 2' }] },
			],
		},
		{
			type: 'callout',
			alertType: 'primary',
			indentation: 1,
			children: [
				{ type: 'paragraph', children: [{ text: 'primary warning you' }] },
				{ type: 'paragraph', children: [{ text: 'primary warning you 2' }] },
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
						{ type: 'tablecell', children: [{ text: 'names' }] },
						{ type: 'tablecell', children: [{ text: 'org' }] },
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
			indentation: 1,
			children: [
				{
					type: 'tablerow',
					header: true,
					children: [
						{ type: 'tablecell', children: [{ text: 'yeti names' }] },
						{ type: 'tablecell', children: [{ text: 'yeti orgs' }] },
						{ type: 'tablecell', children: [{ text: 'yeti org number' }] },
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
			type: 'inlinecode',
			children: [{ text: "console.log('code')" }],
		},
		{
			type: 'link',
			href: 'https://developer.genesys.cloud/',
			title: 'dev center',
			children: [{ text: 'this is dev center' }],
		},
		{ type: 'bold', children: [{ text: 'testing bold' }] },
		{ type: 'italic', children: [{ text: 'testing italic' }] },
		{
			type: 'blockquote',
			children: [{ text: 'blockquote paragraph 1' }],
		},
		{
			type: 'contentgroup',
			groupType: 'accordion',
			children: [
				{
					type: 'contentgroupitem',
					groupType: 'accordion',
					title: 'test accordion',
					children: [{ text: 'i am accordion' }],
				},
				{
					type: 'contentgroupitem',
					groupType: 'accordion',
					title: 'accordion 2 text',
					children: [{ text: 'i am accordion 2' }],
				},
			],
		},
		{
			type: 'contentgroup',
			groupType: 'tabbedcontent',
			children: [
				{
					type: 'contentgroupitem',
					groupType: 'tabbedcontent',
					title: 'test tabbedcontent',
					children: [{ text: 'i am tabbedcontent' }],
				},
				{
					type: 'contentgroupitem',
					groupType: 'tabbedcontent',
					title: 'test tabbedcontent 2',
					children: [{ text: 'i am tabbedcontent 2' }],
				},
			],
		},
		{
			type: 'strikethrough',
			children: [{ text: 'strikethroughContent' }],
		},
		{
			type: 'image',
			src: 'https://i.postimg.cc/1zrNF4sT/images.jpg',
			alt: 'animated boy with white hair',
			title: 'killua',
		},
	],
	author: 'yuri.yeti',
	customDataOne: 'The first value',
};
