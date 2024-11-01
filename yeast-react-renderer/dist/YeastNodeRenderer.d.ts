import React from 'react';
import { YeastChild } from 'yeast-core';
import { NodeRendererMap } from './ReactRenderer';
import CmsApi from './helpers/types';
export interface YeastNodeRendererProps {
    nodes: YeastChild[];
    customRenderers?: NodeRendererMap;
    api: CmsApi;
}
export default function YeastNodeRenderer(props: YeastNodeRendererProps): React.JSX.Element;
