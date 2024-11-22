import React from 'react';
import CmsApi, { Toast } from './helpers/types';
import { AssetInfo } from './atoms/AssetInfoAtom';
export interface YeastNodeStateProps {
    api: CmsApi;
    assetInfo: AssetInfo;
    addToast: (toast: Toast) => any;
}
export default function YeastNodeState(props: YeastNodeStateProps): React.JSX.Element;
