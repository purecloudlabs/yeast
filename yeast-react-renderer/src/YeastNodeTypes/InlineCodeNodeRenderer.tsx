import React from 'react';
import { InlineCodeNode } from 'yeast-core';

import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { ReactRenderer } from '../ReactRenderer';

interface IProps {
	node: InlineCodeNode;
	renderer: ReactRenderer;
}

export default function InlineCodeNodeRenderer(props: IProps) {
	const key = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = diffRenderData ? diffRenderData.diffClass : '';

	return <code key={key.current} className={className}>{props.renderer.renderComponents(props.node.children)}</code>;
}
