import React from 'react';
import { ListNode } from 'yeast-core';

import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';

import { ReactRenderer } from '../ReactRenderer';

interface IProps {
	node: ListNode;
	renderer: ReactRenderer;
}

export default function ListNodeRenderer(props: IProps) {
	const key = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = diffRenderData ? diffRenderData.diffClass : '';

	if (props.node.start && props.node.start > 0) {
		return (
			<ol key={key.current} start={props.node.start || 1} className={className}>
				{props.renderer.renderComponents(props.node.children)}
			</ol>
		);
	} else {
		return <ul key={key.current} className={className}>{props.renderer.renderComponents(props.node.children)}</ul>;
	}
}
