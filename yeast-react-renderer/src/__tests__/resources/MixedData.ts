import { DocumentNode } from 'yeast-core';

export default {
	type: 'document',
	title: "A page's title",
	className: 'main--container',
	children: [
		{ type: 'paragraph', children: [{ text: 'dummy text level 2' }] },
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
			value: "const name = 'Yeti'",
			language: 'javascript',
		},
		{
			type: 'callout',
			title: 'Test warning',
			alertType: 'warning',
			children: [{ text: 'warning you' }],
		},
		{
			type: 'inlinecode',
			children: [{ text: "console.log('code') \n //hello world inline" }],
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
			type: 'table',
			indentation: 0,
			children: [
				{
					type: 'tablerow',
					header: true,
					children: [{ type: 'tablecell', children: [{ text: 'names' }] }],
				},
				{
					type: 'tablerow',
					children: [{ type: 'tablecell', children: [{ text: 'yeti' }] }],
				},
			],
		},
		{
			type: 'table',
			indentation: 0,
			children: [
				{ type: 'tablerow', children: [{ type: 'tablecell', children: [{ text: 'yeti names' }] }] },
				{
					type: 'tablerow',
					children: [{ type: 'tablecell', children: [{ text: 'yetina' }] }],
				},
			],
		},

		{
			type: 'blockquote',
			children: [{ text: 'Welcome to the Genesys Cloud Developer Guides.' }],
		},
		{
			type: 'contentgroup',
			groupType: 'accordion',
			children: [{ type: 'contentgroupitem', groupType: 'accordion', title: 'test accordion', children: [{ text: 'i am accordion' }] }],
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
			],
		},
		{
			type: 'strikethrough',
			children: [{ text: 'strikethroughContent' }],
		},
		{
			type: 'paragraph',
			children: [{ text: '09:00\\~17:00\|America/Los\_Angeles", "08:30\\~12:30\|\-05:00' }],
		},
	],
	author: 'yuri.yeti',
	customDataOne: 'The first value',
} as DocumentNode;
