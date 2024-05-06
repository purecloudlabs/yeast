import React from 'react';
import { ListItemNode } from 'yeast-core';

import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { ReactRenderer } from '../ReactRenderer';

interface IProps {
	node: ListItemNode;
	renderer: ReactRenderer;
}

export default function ListItemNodeRenderer(props: IProps) {
	const key = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = diffRenderData ? diffRenderData.diffClass : '';

	return <li key={key.current} className={className}>{props.renderer.renderComponents(props.node.children)}</li>;
}
