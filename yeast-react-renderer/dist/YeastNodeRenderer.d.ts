import React from 'react';
import { YeastChild } from 'yeast-core';
import { NodeRendererMap } from './ReactRenderer';
import CmsApi, { Toast } from './helpers/types';
import { AssetInfo } from './atoms/AssetInfoAtom';
export interface YeastNodeRendererProps {
    nodes: YeastChild[];
    customRenderers?: NodeRendererMap;
    api?: CmsApi;
    assetInfo?: AssetInfo;
    addToast?: (toast: Toast) => any;
}
export default function YeastNodeRenderer(props: YeastNodeRendererProps): React.JSX.Element;
