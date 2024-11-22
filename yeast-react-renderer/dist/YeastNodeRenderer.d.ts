import React from 'react';
import { YeastChild } from 'yeast-core';
import { NodeRendererMap } from './ReactRenderer';
import CmsApi, { ToastFn } from './helpers/types';
import { AssetInfo } from './atoms/AssetInfoAtom';
export interface YeastNodeRendererProps {
    nodes: YeastChild[];
    customRenderers?: NodeRendererMap;
    api?: CmsApi;
    assetInfo?: AssetInfo;
    addToast?: ToastFn;
}
export default function YeastNodeRenderer(props: YeastNodeRendererProps): React.JSX.Element;
