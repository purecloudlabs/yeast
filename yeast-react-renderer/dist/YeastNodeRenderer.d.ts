import React from 'react';
import { YeastChild } from 'yeast-core';
import { NodeRendererMap } from './ReactRenderer';
import CmsApi from './helpers/types';
import { AssetInfo } from './atoms/AssetInfoAtom';
export interface YeastNodeRendererProps {
    nodes: YeastChild[];
    customRenderers?: NodeRendererMap;
    api?: CmsApi;
    assetInfo?: AssetInfo;
}
export default function YeastNodeRenderer(props: YeastNodeRendererProps): React.JSX.Element;
