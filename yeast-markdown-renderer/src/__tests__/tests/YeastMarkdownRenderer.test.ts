import { DocumentNode, isYeastTextNode, isYeastNode, YeastChild, YeastNode, YeastText } from 'yeast-core';
import { MarkdownRenderer } from '../../MarkdownRenderer';
import { GENERAL_DATA } from '../resources/GENERAL_DATA';
import { TABLE_DATA } from '../resources/TABLE_DATA';
import { LIST_DATA } from '../resources/LIST_DATA';
import { SIMPLE_TABLE_AST, SIMPLE_TABLE_MARKDOWN } from '../resources/SIMPLE_TABLE';
import { INLINE_CODE_AST, INLINE_CODE_MARKDOWN } from '../resources/INLINE_CODE_DATA';
import { UNDEFINED_DATA_AST, UNDEFINED_DATA_MARKDOWN } from '../resources/UNDEFINED_DATA';
import { IMAGE_DATA_AST, IMAGE_DATA_MARKDOWN } from '../resources/IMAGE_DATA';

test('testing  bold  node', () => {
	const boldRegex = /\*\*testing bold\*\*/gi;
	const markdownString = new MarkdownRenderer().renderMarkdown(GENERAL_DATA as DocumentNode);
	expect(markdownString.match(boldRegex).length).toBe(1);
});

test('expecting inlinecode node', () => {
	const regex = /`console.log\('code'\)`/g;
	const markdownString = new MarkdownRenderer().renderMarkdown(GENERAL_DATA as DocumentNode);
	expect(markdownString.match(regex).length).toBe(1);
});

test('expecting link node', () => {
	const regex = /[^!]\[(.+?)\]\((.+?)\)/gi;
	const markdownString = new MarkdownRenderer().renderMarkdown(GENERAL_DATA as DocumentNode);
	expect(markdownString.match(regex).length).toBe(1);
});

test('expecting strikethrough node', () => {
	const regex = /~~strikethroughContent~~/gi;
	const markdownString = new MarkdownRenderer().renderMarkdown(GENERAL_DATA as DocumentNode);
	expect(markdownString.match(regex).length).toBe(1);
});

//Testing Block types
test('expecting block code node', () => {
	const regex = /`{3,}(.*)\n([\s\S]+?\n)\s*`{3,}\n/gi;
	const markdownString = new MarkdownRenderer().renderMarkdown(GENERAL_DATA as DocumentNode);
	expect(markdownString.match(regex).length).toBe(1);
});

test('expecting callout type', () => {
	const regex = /:{3,}(.*)\n([\s\S]+?\n)\s*:{3,}\n/gi;
	const markdownString = new MarkdownRenderer().renderMarkdown(GENERAL_DATA as DocumentNode);
	expect(markdownString.match(regex).length).toBe(2);
});

test('expecting image node', () => {
	const regex = /!\[(.+?)\]\((.+?)\)/gi;
	const markdownString = new MarkdownRenderer().renderMarkdown(GENERAL_DATA as DocumentNode);
	expect(markdownString.match(regex).length).toBe(1);
});

test('expecting list node', () => {
	const regex = /(\d\.( .{3,}))|(-( .{3,}))/gi;
	const markdownString = new MarkdownRenderer().renderMarkdown(GENERAL_DATA as DocumentNode);
	expect(markdownString.match(regex).length).toBe(6);
});

test('expecting heading node', () => {
	const regex = /(#{1,7} .+)/gi;
	const markdownString = new MarkdownRenderer().renderMarkdown(GENERAL_DATA as DocumentNode);

	expect(markdownString.match(regex).length).toBe(7);
});

test('expecting custom component', () => {
	const markdownString = new MarkdownRenderer().renderMarkdown(TABLE_DATA as DocumentNode);
	const regex = /(<yeast:.*>)dx-ui-text bro(<\/yeast:.*>)/g;
	expect(markdownString.match(regex).length).toBe(1);
});

test('table node with header', () => {
	const markdownString = new MarkdownRenderer().renderMarkdown(TABLE_DATA as DocumentNode);
	const headerRegex = /\| :--- \| ---: \|/g;
	const centerRegex = /\| :---: /g;
	expect(markdownString.match(headerRegex).length).toBe(1);
	expect(markdownString.match(centerRegex).length).toBe(3);
});

test('special characters in certain nodes', () => {
	const data = {
		type: 'document',
		title: 'Testing Paragraph type in blockquote',
		author: 'yuri.yetina',
		children: [
			{
				type: 'heading',
				level: 1,
				children: [{ text: '##heading node 1' }],
			},
			{
				type: 'strikethrough',
				children: [{ text: 'strikethrough ~node 1' }],
			},
			{
				type: 'italic',
				children: [{ text: 'italic **node 1' }],
			},
			{
				type: 'italic',
				children: [
					{
						type: 'bold',
						children: [
							{
								text: 'bold in italic',
							},
						],
					},
				],
			},
			{
				type: 'table',
				align: 'L|R',
				children: [
					{
						type: 'tablerow',
						header: true,
						children: [
							{ type: 'tablecell', children: [{ text: 'names' }] },
							{ type: 'tablecell', children: [{ text: 'use a | pipe character to | define the cells' }] },
						],
					},
					{
						type: 'tablerow',
						children: [
							{ type: 'tablecell', children: [{ text: 'yeti' }] },
							{ type: 'tablecell', children: [{ text: 'genesys' }] },
						],
					},
				],
			},
		],
	};
	const markdownString = new MarkdownRenderer().renderMarkdown(data as DocumentNode);
	const regex = /\\~/g;
	expect(markdownString.match(regex).length).toBe(1);
});

test('contentgroup titles rendered as json', () => {
	const markdownString = new MarkdownRenderer().renderMarkdown(GENERAL_DATA as DocumentNode);
	const match = markdownString.match(/{"title":"test accordion","type":"accordion"}/gi);
	expect(match).not.toBeNull();
	expect(match.length).toBe(1);
});

test('nested lists rendering accurately', () => {
	const markdownString = new MarkdownRenderer().renderMarkdown(LIST_DATA as DocumentNode);
	const firstItemRegex = /(.*(?:first item).*)/g;
	const nestedItemRegex = /(.*(?:first subsecond).*)/g;
	const nestedDiff = markdownString.match(nestedItemRegex)[0].indexOf('-') - markdownString.match(firstItemRegex)[0].indexOf('-');
	expect(nestedDiff).toBe(1);
});

test('a simple table renders simply', () => {
	const markdownString = new MarkdownRenderer().renderMarkdown(SIMPLE_TABLE_AST as DocumentNode);
	expect(markdownString).toEqual(SIMPLE_TABLE_MARKDOWN);
});

test('inline code simple and escaped syntax', () => {
	const markdownString = new MarkdownRenderer().renderMarkdown(INLINE_CODE_AST as DocumentNode);
	expect(markdownString).toEqual(INLINE_CODE_MARKDOWN);
});

test('undefined in required prop', () => {
	const markdownString = new MarkdownRenderer().renderMarkdown(UNDEFINED_DATA_AST as DocumentNode);
	expect(markdownString.trim()).toEqual(UNDEFINED_DATA_MARKDOWN.trim());
});

test('image alt element undefined', () => {
	const markdownString = new MarkdownRenderer().renderMarkdown(IMAGE_DATA_AST as DocumentNode);
	expect(markdownString.trim()).toEqual(IMAGE_DATA_MARKDOWN.trim());
});
