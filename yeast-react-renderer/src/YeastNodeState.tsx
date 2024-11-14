import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import CmsApi from './helpers/types';
import { AssetInfo, assetInfoAtom, debounceAtom, prevAssetInfoAtom } from './atoms/AssetInfoAtom';
import { setCmsApi, useCmsApi } from './atoms/CmsApiAtom';

export interface YeastNodeStateProps {
	api: CmsApi;
	assetInfo: AssetInfo;
}

export default function YeastNodeState(props: YeastNodeStateProps) {
    const cmsApi = useCmsApi();
    const [assetInfo, setAssetInfo] = useRecoilState(assetInfoAtom);
    // const prevAssetInfo = useRecoilValue(prevAssetInfoAtom);
    const [isDebouncing, setIsDebouncing] = useRecoilState(debounceAtom);

    useEffect(() => {
		if (JSON.stringify(props.assetInfo) !== JSON.stringify(assetInfo)) setAssetInfo(props.assetInfo);
		if (JSON.stringify(props.api) !== JSON.stringify(cmsApi)) setCmsApi(props.api);

        if (isDebouncing) {
            setIsDebouncing(false);
        } else if (
			assetInfo &&
				((assetInfo.property && assetInfo.property && props.assetInfo.property !== assetInfo.property) 
				|| (assetInfo.keyPath && props.assetInfo.keyPath && assetInfo.keyPath !== props.assetInfo.keyPath))
		) {
			setIsDebouncing(true);
        }
	}, [props.api, props.assetInfo]);

    return <></>;
}