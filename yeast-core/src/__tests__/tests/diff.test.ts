global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

import * as fs from 'fs-extra';

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
import { diff, mapAnchorPath } from '../../helpers/diff';

const publishedImg = require('../resources/content/published-img.json');
const draftImg = require('../resources/content/draft-img.json');

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
	expect(doc.children[0].containsDiff).toBeTruthy();
	expect(doc.children[0].diffType).toBe(DiffType.Modified);

	expect(doc.children[1].type).toBe(YeastBlockNodeTypes.Paragraph);
	expect(doc.children[1].hasDiff).toBeTruthy();
	expect(doc.children[1].containsDiff).toBeTruthy();
	expect(doc.children[1].diffType).toBe(DiffType.Modified);

	expect(doc.children[2].type).toBe(YeastBlockNodeTypes.Heading);
	expect(doc.children[2].hasDiff).toBeTruthy();
	expect(doc.children[2].containsDiff).toBeTruthy();
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

test('maps anchor path when node exists in same position', () => {
	const result = mapAnchorPath('1', publishedNodeBasic, draftNodeBasic);
	expect(result.newPath).toBe(undefined);
	expect(result.isOrphaned).toBe(true); 
});

test('successfully performs advanced diff', () => {
	const doc: DocumentNode = diff(publishedNodeAdvanced, draftNodeAdvanced);

	// debugAST('successfully performs advanced diff', doc)

	expect(doc.hasDiff).toBeTruthy();
	expect(doc.diffType).toBe(DiffType.Modified);
	expect(doc.children.length).toBe(10);

	expect(doc.children[0].type).toBe(YeastBlockNodeTypes.Callout);
	expect(doc.children[0].hasDiff).toBeTruthy();
	expect(doc.children[0].diffType).toBe(DiffType.Modified);
	expect(doc.children[0].isTextModification).toBeTruthy();
	expect(doc.children[0].diffPivots['title']).toBe(13);
	expect(doc.children[0]['title']).toBe('Callout title New title');

	expect(doc.children[1].type).toBe(YeastBlockNodeTypes.Table);
	expect(doc.children[1].hasDiff).toBeTruthy();
	expect(doc.children[1].diffType).toBe(DiffType.Modified);
	expect(doc.children[1].children.length).toBe(2)
	expect(doc.children[1].children[1].diffType).toBe(DiffType.Removed)

	expect(doc.children[2].type).toBe(YeastBlockNodeTypes.Paragraph);
	expect(doc.children[2].hasDiff).toBeTruthy();
	expect(doc.children[2].diffType).toBe(DiffType.Modified);
	expect(doc.children[2].containsDiff).toBeTruthy();

	expect(doc.children[3].type).toBe(YeastInlineNodeTypes.Code);
	expect(doc.children[3].hasDiff).toBeTruthy();
	expect(doc.children[3].diffType).toBe(DiffType.Modified);
	expect(doc.children[3].containsDiff).toBeTruthy();

	expect(doc.children[4].type).toBe(YeastBlockNodeTypes.Paragraph);
	expect(doc.children[4].hasDiff).toBeTruthy();
	expect(doc.children[4].diffType).toBe(DiffType.Modified);
	expect(doc.children[4].containsDiff).toBeTruthy();

	expect(doc.children[5].type).toBe(YeastBlockNodeTypes.HorizontalRule);
	expect(doc.children[5].hasDiff).toBeTruthy();
	expect(doc.children[5].diffType).toBe(DiffType.Removed);

	expect(doc.children[6].type).toBe(YeastBlockNodeTypes.Blockquote);
	expect(doc.children[6].hasDiff).toBeFalsy();

	expect(doc.children[7].type).toBe(YeastBlockNodeTypes.Code);
	expect(doc.children[7].hasDiff).toBeTruthy();
	expect(doc.children[7].diffType).toBe(DiffType.Modified);
	expect(doc.children[7].isTextModification).toBeTruthy();
	expect(doc.children[7].diffPivots['title']).toBe(3);
	expect(doc.children[7]['title']).toBe('foo bar');

	expect(doc.children[8].type).toBe(YeastBlockNodeTypes.ContentGroup);
	expect(doc.children[8].hasDiff).toBeTruthy();
	expect(doc.children[8].diffType).toBe(DiffType.Modified);
	expect(doc.children[8].containsDiff).toBeTruthy();

	expect(doc.children[9].type).toBe(YeastBlockNodeTypes.Code);
	expect(doc.children[9].hasDiff).toBeTruthy();
	expect(doc.children[9].diffType).toBe(DiffType.Added);
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
	expect(oldImage.containsDiff).toBeFalsy();

	expect(newImage.type).toBe(YeastInlineNodeTypes.Image);
	expect(newImage.src).toBe('../asset.jpg');
	expect(newImage.alt).toBe('new');
	expect(newImage.hasDiff).toBeTruthy();
	expect(newImage.diffType).toBe('modified');
	expect(newImage.diffSource).toBe('new');
	expect(newImage.containsDiff).toBeFalsy();
});

test('successfully diffs nodes with image removal', () => {
	const doc: DocumentNode = diff(publishedImg, draftImg);
	const children = doc.children;

	expect(children.length).toBe(2)

	// check containing paragraph diff
	expect(children[0].hasDiff).toBeTruthy();
	expect(children[0].containsDiff).toBeTruthy();
	expect(children[0].diffType).toBe(DiffType.Modified);

	// check removed image diff
	expect(children[0].children[0].hasDiff).toBeTruthy();
	expect(children[0].children[0].diffType).toBe(DiffType.Removed);

	// check unchanged final node
	expect(children[1].hasDiff).toBeFalsy();

	// debugAST('successfully diffs nodes with images 2', doc);
});

// debugAST prints the AST document to the console log and writes it to a local file in the debug directory
function debugAST(testName: string, ast: DocumentNode) {
	// console.log(JSON.stringify(ast, null, 2));
	if (!fs.existsSync('./debug/')) {
		fs.mkdirSync('debug');
	}
	fs.writeFileSync(`./debug/${(testName || 'unnamed').replace(/[^a-z0-9]/gi, '_')}.json`, JSON.stringify(ast, null, 2));
}
