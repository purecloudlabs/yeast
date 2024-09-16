export const LINK_MARKDOWN = `[/Genesys/developercenter](https://developer.genesys.cloud/ 'single quote text')tellus et pretium tempus, https://developer.genesys.cloud/

Here's a recursive link: [https://genesys.com](https://genesys.com)

Parsing a URL as a link https://genesys.com mid-text.

URL with a trailing period: https://genesys.com/asdf. Or https://genesys.com/asdf/. Or even https://genesys.com/asdf.html. Or even this nonsense: https://a.bc.?;,!

Not parsing escaped [brackets \\[inside\\] links](#asdf).

This is not a link because it's not escaped: \\[brackets \\[inside\\] NOT links](#asdf). why \] ok.

Links with whitespace [ why do you do this   ](    #somewhere  ).

and alt text [     lots more poor spacing   ](    #somewhere   "  goes to somewhere's special. '    ).
`;

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
		{
			type: 'paragraph',
			children: [
				{
					text: 'Parsing a URL as a link ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'https://genesys.com',
						},
					],
					href: 'https://genesys.com',
				},
				{
					text: ' mid-text.',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'URL with a trailing period: ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'https://genesys.com/asdf',
						},
					],
					href: 'https://genesys.com/asdf',
				},
				{
					text: '. Or ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'https://genesys.com/asdf/',
						},
					],
					href: 'https://genesys.com/asdf/',
				},
				{
					text: '. Or even ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'https://genesys.com/asdf.html',
						},
					],
					href: 'https://genesys.com/asdf.html',
				},
				{
					text: '. Or even this nonsense: ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'https://a.bc',
						},
					],
					href: 'https://a.bc',
				},
				{
					text: '.?;,!',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'Not parsing escaped ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'brackets [inside] links',
						},
					],
					href: '#asdf',
					title: 'Link',
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
					text: "This is not a link because it's not escaped: [brackets [inside] NOT links](#asdf). why ] ok.",
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'Links with whitespace ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'why do you do this',
						},
					],
					href: '#somewhere',
					title: 'Link',
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
					text: 'and alt text ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'lots more poor spacing',
						},
					],
					href: '#somewhere',
					title: "goes to somewhere's special.",
				},
				{
					text: '.',
				},
			],
			indentation: 0,
		},
	],
};
