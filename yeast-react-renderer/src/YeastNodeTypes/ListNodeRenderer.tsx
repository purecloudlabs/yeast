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

	/*
	 * The explicit boolean check prevents the case where a custom node has ordered value "false" which evaluates as truthy.
	 * Custom nodes get parsed from xml and the ordered property is parsed as a string.
	 * This can happen because TypeScript types only exist at compile time.
	 */ 
	if (props.node.ordered === true || (props.node.ordered as any) === 'true') {
		return (
			<ol key={key.current} start={props.node.start || 1} className={className}>
				{props.renderer.renderComponents(props.node.children)}
			</ol>
		);
	} else {
		return <ul key={key.current} className={className}>{props.renderer.renderComponents(props.node.children)}</ul>;
	}
}
