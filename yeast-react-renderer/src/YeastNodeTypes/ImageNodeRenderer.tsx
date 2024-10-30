import React, { useEffect, useRef, useState }  from 'react';
import { ImageNode } from 'yeast-core';

import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { ReactRenderer } from '../ReactRenderer';
import CmsApi from '../helpers/types'

interface IProps {
	node: ImageNode;
	renderer: ReactRenderer;
	api: CmsApi;
}

const hostnameRegex = /^https?:\/\//i;

export default function ImageNodeRenderer(props: IProps) {
	const [imgSrc, setImgSrc] = useState<string>();
	const [loadingError, setLoadingError] = useState<string>();

	const key1 = useKey();
	const key2 = useKey();
	const currentSrc = useRef<string>();

	useEffect(() => {
		if (currentSrc.current === props.node.src) return;
		currentSrc.current = props.node.src;
		(async () => {
			try {
				setLoadingError(undefined);
				setImgSrc(undefined);
				const match = hostnameRegex.exec(props.node.src);
				let src = new URL(props.node.src, window.location.href);
				const isSameHost = window.location.hostname.toLowerCase() === src.hostname.toLowerCase();
				if (match && !isSameHost) {
					// Set src to URL to let the browser load the image normally
					setImgSrc(props.node.src);
				} else {
					// Load image from API and set src as encoded image data
					const content = await props.api.getAssetContent(src.pathname, true);
					if (!content) {
						setLoadingError('Failed to load image');
					}
					let str = await readBlob(content?.content);
					setImgSrc(str);
				}
			} catch (err) {
				console.error(err);
				setLoadingError('Failed to load image');
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.node.src]);

	const readBlob = async(imageBlob: Blob) => {
		const reader = new FileReader();
		return new Promise<string>((resolve) => {
			reader.onloadend = () => resolve(reader.result as string);
			reader.readAsDataURL(imageBlob);
		});
	}

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
