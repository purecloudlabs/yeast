import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import CmsApi from './helpers/types';
import { AssetInfo, assetInfoAtom } from './atoms/AssetInfoAtom';
import { setCmsApi, useCmsApi } from './atoms/CmsApiAtom';

export interface YeastNodeStateProps {
	api: CmsApi;
	assetInfo: AssetInfo;
}

// This component
export default function YeastNodeState(props: YeastNodeStateProps) {
    const cmsApi = useCmsApi();
    const [assetInfo, setAssetInfo] = useRecoilState(assetInfoAtom);

    useEffect(() => {
		if (JSON.stringify(props.assetInfo) !== JSON.stringify(assetInfo)) setAssetInfo(props.assetInfo);
		if (JSON.stringify(props.api) !== JSON.stringify(cmsApi)) setCmsApi(props.api);
	}, [props.api, props.assetInfo]);

    return <></>;
}