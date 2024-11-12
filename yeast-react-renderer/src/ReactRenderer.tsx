import { DxAccordion, DxTabPanel } from 'genesys-react-components';
import './styles/ReactRenderer.scss';
import React, { ReactNode } from 'react';
import {
	YeastBlockNodeTypes,
	ParagraphNode,
	HeadingNode,
	ListNode,
	ListItemNode,
	YeastInlineNodeTypes,
	BoldNode,
	ItalicNode,
	InlineCodeNode,
	BlockCodeNode,
	LinkNode,
	CalloutNode,
	TableNode,
	ImageNode,
	BlockquoteNode,
	ContentGroupNode,
	ContentGroupItemNode,
	StrikethroughNode,
	YeastChild,
	YeastText,
	YeastBlockNode,
	YeastInlineNode,
	HorizontalRuleNode,
} from 'yeast-core';
import { v4 as uuidv4 } from 'uuid';

import BlockCodeNodeRenderer from './YeastNodeTypes/BlockCodeNodeRenderer';
import BlockQuoteNodeRenderer from './YeastNodeTypes/BlockQuoteNodeRenderer';
import BoldNodeRenderer from './YeastNodeTypes/BoldNodeRenderer';
import CalloutNodeRenderer from './YeastNodeTypes/CalloutNodeRenderer';
import ContentGroupNodeRenderer from './YeastNodeTypes/ContentGroupNodeRenderer';
import HeadingNodeRenderer from './YeastNodeTypes/HeadingNodeRenderer';
import ImageNodeRenderer from './YeastNodeTypes/ImageNodeRenderer';
import InlineCodeNodeRenderer from './YeastNodeTypes/InlineCodeNodeRenderer';
import ItalicNodeRenderer from './YeastNodeTypes/ItalicNodeRenderer';
import LinkNodeRenderer from './YeastNodeTypes/LinkNodeRenderer';
import ListItemNodeRenderer from './YeastNodeTypes/ListItemNodeRenderer';
import ListNodeRenderer from './YeastNodeTypes/ListNodeRenderer';
import ParagraphNodeRenderer from './YeastNodeTypes/PragraphNodeRenderer';
import StrikethroughNodeRenderer from './YeastNodeTypes/StrikethroughNodeRenderer';
import TableNodeRenderer from './YeastNodeTypes/TableNodeRenderer';
import HorizontalRuleNodeRenderer from './YeastNodeTypes/HorizontalRuleNodeRenderer';

import { DiffRenderData, getDiffRenderData } from './helpers/diff';
import CmsApi, { CMSProperties } from './helpers/types';

export interface NodeRendererPlugin {
	(node: YeastChild, renderer: ReactRenderer): ReactNode | undefined;
}

export type NodeRendererMapKeys = YeastBlockNodeTypes | YeastInlineNodeTypes | string;
export type NodeRendererMap = {
	[nodeType in NodeRendererMapKeys]: NodeRendererPlugin | undefined;
};

export type RenderComponentsFunction = {
	(nodes: YeastChild[] | undefined, renderers: NodeRendererMap, unhandledNodeRenderer?: NodeRendererPlugin): ReactNode;
};

export class ReactRenderer {
	defaultRenderers: NodeRendererMap = {
		[YeastBlockNodeTypes.Paragraph]: (node: ParagraphNode, renderer: ReactRenderer) => {
			return <ParagraphNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastBlockNodeTypes.Heading]: (node: HeadingNode, renderer: ReactRenderer) => {
			return <HeadingNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastBlockNodeTypes.List]: (node: ListNode, renderer: ReactRenderer) => {
			return <ListNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastBlockNodeTypes.ListItem]: (node: ListItemNode, renderer: ReactRenderer) => {
			return <ListItemNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastInlineNodeTypes.Bold]: (node: BoldNode, renderer: ReactRenderer) => {
			return <BoldNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastInlineNodeTypes.Italic]: (node: ItalicNode, renderer: ReactRenderer) => {
			return <ItalicNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastInlineNodeTypes.Code]: (node: InlineCodeNode, renderer: ReactRenderer) => {
			return <InlineCodeNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastBlockNodeTypes.Code]: (node: BlockCodeNode, renderer: ReactRenderer) => {
			return <BlockCodeNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastInlineNodeTypes.Link]: (node: LinkNode, renderer: ReactRenderer) => {
			return <LinkNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastBlockNodeTypes.Callout]: (node: CalloutNode, renderer: ReactRenderer) => {
			return <CalloutNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastBlockNodeTypes.Table]: (node: TableNode, renderer: ReactRenderer) => {
			return <TableNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastInlineNodeTypes.Image]: (node: ImageNode, renderer: ReactRenderer) => {
			return <ImageNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastBlockNodeTypes.HorizontalRule]: (node: HorizontalRuleNode, renderer: ReactRenderer) => {
			return <HorizontalRuleNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastBlockNodeTypes.Blockquote]: (node: BlockquoteNode, renderer: ReactRenderer) => {
			return <BlockQuoteNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastBlockNodeTypes.ContentGroup]: (node: ContentGroupNode, renderer: ReactRenderer) => {
			return <ContentGroupNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
		[YeastBlockNodeTypes.ContentGroupItem]: (node: ContentGroupItemNode, renderer: ReactRenderer) => {
			if (node.groupType === 'accordion') {
				return <DxAccordion title={node.title}>{renderer.renderComponents(node.children)}</DxAccordion>;
			} else if (node.groupType === 'tabbedcontent') {
				return <DxTabPanel title={node.title}>{renderer.renderComponents(node.children)}</DxTabPanel>;
			}
		},
		[YeastInlineNodeTypes.Strikethrough]: (node: StrikethroughNode, renderer: ReactRenderer) => {
			return <StrikethroughNodeRenderer key={uuidv4()} node={node} renderer={renderer} />;
		},
	};
	customRenderers?: NodeRendererMap;
	unhandledNodeRenderer?: NodeRendererPlugin;

	constructor(customRenderers?: NodeRendererMap) {
		this.customRenderers = customRenderers;
	}

	renderComponents(nodes: YeastChild[] | undefined): ReactNode {
		if (!nodes) return;
		return nodes.map((node, i) => {
			// Render the node using custom renderers
			let rendered = this.renderComponent(node, this.customRenderers);
			if (!!rendered) return rendered;

			// Render the node using defaults
			rendered = this.renderComponent(node, this.defaultRenderers);
			if (!!rendered) return rendered;

			// Fallback to custom unhandled renderer
			if (!rendered && this.unhandledNodeRenderer) {
				rendered = this.unhandledNodeRenderer(node, this);
				if (!!rendered) return rendered;
			}

			// Final fallback to default unhandled renderer
			if ((node as YeastText).text) {
				const diffRenderData: DiffRenderData = getDiffRenderData(node);
				const typedNode = node as YeastText;
				return diffRenderData && diffRenderData.renderedNodes
					? <React.Fragment key={i}>{diffRenderData.renderedNodes['text']}</React.Fragment>
					: <React.Fragment key={i}>{typedNode.text}</React.Fragment>;
			} else {
				console.warn('Unhandled node', node);
				return;
			}
		});
	}

	renderComponent(node: YeastChild, renderers: NodeRendererMap): ReactNode {
		if (!node || !renderers) return;

		// Untyped nodes aren't handled here
		if (!(node as any).type) return;

		const typedNode = node as YeastBlockNode | YeastInlineNode;
		typedNode.children = typedNode.children || [];

		// Process renderers
		let component: ReactNode;
		Object.entries(renderers).some(([nodeType, plugin]) => {
			if (typedNode.type.toLowerCase() === nodeType.toLowerCase()) {
				component = plugin(node, this);
			}
			return !!component;
		});

		// Return whatever was assigned
		return component;
	}
}
