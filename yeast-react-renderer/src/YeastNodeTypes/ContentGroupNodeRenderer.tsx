import React from 'react';
import { ContentGroupNode } from 'yeast-core';
import { DxAccordionGroup, DxTabbedContent } from 'genesys-react-components';

import { ReactRenderer } from '../ReactRenderer';
import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';

interface IProps {
	node: ContentGroupNode;
	renderer: ReactRenderer;
}

export default function ContentGroupNodeRenderer(props: IProps) {
	const key = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = diffRenderData ? diffRenderData.diffClass : '';

	if (props.node.groupType === 'accordion') {
		return (
			<div className={className}>
				<DxAccordionGroup key={key.current}>{props.renderer.renderComponents(props.node.children)}</DxAccordionGroup>;
			</div>
		);
	} else if (props.node.groupType === 'tabbedcontent') {
		return (
			<div className={className}>
				<DxTabbedContent key={key.current}>{props.renderer.renderComponents(props.node.children)}</DxTabbedContent>
			</div>
		);
	}
}
