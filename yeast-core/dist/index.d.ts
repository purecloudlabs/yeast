import { YeastParser } from './YeastParser';
import YeastNodeFactory from './YeastNodeFactory';
import { diff } from './helpers/diff';
export { YeastParser, YeastNodeFactory, diff };
export declare enum YeastBlockNodeTypes {
    Blockquote = "blockquote",
    Callout = "callout",
    Code = "code",
    ContentGroup = "contentgroup",
    ContentGroupItem = "contentgroupitem",
    Diff = "diff",
    Document = "document",
    Heading = "heading",
    HorizontalRule = "horizontalrule",
    List = "list",
    ListItem = "listitem",
    Paragraph = "paragraph",
    PseudoParagraph = "pseudoParagraph",
    Table = "table",
    TableRow = "tablerow",
    TableCell = "tablecell"
}
export declare enum YeastInlineNodeTypes {
    Bold = "bold",
    Italic = "italic",
    Link = "link",
    Strikethrough = "strikethrough",
    Code = "inlinecode",
    Image = "image"
}
export declare enum ContentGroupType {
    accordion = "accordion",
    tabbedContent = "tabbedcontent"
}
export declare enum DiffType {
    Added = "added",
    Modified = "modified",
    Removed = "removed"
}
export declare enum DiffSource {
    Old = "old",
    New = "new"
}
export declare type DiffEntity = YeastChild | string;
export interface DiffPivotMap {
    [textProperty: string]: number;
}
export declare type YeastChild = YeastBlockNode | YeastInlineNode | YeastText | YeastNode;
export declare type YeastInlineChild = YeastInlineNode | YeastText;
export interface YeastNode {
    type: YeastBlockNodeTypes | YeastInlineNodeTypes | string;
    children?: YeastChild[];
    hasDiff?: boolean;
    diffType?: DiffType;
    diffMods?: ModificationDiffMap;
    diffPivots?: DiffPivotMap;
    isTextModification?: boolean;
    containsTextModification?: boolean;
    diffSource?: DiffSource;
}
export interface ModificationData {
    startIndex: number;
    endIndex: number;
    diffSource: DiffSource;
    modSubtype: DiffType;
}
export interface ModificationDiffMap {
    [textProperty: string]: ModificationAssignment;
}
export interface ModificationAssignment {
    oldModData: ModificationData[];
    newModData: ModificationData[];
}
export interface YeastBlockNode extends YeastNode {
    type: YeastBlockNodeTypes;
}
export interface YeastInlineNode extends YeastNode {
    type: YeastInlineNodeTypes;
}
export interface CustomComponentNode extends YeastNode {
    type: string;
    children?: YeastChild[];
    [key: string]: any;
}
export interface DocumentNode extends YeastBlockNode {
    type: YeastBlockNodeTypes.Document;
    children: YeastNode[];
    title: string;
    author?: string;
    [key: string]: any;
}
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
    align?: string;
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
export interface YeastText {
    text: string;
    hasDiff?: boolean;
    diffSource?: DiffSource;
    diffType?: DiffType;
    diffMods?: ModificationDiffMap;
    diffPivots?: DiffPivotMap;
    isTextModification?: boolean;
    containsTextModification?: boolean;
}
export interface RootNodeParserPlugin {
    parse: {
        (text: string): RootNodeParserPluginResult;
    };
}
export interface RootNodeParserPluginResult {
    remainingText: string;
    document: DocumentNode;
}
export interface BlockParserPlugin {
    parse: {
        (text: string, parser: YeastParser): void | BlockParserPluginResult;
    };
}
export interface BlockParserPluginResult {
    remainingText: string;
    nodes: YeastNode[];
}
export interface PostProcessorPlugin {
    parse: {
        (document: DocumentNode, parser: YeastParser): DocumentNode;
    };
}
export interface InlineTokenizerPlugin {
    tokenize: {
        (text: string, parser: YeastParser): void | Token[];
    };
}
export interface Token {
    start: number;
    end: number;
    from?: string;
    nodes: YeastInlineChild[];
}
export declare function isYeastNode(node: YeastChild): node is YeastNode;
export declare function isYeastInlineNode(node: YeastChild): node is YeastInlineNode;
export declare function isYeastBlockNode(node: YeastChild): node is YeastBlockNode;
export declare function isYeastTextNode(node: YeastChild): node is YeastText;
export declare function isMockListItemNode(node: any): node is MockListItemNode;
export declare function scrapeText(node: any): string;
export declare function isYeastNodeType(node: YeastChild, type: YeastBlockNodeTypes | YeastInlineNodeTypes | string): boolean;
//# sourceMappingURL=index.d.ts.map