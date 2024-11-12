import React, { useEffect, useState } from 'react';
import { YeastChild } from 'yeast-core';

import { useKey } from './helpers/useKey';
import { ReactRenderer, NodeRendererMap } from './ReactRenderer';
import CmsApi, { CMSProperties } from './helpers/types';
import { setProperty, useProperty } from './atoms/PropertyAtom';
import { setCmsApi, useCmsApi } from './atoms/CmsApiAtom';

export interface YeastNodeRendererProps {
	nodes: YeastChild[];
	customRenderers?: NodeRendererMap;
	api?: CmsApi;
	property?: CMSProperties;
}

export default function YeastNodeRenderer(props: YeastNodeRendererProps) {
	const key = useKey();
	const [renderer, setRenderer] = useState<ReactRenderer>(new ReactRenderer(props.customRenderers));
	const property = useProperty();
	const cmsApi = useCmsApi();

	useEffect(() => {
		if (props.customRenderers === renderer.customRenderers) return;
		setRenderer(new ReactRenderer(props.customRenderers));
	}, [props.customRenderers]);

	useEffect(() => {
		if (props.property !== property) setProperty(props.property);
		if (props.api !== cmsApi) setCmsApi(props.api);
	}, [props.api, props.property]);

	return <React.Fragment key={key.current}>{renderer.renderComponents(props.nodes)}</React.Fragment>;
}
