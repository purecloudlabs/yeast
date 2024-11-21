import React, { useEffect, useState } from 'react';
import { YeastChild } from 'yeast-core';
import { RecoilRoot, useRecoilState } from 'recoil';
import RecoilNexus from 'recoil-nexus';

import { useKey } from './helpers/useKey';
import { ReactRenderer, NodeRendererMap } from './ReactRenderer';
import CmsApi from './helpers/types';
import YeastNodeState from './YeastNodeState';
import { AssetInfo, assetInfoAtom } from './atoms/AssetInfoAtom';
import { setCmsApi, useCmsApi } from './atoms/CmsApiAtom';

export interface YeastNodeRendererProps {
	nodes: YeastChild[];
	customRenderers?: NodeRendererMap;
	api?: CmsApi;
	assetInfo?: AssetInfo;
}

export default function YeastNodeRenderer(props: YeastNodeRendererProps) {
	const key = useKey();
	const [renderer, setRenderer] = useState<ReactRenderer>(new ReactRenderer(props.customRenderers));
	const cmsApi = useCmsApi();
    const [assetInfo, setAssetInfo] = useRecoilState(assetInfoAtom);

    useEffect(() => {
		if (JSON.stringify(props.assetInfo) !== JSON.stringify(assetInfo)) setAssetInfo(props.assetInfo);
		if (JSON.stringify(props.api) !== JSON.stringify(cmsApi)) setCmsApi(props.api);
	}, [props.api, props.assetInfo]);

	useEffect(() => {
		if (props.customRenderers === renderer.customRenderers) return;
		setRenderer(new ReactRenderer(props.customRenderers));
	}, [props.customRenderers]);

	return (
		<RecoilRoot>
			<RecoilNexus />
			{/* <YeastNodeState api={props.api} assetInfo={props.assetInfo}></YeastNodeState> */}
			<React.Fragment key={key.current}>{renderer.renderComponents(props.nodes)}</React.Fragment>
		</RecoilRoot>
	);
}
