import React from 'react';
import CmsApi, { ToastFn } from './helpers/types';
import { AssetInfo } from './atoms/AssetInfoAtom';
export interface YeastNodeStateProps {
    api: CmsApi;
    assetInfo: AssetInfo;
    addToast: ToastFn;
}
export default function YeastNodeState(props: YeastNodeStateProps): React.JSX.Element;
