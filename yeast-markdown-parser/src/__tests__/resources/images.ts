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
			type: 'image',
			src: 'image.jpg',
			title: '',
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
			type: 'image',
			src: '/path/to/image.jpg',
			title: '',
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
			type: 'image',
			src: '/path/to/image.jpg',
			title: 'title text',
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
			type: 'image',
			src: '/path/to/image.jpg',
			alt: 'alternative text',
			title: 'title text',
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
			type: 'image',
			src: '/path/to/image.jpg',
			alt: 'alternative text',
			title: '',
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
			type: 'image',
			src: 'image.jpg',
			title: '',
		},
		{
			type: 'image',
			src: '/path/to/image.jpg',
			title: '',
		},
		{
			type: 'image',
			src: '/path/to/image.jpg',
			title: 'title text',
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
					text: 'This is some text before the image:',
				},
			],
			indentation: 0,
		},
		{
			type: 'image',
			src: '/path/to/image.jpg',
			alt: 'alternative text',
			title: 'title text',
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
			type: 'image',
			src: '/path/to/image.jpg',
			alt: 'alternative text',
			title: 'title text',
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'and then some text',
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
					text: 'This is some text before the image:',
				},
			],
			indentation: 0,
		},
		{
			type: 'image',
			src: '/path/to/image.jpg',
			alt: 'alternative text',
			title: 'title text',
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'and then some text',
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
					text: 'This is some text before the image:',
				},
			],
			indentation: 0,
		},
		{
			type: 'image',
			src: '/path/to/image.jpg',
			alt: 'alternative text',
			title: 'title text',
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'and then some text',
				},
			],
			indentation: 0,
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
					text: 'This is some text before the image:',
				},
			],
			indentation: 0,
		},
		{
			type: 'image',
			src: '/path/to/image.jpg',
			alt: 'alternative text',
			title: 'title text',
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'and then some text',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'more text on the next line without a line break',
				},
			],
			indentation: 0,
		},
	],
};
