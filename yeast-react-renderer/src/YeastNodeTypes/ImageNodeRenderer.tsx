import React, { useEffect, useRef, useState }  from 'react';
import { useRecoilState } from 'recoil';
import { ImageNode } from 'yeast-core';

import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { ReactRenderer } from '../ReactRenderer';
import { assetInfoAtom, prevAssetInfoAtom } from '../atoms/AssetInfoAtom';
import { useCmsApi } from '../atoms/CmsApiAtom';
import { LoadingPlaceholder } from 'genesys-react-components';
import CmsApi from '../helpers/types';
import { imageDataAtom } from '../atoms/ImageDataAtom';

interface IProps {
	node: ImageNode;
	renderer: ReactRenderer;
}

const hostnameRegex = /^https?:\/\//i;
const changesetFilepathRegex = /^\/changesets\/(.+\.(jpg|jpeg|png|svg))$/i;
const keyPathRegex = /^(.+)\/[^\/]+$/i;

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
	const [assetInfo, setAssetInfo] = useRecoilState(assetInfoAtom);
	const [prevAssetInfo, setPrevAssetInfo] = useRecoilState(prevAssetInfoAtom);
	const [imageData, setImageDataAtom] = useRecoilState(imageDataAtom)
	const cmsApi = useCmsApi();

	const key1 = useKey();
	const key2 = useKey();
	const currentCmsApi = useRef<CmsApi>(cmsApi);

	useEffect(() => {
		if (
			JSON.stringify(props.node) === JSON.stringify(imageData?.currentNode)
				&& JSON.stringify(assetInfo) === JSON.stringify(prevAssetInfo)
				&& JSON.stringify(cmsApi) === JSON.stringify(currentCmsApi.current)
		) return;

		if (imageData.isDebouncing) {
			imageData && clearTimeout(imageData.timer);
			setImageDataAtom({
				...imageData,
				isDebouncing: false
			});
			doItAll();
		}
		// When asset property or key path changes, debounce to ensure all data is up to date before executing api calls
		else if (
			prevAssetInfo &&
				((prevAssetInfo.property && assetInfo.property && prevAssetInfo.property !== assetInfo.property) 
				|| (prevAssetInfo.keyPath && assetInfo.keyPath && prevAssetInfo.keyPath !== assetInfo.keyPath))
		) {
			setImageDataAtom({
				...imageData,
				isDebouncing: true
			});
			setImageDataAtom({
				...imageData,
				timer: setTimeout(() => {
					setImageDataAtom({
						...imageData,
						isDebouncing: false
					});
					doItAll();
				}, 300)
			});
		} else {
			doItAll();
		}
	}, [props.node, assetInfo, cmsApi]);

	const doItAll = () => {
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
		} else if (
			(imageData && imageData.currentSrc !== props.node.src) || prevAssetInfo.property !== assetInfo.property || prevAssetInfo.keyPath !== assetInfo.keyPath
				|| JSON.stringify(currentCmsApi.current) !== JSON.stringify(cmsApi)
		) {
			setImageDataAtom({
				...imageData,
				currentSrc: props.node.src,
				currentNode: props.node
			});
			setPrevAssetInfo({
				property: assetInfo.property,
				keyPath: assetInfo.keyPath
			});
			currentCmsApi.current = cmsApi;

			// This path contains an api call to get image asset content. Only proceed if the property, keypath, and api are present
			if (assetInfo.property && assetInfo.keyPath && cmsApi) {
				(async () => {
					const newSrc = await getImgSrc(props.node.src);
					if (newSrc) setImgSrc(newSrc);
				})();
			}
		}
	};

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
				return await getImg(assetInfo.property, newSrc.pathname);
			}
		} catch (err) {
			const filepathMatch = changesetFilepathRegex.exec(newSrc.pathname);
			if (filepathMatch && assetInfo.keyPath) {
				const keyPathMatch = keyPathRegex.exec(assetInfo.keyPath);
				if (!keyPathMatch || !keyPathMatch[1]) {
					setLoadingError('Failed to load image');
					return;
				}
				const prefix: string = keyPathMatch[1];
				const filename: string = filepathMatch[1];
				try {
					const resolvedSrc = prefix + '/' + filename;
					return await getImg(assetInfo.property, resolvedSrc);
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
