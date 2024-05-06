import React from 'react';
import { StrikethroughNode } from 'yeast-core';

import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';

import { ReactRenderer } from '../ReactRenderer';

interface IProps {
	node: StrikethroughNode;
	renderer: ReactRenderer;
}

export default function StrikethroughNodeRenderer(props: IProps) {
	const key = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = diffRenderData ? diffRenderData.diffClass : '';

	return <s className={className} key={key.current}>{props.renderer.renderComponents(props.node.children)}</s>;
}
