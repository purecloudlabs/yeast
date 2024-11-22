import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import CmsApi, { ToastFn } from './helpers/types';
import { AssetInfo, assetInfoAtom } from './atoms/AssetInfoAtom';
import { setCmsApi, useCmsApi, setAddToast, useAddToast } from './atoms/CmsApiAtom';

export interface YeastNodeStateProps {
	api: CmsApi;
	assetInfo: AssetInfo;
	addToast: ToastFn;
}

// This component
export default function YeastNodeState(props: YeastNodeStateProps) {
	const cmsApi = useCmsApi();
	const addToast = useAddToast();
	const [assetInfo, setAssetInfo] = useRecoilState(assetInfoAtom);

	useEffect(() => {
		if (JSON.stringify(props.assetInfo) !== JSON.stringify(assetInfo)) setAssetInfo(props.assetInfo);
		if (JSON.stringify(props.api) !== JSON.stringify(cmsApi)) setCmsApi(props.api);
		if (JSON.stringify(props.addToast) !== JSON.stringify(addToast)) setAddToast(props.addToast);
	}, [props.api, props.assetInfo, props.addToast]);

	return <></>;
}
