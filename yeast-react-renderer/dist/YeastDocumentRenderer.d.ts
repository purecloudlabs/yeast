import React from 'react';
import { DocumentNode } from 'yeast-core';
import { NodeRendererMap } from './ReactRenderer';
import CmsApi, { CMSProperties } from './helpers/types';
interface IProps {
    ast: DocumentNode;
    className?: string;
    customRenderers?: NodeRendererMap;
    api?: CmsApi;
    property?: CMSProperties;
}
export default function YeastDocumentRenderer(props: IProps): React.JSX.Element;
export {};
