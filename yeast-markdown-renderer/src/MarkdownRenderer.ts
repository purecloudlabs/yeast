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
	isYeastNode,
	isYeastTextNode,
	ItalicNode,
	LinkNode,
	ListItemNode,
	ListNode,
	ParagraphNode,
	StrikethroughNode,
	TableCellNode,
	TableNode,
	TableRowNode,
	YeastBlockNode,
	YeastBlockNodeTypes,
	YeastChild,
	YeastInlineNode,
	YeastInlineNodeTypes,
	YeastText,
} from 'yeast-core';

import renderCustomComponent from './YeastNodeTypes/CustomComponentRenderer';
import renderBlockCodeNode from './YeastNodeTypes/BlockCodeNode';
import renderBlockquoteNode from './YeastNodeTypes/BlockquoteNode';
import renderBoldNode from './YeastNodeTypes/BoldNode';
import renderCalloutNode from './YeastNodeTypes/CalloutNode';
import renderContentGroupItemNode from './YeastNodeTypes/ContentGroupItemNode';
import renderContentGroupNode from './YeastNodeTypes/ContentGroupNode';
import renderHeadingNode from './YeastNodeTypes/HeadingNode';
import renderHorizontalRuleNode from './YeastNodeTypes/HorizontalRuleNode';
import renderImageNode from './YeastNodeTypes/ImageNode';
import renderInlineCodeNode from './YeastNodeTypes/InlineCodeNode';
import renderItalicNode from './YeastNodeTypes/ItalicNode';
import renderLinkNode from './YeastNodeTypes/LinkNode';
import renderListItemNode from './YeastNodeTypes/ListItemNode';
import renderListNode from './YeastNodeTypes/ListNode';
import renderParagraphNode from './YeastNodeTypes/ParagraphNode';
import renderStrikethroughode from './YeastNodeTypes/StrikethorughNode';
import renderTableCellNode from './YeastNodeTypes/TableCell';
import renderTableNode from './YeastNodeTypes/TableNode';
import renderTableRowNode from './YeastNodeTypes/TableRowNode';

export interface NodeRendererPlugin {
	(node: YeastChild, renderer: MarkdownRenderer): string | undefined;
}

type NodeRendererMapKeys = YeastBlockNodeTypes | YeastInlineNodeTypes | string;
type NodeRendererMap = {
	[nodeType in NodeRendererMapKeys]: NodeRendererPlugin | undefined;
};

export class MarkdownRenderer {
	defaultRenderers: NodeRendererMap = {
		[YeastInlineNodeTypes.Bold]: (node: BoldNode, renderer: MarkdownRenderer) => {
			return renderBoldNode(node, renderer);
		},
		[YeastInlineNodeTypes.Code]: (node: InlineCodeNode, renderer: MarkdownRenderer) => {
			return renderInlineCodeNode(node, renderer);
		},
		[YeastInlineNodeTypes.Italic]: (node: ItalicNode, renderer: MarkdownRenderer) => {
			return renderItalicNode(node, renderer);
		},
		[YeastInlineNodeTypes.Link]: (node: LinkNode, renderer: MarkdownRenderer) => {
			return renderLinkNode(node, renderer);
		},
		[YeastInlineNodeTypes.Strikethrough]: (node: StrikethroughNode, renderer: MarkdownRenderer) => {
			return renderStrikethroughode(node, renderer);
		},
		[YeastBlockNodeTypes.Paragraph]: (node: ParagraphNode, renderer: MarkdownRenderer) => {
			return renderParagraphNode(node, renderer);
		},
		[YeastBlockNodeTypes.Blockquote]: (node: BlockquoteNode, renderer: MarkdownRenderer) => {
			return renderBlockquoteNode(node, renderer);
		},
		[YeastBlockNodeTypes.Callout]: (node: CalloutNode, renderer: MarkdownRenderer) => {
			return renderCalloutNode(node, renderer);
		},
		[YeastBlockNodeTypes.Code]: (node: BlockCodeNode, renderer: MarkdownRenderer) => {
			return renderBlockCodeNode(node, renderer);
		},
		[YeastBlockNodeTypes.ContentGroup]: (node: ContentGroupNode, renderer: MarkdownRenderer) => {
			return renderContentGroupNode(node, renderer);
		},
		[YeastBlockNodeTypes.ContentGroupItem]: (node: ContentGroupItemNode, renderer: MarkdownRenderer) => {
			return renderContentGroupItemNode(node, renderer);
		},
		[YeastBlockNodeTypes.Heading]: (node: HeadingNode, renderer: MarkdownRenderer) => {
			return renderHeadingNode(node, renderer);
		},
		[YeastBlockNodeTypes.HorizontalRule]: () => {
			return renderHorizontalRuleNode();
		},
		[YeastInlineNodeTypes.Image]: (node: ImageNode, renderer: MarkdownRenderer) => {
			return renderImageNode(node, renderer);
		},
		[YeastBlockNodeTypes.List]: (node: ListNode, renderer: MarkdownRenderer) => {
			return renderListNode(node, renderer);
		},
		[YeastBlockNodeTypes.ListItem]: (node: ListItemNode, renderer: MarkdownRenderer) => {
			return renderListItemNode(node, renderer);
		},
		[YeastBlockNodeTypes.Table]: (node: TableNode, renderer: MarkdownRenderer) => {
			return renderTableNode(node, renderer);
		},
		[YeastBlockNodeTypes.TableRow]: (node: TableRowNode, renderer: MarkdownRenderer) => {
			return renderTableRowNode(node, renderer);
		},
		[YeastBlockNodeTypes.TableCell]: (node: TableCellNode, renderer: MarkdownRenderer) => {
			return renderTableCellNode(node, renderer);
		},
	};
	customRenderers?: NodeRendererMap;
	unhandledNodeRenderer?: NodeRendererPlugin;

	constructor(customRenderers?: NodeRendererMap) {
		this.customRenderers = customRenderers;
	}

	renderComponents(nodes: YeastChild[] | undefined): string[] {
		if (!nodes) return;
		return nodes.map((node) => {
			let rendered = this.renderComponent(node, this.customRenderers);
			if (!!rendered) return rendered;

			rendered = this.renderComponent(node, this.defaultRenderers);
			if (rendered == '' || !!rendered) return rendered;

			if (!rendered && this.unhandledNodeRenderer) {
				rendered = this.unhandledNodeRenderer(node, this);
				if (!!rendered) return rendered;
			}

			if (!rendered) {
				if (isYeastTextNode(node) && !isYeastNode(node)) {
					const typedNode = node as YeastText;
					return typedNode.text;
				} else {
					console.log('Unhandled node', node);
					return renderCustomComponent(node); //return custom component
				}
			}
		});
	}

	renderComponent(node: YeastChild, renderers: NodeRendererMap): string {
		if (!node || !renderers) return;

		//Untyped nodes aren't handled here
		if (!(node as any).type) return;
		const typedNode = node as YeastBlockNode | YeastInlineNode;
		typedNode.children = typedNode.children || [];
		//process renderers
		let markdownString: string;

		Object.entries(renderers).some(([nodeType, plugin]) => {
			if (typedNode.type === nodeType) {
				markdownString = plugin(node, this);
			}
			return !!markdownString;
		});

		return markdownString;
	}

	renderMarkdown(astDocument: DocumentNode): string {
		let documentChildren = this.renderComponents(astDocument.children).join('');

		let documentInfo = '---\n';
		Object.entries(astDocument).forEach(([key, value]) => {
			if (key !== 'children' && key !== 'type') {
				documentInfo += `${key}: ${value}\n`;
			}
		});
		documentInfo += '---\n';
		let markdownVal = '';
		markdownVal += documentInfo + documentChildren;
		return markdownVal;
	}
}
