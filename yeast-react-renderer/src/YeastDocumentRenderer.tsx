import React, { ReactNode } from 'react';
import { DocumentNode } from 'yeast-core';

import { NodeRendererMap } from './ReactRenderer';
import YeastNodeRenderer from './YeastNodeRenderer';
import { getDiffRenderData, DiffRenderData } from './helpers/diff';
import CmsApi, { CMSProperties } from './helpers/types';

interface IProps {
	ast: DocumentNode;
	className?: string;
	customRenderers?: NodeRendererMap;
	api?: CmsApi;
	property?: CMSProperties;
}

export default function YeastDocumentRenderer(props: IProps) {
	const diffRenderData: DiffRenderData = getDiffRenderData(props.ast);
	const classList: string[] = [];
	if (props.className) classList.push(props.className);
	if (diffRenderData) classList.push(diffRenderData.diffClass); 
	const className: string = classList.join(' ').trim();

	let title: ReactNode | string = props.ast?.title || '';
	let author: ReactNode | string | undefined;
	if (props.ast?.author) author = props.ast.author;

	if (diffRenderData && diffRenderData.renderedNodes) {
		if (diffRenderData.renderedNodes['title']) {
			title = diffRenderData.renderedNodes['title'];
		}
		if (diffRenderData.renderedNodes['author']) {
			author = diffRenderData.renderedNodes['author'];
		}
	}

	return (
		<div className={className}>
			<h1>{title}</h1>
			{author && <h2>{author}</h2>}
			<YeastNodeRenderer nodes={props.ast?.children} customRenderers={props.customRenderers} api={props.api} property={props.property}/>
		</div>
	);
}
