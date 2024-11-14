import React, { useEffect } from 'react';

import CmsApi from './helpers/types';
import { AssetInfo, setAssetInfo, useAssetInfo } from './atoms/AssetInfoAtom';
import { setCmsApi, useCmsApi } from './atoms/CmsApiAtom';

export interface YeastNodeStateProps {
	api: CmsApi;
	assetInfo: AssetInfo;
}

export default function YeastNodeState(props: YeastNodeStateProps) {
    const assetInfo: AssetInfo = useAssetInfo();
    const cmsApi = useCmsApi();

    useEffect(() => {
		if (props.assetInfo !== assetInfo) setAssetInfo(props.assetInfo);
		if (props.api !== cmsApi) setCmsApi(props.api);
	}, [props.api, props.assetInfo]);

    return <></>;
}