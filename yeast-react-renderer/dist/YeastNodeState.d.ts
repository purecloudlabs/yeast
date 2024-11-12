import React from 'react';
import CmsApi from './helpers/types';
import { AssetInfo } from './atoms/AssetInfoAtom';
export interface YeastNodeStateProps {
    api: CmsApi;
    assetInfo: AssetInfo;
}
export default function YeastNodeState(props: YeastNodeStateProps): React.JSX.Element;
