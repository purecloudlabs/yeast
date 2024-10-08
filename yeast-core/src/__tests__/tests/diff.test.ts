import {
	YeastBlockNodeTypes,
	YeastInlineNodeTypes,
	ContentGroupType,
	DiffType,
	HorizontalRuleNode,
	LinkNode,
	YeastNode,
	ContentGroupNode,
	ContentGroupItemNode,
	DocumentNode,
	HeadingNode,
	TableNode,
	CalloutNode,
	BlockCodeNode,
	DiffSource,
	ImageNode,
} from '../..';

import { diff } from '../../helpers/diff';

const publishedNodeBasic: DocumentNode = {
	type: YeastBlockNodeTypes.Document,
	children: [
		{
			type: YeastBlockNodeTypes.Heading,
			level: 1,
			children: [
				{
					text: 'Old Title',
				},
			],
		} as HeadingNode,
		{
			type: YeastBlockNodeTypes.Paragraph,
			children: [
				{
					text: 'I ride a bicycle',
				},
			],
		},
		{
			type: YeastBlockNodeTypes.Heading,
			level: 1,
			children: [
				{
					text: 'Old Heading',
				},
			],
		} as HeadingNode,
		{
			type: YeastBlockNodeTypes.Heading,
			level: 2,
			children: [
				{
					text: 'This will be removed',
				},
			],
		} as HeadingNode,
	],
	title: 'Doc',
};

const draftNodeBasic: DocumentNode = {
	type: YeastBlockNodeTypes.Document,
	children: [
		{
			type: YeastBlockNodeTypes.Heading,
			level: 1,
			children: [
				{
					text: 'New Title',
				},
			],
		} as HeadingNode,
		{
			type: YeastBlockNodeTypes.Paragraph,
			children: [
				{
					text: 'You fly a plane',
				},
			],
		},
		{
			type: YeastBlockNodeTypes.Heading,
			level: 1,
			children: [
				{
					text: 'New Heading',
				},
			],
		} as HeadingNode,
		{
			type: YeastBlockNodeTypes.Blockquote,
			children: [
				{
					type: YeastBlockNodeTypes.Paragraph,
					children: [
						{
							text: '100% new',
						},
					],
				},
			],
		},
	],
	title: 'New Doc',
};

const publishedNodeAdvanced: DocumentNode = {
	type: YeastBlockNodeTypes.Document,
	children: [
		{
			type: YeastBlockNodeTypes.Callout,
			alertType: 'warning',
			title: 'Callout title',
			children: [
				{
					type: YeastBlockNodeTypes.Paragraph,
					children: [
						{
							text: 'Callout',
						},
					],
				},
			],
		} as CalloutNode,
		{
			type: YeastBlockNodeTypes.Table,
			indentation: 2,
			children: [
				{
					type: YeastBlockNodeTypes.TableRow,
					children: [
						{
							type: YeastBlockNodeTypes.TableCell,
							children: [
								{
									text: 'rock',
								},
							],
						},
						{
							type: YeastBlockNodeTypes.TableCell,
							children: [
								{
									text: 'paper',
								},
							],
						},
						{
							type: YeastBlockNodeTypes.TableCell,
							children: [
								{
									text: 'scissors',
								},
							],
						},
					],
				},
				{
					type: YeastBlockNodeTypes.TableRow,
					children: [
						{
							type: YeastBlockNodeTypes.TableCell,
							children: [
								{
									text: 'apples',
								},
							],
						},
						{
							type: YeastBlockNodeTypes.TableCell,
							children: [
								{
									text: 'oranges',
								},
							],
						},
						{
							type: YeastBlockNodeTypes.TableCell,
							children: [
								{
									text: 'bananas',
								},
							],
						},
					],
				},
			],
		} as TableNode,
		{
			type: YeastBlockNodeTypes.Paragraph,
			children: [
				{
					type: YeastInlineNodeTypes.Bold,
					children: [
						{
							text: 'Old bold',
						},
					],
				},
			],
		},
		{
			type: YeastInlineNodeTypes.Code,
			children: [
				{
					text: 'String[] strArr = new String[] {\\"Mary\\", \\"Jones\\"}',
				},
			],
		},
		{
			type: YeastBlockNodeTypes.Paragraph,
			children: [
				{
					type: YeastInlineNodeTypes.Link,
					href: 'https://google.com',
					title: 'google',
					children: [
						{
							text: 'google',
						},
					],
				} as LinkNode,
			],
		},
		{
			type: YeastBlockNodeTypes.HorizontalRule,
		} as HorizontalRuleNode,
		{
			type: YeastBlockNodeTypes.Blockquote,
			children: [
				{
					text: 'All dogs go to heaven',
				},
			],
		},
		{
			type: YeastBlockNodeTypes.Code,
			value: 'foo()',
			title: 'foo',
			language: 'java',
		} as YeastNode,
		{
			type: YeastBlockNodeTypes.ContentGroup,
			groupType: ContentGroupType.accordion,
			children: [
				{
					type: YeastBlockNodeTypes.ContentGroupItem,
					title: 'movie 1',
					children: [
						{
							text: 'Metropolis',
						},
					],
				} as ContentGroupItemNode,
				{
					type: YeastBlockNodeTypes.ContentGroupItem,
					title: 'movie 2',
					children: [
						{
							text: 'The Abominable Dr. Phibes',
						},
					],
				} as ContentGroupItemNode,
			],
		} as ContentGroupNode,
	],
	title: 'Doc',
};

const draftNodeAdvanced: DocumentNode = {
	type: YeastBlockNodeTypes.Document,
	children: [
		{
			type: YeastBlockNodeTypes.Callout,
			alertType: 'info',
			title: 'New title',
			children: [
				{
					type: YeastBlockNodeTypes.Paragraph,
					children: [
						{
							text: 'Call',
						},
					],
				},
			],
		} as CalloutNode,
		{
			type: YeastBlockNodeTypes.Table,
			indentation: 2,
			children: [
				{
					type: YeastBlockNodeTypes.TableRow,
					children: [
						{
							type: YeastBlockNodeTypes.TableCell,
							children: [
								{
									text: 'rock',
								},
							],
						},
						{
							type: YeastBlockNodeTypes.TableCell,
							children: [
								{
									text: 'paper',
								},
							],
						},
						{
							type: YeastBlockNodeTypes.TableCell,
							children: [
								{
									text: 'scissors',
								},
							],
						},
					],
				},
			],
		} as TableNode,
		{
			type: YeastBlockNodeTypes.Paragraph,
			children: [
				{
					type: YeastInlineNodeTypes.Bold,
					children: [
						{
							text: 'New bold',
						},
					],
				},
			],
		},
		{
			type: YeastInlineNodeTypes.Code,
			children: [
				{
					text: 'String[] strArr = new String[] {\\"Mary\\", \\"Rae\\", \\"Shaw\\"}',
				},
			],
		},
		{
			type: YeastBlockNodeTypes.Paragraph,
			children: [
				{
					type: YeastInlineNodeTypes.Link,
					href: 'https://genesys.com',
					title: 'Link to Genesys',
					children: [
						{
							text: 'Genesys',
						},
					],
				} as LinkNode,
			],
		},
		{
			type: YeastBlockNodeTypes.Blockquote,
			children: [
				{
					text: 'All dogs go to heaven',
				},
			],
		},
		{
			type: YeastBlockNodeTypes.Code,
			value: 'bar()',
			title: 'bar',
			language: 'java',
		} as YeastNode,
		{
			type: YeastBlockNodeTypes.ContentGroup,
			groupType: ContentGroupType.accordion,
			children: [
				{
					type: YeastBlockNodeTypes.ContentGroupItem,
					groupType: ContentGroupType.accordion,
					title: 'movie 1',
					children: [
						{
							text: 'North by Northwest',
						},
					],
				} as ContentGroupItemNode,
				{
					type: YeastBlockNodeTypes.ContentGroupItem,
					groupType: ContentGroupType.accordion,
					title: 'movie 2',
					children: [
						{
							text: 'Caddyshack',
						},
					],
				} as ContentGroupItemNode,
			],
		} as ContentGroupNode,
		{
			type: YeastBlockNodeTypes.Code,
			value: '{\\n \\"this\\": \\"is new\\"\\n}',
			children: [],
		} as BlockCodeNode,
	],
	title: 'New Doc',
};

const publishedNodeWithImage: DocumentNode = {
	type: YeastBlockNodeTypes.Document,
	children: [
		{
			type: YeastInlineNodeTypes.Image,
			src: '../asset.jpg',
			title: 'original',
		} as ImageNode,
	],
	title: 'Doc',
};
const draftNodeWithImage: DocumentNode = {
	type: YeastBlockNodeTypes.Document,
	children: [
		{
			type: YeastInlineNodeTypes.Image,
			src: '../asset.jpg',
			alt: 'new',
		} as ImageNode,
	],
	title: 'Doc',
};

test('successfully performs basic diff', () => {
	const doc: DocumentNode = diff(publishedNodeBasic, draftNodeBasic);

	expect(doc.children.length).toEqual(5);
	expect(doc.hasDiff).toBeTruthy();
	expect(doc.diffType).toBe(DiffType.Modified);

	expect(doc.children[0].type).toBe(YeastBlockNodeTypes.Heading);
	expect(doc.children[0].hasDiff).toBeTruthy();
	expect(doc.children[0].containsTextModification).toBeTruthy();
	expect(doc.children[0].diffType).toBe(DiffType.Modified);

	expect(doc.children[1].type).toBe(YeastBlockNodeTypes.Paragraph);
	expect(doc.children[1].hasDiff).toBeTruthy();
	expect(doc.children[1].containsTextModification).toBeTruthy();
	expect(doc.children[1].diffType).toBe(DiffType.Modified);

	expect(doc.children[2].type).toBe(YeastBlockNodeTypes.Heading);
	expect(doc.children[2].hasDiff).toBeTruthy();
	expect(doc.children[2].containsTextModification).toBeTruthy();
	expect(doc.children[2].diffType).toBe(DiffType.Modified);

	expect(doc.children[3].type).toBe(YeastBlockNodeTypes.Heading);
	expect(doc.children[3].hasDiff).toBeTruthy();
	expect(doc.children[3].diffSource).toBe(DiffSource.Old);
	expect(doc.children[3].diffType).toBe(DiffType.Modified);

	expect(doc.children[4].type).toBe(YeastBlockNodeTypes.Blockquote);
	expect(doc.children[4].hasDiff).toBeTruthy();
	expect(doc.children[4].diffSource).toBe(DiffSource.New);
	expect(doc.children[4].diffType).toBe(DiffType.Modified);
});

test('successful diff with no published node', () => {
	const doc: DocumentNode = diff(undefined, draftNodeBasic);

	expect(doc.hasDiff).toBeTruthy();
	expect(doc.children.length).toEqual(4);
	expect(doc.diffType).toBe(DiffType.Added);
});

test('correctly handles documents with no diff', () => {
	const doc: DocumentNode = diff(draftNodeBasic, draftNodeBasic);

	expect(doc.hasDiff).toBeFalsy();
	expect(doc.children.length).toEqual(4);
});

test('successfully performs advanced diff', () => {
	const doc: DocumentNode = diff(publishedNodeAdvanced, draftNodeAdvanced);

	expect(doc.hasDiff).toBeTruthy();
	expect(doc.diffType).toBe(DiffType.Modified);
	expect(doc.children.length).toBe(11);

	expect(doc.children[0].type).toBe(YeastBlockNodeTypes.Callout);
	expect(doc.children[0].hasDiff).toBeTruthy();
	expect(doc.children[0].diffType).toBe(DiffType.Modified);
	expect(doc.children[0].isTextModification).toBeTruthy();
	expect(doc.children[0].diffPivots['title']).toBe(13);
	expect(doc.children[0]['title']).toBe('Callout title New title');

	expect(doc.children[1].type).toBe(YeastBlockNodeTypes.Table);
	expect(doc.children[1].hasDiff).toBeTruthy();
	expect(doc.children[1].diffType).toBe(DiffType.Modified);
	expect(doc.children[1].diffSource).toBe(DiffSource.Old);

	expect(doc.children[2].type).toBe(YeastBlockNodeTypes.Table);
	expect(doc.children[2].hasDiff).toBeTruthy();
	expect(doc.children[2].diffType).toBe(DiffType.Modified);
	expect(doc.children[2].diffSource).toBe(DiffSource.New);

	expect(doc.children[3].type).toBe(YeastBlockNodeTypes.Paragraph);
	expect(doc.children[3].hasDiff).toBeTruthy();
	expect(doc.children[3].diffType).toBe(DiffType.Modified);
	expect(doc.children[3].containsTextModification).toBeTruthy();

	expect(doc.children[4].type).toBe(YeastInlineNodeTypes.Code);
	expect(doc.children[4].hasDiff).toBeTruthy();
	expect(doc.children[4].diffType).toBe(DiffType.Modified);
	expect(doc.children[4].containsTextModification).toBeTruthy();

	expect(doc.children[5].type).toBe(YeastBlockNodeTypes.Paragraph);
	expect(doc.children[5].hasDiff).toBeTruthy();
	expect(doc.children[5].diffType).toBe(DiffType.Modified);
	expect(doc.children[5].containsTextModification).toBeTruthy();

	expect(doc.children[6].type).toBe(YeastBlockNodeTypes.HorizontalRule);
	expect(doc.children[6].hasDiff).toBeTruthy();
	expect(doc.children[6].diffType).toBe(DiffType.Removed);

	expect(doc.children[7].type).toBe(YeastBlockNodeTypes.Blockquote);
	expect(doc.children[7].hasDiff).toBeFalsy();

	expect(doc.children[8].type).toBe(YeastBlockNodeTypes.Code);
	expect(doc.children[8].hasDiff).toBeTruthy();
	expect(doc.children[8].diffType).toBe(DiffType.Modified);
	expect(doc.children[8].isTextModification).toBeTruthy();
	expect(doc.children[8].diffPivots['title']).toBe(3);
	expect(doc.children[8]['title']).toBe('foo bar');

	expect(doc.children[9].type).toBe(YeastBlockNodeTypes.ContentGroup);
	expect(doc.children[9].hasDiff).toBeTruthy();
	expect(doc.children[9].diffType).toBe(DiffType.Modified);
	expect(doc.children[9].containsTextModification).toBeTruthy();

	expect(doc.children[10].type).toBe(YeastBlockNodeTypes.Code);
	expect(doc.children[10].hasDiff).toBeTruthy();
	expect(doc.children[10].diffType).toBe(DiffType.Added);
});

test('successfully diffs nodes with images', () => {
	const doc: DocumentNode = diff(publishedNodeWithImage, draftNodeWithImage);

	expect(doc.children.length).toBe(2);

	const oldImage: ImageNode = doc.children[0] as ImageNode;
	const newImage: ImageNode = doc.children[1] as ImageNode;

	expect(oldImage.type).toBe(YeastInlineNodeTypes.Image);
	expect(oldImage.src).toBe('../asset.jpg');
	expect(oldImage.title).toBe('original');
	expect(oldImage.hasDiff).toBeTruthy();
	expect(oldImage.diffType).toBe('modified');
	expect(oldImage.diffSource).toBe('old');
	expect(oldImage.containsTextModification).toBeFalsy();

	expect(newImage.type).toBe(YeastInlineNodeTypes.Image);
	expect(newImage.src).toBe('../asset.jpg');
	expect(newImage.alt).toBe('new');
	expect(newImage.hasDiff).toBeTruthy();
	expect(newImage.diffType).toBe('modified');
	expect(newImage.diffSource).toBe('new');
	expect(newImage.containsTextModification).toBeFalsy();
});
