import React, { useEffect, useRef, useState }  from 'react';
import { useRecoilState } from 'recoil';
import { ImageNode } from 'yeast-core';

import { useKey } from '../helpers/useKey';
import { DiffRenderData, getDiffRenderData } from '../helpers/diff';
import { ReactRenderer } from '../ReactRenderer';
import { assetInfoAtom, prevAssetInfoAtom } from '../atoms/AssetInfoAtom';
import { useAddToast, useCmsApi } from '../atoms/CmsApiAtom';
import { LoadingPlaceholder } from 'genesys-react-components';
import { imageDataAtom } from '../atoms/ImageDataAtom';
import { ToastType } from '../helpers/types';

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
	const [isDebouncing, setIsDebouncing] = useState<boolean>();
	const [diffRenderData, setDiffRenderData] = useState<DiffRenderData>();
	const [assetInfo, setAssetInfo] = useRecoilState(assetInfoAtom);
	const [prevAssetInfo, setPrevAssetInfo] = useRecoilState(prevAssetInfoAtom);
	const [imageData, setImageData] = useRecoilState(imageDataAtom);
	const cmsApi = useCmsApi();
	const addToast = useAddToast();

	const key1 = useKey();
	const key2 = useKey();

	const timer = useRef<NodeJS.Timeout>();

	useEffect(() => {
		return () => {
			// clear timeout when component unmounts
			if (timer.current) clearTimeout(timer.current);
		};
	}, []);

	useEffect(() => {
		// abort non-updates
		if (JSON.stringify(props.node) === JSON.stringify(imageData?.currentNode) && JSON.stringify(assetInfo) === JSON.stringify(prevAssetInfo)) 
			return;

		/* 
		 * API errors occur when retrieving asset/draft content when state for the asset is only partially updated.
		 * Debouncing prevents the API errors.
		 */
		if (
			!isDebouncing && assetInfo
				&& ((assetInfo.property && prevAssetInfo.property && assetInfo.property !== prevAssetInfo.property) 
				|| (assetInfo.keyPath && prevAssetInfo.keyPath && assetInfo.keyPath !== prevAssetInfo.keyPath))
		) {
			setIsDebouncing(true)
			timer.current = setTimeout(() => {
				setIsDebouncing(false);
				imageSetup();
			}, 300);
		} else if (isDebouncing) {
			if (timer.current) clearTimeout(timer.current);
			setIsDebouncing(false);
			imageSetup();
		} else {
			imageSetup();
		}

	}, [props.node, assetInfo]);

	const imageSetup = () => {
		// set data
		if (imageData.currentSrc !== props.node.src || JSON.stringify(imageData.currentNode) !== JSON.stringify(props.node)) {
			setImageData({
				...imageData,
				currentSrc: props.node.src,
				currentNode: props.node
			});
		}
		if (assetInfo.property !== prevAssetInfo.property || assetInfo.keyPath !== prevAssetInfo.keyPath) {
			setPrevAssetInfo({
				property: assetInfo.property,
				keyPath: assetInfo.keyPath
			});
		}

		// diff scenario
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
		}
		// non-diff scenario
		else {
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
				return await getImg(assetInfo.property, newSrc.pathname, true);
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
				}
			} else {
				console.error(err);		
			}

			setLoadingError('Failed to load image');
			addToast({
				toastType: ToastType.Critical,
				title: 'API Error',
				message: 'Failed to load image',
				timeoutSeconds: 30,
			});	
		}
	};

	const getImg = async(property: string, keyPath: string, suppressError: boolean = false): Promise<string | undefined> => {
		if (property && cmsApi) {
			const content = await cmsApi.AssetsApi.getAssetContent(property, keyPath, true, suppressError);
			if (!content) {
				if (!suppressError) setLoadingError('Failed to load image');
				throw new Error('Failed to load image');
			}
			let str = await readBlob(content?.content);
			return str;
		} else {
			if (!suppressError) setLoadingError('Failed to load image');
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

	if (loadingError) return <em title={props.node.src}>{loadingError}</em>;

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
