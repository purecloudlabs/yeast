import { YeastParser } from './YeastParser';
import YeastNodeFactory from './YeastNodeFactory';
import { diff, mapAnchorPath } from './helpers/diff';

export { YeastParser, YeastNodeFactory, diff, mapAnchorPath };

// Nodes meant to be displayed as a block element (e.g. div)
export enum YeastBlockNodeTypes {
	Blockquote = 'blockquote',
	Callout = 'callout',
	Code = 'code',
	ContentGroup = 'contentgroup', // TODO: combined node type for accordions and tab groups. Same exact info with "format" discriminator for accordion/tab
	ContentGroupItem = 'contentgroupitem', // TODO: has a prop for tab name and children[]
	Diff = 'diff',
	Document = 'document',
	Heading = 'heading',
	HorizontalRule = 'horizontalrule',
	List = 'list',
	ListItem = 'listitem',
	Paragraph = 'paragraph',
	PseudoParagraph = 'pseudoParagraph',
	Table = 'table',
	TableRow = 'tablerow',
	TableCell = 'tablecell',
}

// Nodes meant to be displayed as an inline element (e.g. span)
export enum YeastInlineNodeTypes {
	Bold = 'bold',
	Italic = 'italic',
	Link = 'link',
	Strikethrough = 'strikethrough',
	Code = 'inlinecode',
	Image = 'image',
}

// displays to ContentGroup & ContentGroupItem nodes
export enum ContentGroupType {
	accordion = 'accordion',
	tabbedContent = 'tabbedcontent',
}

// DiffType enumerates the possible change types for yeast node during the changeset diffing process
export enum DiffType {
	Added = 'added',
	Modified = 'modified',
	Removed = 'removed',
}

// DiffSource enumerates the possible sources of a node being diffed
export enum DiffSource {
	Old = 'old',
	New = 'new',
}

// DiffEntity contains the types that can be diffed
export type DiffEntity = YeastChild | string;

// DiffPivotMap maps text properties within a node to the index in the value string that divides the old string from the new string for diff display purposes.
export interface DiffPivotMap {
	[textProperty: string]: number;
}

// YeastChild is the most permissive definition for a child
export type YeastChild = YeastBlockNode | YeastInlineNode | YeastText | YeastNode;
// YeastInlineChild is any child type that is an inline element
export type YeastInlineChild = YeastInlineNode | YeastText;

// YeastNode is the root interface for all nodes
export interface YeastNode {
	type: YeastBlockNodeTypes | YeastInlineNodeTypes | string;
	children?: YeastChild[];
	hasDiff?: boolean;
	diffType?: DiffType;
	diffMods?: ModificationDiffMap;
	diffPivots?: DiffPivotMap;
	isTextModification?: boolean;
	containsDiff?: boolean;
	diffSource?: DiffSource;
	oldNodePath?: number[];
	newNodePath?: number[];
}

// ModificationData contains the start and end indices for a substring that has been modifed. Used by the diff process.
export interface ModificationData {
	startIndex: number;
	endIndex: number;
	diffSource: DiffSource;
	modSubtype: DiffType;
}

// ModificationDiffMap contains the ModificationAssignment data per text property
export interface ModificationDiffMap {
	[textProperty: string]: ModificationAssignment;
}

// ModificationAssignment contains assignments for old and new ModificationData arrays
export interface ModificationAssignment {
	oldModData: ModificationData[];
	newModData: ModificationData[];
}

// YeastBlockNode implies the node is meant to be displayed as a block element (e.g. div)
export interface YeastBlockNode extends YeastNode {
	type: YeastBlockNodeTypes;
}
// YeastInlineNode implies the node is meant to be displayed as an inline element (e.g. span)
export interface YeastInlineNode extends YeastNode {
	type: YeastInlineNodeTypes;
}
// CustomComponentNode represents an arbitrary node format and may not be of a built-in type
export interface CustomComponentNode extends YeastNode {
	type: string;
	children?: YeastChild[];
	// Generic accessor for arbitrary attributes used by custom component implementations
	[key: string]: any;
}

// DocumentNode is the singular root element for all yeast documents; it's not valid as a child of anything
export interface DocumentNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.Document;
	children: YeastNode[];
	// Known document properties
	title: string;
	author?: string;
	// Generic accessor for arbitrary attributes (e.g. user-defined frontmatter)
	[key: string]: any;
}

/**
 * Block nodes
 */

export interface ParagraphNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.Paragraph;
	children?: YeastChild[];
	indentation: number;
}

export interface PseudoParagraphNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.PseudoParagraph;
	isLastLine?: boolean;
	children?: YeastChild[];
	indentation: number;
}

export interface HeadingNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.Heading;
	children: YeastInlineChild[];
	level: number;
	id: string;
}

export interface HorizontalRuleNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.HorizontalRule;
	children: never;
}

export interface ListNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.List;
	children: (ListItemNode | ListNode)[];
	ordered?: boolean;
	start?: number;
	level?: number;
}

export interface ListItemNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.ListItem;
	children: YeastChild[];
	level?: number;
}

//For parsing purposes
export interface MockListItemNode extends ListItemNode {
	marker: string;
}

export interface TableNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.Table;
	children: TableRowNode[];
	indentation: number;
	sortable?: boolean;
	filterable?: boolean;
	paginated?: boolean;
	align?: string; //format 'L|R|C' for three columns left right center align
}

export interface TableRowNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.TableRow;
	children: TableCellNode[];
	header?: boolean;
}

export interface TableCellNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.TableCell;
	children: YeastChild[];
	align?: string;
}

export interface CalloutNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.Callout;
	children: YeastChild[];
	alertType?: 'info' | 'success' | 'critical' | 'warning' | 'toast';
	title?: string;
	collapsible?: boolean;
	autoCollapse?: boolean;
	indentation?: number;
	className?: string;
}

export interface BlockquoteNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.Blockquote;
	children: YeastChild[];
}

export interface BlockCodeNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.Code;
	children: never;
	value: string;
	language: string;
	title?: string;
	autoCollapse?: boolean;
	noCollapse?: boolean;
	tabsToSpaces?: number;
	showLineNumbers?: boolean;
	indentation?: number;
}

export interface ContentGroupNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.ContentGroup;
	groupType: ContentGroupType;
	children: ContentGroupItemNode[];
}

export interface ContentGroupItemNode extends YeastBlockNode {
	type: YeastBlockNodeTypes.ContentGroupItem;
	groupType: ContentGroupType;
	title: string;
	children: YeastChild[];
}

/**
 * Inline nodes
 */
export interface LinkNode extends YeastInlineNode {
	type: YeastInlineNodeTypes.Link;
	children: YeastInlineChild[];
	href: string;
	title?: string;
	forceNewTab?: boolean;
}

export interface BoldNode extends YeastInlineNode {
	type: YeastInlineNodeTypes.Bold;
	children: YeastInlineChild[];
}

export interface StrikethroughNode extends YeastInlineNode {
	type: YeastInlineNodeTypes.Strikethrough;
	children: YeastInlineChild[];
}

export interface ItalicNode extends YeastInlineNode {
	type: YeastInlineNodeTypes.Italic;
	children: YeastInlineChild[];
}

export interface InlineCodeNode extends YeastInlineNode {
	type: YeastInlineNodeTypes.Code;
	children: YeastInlineChild[];
}

export interface ImageNode extends YeastInlineNode {
	type: YeastInlineNodeTypes.Image;
	src: string;
	alt?: string;
	title?: string;
	children: never;
}

/**
 * Non-nodes
 */

// YeastText is the actual string of characters with attributes for styling directives. It is not a type node, though it can exist as a child.
export interface YeastText {
	text: string;
	hasDiff?: boolean;
	diffSource?: DiffSource;
	diffType?: DiffType;
	diffMods?: ModificationDiffMap;
	diffPivots?: DiffPivotMap;
	isTextModification?: boolean;
	containsDiff?: boolean;
	oldNodePath?: number;
	newNodePath?: number;
	// bold?: boolean;
	// italic?: boolean;
	// strikethrough?: boolean;
	// code?: boolean;
	// color?: string;
}

/**
 * Root node parser
 */

// RootNodeParserPlugin is a plugin that separates content (i.e. markdown) from metadata (i.e. frontmatter)
export interface RootNodeParserPlugin {
	// parse is responsible for parsing document metadata from the input text, then returning the root document and the text that remains to be
	// parsed as the content. The plugin _can_ add children to the document, but this is not typical.
	parse: { (text: string): RootNodeParserPluginResult };
}

export interface RootNodeParserPluginResult {
	remainingText: string;
	document: DocumentNode;
}

/**
 * Block parser
 */

export interface BlockParserPlugin {
	parse: { (text: string, parser: YeastParser): void | BlockParserPluginResult };
}

export interface BlockParserPluginResult {
	remainingText: string;
	nodes: YeastNode[];
}

/**
 * For post processing AST documents
 */

export interface PostProcessorPlugin {
	parse: { (document: DocumentNode, parser: YeastParser): DocumentNode };
}

/**
 * Inline tokenizer
 */

export interface InlineTokenizerPlugin {
	tokenize: { (text: string, parser: YeastParser): void | Token[] };
}

export interface Token {
	start: number;
	end: number;
	from?: string;
	nodes: YeastInlineChild[];
}

export function isYeastNode(node: YeastChild): node is YeastNode {
	return (node as YeastNode).type !== undefined;
}

export function isYeastInlineNode(node: YeastChild): node is YeastInlineNode {
	return Object.values(YeastInlineNodeTypes).includes((node as YeastInlineNode).type);
}

export function isYeastBlockNode(node: YeastChild): node is YeastBlockNode {
	return Object.values(YeastBlockNodeTypes).includes((node as YeastBlockNode).type);
}

export function isYeastTextNode(node: YeastChild): node is YeastText {
	return (node as YeastText).text !== undefined;
}

export function isMockListItemNode(node: any): node is MockListItemNode {
	return (node as MockListItemNode).marker !== undefined;
}

export function scrapeText(node: any): string {
	let s = '';
	if (Array.isArray(node.children)) s += node.children.map(scrapeText).join();
	if (node.text) s += node.text;
	return s;
}

export function isYeastNodeType(node: YeastChild, type: YeastBlockNodeTypes | YeastInlineNodeTypes | string): boolean {
	return node.hasOwnProperty('type') && (node as { type: string }).type.toLowerCase() === type.toLowerCase();
}
