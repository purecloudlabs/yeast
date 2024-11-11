import React from 'react';
import { YeastChild } from 'yeast-core';
import { NodeRendererMap } from './ReactRenderer';
import CmsApi, { CMSProperties } from './helpers/types';
export interface YeastNodeRendererProps {
    nodes: YeastChild[];
    customRenderers?: NodeRendererMap;
    api?: CmsApi;
    property?: CMSProperties;
}
export default function YeastNodeRenderer(props: YeastNodeRendererProps): React.JSX.Element;
