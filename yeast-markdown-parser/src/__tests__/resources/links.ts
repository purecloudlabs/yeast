export const LINK_MARKDOWN = `[/Genesys/developercenter](https://developer.genesys.cloud/ 'single quote text')tellus et pretium tempus, https://developer.genesys.cloud/

Here's a recursive link: [https://genesys.com](https://genesys.com)`;

export const LINK_AST = {
	type: 'document',
	title: 'Default Page Title',
	children: [
		{
			type: 'paragraph',
			children: [
				{
					type: 'link',
					children: [
						{
							text: '/Genesys/developercenter',
						},
					],
					href: 'https://developer.genesys.cloud/',
					title: 'single quote text',
				},
				{
					text: 'tellus et pretium tempus, ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'https://developer.genesys.cloud/',
						},
					],
					href: 'https://developer.genesys.cloud/',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					text: "Here's a recursive link: ",
				},
				{
					type: 'link',
					children: [
						{
							text: 'https://genesys.com',
						},
					],
					href: 'https://genesys.com',
					title: 'Link',
				},
			],
			indentation: 0,
		},
	],
};
