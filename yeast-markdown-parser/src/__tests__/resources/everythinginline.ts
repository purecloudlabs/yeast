export const EVERYTHING_INLINE_AST = {
	type: 'document',
	title: 'Default Page Title',
	children: [
		{
			type: 'paragraph',
			children: [
				{
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
				},
				{
					type: 'strikethrough',
					children: [
						{
							text: 'Nulla viverra',
						},
					],
				},
				{
					text: ' tortor non diam , non ',
				},
				{
					type: 'inlinecode',
					children: [
						{
							text: 'func()',
						},
					],
				},
				{
					text: ' fringilla nunc vestibulum. ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'Donec faucibus',
						},
					],
				},
				{
					text: ', odio a congue mollis, arcu nunc viverra leo, vitae viverra * turpis erat at quam. Pellentesque ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'foobar',
						},
					],
				},
				{
					text: ' hendrerit ligula neque, et tempus leo bibendum a.pulvinar, nunc a malesuada dignissim, nisi ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'vestibulum sapien a rutrum',
						},
					],
				},
				{
					text: ' diam maximus est,',
				},
				{
					type: 'inlinecode',
					children: [
						{
							text: 'function() ` ',
						},
					],
				},
				{
					text: ' a pharetra lorem tortor ac odio. Phasellus consectetur vestibulum sapien a rutrum. ',
				},
				{
					type: 'image',
					src: 'path/to/image.png',
					alt: 'Single quote text',
					title: 'Alt Text',
				},
				{
					text: ' Mauris vel ',
				},
				{
					type: 'image',
					src: 'path/to/image.png',
					alt: 'Double quote text',
					title: 'Alt Text',
				},
				{
					text: 'pharetra libero, sollicitudin volutpat erat. ',
				},
				{
					type: 'image',
					src: 'path/to/image.png',
					alt: 'image without alt text',
					title: '',
				},
				{
					text: 'Nulla pulvinar libero sed vehicula sagittis. Mauris at quam fringilla, feugiat ante eget, dictu`m nibh. Vivamus aliquet, ',
				},
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
					text: ' tellus et pretium tempus, odio enim dictum sem, ut ultricies ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'Api Central',
						},
					],
					href: 'https://apicentral.dev-genesys.cloud/index/',
					title: 'double quote text',
				},
				{
					text: ' nibh leo a dolor. ',
				},
				{
					type: 'link',
					children: [
						{
							text: 'https://apicentral.genesys.cloud/index/',
						},
					],
					href: 'https://apicentral.genesys.cloud/index/',
					title: 'link without alt text',
				},
				{
					text: ' Phasellus suscipit libero rhoncus, euismod nulla ac, venenatis eros*. ',
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
					text: 'This paragraph tests ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'non',
						},
					],
				},
				{
					text: 'standard touching use cases. Sin',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'gle',
						},
					],
				},
				{
					text: ' cha',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'racters',
						},
					],
				},
				{
					text: ' ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'i',
						},
					],
				},
				{
					text: 'n ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'wo',
						},
					],
				},
				{
					text: 'rds are f',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'o',
						},
					],
				},
				{
					text: 'r i',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'talic',
						},
					],
				},
				{
					text: 's. Characters * surrounded * by _ whitespace _ are ignored. Es_ca_ped ch*ar*acters a__re__ n**ot** **parsed out** _but_ *are* __rendered without__ escape characters. Dou',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'ble',
						},
					],
				},
				{
					text: ' cha',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'racters',
						},
					],
				},
				{
					text: ' ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'i',
						},
					],
				},
				{
					text: 'n ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'wo',
						},
					],
				},
				{
					text: 'rds are f',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'o',
						},
					],
				},
				{
					text: 'r b',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'ol',
						},
					],
				},
				{
					text: 'd.',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'Check ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'that _escaped text_ inside bold text',
						},
					],
				},
				{
					text: ' is reassembed into one text node.',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'Dangling escaped markers, like * or _ or |, should get unescaped.',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'bold',
					children: [
						{
							text: 'bold underscore',
						},
					],
				},
				{
					text: ' escape use cases 1) ',
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
					text: ' 2) ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'bold__text',
						},
					],
				},
				{
					text: ' 3) ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'bold_text',
						},
					],
				},
				{
					text: ' 4) __notbold',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'isbold',
						},
					],
				},
				{
					text: ' 5) ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'isbold',
						},
					],
				},
				{
					text: 'notbold__ 6) ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'b',
						},
					],
				},
				{
					text: ' ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'bb',
						},
					],
				},
				{
					text: ' ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'bbb',
						},
					],
				},
				{
					text: ' 7) ',
				},
				{
					type: 'bold',
					children: [
						{
							text: '_',
						},
					],
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'bold',
					children: [
						{
							text: 'bold asterisk',
						},
					],
				},
				{
					text: ' escape use cases 1) ',
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
					text: ' 2) ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'bold**text',
						},
					],
				},
				{
					text: ' 3) ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'bold*text',
						},
					],
				},
				{
					text: ' 4) **notbold',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'isbold',
						},
					],
				},
				{
					text: ' 5) ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'isbold',
						},
					],
				},
				{
					text: 'notbold** 6) ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'b',
						},
					],
				},
				{
					text: ' ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'bb',
						},
					],
				},
				{
					text: ' ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'bbb',
						},
					],
				},
				{
					text: ' 7) ',
				},
				{
					type: 'bold',
					children: [
						{
							text: '*',
						},
					],
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'italic',
					children: [
						{
							text: 'italic underscore',
						},
					],
				},
				{
					text: ' escape use cases 1) ',
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
					text: ' 2) ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'italic__text',
						},
					],
				},
				{
					text: ' 3) ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'italic_text',
						},
					],
				},
				{
					text: ' 4) _notitalic',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'isitalic',
						},
					],
				},
				{
					text: ' 5) ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'isitalic',
						},
					],
				},
				{
					text: 'notitalic_ 6) ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'b',
						},
					],
				},
				{
					text: ' ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'bb',
						},
					],
				},
				{
					text: ' ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'bbb',
						},
					],
				},
				{
					text: ' 7) ',
				},
				{
					type: 'italic',
					children: [
						{
							text: '_',
						},
					],
				},
				{
					text: ' 8) _ notitalic_ and _notitalic _ and _  _',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'italic',
					children: [
						{
							text: 'italic asterisk',
						},
					],
				},
				{
					text: ' escape use cases 1) ',
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
					text: ' 2) ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'italic**text',
						},
					],
				},
				{
					text: ' 3) ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'italic*text',
						},
					],
				},
				{
					text: ' 4) *notitalic',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'isitalic',
						},
					],
				},
				{
					text: ' 5) ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'isitalic',
						},
					],
				},
				{
					text: 'notitalic* 6) ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'b',
						},
					],
				},
				{
					text: ' ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'bb',
						},
					],
				},
				{
					text: ' ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'bbb',
						},
					],
				},
				{
					text: ' 7) ',
				},
				{
					type: 'italic',
					children: [
						{
							text: '*',
						},
					],
				},
				{
					text: ' 8) * notitalic* and *notitalic * and *  *',
				},
			],
			indentation: 0,
		},
		 {
            type: 'paragraph',
            children: [
                {
                    text: '09:00~17:00|America/Los_Angeles", "08:30~12:30|\\-05:00',
                },
            ],
            indentation: 0,
        }
	],
};
