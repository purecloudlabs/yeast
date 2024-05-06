import { BlockCodeNode, BlockquoteNode, BoldNode, CalloutNode, ContentGroupItemNode, ContentGroupNode, DocumentNode, HeadingNode, HorizontalRuleNode, ImageNode, InlineCodeNode, ItalicNode, LinkNode, ListItemNode, ListNode, ParagraphNode, StrikethroughNode, TableCellNode, TableNode, TableRowNode, YeastBlockNodeTypes, YeastInlineNodeTypes, YeastNode, YeastText } from './';
declare class YeastNodeFactory {
    Create(type: YeastBlockNodeTypes | YeastInlineNodeTypes | 'text', attributes?: {
        [key: string]: any;
    }): YeastNode | YeastText | undefined;
    CreateBlockquoteNode(from?: BlockquoteNode): BlockquoteNode;
    CreateCalloutNode(from?: CalloutNode): CalloutNode;
    CreateBlockCodeNode(from?: BlockCodeNode): BlockCodeNode;
    CreateContentGroupNode(from?: ContentGroupNode): ContentGroupNode;
    CreateContentGroupItemNode(from?: ContentGroupItemNode): ContentGroupItemNode;
    CreateDocumentNode(from?: DocumentNode): DocumentNode;
    CreateHeadingNode(from?: HeadingNode): HeadingNode;
    CreateImageNode(from?: ImageNode): ImageNode;
    CreateHorizontalRuleNode(from?: HorizontalRuleNode): HorizontalRuleNode;
    CreateListNode(from?: ListNode): ListNode;
    CreateListItemNode(from?: ListItemNode): ListItemNode;
    CreateParagraphNode(from?: ParagraphNode): ParagraphNode;
    CreateTableNode(from?: TableNode): TableNode;
    CreateTableWithStructure(rows: number, columns: number): TableNode;
    CreateTableRowNode(from?: TableRowNode): TableRowNode;
    CreateTableRowWithCells(columns: number): TableRowNode;
    CreateTableCellNode(from?: TableCellNode): TableCellNode;
    CreateBoldNode(from?: BoldNode): BoldNode;
    CreateItalicNode(from?: ItalicNode): ItalicNode;
    CreateLinkNode(from?: LinkNode): LinkNode;
    CreateStrikethroughNode(from?: StrikethroughNode): StrikethroughNode;
    CreateInlineCodeNode(from?: InlineCodeNode): InlineCodeNode;
    CreateText(from?: YeastText): YeastText;
}
declare const _default: YeastNodeFactory;
export default _default;
//# sourceMappingURL=YeastNodeFactory.d.ts.map