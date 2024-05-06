import React from 'react';
import { HeadingNode } from 'yeast-core';
import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { ReactRenderer } from '../ReactRenderer';

interface IProps {
	node: HeadingNode;
	renderer: ReactRenderer;
}

export default function HeadingNodeRenderer(props: IProps) {
	const key = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = diffRenderData ? diffRenderData.diffClass : '';

	const level = props.node.level >= 1 && props.node.level <= 7 && props.node.level % 1 === 0 ? props.node.level : 1;
	if (level === 7) {
		return (
			<span className={`h7 ${className}`} key={key.current} id={props.node.id} >
				{props.renderer.renderComponents(props.node.children)}
			</span>
		);
	} else {
		return React.createElement<any>(
			`h${level}`,
			{ key: key.current, id: props.node.id, className },
			props.renderer.renderComponents(props.node.children)
		);
	}
}
