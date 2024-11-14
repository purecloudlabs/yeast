import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import CmsApi from './helpers/types';
import { AssetInfo, assetInfoAtom } from './atoms/AssetInfoAtom';
import { setCmsApi, useCmsApi } from './atoms/CmsApiAtom';

export interface YeastNodeStateProps {
	api: CmsApi;
	assetInfo: AssetInfo;
}

export default function YeastNodeState(props: YeastNodeStateProps) {
    const cmsApi = useCmsApi();
    const [assetInfo, setAssetInfo] = useRecoilState(assetInfoAtom);

    useEffect(() => {
		if (props.assetInfo !== assetInfo) setAssetInfo(props.assetInfo);
		if (props.api !== cmsApi) setCmsApi(props.api);
	}, [props.api, props.assetInfo]);

    return <></>;
}