import React from 'react';
import { BoldNode } from 'yeast-core';

import { useKey } from '../helpers/useKey';
import { ReactRenderer } from '../ReactRenderer';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';

interface IProps {
	node: BoldNode;
	renderer: ReactRenderer;
}

export default function BoldNodeRenderer(props: IProps) {
	const key = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = diffRenderData ? diffRenderData.diffClass : '';

	return <strong key={key.current} className={className}>{props.renderer.renderComponents(props.node.children)}</strong>;
}
