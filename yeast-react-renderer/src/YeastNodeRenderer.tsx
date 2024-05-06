import React, { useEffect, useState } from 'react';
import { YeastChild } from 'yeast-core';
import { getDiffRenderData, DiffRenderData } from './helpers/diff';

import { useKey } from './helpers/useKey';
import { ReactRenderer, NodeRendererMap } from './ReactRenderer';

export interface YeastNodeRendererProps {
	nodes: YeastChild[];
	customRenderers?: NodeRendererMap;
}

export default function YeastNodeRenderer(props: YeastNodeRendererProps) {
	const key = useKey();
	const [renderer, setRenderer] = useState<ReactRenderer>(new ReactRenderer(props.customRenderers));

	useEffect(() => {
		if (props.customRenderers === renderer.customRenderers) return;
		setRenderer(new ReactRenderer(props.customRenderers));
	}, [props.customRenderers]);

	return <React.Fragment key={key.current}>{renderer.renderComponents(props.nodes)}</React.Fragment>;
}
