import React from 'react';
import { LinkNode } from 'yeast-core';

import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { ReactRenderer } from '../ReactRenderer';

interface IProps {
	node: LinkNode;
	renderer: ReactRenderer;
}

export default function LinkNodeRenderer(props: IProps) {
	const key = useKey();

	let oldTitle: string = props.node.title;
	let newTitle: string = props.node.title;
	
	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	if (diffRenderData && diffRenderData.renderedStrings) {
		if (diffRenderData.renderedStrings['title']) {
			oldTitle = diffRenderData.renderedStrings['title'].oldString;
			newTitle = diffRenderData.renderedStrings['title'].newString;
		}
	}

	const className: string = diffRenderData ? diffRenderData.diffClass : '';

	if (props.node.forceNewTab) {
		return diffRenderData && diffRenderData.renderedStrings 
			? (
				<React.Fragment>
					<a className='diff-modified-old' key={key.current} href={props.node.href} target="_blank" rel="noreferrer" title={oldTitle}>
						{props.renderer.renderComponents(props.node.children)} (TAB)
					</a>
					<a className='diff-modified-new' key={key.current} href={props.node.href} target="_blank" rel="noreferrer" title={newTitle}>
						{props.renderer.renderComponents(props.node.children)} (TAB)
					</a>
				</React.Fragment>
			) : (
				<a className={className} key={key.current} href={props.node.href} target="_blank" rel="noreferrer" title={props.node.title}>
					{props.renderer.renderComponents(props.node.children)} (TAB)
				</a>
			);
	} else {
		return (
			<a key={key.current} href={props.node.href} title={props.node.title}>
				{props.renderer.renderComponents(props.node.children)}
			</a>
		);
	}
}
