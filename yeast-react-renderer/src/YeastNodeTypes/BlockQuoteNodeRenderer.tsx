import React from 'react';
import { BlockquoteNode } from 'yeast-core';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { useKey } from '../helpers/useKey';

import { ReactRenderer } from '../ReactRenderer';

interface IProps {
	node: BlockquoteNode;
	renderer: ReactRenderer;
}

export default function BlockQuoteNodeRenderer(props: IProps) {
	const key = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = diffRenderData ? diffRenderData.diffClass : '';

	return <blockquote key={key.current} className={className}>{props.renderer.renderComponents(props.node.children)}</blockquote>;
}
