import React from 'react';
import { ImageNode } from 'yeast-core';
import { v4 as uuidv4} from 'uuid';

import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { ReactRenderer } from '../ReactRenderer';

interface IProps {
	node: ImageNode;
	renderer: ReactRenderer;
}

export default function ImageNodeRenderer(props: IProps) {
	const key1 = useKey();
	const key2 = useKey();

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	const className: string = diffRenderData ? diffRenderData.diffClass : '';

	let oldSrc: string = '';
	let newSrc: string = '';
	let oldAlt: string = '';
	let newAlt: string = '';
	let oldTitle: string = '';
	let newTitle: string = '';

	if (diffRenderData && diffRenderData.renderedStrings) {
		if (diffRenderData.renderedStrings['title']) {
			oldTitle = diffRenderData.renderedStrings['title'].oldString;
			newTitle = diffRenderData.renderedStrings['title'].newString;
		}
		if (diffRenderData.renderedStrings['alt']) {
			oldAlt = diffRenderData.renderedStrings['alt'].oldString;
			newAlt = diffRenderData.renderedStrings['alt'].newString;
		}
		if (diffRenderData.renderedStrings['src']) {
			oldSrc = diffRenderData.renderedStrings['src'].oldString;
			newSrc = diffRenderData.renderedStrings['src'].newString;
		}
	}

	return diffRenderData && diffRenderData.renderedStrings
		? (
			<React.Fragment>
				<img key={key1.current} alt={oldAlt} src={oldSrc} title={oldTitle} className={className}/>
				<img key={key2.current} alt={newAlt} src={newSrc} title={newTitle} className={className}/>
			</React.Fragment>
		)
		: <img key={key1.current} alt={props.node.alt} src={props.node.src} title={props.node.title} className={className} />
}
