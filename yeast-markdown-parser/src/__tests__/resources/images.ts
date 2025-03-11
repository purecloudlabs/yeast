export const IMAGE_MARKDOWN = `---
title: Image test page
---

# Basic image

![](image.jpg)

## Image with path

![](/path/to/image.jpg)

## Image with title text

![title text](/path/to/image.jpg)

## Image with alt text

![title text](/path/to/image.jpg "alternative text")

## No title text, has alt text

![](/path/to/image.jpg "alternative text")

## Three images with varying whitespace

	![](image.jpg)

		  	![](/path/to/image.jpg)  

    ![title text](/path/to/image.jpg)   

## Image with leading inline text

This is some text before the image: ![title text](/path/to/image.jpg "alternative text")

## Image with trailing inline text

![title text](/path/to/image.jpg "alternative text") and then some text

## Image with leading and trailing text

This is some text before the image: ![title text](/path/to/image.jpg "alternative text") and then some text

## Image with inline text and odd whitespace

    	This is some text before the image: ![title text](/path/to/image.jpg "alternative text") and then some text    

## Image with leading and trailing text and text on the next line

This is some text before the image: ![title text](/path/to/image.jpg "alternative text") and then some text
more text on the next line without a line break
`;

export const IMAGE_AST = {
	type: 'document',
	title: 'Image test page',
	children: [
		{
			type: 'heading',
			children: [
				{
					text: 'Basic image',
				},
			],
			level: 1,
			id: 'basic-image',
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'image',
					src: 'image.jpg',
					title: '',
				},
			],
			indentation: 0,
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Image with path',
				},
			],
			level: 2,
			id: 'image-with-path',
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'image',
					src: '/path/to/image.jpg',
					title: '',
				},
			],
			indentation: 0,
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Image with title text',
				},
			],
			level: 2,
			id: 'image-with-title-text',
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'image',
					src: '/path/to/image.jpg',
					title: 'title text',
				},
			],
			indentation: 0,
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Image with alt text',
				},
			],
			level: 2,
			id: 'image-with-alt-text',
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'image',
					src: '/path/to/image.jpg',
					alt: 'alternative text',
					title: 'title text',
				},
			],
			indentation: 0,
		},
		{
			type: 'heading',
			children: [
				{
					text: 'No title text, has alt text',
				},
			],
			level: 2,
			id: 'no-title-text--has-alt-text',
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'image',
					src: '/path/to/image.jpg',
					alt: 'alternative text',
					title: '',
				},
			],
			indentation: 0,
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Three images with varying whitespace',
				},
			],
			level: 2,
			id: 'three-images-with-varying-whitespace',
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'image',
					src: 'image.jpg',
					title: '',
				},
			],
			indentation: 1,
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'image',
					src: '/path/to/image.jpg',
					title: '',
				},
			],
			indentation: 4,
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'image',
					src: '/path/to/image.jpg',
					title: 'title text',
				},
			],
			indentation: 2,
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Image with leading inline text',
				},
			],
			level: 2,
			id: 'image-with-leading-inline-text',
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'This is some text before the image: ',
				},
				{
					type: 'image',
					src: '/path/to/image.jpg',
					alt: 'alternative text',
					title: 'title text',
				},
			],
			indentation: 0,
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Image with trailing inline text',
				},
			],
			level: 2,
			id: 'image-with-trailing-inline-text',
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'image',
					src: '/path/to/image.jpg',
					alt: 'alternative text',
					title: 'title text',
				},
				{
					text: ' and then some text',
				},
			],
			indentation: 0,
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Image with leading and trailing text',
				},
			],
			level: 2,
			id: 'image-with-leading-and-trailing-text',
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'This is some text before the image: ',
				},
				{
					type: 'image',
					src: '/path/to/image.jpg',
					alt: 'alternative text',
					title: 'title text',
				},
				{
					text: ' and then some text',
				},
			],
			indentation: 0,
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Image with inline text and odd whitespace',
				},
			],
			level: 2,
			id: 'image-with-inline-text-and-odd-whitespace',
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'This is some text before the image: ',
				},
				{
					type: 'image',
					src: '/path/to/image.jpg',
					alt: 'alternative text',
					title: 'title text',
				},
				{
					text: ' and then some text',
				},
			],
			indentation: 3,
		},
		{
			type: 'heading',
			children: [
				{
					text: 'Image with leading and trailing text and text on the next line',
				},
			],
			level: 2,
			id: 'image-with-leading-and-trailing-text-and-text-on-the-next-line',
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'This is some text before the image: ',
				},
				{
					type: 'image',
					src: '/path/to/image.jpg',
					alt: 'alternative text',
					title: 'title text',
				},
				{
					text: ' and then some text more text on the next line without a line break',
				},
			],
			indentation: 0,
		},
	],
};

export const IMAGE_LINKS_MARKDOWN = `---
title: Platform API Client SDK - Java
---

## Resources

[![platform-client-v2](https://maven-badges.herokuapp.com/maven-central/com.mypurecloud/platform-client-v2/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.mypurecloud/platform-client-v2)

Some _italics before_ the [![Release Notes Badge](https://developer-content.genesys.cloud/images/sdk-release-notes.png "RN image alt text")](https://github.com/MyPureCloud/platform-client-sdk-java/blob/master/releaseNotes.md 'link alt text here') **bold after** and [![Another Image](https://genesys.com/fake/image.png)](https://genesys.com "Goes to Genesys") also inline.

* **Documentation** https://developer.genesys.cloud/devapps/sdk/docexplorer/purecloudjava/
* **Source** https://github.com/MyPureCloud/platform-client-sdk-java`;

export const IMAGE_LINKS_AST = {
	type: 'document',
	title: 'Platform API Client SDK - Java',
	children: [
		{
			type: 'heading',
			children: [
				{
					text: 'Resources',
				},
			],
			level: 2,
			id: 'resources',
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'link',
					children: [
						{
							type: 'image',
							src: 'https://maven-badges.herokuapp.com/maven-central/com.mypurecloud/platform-client-v2/badge.svg',
							title: 'platform-client-v2',
						},
					],
					href: 'https://maven-badges.herokuapp.com/maven-central/com.mypurecloud/platform-client-v2',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'Some ',
				},
				{
					type: 'italic',
					children: [
						{
							text: 'italics before',
						},
					],
				},
				{
					text: ' the ',
				},
				{
					type: 'link',
					children: [
						{
							type: 'image',
							src: 'https://developer-content.genesys.cloud/images/sdk-release-notes.png',
							alt: 'RN image alt text',
							title: 'Release Notes Badge',
						},
					],
					href: 'https://github.com/MyPureCloud/platform-client-sdk-java/blob/master/releaseNotes.md',
					title: 'link alt text here',
				},
				{
					text: ' ',
				},
				{
					type: 'bold',
					children: [
						{
							text: 'bold after',
						},
					],
				},
				{
					text: ' and ',
				},
				{
					type: 'link',
					children: [
						{
							type: 'image',
							src: 'https://genesys.com/fake/image.png',
							title: 'Another Image',
						},
					],
					href: 'https://genesys.com',
					title: 'Goes to Genesys',
				},
				{
					text: ' also inline.',
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
							type: 'bold',
							children: [
								{
									text: 'Documentation',
								},
							],
						},
						{
							text: ' ',
						},
						{
							type: 'link',
							children: [
								{
									text: 'https://developer.genesys.cloud/devapps/sdk/docexplorer/purecloudjava/',
								},
							],
							href: 'https://developer.genesys.cloud/devapps/sdk/docexplorer/purecloudjava/',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							type: 'bold',
							children: [
								{
									text: 'Source',
								},
							],
						},
						{
							text: ' ',
						},
						{
							type: 'link',
							children: [
								{
									text: 'https://github.com/MyPureCloud/platform-client-sdk-java',
								},
							],
							href: 'https://github.com/MyPureCloud/platform-client-sdk-java',
						},
					],
				},
			],
			ordered: false,
			level: 0,
		},
	],
};
