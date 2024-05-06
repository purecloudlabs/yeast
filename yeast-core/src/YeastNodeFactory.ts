import {
	BlockCodeNode,
	BlockquoteNode,
	BoldNode,
	CalloutNode,
	ContentGroupItemNode,
	ContentGroupNode,
	ContentGroupType,
	DocumentNode,
	HeadingNode,
	HorizontalRuleNode,
	ImageNode,
	InlineCodeNode,
	ItalicNode,
	LinkNode,
	ListItemNode,
	ListNode,
	ParagraphNode,
	StrikethroughNode,
	TableCellNode,
	TableNode,
	TableRowNode,
	YeastBlockNodeTypes,
	YeastInlineNodeTypes,
	YeastNode,
	YeastText,
} from './';

class YeastNodeFactory {
	// Create is a factory to dynamically create nodes
	public Create(
		type: YeastBlockNodeTypes | YeastInlineNodeTypes | 'text',
		attributes?: { [key: string]: any }
	): YeastNode | YeastText | undefined {
		switch (type) {
			/* Block types */
			case YeastBlockNodeTypes.Blockquote: {
				const node = {
					type: YeastBlockNodeTypes.Blockquote,
					children: [],
				} as BlockquoteNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.Callout: {
				const node = {
					type: YeastBlockNodeTypes.Callout,
					children: [],
				} as CalloutNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.Code: {
				const node = {
					type: YeastBlockNodeTypes.Code,
					children: [],
				} as BlockCodeNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.ContentGroup: {
				const node = {
					type: YeastBlockNodeTypes.ContentGroup,
					children: [],
					groupType: ContentGroupType.tabbedContent,
				} as ContentGroupNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.ContentGroupItem: {
				const node = {
					type: YeastBlockNodeTypes.ContentGroupItem,
					groupType: ContentGroupType.tabbedContent,
					children: [],
				} as ContentGroupItemNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.Document: {
				const node = {
					type: YeastBlockNodeTypes.Document,
					children: [],
					title: 'New Document',
				} as DocumentNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.Heading: {
				const node = {
					type: YeastBlockNodeTypes.Heading,
					children: [],
					level: 1,
					id: '',
				} as HeadingNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.Image: {
				const node = {
					type: YeastBlockNodeTypes.Image,
					src: '',
					alt: '',
					// Note: Images don't have children!
					// children: [],
				} as ImageNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.HorizontalRule: {
				const node = {
					type: YeastBlockNodeTypes.HorizontalRule,
					// Note: Horizontal rules don't have children!
					// children: [],
				} as HorizontalRuleNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.List: {
				const node = {
					type: YeastBlockNodeTypes.List,
					children: [],
					ordered: false,
				} as ListNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.ListItem: {
				const node = {
					type: YeastBlockNodeTypes.ListItem,
					children: [],
				} as ListItemNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.Paragraph: {
				const node = {
					type: YeastBlockNodeTypes.Paragraph,
					children: [this.CreateText()],
				} as ParagraphNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.Table: {
				const node = {
					type: YeastBlockNodeTypes.Table,
					children: [],
				} as TableNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.TableRow: {
				const node = {
					type: YeastBlockNodeTypes.TableRow,
					children: [],
				} as TableRowNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastBlockNodeTypes.TableCell: {
				const node = {
					type: YeastBlockNodeTypes.TableCell,
					children: [this.CreateParagraphNode()],
				} as TableCellNode;
				applyAttributes(node, attributes);
				return node;
			}

			/* Inline types */
			case YeastInlineNodeTypes.Bold: {
				const node = {
					type: YeastInlineNodeTypes.Bold,
					children: [],
				} as BoldNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastInlineNodeTypes.Italic: {
				const node = {
					type: YeastInlineNodeTypes.Italic,
					children: [],
				} as ItalicNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastInlineNodeTypes.Link: {
				const node = {
					type: YeastInlineNodeTypes.Link,
					children: [],
					href: '',
				} as LinkNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastInlineNodeTypes.Strikethrough: {
				const node = {
					type: YeastInlineNodeTypes.Strikethrough,
					children: [],
				} as StrikethroughNode;
				applyAttributes(node, attributes);
				return node;
			}
			case YeastInlineNodeTypes.Code: {
				const node = {
					type: YeastInlineNodeTypes.Code,
					children: [],
				} as InlineCodeNode;
				applyAttributes(node, attributes);
				return node;
			}

			/* Text */
			case 'text': {
				return { text: attributes?.text || '' } as YeastText;
			}

			/* Unknown type */
			default: {
				return;
			}
		}
	}

	/**
	 * Typed block node factories
	 */
	// CreateBlockquote creates a BlockquoteNode node, optionally copying attributes from an existing node
	public CreateBlockquoteNode(from?: BlockquoteNode): BlockquoteNode {
		return this.Create(YeastBlockNodeTypes.Blockquote, from) as BlockquoteNode;
	}
	// CreateCallout creates a CalloutNode node, optionally copying attributes from an existing node
	public CreateCalloutNode(from?: CalloutNode): CalloutNode {
		return this.Create(YeastBlockNodeTypes.Callout, from) as CalloutNode;
	}
	// CreateCode creates a BlockCodeNode node, optionally copying attributes from an existing node
	public CreateBlockCodeNode(from?: BlockCodeNode): BlockCodeNode {
		return this.Create(YeastBlockNodeTypes.Code, from) as BlockCodeNode;
	}
	// CreateContentGroup creates a ContentGroupNode node, optionally copying attributes from an existing node
	public CreateContentGroupNode(from?: ContentGroupNode): ContentGroupNode {
		return this.Create(YeastBlockNodeTypes.ContentGroup, from) as ContentGroupNode;
	}
	// CreateContentGroupItem creates a ContentGroupItemNode node, optionally copying attributes from an existing node
	public CreateContentGroupItemNode(from?: ContentGroupItemNode): ContentGroupItemNode {
		return this.Create(YeastBlockNodeTypes.ContentGroupItem, from) as ContentGroupItemNode;
	}
	// CreateDocument creates a DocumentNode node, optionally copying attributes from an existing node
	public CreateDocumentNode(from?: DocumentNode): DocumentNode {
		return this.Create(YeastBlockNodeTypes.Document, from) as DocumentNode;
	}
	// CreateHeading creates a HeadingNode node, optionally copying attributes from an existing node
	public CreateHeadingNode(from?: HeadingNode): HeadingNode {
		return this.Create(YeastBlockNodeTypes.Heading, from) as HeadingNode;
	}
	// CreateImage creates a ImageNode node, optionally copying attributes from an existing node
	public CreateImageNode(from?: ImageNode): ImageNode {
		return this.Create(YeastBlockNodeTypes.Image, from) as ImageNode;
	}
	// CreateHorizontalRule creates a HorizontalRuleNode node, optionally copying attributes from an existing node
	public CreateHorizontalRuleNode(from?: HorizontalRuleNode): HorizontalRuleNode {
		return this.Create(YeastBlockNodeTypes.HorizontalRule, from) as HorizontalRuleNode;
	}
	// CreateList creates a ListNode node, optionally copying attributes from an existing node
	public CreateListNode(from?: ListNode): ListNode {
		return this.Create(YeastBlockNodeTypes.List, from) as ListNode;
	}
	// CreateListItem creates a ListItemNode node, optionally copying attributes from an existing node
	public CreateListItemNode(from?: ListItemNode): ListItemNode {
		return this.Create(YeastBlockNodeTypes.ListItem, from) as ListItemNode;
	}
	// CreateParagraph creates a ParagraphNode node, optionally copying attributes from an existing node
	public CreateParagraphNode(from?: ParagraphNode): ParagraphNode {
		return this.Create(YeastBlockNodeTypes.Paragraph, from) as ParagraphNode;
	}
	// CreateTable creates a TableNode node, optionally copying attributes from an existing node
	public CreateTableNode(from?: TableNode): TableNode {
		return this.Create(YeastBlockNodeTypes.Table, from) as TableNode;
	}
	// CreateTableWithStructure creates a TableNode node initialized with the specified number of rows and cells
	public CreateTableWithStructure(rows: number, columns: number): TableNode {
		const newTable = this.Create(YeastBlockNodeTypes.Table) as TableNode;
		while (newTable.children.length < rows) {
			newTable.children.push(this.CreateTableRowWithCells(columns));
		}
		return newTable;
	}
	// CreateTableRow creates a TableRowNode node, optionally copying attributes from an existing node
	public CreateTableRowNode(from?: TableRowNode): TableRowNode {
		return this.Create(YeastBlockNodeTypes.TableRow, from) as TableRowNode;
	}
	// CreateTableRowWithCells creates a TableRowNode initialized with the specified number of cells
	public CreateTableRowWithCells(columns: number): TableRowNode {
		const newRow = this.Create(YeastBlockNodeTypes.TableRow) as TableRowNode;
		while (newRow.children.length < columns) {
			newRow.children.push(this.CreateTableCellNode());
		}
		return newRow;
	}
	// CreateTableCell creates a TableCellNode node, optionally copying attributes from an existing node
	public CreateTableCellNode(from?: TableCellNode): TableCellNode {
		return this.Create(YeastBlockNodeTypes.TableCell, from) as TableCellNode;
	}

	/**
	 * Typed inline node factories
	 */
	// CreateBoldNode creates a BoldNode node, optionally copying attributes from an existing node
	public CreateBoldNode(from?: BoldNode): BoldNode {
		return this.Create(YeastInlineNodeTypes.Bold, from) as BoldNode;
	}
	// CreateItalicNode creates a ItalicNode node, optionally copying attributes from an existing node
	public CreateItalicNode(from?: ItalicNode): ItalicNode {
		return this.Create(YeastInlineNodeTypes.Italic, from) as ItalicNode;
	}
	// CreateLinkNode creates a LinkNode node, optionally copying attributes from an existing node
	public CreateLinkNode(from?: LinkNode): LinkNode {
		return this.Create(YeastInlineNodeTypes.Link, from) as LinkNode;
	}
	// CreateStrikethroughNode creates a StrikethroughNode node, optionally copying attributes from an existing node
	public CreateStrikethroughNode(from?: StrikethroughNode): StrikethroughNode {
		return this.Create(YeastInlineNodeTypes.Strikethrough, from) as StrikethroughNode;
	}
	// CreateInlineCodeNode creates a InlineCodeNode node, optionally copying attributes from an existing node
	public CreateInlineCodeNode(from?: InlineCodeNode): InlineCodeNode {
		return this.Create(YeastInlineNodeTypes.Code, from) as InlineCodeNode;
	}

	/**
	 * Typed text node factory
	 */
	// CreateText creates a YeastText node, optionally copying attributes from an existing node
	public CreateText(from?: YeastText): YeastText {
		return this.Create('text', from) as YeastText;
	}
}

export default new YeastNodeFactory() as YeastNodeFactory;

const RESERVED_ATTR_NAMES = ['type'];

function applyAttributes(node: YeastNode, attributes?: { [key: string]: any }) {
	if (!attributes) return;
	Object.entries(attributes)
		.filter(([key, value]) => !RESERVED_ATTR_NAMES.includes(key.toLowerCase()))
		.forEach(([key, value]) => (node[key] = value));
}
