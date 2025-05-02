const GENERAL_DATA_MARKDOWN = `# Main Heading
## Second Level Heading
### Third Level Heading
#### Fourth Level Heading
##### Fifth Level Heading
###### Sixth Level Heading
####### Seventh Level Heading

This is a paragraph with **bold text**, _italic text_, and **_bold italic_** text.

* Unordered list item 1
* Unordered list item 2
  * Nested list item
  * Another nested item

1. Ordered list item 1
2. Ordered list item 2
   1. Nested ordered item
   2. Another nested item

> This is a blockquote
> It can span multiple lines

\`\`\`typescript
// This is a code block
function hello(name: string) {
    console.log(\`Hello, \${name}!\`);
}
\`\`\`

This is an \`inline code\` example.

:::info
This is a _callout_.

With a second line of text.
:::

%%% Tab 1
This is a tab.

%%% Tab 2
More stuff in the second tab.
%%%

---

This is [Link text](https://example.com) to go somewhere.

![Image alt text](https://example.com/image.jpg)

| Table Header 1 | Table Header 2 |
|---------------|----------------|
| Row 1 Cell 1  | Row 1 Cell 2  |
| Row 2 Cell 1  | Row 2 Cell 2  |

~Strikethrough text~

<yeast:OpenAPIExplorer search="true" showAll="true" />
`;

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
									text: 'This is a tab.',
								},
							],
							indentation: 0,
						},
					],
					title: 'Tab 1',
				},
				{
					type: 'contentgroupitem',
					groupType: 'tabbedcontent',
					children: [
						{
							type: 'paragraph',
							children: [
								{
									text: 'More stuff in the second tab.',
								},
							],
							indentation: 0,
						},
					],
					title: 'Tab 2',
				},
			],
			groupType: 'tabbedcontent',
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
							text: 'Strikethrough text',
						},
					],
				},
			],
			indentation: 0,
		},
		{
			search: 'true',
			showAll: 'true',
			type: 'OpenAPIExplorer',
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
<p>This is a paragraph with <strong>bold text</strong>, <i>italic text</i>, and <strong><i>bold italic</i></strong> text.</p>
<ul><li>Unordered list item 1</li><li>Unordered list item 2</li><ul><li>Nested list item</li><li>Another nested item</li></ul><li>Ordered list item 1</li><li>Ordered list item 2</li><ol><li>Nested ordered item</li><li>Another nested item</li></ol></ul>
<blockquote><p>This is a blockquote It can span multiple lines</p></blockquote>
<div><pre><code class="language-typescript">// This is a code block
function hello(name: string) {
    console.log(\`Hello, \${name}!\`);
}</code></pre></div>
<p>This is an <code>inline code</code> example.</p>
<div class="callout callout-info"><p>This is a <i>callout</i>.</p><p>With a second line of text.</p></div>
<div><div class="content-group-tabbedcontent"><p>Tab 1</p><p>This is a tab.</p></div><div class="content-group-tabbedcontent"><p>Tab 2</p><p>More stuff in the second tab.</p></div></div>
<hr>
<p>This is <a href="https://example.com" title="Link">Link text</a> to go somewhere.</p>
<p><img title="Image alt text" src="https://example.com/image.jpg"></p>
<table><thead><tr><td style="text-align: left;"><p>Table Header 1</p></td><td style="text-align: left;"><p>Table Header 2</p></td></tr></thead><tbody><tr><td style="text-align: left;"><p>Row 1 Cell 1</p></td><td style="text-align: left;"><p>Row 1 Cell 2</p></td></tr><tr><td style="text-align: left;"><p>Row 2 Cell 1</p></td><td style="text-align: left;"><p>Row 2 Cell 2</p></td></tr></tbody></table>
<p><s>Strikethrough text</s></p>
<pre><code>&lt;yeast:OpenAPIExplorer search="true" showAll="true"/&gt;</code></pre>`;
