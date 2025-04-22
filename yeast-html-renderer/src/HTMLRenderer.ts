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
import { JSDOM } from 'jsdom';

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

export type RenderedNode = HTMLElement | string;

export interface NodeRendererPlugin {
	(node: YeastChild, renderer: HTMLRenderer): RenderedNode | undefined;
}

type NodeRendererMapKeys = YeastBlockNodeTypes | YeastInlineNodeTypes | string;
type NodeRendererMap = {
	[nodeType in NodeRendererMapKeys]: NodeRendererPlugin | undefined;
};

export class HTMLRenderer {
	document: Document = new JSDOM(`...`).window.document;
	defaultRenderers: NodeRendererMap = {
		[YeastInlineNodeTypes.Bold]: (node: BoldNode, renderer: HTMLRenderer) => {
			return renderBoldNode(node, renderer);
		},
		// [YeastInlineNodeTypes.Code]: (node: InlineCodeNode, renderer: HTMLRenderer) => {
		// 	return renderInlineCodeNode(node, renderer);
		// },
		// [YeastInlineNodeTypes.Italic]: (node: ItalicNode, renderer: HTMLRenderer) => {
		// 	return renderItalicNode(node, renderer);
		// },
		// [YeastInlineNodeTypes.Link]: (node: LinkNode, renderer: HTMLRenderer) => {
		// 	return renderLinkNode(node, renderer);
		// },
		// [YeastInlineNodeTypes.Strikethrough]: (node: StrikethroughNode, renderer: HTMLRenderer) => {
		// 	return renderStrikethroughode(node, renderer);
		// },
		// [YeastBlockNodeTypes.Paragraph]: (node: ParagraphNode, renderer: HTMLRenderer) => {
		// 	return renderParagraphNode(node, renderer);
		// },
		// [YeastBlockNodeTypes.Blockquote]: (node: BlockquoteNode, renderer: HTMLRenderer) => {
		// 	return renderBlockquoteNode(node, renderer);
		// },
		// [YeastBlockNodeTypes.Callout]: (node: CalloutNode, renderer: HTMLRenderer) => {
		// 	return renderCalloutNode(node, renderer);
		// },
		// [YeastBlockNodeTypes.Code]: (node: BlockCodeNode, renderer: HTMLRenderer) => {
		// 	return renderBlockCodeNode(node, renderer);
		// },
		// [YeastBlockNodeTypes.ContentGroup]: (node: ContentGroupNode, renderer: HTMLRenderer) => {
		// 	return renderContentGroupNode(node, renderer);
		// },
		// [YeastBlockNodeTypes.ContentGroupItem]: (node: ContentGroupItemNode, renderer: HTMLRenderer) => {
		// 	return renderContentGroupItemNode(node, renderer);
		// },
		[YeastBlockNodeTypes.Heading]: (node: HeadingNode, renderer: HTMLRenderer) => {
			return renderHeadingNode(node, renderer);
		},
		// [YeastBlockNodeTypes.HorizontalRule]: () => {
		// 	return renderHorizontalRuleNode();
		// },
		// [YeastInlineNodeTypes.Image]: (node: ImageNode, renderer: HTMLRenderer) => {
		// 	return renderImageNode(node, renderer);
		// },
		// [YeastBlockNodeTypes.List]: (node: ListNode, renderer: HTMLRenderer) => {
		// 	return renderListNode(node, renderer);
		// },
		// [YeastBlockNodeTypes.ListItem]: (node: ListItemNode, renderer: HTMLRenderer) => {
		// 	return renderListItemNode(node, renderer);
		// },
		// [YeastBlockNodeTypes.Table]: (node: TableNode, renderer: HTMLRenderer) => {
		// 	return renderTableNode(node, renderer);
		// },
		// [YeastBlockNodeTypes.TableRow]: (node: TableRowNode, renderer: HTMLRenderer) => {
		// 	return renderTableRowNode(node, renderer);
		// },
		// [YeastBlockNodeTypes.TableCell]: (node: TableCellNode, renderer: HTMLRenderer) => {
		// 	return renderTableCellNode(node, renderer);
		// },
	};
	customRenderers?: NodeRendererMap;
	unhandledNodeRenderer?: NodeRendererPlugin;

	constructor(customRenderers?: NodeRendererMap) {
		this.customRenderers = customRenderers;
	}

	renderComponents(nodes: YeastChild[] | undefined): RenderedNode[] {
		if (!nodes) return;
		return nodes.map((node) => {
			let rendered = this.renderComponent(node, this.customRenderers);
			if (!!rendered) return rendered;

			rendered = this.renderComponent(node, this.defaultRenderers);
			if (!!rendered) return rendered;

			if (!rendered && this.unhandledNodeRenderer) {
				rendered = this.unhandledNodeRenderer(node, this);
				if (!!rendered) return rendered;
			}

			if (!rendered) {
				if (isYeastTextNode(node) && !isYeastNode(node)) {
					return node.text;
				} else {
					return renderCustomComponent(node, this); //return custom component
				}
			}
		});
	}

	renderComponent(node: YeastChild, renderers: NodeRendererMap): RenderedNode {
		if (!node || !renderers) return;

		// Untyped nodes aren't handled here
		if (!(node as any).type) return;
		const typedNode = node as YeastBlockNode | YeastInlineNode;
		typedNode.children = typedNode.children || [];

		// Process renderers
		let nodeElement: RenderedNode;
		const htmlRenderer = this;
		Object.entries(renderers).some(([nodeType, plugin]) => {
			if (typedNode.type === nodeType) {
				nodeElement = plugin(node, htmlRenderer);
			}
			return !!nodeElement;
		});

		return nodeElement;
	}

	renderHTML(astDocument: DocumentNode): RenderedNode[] {
		let documentChildren = this.renderComponents(astDocument.children);

		return documentChildren;
	}

	renderHTMLString(astDocument: DocumentNode): string {
		return this.renderHTML(astDocument)
			.map((element) => (typeof element === 'string' ? element : element.outerHTML))
			.join('\n');
	}
}
