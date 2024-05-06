import React from 'react';
import { ParagraphNode } from 'yeast-core';
import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { ReactRenderer } from '../ReactRenderer';

interface IProps {
	node: ParagraphNode;
	renderer: ReactRenderer;
}

export default function ParagraphNodeRenderer(props: IProps) {
	const key = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	const baseClass: string = `${props.node.indentation && props.node.indentation > 0 ? ` indent-${props.node.indentation}` : ''}`;
	let className: string = diffRenderData ? baseClass + ' ' + diffRenderData.diffClass : baseClass;

	return (
		<p className={className} key={key.current}>
			{props.renderer.renderComponents(props.node.children)}
		</p>
	);
}
