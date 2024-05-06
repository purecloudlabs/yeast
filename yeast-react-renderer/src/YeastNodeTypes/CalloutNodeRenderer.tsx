import React from 'react';
import { CalloutNode } from 'yeast-core';
import { AlertBlock } from 'genesys-react-components';

import { ReactRenderer } from '../ReactRenderer';
import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData, separateDiffChildren } from '../helpers/diff';

interface IProps {
	node: CalloutNode;
	renderer: ReactRenderer;
}

export default function CalloutNodeRenderer(props: IProps) {
	const key = useKey();
	
	let oldTitle: string = props.node.title;
	let newTitle: string = props.node.title;
	let oldDiffChildren = [];
	let newDiffChildren = [];
	
	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	let className: string = props.node.className || '';

	if (diffRenderData) {
		className += ' diff-block-padding';

		if (diffRenderData.renderedStrings && diffRenderData.renderedStrings['title']) {
			const { oldChildren, newChildren } = separateDiffChildren(props.node);
			oldDiffChildren = oldChildren;
			newDiffChildren = newChildren;
			oldTitle = diffRenderData.renderedStrings['title'].oldString;
			newTitle = diffRenderData.renderedStrings['title'].newString;
		}
	}

	return diffRenderData && diffRenderData.renderedStrings 
		? (
			<React.Fragment>
				<AlertBlock
					key={key.current}
					alertType={props.node.alertType}
					title={oldTitle}
					collapsible={props.node.collapsible}
					autoCollapse={props.node.autoCollapse}
					indentation={props.node.indentation}
					className={`${className} diff-modified-old diff-block-old`}
				>
					{props.renderer.renderComponents(oldDiffChildren)}
				</AlertBlock>
				<AlertBlock
					key={key.current}
					alertType={props.node.alertType}
					title={newTitle}
					collapsible={props.node.collapsible}
					autoCollapse={props.node.autoCollapse}
					indentation={props.node.indentation}
					className={`${className} diff-modified-new diff-block-new`}
				>
					{props.renderer.renderComponents(newDiffChildren)}
				</AlertBlock>
			</React.Fragment>
		) : (
			<AlertBlock
				key={key.current}
				alertType={props.node.alertType}
				title={props.node.title}
				collapsible={props.node.collapsible}
				autoCollapse={props.node.autoCollapse}
				indentation={props.node.indentation}
				className={className}
			>
				{props.renderer.renderComponents(props.node.children)}
			</AlertBlock>
		);
}
