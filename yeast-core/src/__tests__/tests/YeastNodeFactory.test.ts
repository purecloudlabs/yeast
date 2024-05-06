import {
	BlockquoteNode,
	ContentGroupType,
	HeadingNode,
	ListNode,
	YeastBlockNodeTypes,
	YeastInlineNodeTypes,
	isYeastBlockNode,
	isYeastInlineNode,
	isYeastNode,
	isYeastTextNode,
	scrapeText,
	isYeastNodeType,
} from '../../';
import YeastNodeFactory from '../../YeastNodeFactory';
import { textNode, inlineNode, blockNode, ogYeastNode } from '../resources/content/nodeSamples';

test('Create unknown node', () => {
	// Create node
	const node = YeastNodeFactory.Create('this is not a known node type' as any);

	// Check properties
	expect(node).toBeUndefined();
});

test('Create typed node', () => {
	// Create node
	const node = YeastNodeFactory.Create(YeastBlockNodeTypes.Heading) as HeadingNode;

	// Check properties
	expect(node).not.toBeUndefined();
	expect(Object.keys(node)).toHaveLength(4);
	expect(node.type).toBe(YeastBlockNodeTypes.Heading);
	expect(node.children).toHaveLength(0);
	expect(node.level).toBe(1);
	expect(node.id).toBe('');
});

test('Create typed node from another node (generic)', () => {
	// Create node
	const fromNode = {
		children: [{ text: 'Heading Text' }],
		level: 5,
		id: 'my-heading',
		customProperty: 'Custom Value',
	};
	const node = YeastNodeFactory.Create(YeastBlockNodeTypes.Heading, fromNode) as HeadingNode;

	// Check properties
	expect(node).not.toBeUndefined();
	expect(Object.keys(node)).toHaveLength(5);
	expect(node.type).toBe(YeastBlockNodeTypes.Heading);
	expect(node.children).toHaveLength(1);
	expect(node.level).toBe(5);
	expect(node.id).toBe('my-heading');
	expect((node as any).customProperty).toBe('Custom Value');
});

test('Create typed node from another node (typed)', () => {
	// Create node
	const fromNode = {
		type: YeastBlockNodeTypes.Heading,
		children: [{ text: 'Heading Text' }],
		level: 5,
		id: 'my-heading',
	} as HeadingNode;
	const node = YeastNodeFactory.CreateHeadingNode(fromNode) as HeadingNode;

	// Check properties
	expect(node).not.toBeUndefined();
	expect(Object.keys(node)).toHaveLength(4);
	expect(node.type).toBe(YeastBlockNodeTypes.Heading);
	expect(node.children).toHaveLength(1);
	expect(node.level).toBe(5);
	expect(node.id).toBe('my-heading');
});

test('Apply attributes respects reserved names', () => {
	// Note: Creating from a node of a different type shouldn't be done in practice, but this ensures that the type of a node isn't mutated.

	// Create from node
	const fromNode = {
		type: YeastBlockNodeTypes.Blockquote,
		children: [],
	} as BlockquoteNode;

	// Create node
	const node = YeastNodeFactory.Create(YeastBlockNodeTypes.List, fromNode) as ListNode;

	// Check properties
	expect(node).not.toBeUndefined();
	expect(Object.keys(node)).toHaveLength(3);
	expect(node.type).toBe(YeastBlockNodeTypes.List);
	expect(node.children).toHaveLength(0);
	expect(node.ordered).toBe(false);
});

/**
 * Block node factory defaults
 */

test('CreateBlockquoteNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateBlockquoteNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastBlockNodeTypes.Blockquote);
	expect(node.children).toHaveLength(0);
});

test('CreateCalloutNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateCalloutNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastBlockNodeTypes.Callout);
	expect(node.children).toHaveLength(0);
});

test('CreateBlockCodeNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateBlockCodeNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastBlockNodeTypes.Code);
	expect(node.children).toHaveLength(0);
});

test('CreateContentGroupNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateContentGroupNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(3);
	expect(node.type).toBe(YeastBlockNodeTypes.ContentGroup);
	expect(node.children).toHaveLength(0);
	expect(node.groupType).toBe(ContentGroupType.tabbedContent);
});

test('CreateContentGroupItemNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateContentGroupItemNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(3);
	expect(node.type).toBe(YeastBlockNodeTypes.ContentGroupItem);
	expect(node.children).toHaveLength(0);
	expect(node.groupType).toBe(ContentGroupType.tabbedContent);
});

test('CreateDocumentNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateDocumentNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(3);
	expect(node.type).toBe(YeastBlockNodeTypes.Document);
	expect(node.children).toHaveLength(0);
	expect(node.title).toBe('New Document');
});

test('CreateHeadingNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateHeadingNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(4);
	expect(node.type).toBe(YeastBlockNodeTypes.Heading);
	expect(node.children).toHaveLength(0);
	expect(node.level).toBe(1);
	expect(node.id).toBe('');
});

test('CreateImageNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateImageNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(3);
	expect(node.type).toBe(YeastBlockNodeTypes.Image);
	expect(node.src).toBe('');
	expect(node.alt).toBe('');
});

test('CreateHorizontalRuleNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateHorizontalRuleNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(1);
	expect(node.type).toBe(YeastBlockNodeTypes.HorizontalRule);
});

test('CreateListNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateListNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(3);
	expect(node.type).toBe(YeastBlockNodeTypes.List);
	expect(node.children).toHaveLength(0);
	expect(node.ordered).toBe(false);
});

test('CreateListItemNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateListItemNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastBlockNodeTypes.ListItem);
	expect(node.children).toHaveLength(0);
});

test('CreateParagraphNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateParagraphNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastBlockNodeTypes.Paragraph);
	expect(node.children).toHaveLength(1);
	expect(node.children[0]).toHaveProperty('text');
});

test('CreateTableNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateTableNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastBlockNodeTypes.Table);
	expect(node.children).toHaveLength(0);
});

test('CreateTableRowNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateTableRowNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastBlockNodeTypes.TableRow);
	expect(node.children).toHaveLength(0);
});

test('CreateTableCellNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateTableCellNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastBlockNodeTypes.TableCell);
	expect(node.children).toHaveLength(1);
	expect(node.children[0]).toHaveProperty('type');
	expect((node.children[0] as any).type).toEqual('paragraph');
	expect((node.children[0] as any).children).toHaveLength(1);
	expect((node.children[0] as any).children[0]).toHaveProperty('text');
});

/**
 * Inline node factory defaults
 */

test('CreateBoldNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateBoldNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastInlineNodeTypes.Bold);
	expect(node.children).toHaveLength(0);
});

test('CreateItalicNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateItalicNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastInlineNodeTypes.Italic);
	expect(node.children).toHaveLength(0);
});

test('CreateLinkNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateLinkNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(3);
	expect(node.type).toBe(YeastInlineNodeTypes.Link);
	expect(node.children).toHaveLength(0);
	expect(node.href).toBe('');
});

test('CreateStrikethroughNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateStrikethroughNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastInlineNodeTypes.Strikethrough);
	expect(node.children).toHaveLength(0);
});

test('CreateInlineCodeNode defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateInlineCodeNode();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(2);
	expect(node.type).toBe(YeastInlineNodeTypes.Code);
	expect(node.children).toHaveLength(0);
});

/**
 * Text node factory defaults
 */

test('CreateText defaults', () => {
	// Create node
	const node = YeastNodeFactory.CreateText();
	expect(node).not.toBeUndefined();

	// Check properties
	expect(Object.keys(node)).toHaveLength(1);
	expect(node.text).toBe('');
});

/**
 * Test node type
 */

test('YeastChild is Text', () => {
	expect(isYeastTextNode(textNode)).toBe(true);
	expect(isYeastTextNode(inlineNode)).toBe(false);
	expect(isYeastTextNode(blockNode)).toBe(false);
	expect(isYeastTextNode(ogYeastNode)).toBe(false);
});

test('YeastChild is inline', () => {
	expect(isYeastInlineNode(textNode)).toBe(false);
	expect(isYeastInlineNode(blockNode)).toBe(false);
	expect(isYeastInlineNode(ogYeastNode)).toBe(false);
	expect(isYeastInlineNode(inlineNode)).toBe(true);
});

test('YeastChild is block', () => {
	expect(isYeastBlockNode(textNode)).toBe(false);
	expect(isYeastBlockNode(inlineNode)).toBe(false);
	expect(isYeastBlockNode(ogYeastNode)).toBe(false);
	expect(isYeastBlockNode(blockNode)).toBe(true);
});

test('YeastChild is YeastNode', () => {
	expect(isYeastNode(textNode)).toBe(false);
	expect(isYeastNode(blockNode)).toBe(true);
	expect(isYeastNode(inlineNode)).toBe(true);
	expect(isYeastNode(ogYeastNode)).toBe(true);
});

test('scrapeText gets the text', () => {
	expect(scrapeText(textNode)).toBe('Hello world');
	expect(scrapeText(blockNode)).toBe("Hello world I'm paragraph p");
	expect(scrapeText(inlineNode)).toBe("Hello World I'm bold");
	expect(scrapeText(ogYeastNode)).toBe('I have kids?');
});

test('isYeastNodeType checks the type', () => {
	// Not a node, expect check to fail
	expect(isYeastNodeType(textNode, undefined)).toBe(false);
	// Same case
	expect(isYeastNodeType(blockNode, YeastBlockNodeTypes.Paragraph)).toBe(true);
	expect(isYeastNodeType(inlineNode, YeastInlineNodeTypes.Bold)).toBe(true);
	// Not same case
	expect(isYeastNodeType(blockNode, 'PARAgraph')).toBe(true);
	// Arbitrary custom node type
	expect(isYeastNodeType(ogYeastNode, 'who knows')).toBe(true);
});
