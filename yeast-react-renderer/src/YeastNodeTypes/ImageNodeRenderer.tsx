import React, { useEffect, useRef, useState }  from 'react';
import { ImageNode } from 'yeast-core';

import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { ReactRenderer } from '../ReactRenderer';
import { useAssetInfo } from '../atoms/AssetInfoAtom';
import { useCmsApi } from '../atoms/CmsApiAtom';
import { LoadingPlaceholder } from 'genesys-react-components';
import CmsApi, { CMSProperties } from '../helpers/types';

interface IProps {
	node: ImageNode;
	renderer: ReactRenderer;
}

const hostnameRegex = /^https?:\/\//i;
const filepathRegex = /^(\/)?(.+\.(jpg|jpeg|png|svg))$/i;

export default function ImageNodeRenderer(props: IProps) {
	const [imgSrc, setImgSrc] = useState<string>();
	const [loadingError, setLoadingError] = useState<string>();
	const [oldSrc, setOldSrc] = useState<string>();
	const [newSrc, setNewSrc] = useState<string>();
	const [oldAlt, setOldAlt] = useState<string>();
	const [newAlt, setNewAlt] = useState<string>();
	const [oldTitle, setOldTitle] = useState<string>();
	const [newTitle, setNewTitle] = useState<string>();
	const [diffRenderData, setDiffRenderData] = useState<DiffRenderData>();
	const assetInfo = useAssetInfo();
	const cmsApi = useCmsApi();

	const key1 = useKey();
	const key2 = useKey();
	const currentSrc = useRef<string>();
	const currentProperty = useRef<CMSProperties>();
	const currentCmsApi = useRef<CmsApi>();
	const currentNode = useRef<ImageNode>();


	useEffect(() => {
		if (JSON.stringify(props.node) === JSON.stringify(currentNode)) return;

		const newDiffRenderData: DiffRenderData = getDiffRenderData(props.node);
		if (newDiffRenderData && newDiffRenderData.renderedStrings) {
			if (newDiffRenderData.renderedStrings['title']) {
				setOldTitle(newDiffRenderData.renderedStrings['title'].oldString);
				setNewTitle(newDiffRenderData.renderedStrings['title'].newString);
			}
			if (newDiffRenderData.renderedStrings['alt']) {
				setOldAlt(newDiffRenderData.renderedStrings['alt'].oldString);
				setNewAlt(newDiffRenderData.renderedStrings['alt'].newString);
			}
			if (newDiffRenderData.renderedStrings['src']) {
				(async () => {
					const oldImgSrc = await getImgSrc(newDiffRenderData.renderedStrings['src'].oldString);
					if (oldImgSrc) setOldSrc(oldImgSrc);
					const newImgSrc = await getImgSrc(newDiffRenderData.renderedStrings['src'].newString);
					if (newImgSrc) setNewSrc(newImgSrc);
				})();
			}

			setDiffRenderData(newDiffRenderData);
		} else if (currentSrc.current !== props.node.src || currentProperty.current !== assetInfo.property || JSON.stringify(currentCmsApi.current) !== JSON.stringify(cmsApi)) {
			currentSrc.current = props.node.src;
			currentProperty.current = assetInfo.property;
			currentCmsApi.current = cmsApi;

			(async () => {
				const newSrc = await getImgSrc(props.node.src);
				if (newSrc) setImgSrc(newSrc)
			})();
		}
	}, [props.node, assetInfo, cmsApi]);

	const getImgSrc = async (src: string): Promise<string | undefined> => {
		setLoadingError(undefined);
		setImgSrc(undefined);
		const match = hostnameRegex.exec(src);
		let newSrc = new URL(src, window.location.href);
		const isSameHost = window.location.hostname.toLowerCase() === newSrc.hostname.toLowerCase();
		try {
			if (match && !isSameHost) {
				// Set src to URL to let the browser load the image normally
				return src;
			} else {
				// Load image from API and set src as encoded image data
				return getImg(assetInfo.property, newSrc.pathname);
			}
		} catch (err) {
			const filepathMatch = filepathRegex.exec(newSrc.pathname);
			if (filepathMatch) {
				let normalizedPath: string = filepathMatch[0];
				if (filepathMatch[1] === '/') normalizedPath = filepathMatch[2];
				try {
					const resolvedSrc = assetInfo.keyPath + '/' + normalizedPath;
					return getImg(assetInfo.property, resolvedSrc);
				} catch (err) {
					console.error(err);
					setLoadingError('Failed to load image');
				}
			} else {
				console.error(err);
				setLoadingError('Failed to load image');
			}
		}
	};

	const getImg = async(property: string, keyPath: string): Promise<string | undefined> => {
		if (property && cmsApi) {
			const content = await cmsApi.AssetsApi.getAssetContent(property, keyPath, true);
			if (!content) {
				setLoadingError('Failed to load image');
				throw new Error('Failed to load image');
			}
			let str = await readBlob(content?.content);
			return str;
		} else {
			setLoadingError('Failed to load image');
			throw new Error('Failed to load image');
		}
	};

	const readBlob = async(imageBlob: Blob) => {
		const reader = new FileReader();
		return new Promise<string>((resolve) => {
			reader.onloadend = () => resolve(reader.result as string);
			reader.readAsDataURL(imageBlob);
		});
	};

	const className: string = diffRenderData ? diffRenderData.diffClass : '';

	return diffRenderData && diffRenderData.renderedStrings
		?
			<React.Fragment>
				<img key={key1.current} alt={oldAlt} src={oldSrc} title={oldTitle} className={className}/>
				<img key={key2.current} alt={newAlt} src={newSrc} title={newTitle} className={className}/>
			</React.Fragment>
		: imgSrc
			? <img key={key1.current} alt={props.node.alt} src={imgSrc} title={props.node.title} className={className} />
			: <LoadingPlaceholder />;
}
