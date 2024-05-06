import { DocumentNode } from 'yeast-core';

export default {
	type: 'document',
	title: 'Code Data',
	children: [
		{ type: 'paragraph', children: [{ text: 'Testing code data' }] },
		{
			type: 'code',
			value: "System.out.print('code') \n //hello world",
			language: 'Java',
		},
		{
			type: 'code',
			value: 'no code',
		},
		{
			type: 'inlinecode',
			children: [{ text: "console.log('hello')" }],
		},
	],
	author: 'yuri.yeti',
} as DocumentNode;
