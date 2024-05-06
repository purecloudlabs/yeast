import React from 'react';
import { HorizontalRuleNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';

interface IProps {
	node: HorizontalRuleNode;
	renderer: ReactRenderer;
}

export default function HorizontalRuleNodeRenderer(props: IProps) {
	const key = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = 'diff-block-padding';
	if (diffRenderData) {
		className += ` ${diffRenderData.diffClass}`;
		return (
			<div className={className}>
				<hr key={key.current} />
			</div>
		)
	}

	return <hr className={className} key={key.current} />;
}
