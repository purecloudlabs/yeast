import * as fs from 'fs';
import * as path from 'path';
import {
	BlockCodeNode,
	BlockquoteNode,
	BoldNode,
	CalloutNode,
	ContentGroupItemNode,
	ContentGroupNode,
	DocumentNode,
	HeadingNode,
	ImageNode,
	InlineCodeNode,
	ItalicNode,
	LinkNode,
	ListNode,
	ParagraphNode,
	StrikethroughNode,
	TableNode,
	TableRowNode,
	YeastInlineChild,
	YeastInlineNodeTypes,
	YeastNode,
	YeastText,
} from 'yeast-core';

import { MarkdownParser } from '../../MarkdownParser';
import { BlockquoteParserPlugin } from '../../plugins/block/BlockquoteParserPlugin';
import { CalloutParserPlugin } from '../../plugins/block/CalloutParserPlugin';
import { CodeParserPlugin } from '../../plugins/block/CodeParserPlugin';
import { ContentGroupParserPlugin } from '../../plugins/block/ContentGroupParserPlugin';
import { CustomComponentParserPlugin } from '../../plugins/block/CustomComponentParser';
import { HeadingParserPlugin } from '../../plugins/block/HeadingParserPlugin';
import { HorizontalRuleParserPlugin } from '../../plugins/block/HorizontalRuleParserPlugin';
import { ListParserPlugin } from '../../plugins/block/ListParserPlugin';
import { ParagraphParserPlugin } from '../../plugins/block/ParagraphParserPlugin';
import { TableParserPlugin } from '../../plugins/block/TableParser';
import { InlineEmphasisPlugin } from '../../plugins/inline/InlineEmphasisPlugin';

import { IMAGE_AST, IMAGE_LINKS_AST, IMAGE_LINKS_MARKDOWN, IMAGE_MARKDOWN } from '../resources/images';
import { LINK_AST, LINK_MARKDOWN } from '../resources/links';

const standardBlockPluginCount = 10;
const standardInlinePluginCount = 7;

test('MarkdownParser with no plugins should create root document with frontmatter', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.clearInlinePlugins();

	// Check plugins
	checkParserPlugins(parser, 0, 0);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/frontmatter.md'), 'utf8');
	const ast = parser.parse(documentText);

	// Check result
	expect(ast.type).toBe('document');
	expect(ast.title).toBe("A page's title");
	expect(ast.author).toBe('yuri.yeti');
	expect(ast.customDataOne).toBe('The first value');
	expect(Object.keys(ast).length).toBe(5);
	expect(ast.children).not.toBeUndefined();
	expect(ast.children.length).toBe(0);
});

test('MarkdownParser with no plugins should create root document without frontmatter', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.clearInlinePlugins();

	// Check plugins
	checkParserPlugins(parser, 0, 0);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/nofrontmatter.md'), 'utf8');
	const ast = parser.parse(documentText);

	// Check document
	checkAstStructureForDefaultDocument(ast, 0);
});

test('MarkdownParser using ParagraphParserPlugin', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.clearInlinePlugins();
	parser.registerBlockPlugin(new BlockquoteParserPlugin());
	parser.registerBlockPlugin(new ParagraphParserPlugin());

	// Check plugins
	checkParserPlugins(parser, 2, 0);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/paragraph.md'), 'utf8');
	const ast = parser.parse(documentText);

	expect(ast.children[2].type).toBe('blockquote');
	expect(((ast.children[4] as ParagraphNode).children[0] as YeastText).text).toBe(
		'public class MyEventStrategy extends EventStrategy<MyEvent> { public MyStrategy() { super(MyEvent.class); } }'
	);
	expect((ast.children[6].children[0] as YeastText).text).toBe('Remove old logs if needed');

	// Check document
	checkAstStructureForDefaultDocument(ast, 8);
});

test('MarkdownParser using CustomComponentParserPlugin', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.clearInlinePlugins();
	parser.registerBlockPlugin(new CustomComponentParserPlugin());
	parser.registerBlockPlugin(new ParagraphParserPlugin());

	// Check plugins
	checkParserPlugins(parser, 2, 0);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/customcomponent.md'), 'utf8');
	const ast = parser.parse(documentText);
	expect(ast.children[0].type).toBe('link');
	expect(ast.children[1].type).toBe('table');
	expect((ast.children[1] as TableNode).align).toBe('L|C|R');
	expect((ast.children[1].children[0] as TableRowNode).header).toBe('true');
	expect(ast.children[1].children.length).toBe(3);
	expect((ast.children[1].children[1] as TableRowNode).children[2].type).toBe('tablecell');
	expect(((ast.children[1].children[1] as TableRowNode).children[2].children[0] as BoldNode).type).toBe('bold');
	expect(ast.children[2].type).toBe('paragraph');
	expect(ast.children[3].type).toBe('horizontalRule');
	expect(ast.children[3].children).toBeUndefined();
	expect(ast.children[4].type).toBe('bold');
	expect(ast.children[5].type).toBe('image');
	expect(ast.children[5].children).toBeUndefined();
	expect(ast.children[6].type).toBe('OpenAPIExplorer');
	expect(ast.children[7].type).toBe('QuickHit');

	// Check document
	checkAstStructureForDefaultDocument(ast, 8);
});

test('MarkdownParser using TableParserPlugin', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.registerBlockPlugin(new CustomComponentParserPlugin());
	parser.registerBlockPlugin(new TableParserPlugin());
	parser.registerBlockPlugin(new ParagraphParserPlugin());

	// Check plugins
	checkParserPlugins(parser, 13, standardInlinePluginCount);

	const documentText = fs.readFileSync(path.join(__dirname, '../resources/tables.md'), 'utf8');
	const ast = parser.parse(documentText);
	expect(ast.children[0].children.length).toBe(3);
	expect((ast.children[0] as TableNode).children[0].header).toBeTruthy();
	// table > tablerow > tablecell > paragraph > text
	expect((((ast.children[0] as TableNode).children[1].children[0].children[0] as YeastNode).children[0] as YeastText).text).toBe('Header');
	expect(((ast.children[0] as TableNode).children[2].children[1].children[0] as BoldNode).type).toBe('bold');
	expect((ast.children[1] as TableNode).children[0].header).toBeTruthy();
	expect((ast.children[1] as TableNode).align).toBe('L|C|R');
	expect((ast.children[2] as TableNode).filterable).toBeTruthy();
	expect((ast.children[2] as TableNode).sortable).toBeTruthy();
	expect((ast.children[3].children[0] as TableRowNode).children[1].align).toBe('right');
	expect((ast.children[3].children[0] as TableRowNode).children[0].align).toBe('center');
	expect((ast.children[3] as TableNode).align).toBe('C|R');
	expect((ast.children[3] as TableNode).sortable).toBeUndefined();
	expect((ast.children[4] as TableNode).children[0].header).toBeFalsy();
	expect((ast.children[5] as TableNode).children.length).toBe(7);

	// Check document
	checkAstStructureForDefaultDocument(ast, 6);
});

test('MarkdownParser using BlockquoteParserPlugin', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.clearInlinePlugins();
	parser.registerBlockPlugin(new BlockquoteParserPlugin());
	parser.registerBlockPlugin(new ParagraphParserPlugin());

	// Check plugins
	checkParserPlugins(parser, 2, 0);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/blockquote.md'), 'utf8');
	const ast = parser.parse(documentText);
	expect((ast.children[0] as BlockquoteNode).type).toBe('blockquote');
	expect((ast.children[0] as BlockquoteNode).children.length).toBe(2);
	expect((ast.children[1] as BlockquoteNode).type).toBe('blockquote');
	expect(((ast.children[5].children[0] as ParagraphNode).children[0] as YeastText).text).toBe('euismod nulla ac');

	// Check document
	checkAstStructureForDefaultDocument(ast, 6);
});

test('MarkdownParser using CalloutParserPlugin', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.clearInlinePlugins();
	parser.registerBlockPlugin(new CalloutParserPlugin());
	parser.registerBlockPlugin(new ParagraphParserPlugin());

	// Check plugins
	checkParserPlugins(parser, 2, 0);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/callout.md'), 'utf8');
	const ast = parser.parse(documentText);
	expect((ast.children[0] as CalloutNode).type).toBe('callout');
	expect((ast.children[0] as CalloutNode).alertType).toBe('critical');
	expect((ast.children[0] as CalloutNode).title).toBe('Note for C# Example');
	expect((ast.children[0] as CalloutNode).autoCollapse).toBe(true);
	expect((ast.children[0] as CalloutNode).collapsible).toBeUndefined();
	expect((ast.children[2] as CalloutNode).type).toBe('callout');
	expect((ast.children[2] as CalloutNode).alertType).toBe('info');

	// Check document
	checkAstStructureForDefaultDocument(ast, 3);
});

test('MarkdownParser using CodeParserPlugin', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.clearInlinePlugins();
	parser.registerBlockPlugin(new CodeParserPlugin());
	parser.registerBlockPlugin(new ParagraphParserPlugin());

	// Check plugins
	checkParserPlugins(parser, 2, 0);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/codeblock.md'), 'utf8');
	const ast = parser.parse(documentText);
	expect(ast.children.length).toBe(2);

	// Check document
	checkAstStructureForDefaultDocument(ast, 2);
});

test('MarkdownParser using ContentGroupParserPlugin', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.clearInlinePlugins();
	parser.registerInlinePlugin(new InlineEmphasisPlugin());
	parser.registerBlockPlugin(new ContentGroupParserPlugin());
	parser.registerBlockPlugin(new CodeParserPlugin());
	parser.registerBlockPlugin(new ParagraphParserPlugin());

	// Check plugins
	checkParserPlugins(parser, 3, 1);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/contentgroup.md'), 'utf8');
	const ast = parser.parse(documentText);

	expect((ast.children[0] as ContentGroupNode).type).toBe('contentgroup');
	expect((ast.children[0] as ContentGroupNode).groupType).toBe('accordion');
	expect((ast.children[0] as ContentGroupNode).children.length).toBe(2);
	expect((ast.children[0].children[0] as ContentGroupItemNode).type).toBe('contentgroupitem');
	expect((ast.children[0].children[1] as ContentGroupItemNode).title).toBe('Proin ullamcorper');
	expect((ast.children[2] as ContentGroupNode).type).toBe('contentgroup');
	expect((ast.children[2] as ContentGroupNode).groupType).toBe('tabbedcontent');
	expect((ast.children[3] as ContentGroupNode).type).toBe('contentgroup');
	expect(((ast.children[3] as ContentGroupNode).children[0].children[0] as BlockCodeNode).title).toBe('Response');
	expect((ast.children[3] as ContentGroupNode).children[1].title).toBe('1234');
	expect(ast.children[4].type).toBe('paragraph');

	// Check document
	checkAstStructureForDefaultDocument(ast, 5);
});

test('MarkdownParser using HorizontalRuleParserPlugin', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.clearInlinePlugins();
	parser.registerBlockPlugin(new HorizontalRuleParserPlugin());
	parser.registerBlockPlugin(new ParagraphParserPlugin());

	// Check plugins
	checkParserPlugins(parser, 2, 0);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/horizontalrule.md'), 'utf8');
	const ast = parser.parse(documentText);

	// Check document
	checkAstStructureForDefaultDocument(ast, 7);
});

test('MarkdownParser using HeadingParserPlugin', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.clearInlinePlugins();
	parser.registerBlockPlugin(new HeadingParserPlugin());
	parser.registerBlockPlugin(new ParagraphParserPlugin());

	// Check plugins
	checkParserPlugins(parser, 2, 0);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/heading.md'), 'utf8');
	const ast = parser.parse(documentText);

	// Check document
	checkAstStructureForDefaultDocument(ast, 14);

	// Check to make sure headings were parsed correctly
	expect(ast.children[0].type).toBe('heading');
	expect((ast.children[0] as HeadingNode).level).toBe(1);
	expect(ast.children[2].type).toBe('heading');
	expect((ast.children[2] as HeadingNode).level).toBe(2);
	expect(ast.children[4].type).toBe('heading');
	expect((ast.children[4] as HeadingNode).level).toBe(3);
	expect(ast.children[6].type).toBe('heading');
	expect((ast.children[6] as HeadingNode).level).toBe(4);
	expect(ast.children[8].type).toBe('heading');
	expect((ast.children[8] as HeadingNode).level).toBe(5);
	expect(ast.children[10].type).toBe('heading');
	expect((ast.children[10] as HeadingNode).level).toBe(6);
	expect(ast.children[12].type).toBe('heading');
	expect((ast.children[12] as HeadingNode).level).toBe(2);
});

test('MarkdownParser using ListParserPlugin', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.clearInlinePlugins();
	parser.registerBlockPlugin(new ListParserPlugin());
	parser.registerBlockPlugin(new ParagraphParserPlugin());

	// Check plugins
	checkParserPlugins(parser, 2, 0);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/lists.md'), 'utf8');
	const ast = parser.parse(documentText);

	// Check document
	checkAstStructureForDefaultDocument(ast, 10);

	// check for JSON equivalency
	expect(JSON.stringify(ast)).toBe(
		`{"type":"document","title":"Default Page Title","children":[{"type":"list","children":[{"type":"listitem","level":0,"children":[{"text":"asterisk list 1"}]},{"type":"listitem","level":0,"children":[{"text":"more asterisk 2"}]},{"type":"list","children":[{"type":"listitem","level":1,"children":[{"text":"two spaces in - 2.1"}]},{"type":"listitem","level":1,"children":[{"text":"one tab in - 2.2"}]},{"type":"list","children":[{"type":"listitem","level":2,"children":[{"text":"mixing in a hyphen 2.2.1"}]}],"ordered":false,"level":2}],"ordered":false,"level":1},{"type":"listitem","level":0,"children":[{"text":"Root level back to asterisk 3"}]},{"type":"listitem","level":0,"children":[{"text":"Skipped a single line 4"}]},{"type":"list","children":[{"type":"list","children":[{"type":"listitem","level":2,"children":[{"text":"skipped an indentation level 4.1.1"}]}],"ordered":false,"level":2}],"ordered":false,"level":1}],"ordered":false,"level":0},{"type":"list","children":[{"type":"list","children":[{"type":"list","children":[{"type":"listitem","level":2,"children":[{"text":"Indented two levels and skipped two lines - this is a new list with indentation"}]}],"ordered":false,"level":2}],"ordered":false,"level":1},{"type":"listitem","level":0,"children":[{"text":"Drop back to root level, same list"}]}],"ordered":false,"level":0},{"type":"list","children":[{"type":"listitem","level":0,"children":[{"text":"Ordered list"}]},{"type":"listitem","level":0,"children":[{"text":"Second item"}]},{"type":"listitem","level":0,"children":[{"text":"Third item"}]}],"ordered":true,"level":0,"start":90},{"type":"list","children":[{"type":"listitem","level":0,"children":[{"text":"this"}]},{"type":"listitem","level":0,"children":[{"text":"is"}]},{"type":"listitem","level":0,"children":[{"text":"what"}]},{"type":"list","children":[{"type":"listitem","level":1,"children":[{"text":"nested"}]},{"type":"listitem","level":1,"children":[{"text":"lists"}]},{"type":"list","children":[{"type":"listitem","level":2,"children":[{"text":"look"}]},{"type":"listitem","level":2,"children":[{"text":"like"}]}],"ordered":true,"level":2}],"ordered":true,"level":1}],"ordered":true,"level":0,"start":1},{"type":"list","children":[{"type":"listitem","level":0,"children":[{"text":"Next list with hyphens 1"}]},{"type":"list","children":[{"type":"listitem","level":1,"children":[{"text":"hyphen 1.1"}]}],"ordered":false,"level":1},{"type":"listitem","level":0,"children":[{"text":"hyphen 2"}]}],"ordered":false,"level":0},{"type":"list","children":[{"type":"listitem","level":0,"children":[{"text":"Now let's do a numbered list 1"}]},{"type":"list","children":[{"type":"listitem","level":1,"children":[{"text":"Indented one level 1.1"}]},{"type":"list","children":[{"type":"listitem","level":2,"children":[{"text":"1.1.1 (3)"}]},{"type":"list","children":[{"type":"listitem","level":3,"children":[{"text":"1.1.1.1 (4)"}]},{"type":"list","children":[{"type":"listitem","level":4,"children":[{"text":"1.1.1.1.1 (5)"}]},{"type":"list","children":[{"type":"listitem","level":5,"children":[{"text":"1.1.1.1.1.1 (6)"}]},{"type":"list","children":[{"type":"listitem","level":6,"children":[{"text":"1.1.1.1.1.1.1 (7)"}]},{"type":"list","children":[{"type":"listitem","level":7,"children":[{"text":"1.1.1.1.1.1.1.1 (8)"}]},{"type":"list","children":[{"type":"listitem","level":8,"children":[{"text":"1.1.1.1.1.1.1.1.1 (9)"}]},{"type":"list","children":[{"type":"listitem","level":9,"children":[{"text":"1.1.1.1.1.1.1.1.1.1 (10)"}]}],"ordered":true,"level":9}],"ordered":true,"level":8}],"ordered":true,"level":7}],"ordered":true,"level":6}],"ordered":true,"level":5}],"ordered":true,"level":4}],"ordered":true,"level":3}],"ordered":true,"level":2}],"ordered":true,"level":1},{"type":"listitem","level":0,"children":[{"text":"drop back to root 2"}]},{"type":"list","children":[{"type":"listitem","level":1,"children":[{"text":"indented with a 7 - 2.1"}]}],"ordered":true,"level":1}],"ordered":true,"level":0,"start":1},{"type":"list","children":[{"type":"listitem","level":0,"children":[{"text":"Another UL, but start at 6"}]},{"type":"listitem","level":0,"children":[{"text":"asdf 7"}]}],"ordered":true,"level":0,"start":3},{"type":"list","children":[{"type":"list","children":[{"type":"list","children":[{"type":"list","children":[{"type":"listitem","level":3,"children":[{"text":"Indented 3 levels and starting at 3"}]},{"type":"list","children":[{"type":"listitem","level":4,"children":[{"text":"3.1"}]}],"ordered":true,"level":4}],"ordered":true,"level":3}],"ordered":true,"level":2}],"ordered":true,"level":1}],"ordered":true,"level":0,"start":1},{"type":"paragraph","children":[{"text":"*THIS* is italic text"}],"indentation":0},{"type":"paragraph","children":[{"text":"**THIS** is bold text"}],"indentation":0}]}`
	);

	expect((ast.children[1] as ListNode).children[1].level).toBe(0);
	expect(((ast.children[1] as ListNode).children[0].children[0] as ListNode).children[0].level).toBe(2);
	expect((ast.children[2] as ListNode).start).toBe(90);
	expect((ast.children[2] as ListNode).ordered).toBe(true);
	expect((ast.children[3] as ListNode).ordered).toBe(true);
	expect(((ast.children[3] as ListNode).children[3] as ListNode).ordered).toBe(true);
	expect((ast.children[4] as ListNode).ordered).toBe(false);
	expect((ast.children[4] as ListNode).start).toBeUndefined();
});

test('MarkdownParser using ParagraphDenester', () => {
	// Initialize parser using defaults
	const parser = new MarkdownParser();

	// Check plugins
	checkParserPlugins(parser, standardBlockPluginCount, standardInlinePluginCount);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/nested-paragraphs.md'), 'utf8');
	const ast = parser.parse(documentText);

	// Check document
	checkAstStructureForDefaultDocument(ast, 3);

	// check for JSON equivalency
	expect(JSON.stringify(ast)).toBe(
		`{"type":"document","title":"Default Page Title","children":[{"type":"heading","children":[{"text":"Table Test Document"}],"level":2,"id":"table-test-document"},{"type":"paragraph","children":[{"text":"This document exists to test tables. Oh look! Here's one now:"}],"indentation":0},{"indentation":"0","align":"L|C|R","type":"table","children":[{"type":"tablerow","header":"true","children":[{"type":"tablecell","align":"left","children":[{"type":"paragraph","children":[{"text":"Left"}],"indentation":0}]},{"type":"tablecell","align":"center","children":[{"type":"paragraph","children":[{"text":"Right"}],"indentation":0}]},{"type":"tablecell","align":"right","children":[{"type":"paragraph","children":[{"text":"Center"}],"indentation":0}]}]},{"type":"tablerow","children":[{"type":"tablecell","align":"left","children":[{"type":"paragraph","children":[{"text":"Left 1"}],"indentation":0}]},{"type":"tablecell","align":"center","children":[{"type":"paragraph","children":[{"text":"Center 1"}],"indentation":0}]},{"type":"tablecell","align":"right","children":[{"type":"paragraph","children":[{"text":"Right 1"}],"indentation":0}]}]},{"type":"tablerow","children":[{"type":"tablecell","align":"left","children":[{"type":"paragraph","children":[{"text":"Left 2"}],"indentation":0}]},{"type":"tablecell","align":"center","children":[{"type":"paragraph","children":[{"text":"Center 2"}],"indentation":0},{"type":"paragraph","children":[{"text":"Second paragraph to trigger custom component rendering"}],"indentation":0}]},{"type":"tablecell","align":"right","children":[{"type":"paragraph","children":[{"text":"Right 2"}],"indentation":0}]}]},{"type":"tablerow","children":[{"type":"tablecell","align":"left","children":[{"type":"paragraph","children":[{"text":"Left 3"}],"indentation":0}]},{"type":"tablecell","align":"center","children":[{"type":"paragraph","children":[{"text":"Center 3"}],"indentation":0}]},{"type":"tablecell","align":"right","children":[{"type":"paragraph","children":[{"text":"Right 3"}],"indentation":0}]}]}]}]}`
	);
});

test('MarkdownParser using all inline plugins', () => {
	// Initialize parser
	const parser = new MarkdownParser();
	parser.clearBlockPlugins();
	parser.registerBlockPlugin(new ParagraphParserPlugin());

	// Check plugins
	checkParserPlugins(parser, 1, standardInlinePluginCount);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/everythinginline.md'), 'utf8');
	const ast = parser.parse(documentText);

	// Check document
	checkAstStructureForDefaultDocument(ast, 2);

	// Paragraph 1
	expect(ast.children[0].children.length).toBe(26);
	expect((ast.children[0].children[1] as StrikethroughNode).type).toBe(YeastInlineNodeTypes.Strikethrough);
	expect((ast.children[0].children[3] as InlineCodeNode).type).toBe(YeastInlineNodeTypes.Code);
	expect((ast.children[0].children[5] as ItalicNode).type).toBe(YeastInlineNodeTypes.Italic);
	expect((ast.children[0].children[7] as ItalicNode).type).toBe(YeastInlineNodeTypes.Italic);
	expect((ast.children[0].children[9] as BoldNode).type).toBe(YeastInlineNodeTypes.Bold);
	expect((ast.children[0].children[11] as InlineCodeNode).type).toBe(YeastInlineNodeTypes.Code);
	expect((ast.children[0].children[13] as ImageNode).type).toBe(YeastInlineNodeTypes.Image);
	expect((ast.children[0].children[15] as ImageNode).type).toBe(YeastInlineNodeTypes.Image);
	expect((ast.children[0].children[17] as ImageNode).type).toBe(YeastInlineNodeTypes.Image);
	expect((ast.children[0].children[19] as LinkNode).type).toBe(YeastInlineNodeTypes.Link);
	expect((ast.children[0].children[21] as LinkNode).type).toBe(YeastInlineNodeTypes.Link);
	expect((ast.children[0].children[23] as LinkNode).type).toBe(YeastInlineNodeTypes.Link);
	expect((ast.children[0].children[25] as LinkNode).type).toBe(YeastInlineNodeTypes.Link);

	// Paragraph 2
	expect(ast.children[1].children.length).toBe(27);
	expect((ast.children[1].children[1] as ItalicNode).type).toBe(YeastInlineNodeTypes.Italic);
	expect((ast.children[1].children[3] as ItalicNode).type).toBe(YeastInlineNodeTypes.Italic);
	expect((ast.children[1].children[5] as ItalicNode).type).toBe(YeastInlineNodeTypes.Italic);
	expect((ast.children[1].children[7] as ItalicNode).type).toBe(YeastInlineNodeTypes.Italic);
	expect((ast.children[1].children[9] as ItalicNode).type).toBe(YeastInlineNodeTypes.Italic);
	expect((ast.children[1].children[11] as ItalicNode).type).toBe(YeastInlineNodeTypes.Italic);
	expect((ast.children[1].children[13] as ItalicNode).type).toBe(YeastInlineNodeTypes.Italic);
	expect((ast.children[1].children[15] as BoldNode).type).toBe(YeastInlineNodeTypes.Bold);
	expect((ast.children[1].children[17] as BoldNode).type).toBe(YeastInlineNodeTypes.Bold);
	expect((ast.children[1].children[19] as BoldNode).type).toBe(YeastInlineNodeTypes.Bold);
	expect((ast.children[1].children[21] as BoldNode).type).toBe(YeastInlineNodeTypes.Bold);
	expect((ast.children[1].children[23] as BoldNode).type).toBe(YeastInlineNodeTypes.Bold);
	expect((ast.children[1].children[25] as BoldNode).type).toBe(YeastInlineNodeTypes.Bold);
});

test('MarkdownParser using all defaults', () => {
	// Initialize parser
	const parser = new MarkdownParser();

	// Check plugins
	checkParserPlugins(parser, standardBlockPluginCount, standardInlinePluginCount);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/everything.md'), 'utf8');
	const ast = parser.parse(documentText);

	// Check result
	expect(ast.type).toBe('document');
	expect(ast.title).toBe('Everything Bagel');
	expect(ast.author).toBe('yuri.yeti');
	expect(ast.customProperty).toBe('Has a value');
	expect(ast.children).not.toBeUndefined();
	expect(ast.children.length).toBe(20);
	expect(Object.keys(ast).length).toBe(5);
	expect(ast.children).not.toBeUndefined();
});

test('MarkdownParser parses image formats', () => {
	// Initialize parser
	const parser = new MarkdownParser();

	// Parse
	const ast = parser.parse(IMAGE_MARKDOWN);

	// Check result
	expect(ast.type).toBe('document');
	expect(ast.title).toBe('Image test page');
	expect(ast.children).not.toBeUndefined();
	expect(ast.children.length).toBe(24);
	expect(JSON.stringify(ast)).toBe(JSON.stringify(IMAGE_AST));
});

test('MarkdownParser parses image links', () => {
	// Initialize parser
	const parser = new MarkdownParser();

	// Parse
	const ast = parser.parse(IMAGE_LINKS_MARKDOWN);

	// Check result
	expect(ast.type).toBe('document');
	expect(ast.title).toBe('Platform API Client SDK - Java');
	expect(ast.children).not.toBeUndefined();
	expect(ast.children.length).toBe(4);
	expect(JSON.stringify(ast)).toBe(JSON.stringify(IMAGE_LINKS_AST));
});

test('Inline content should not be parsed', () => {
	//Initialize parser
	const parser = new MarkdownParser();

	// Check plugins
	checkParserPlugins(parser, standardBlockPluginCount, standardInlinePluginCount);

	// Parse
	const documentText = fs.readFileSync(path.join(__dirname, '../resources/inlinecode.md'), 'utf8');
	const ast = parser.parse(documentText);
	const italicInlineCode = ast.children[0].children[0] as InlineCodeNode;
	const boldInlineCode = ast.children[0].children[2] as InlineCodeNode;
	expect((italicInlineCode.children[0] as YeastInlineChild as YeastText).text).toBe('italic_syntax_');
	expect((boldInlineCode.children[0] as YeastInlineChild as YeastText).text).toBe('bold**syntax**');
});

test('MarkdownParser parses hyperlink in text', () => {
	// Initialize parser
	const parser = new MarkdownParser();

	// Check plugins
	checkParserPlugins(parser, standardBlockPluginCount, standardInlinePluginCount);

	// Parse
	const ast = parser.parse(LINK_MARKDOWN);

	expect(JSON.stringify(ast)).toBe(JSON.stringify(LINK_AST));
});
// /**
//  * Helper functions
//  */

// checkParserPlugins validates the parser is configured with the expected number of plugins
function checkParserPlugins(parser: MarkdownParser, blockPluginCount: number, inlinePluginCount: number) {
	// Validate function input
	expect(parser).not.toBeUndefined();
	expect(blockPluginCount).toBeGreaterThanOrEqual(0);
	expect(inlinePluginCount).toBeGreaterThanOrEqual(0);

	// Validate data
	expect((parser as any).rootPlugin).not.toBeUndefined();
	expect((parser as any).blockPlugins).toBeInstanceOf(Array);
	expect((parser as any).blockPlugins.length).toBe(blockPluginCount);
	expect((parser as any).inlinePlugins).toBeInstanceOf(Array);
	expect((parser as any).inlinePlugins.length).toBe(inlinePluginCount);
}

// checkAstStructureForDefaultDocument validates the AST document without frontmatter was populated using correct defaults and has the expected number of child elements
function checkAstStructureForDefaultDocument(ast: DocumentNode, childrenCount: number) {
	// Validate function input
	expect(ast).not.toBeUndefined();
	expect(childrenCount).toBeGreaterThanOrEqual(0);

	// Validate data
	expect(ast.type).toBe('document');
	expect(ast.title).toBe('Default Page Title');
	expect(ast.children).not.toBeUndefined();
	expect(ast.children.length).toBe(childrenCount);
	expect(Object.keys(ast).length).toBe(3);
}

// debugAST prints the AST document to the console log and writes it to a local file in the debug directory
function debugAST(testName: string, ast: DocumentNode) {
	console.log(JSON.stringify(ast, null, 2));
	if (!fs.existsSync('./debug/')) {
		fs.mkdirSync('debug');
	}
	fs.writeFileSync(`./debug/${(testName || 'unnamed').replaceAll(/[^a-z0-9]/gi, '_')}.json`, JSON.stringify(ast, null, 2));
}
