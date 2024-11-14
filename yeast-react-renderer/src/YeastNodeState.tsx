import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import CmsApi from './helpers/types';
import { AssetInfo, assetInfoAtom, debounceAtom, prevAssetInfoAtom, timerAtom, timerCallbackAtom } from './atoms/AssetInfoAtom';
import { setCmsApi, useCmsApi } from './atoms/CmsApiAtom';

export interface YeastNodeStateProps {
	api: CmsApi;
	assetInfo: AssetInfo;
}

export default function YeastNodeState(props: YeastNodeStateProps) {
    const cmsApi = useCmsApi();
    const [assetInfo, setAssetInfo] = useRecoilState(assetInfoAtom);
    const prevAssetInfo = useRecoilValue(prevAssetInfoAtom);
    const [isDebouncing, setIsDebouncing] = useRecoilState(debounceAtom);
    const [timer, setTimer] = useRecoilState(timerAtom);
    const timerCallback = useRecoilValue(timerCallbackAtom);

    useEffect(() => {
		if (props.assetInfo !== assetInfo) setAssetInfo(props.assetInfo);
		if (props.api !== cmsApi) setCmsApi(props.api);

        if (
			prevAssetInfo &&
				((prevAssetInfo.property && assetInfo.property && prevAssetInfo.property !== assetInfo.property) 
				|| (prevAssetInfo.keyPath && assetInfo.keyPath && prevAssetInfo.keyPath !== assetInfo.keyPath))
		) {
			setIsDebouncing(true);
            setTimer(setTimeout(() => {
				setIsDebouncing(false)
				timerCallback();
			}, 300));
        }
	}, [props.api, props.assetInfo]);

    return <></>;
}