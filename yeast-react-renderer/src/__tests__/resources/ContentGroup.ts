import { DocumentNode } from 'yeast-core';

export default {
	type: 'document',
	title: 'Default Page Title',
	className: 'main--container',
	children: [
		{ type: 'paragraph', children: [{ text: 'dummy text level 2' }] },
		{
			type: 'contentgroup',
			children: [
				{
					type: 'contentgroupitem',
					groupType: 'tabbedcontent',
					children: [
						{
							type: 'paragraph',
							children: [
								{
									text: 'item 1 on content Group tab 1',
								},
							],
						},
					],
					title: 'tab 1',
				},

				{
					type: 'contentgroupitem',
					groupType: 'tabbedcontent',
					children: [
						{ type: 'paragraph', children: [{ text: 'Second tab content' }] },
						{ type: 'paragraph', children: [{ text: 'more stuff' }] },
					],
					title: 'tab two',
				},
			],
			groupType: 'tabbedcontent',
		},
	],
	author: 'yuri.yeti',
	customDataOne: 'The first value',
} as DocumentNode;
