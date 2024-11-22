import React, { useEffect, useState } from 'react';
import { YeastChild } from 'yeast-core';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';

import { useKey } from './helpers/useKey';
import { ReactRenderer, NodeRendererMap } from './ReactRenderer';
import CmsApi, { ToastFn } from './helpers/types';
import YeastNodeState from './YeastNodeState';
import { AssetInfo } from './atoms/AssetInfoAtom';

export interface YeastNodeRendererProps {
	nodes: YeastChild[];
	customRenderers?: NodeRendererMap;
	api?: CmsApi;
	assetInfo?: AssetInfo;
	addToast?: ToastFn;
}

export default function YeastNodeRenderer(props: YeastNodeRendererProps) {
	const key = useKey();
	const [renderer, setRenderer] = useState<ReactRenderer>(new ReactRenderer(props.customRenderers));

	useEffect(() => {
		if (props.customRenderers === renderer.customRenderers) return;
		setRenderer(new ReactRenderer(props.customRenderers));
	}, [props.customRenderers]);

	return (
		<RecoilRoot>
			<RecoilNexus />
			{/* recoil state must be set within the RecoilRoot compoenent, so this component's recoil state gets set in the functional component YeastNodeState */}
			<YeastNodeState api={props.api} assetInfo={props.assetInfo} addToast={props.addToast} />
			<React.Fragment key={key.current}>{renderer.renderComponents(props.nodes)}</React.Fragment>
		</RecoilRoot>
	);
}
