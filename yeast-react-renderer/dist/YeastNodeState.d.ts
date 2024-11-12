import React from 'react';
import CmsApi, { CMSProperties } from './helpers/types';
export interface YeastNodeStateProps {
    api: CmsApi;
    property: CMSProperties;
}
export default function YeastNodeState(props: YeastNodeStateProps): React.JSX.Element;
