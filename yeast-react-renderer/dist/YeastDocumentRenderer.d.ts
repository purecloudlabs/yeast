import React from 'react';
import { DocumentNode } from 'yeast-core';
import { NodeRendererMap } from './ReactRenderer';
import CmsApi from './helpers/types';
import { AssetInfo } from './atoms/AssetInfoAtom';
interface IProps {
    ast: DocumentNode;
    className?: string;
    customRenderers?: NodeRendererMap;
    api?: CmsApi;
    assetInfo?: AssetInfo;
}
export default function YeastDocumentRenderer(props: IProps): React.JSX.Element;
export {};
