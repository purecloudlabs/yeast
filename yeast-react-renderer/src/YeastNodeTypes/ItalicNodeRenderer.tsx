import React from 'react';
import { ItalicNode } from 'yeast-core';

import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { ReactRenderer } from '../ReactRenderer';

interface IProps {
	node: ItalicNode;
	renderer: ReactRenderer;
}

export default function ItalicNodeRenderer(props: IProps) {
	const key = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = diffRenderData ? diffRenderData.diffClass : '';

	return <em className={className} key={key.current}>{props.renderer.renderComponents(props.node.children)}</em>;
}
