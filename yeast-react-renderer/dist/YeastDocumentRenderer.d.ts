import React from 'react';
import { DocumentNode } from 'yeast-core';
import { NodeRendererMap } from './ReactRenderer';
interface IProps {
    ast: DocumentNode;
    className?: string;
    customRenderers?: NodeRendererMap;
}
export default function YeastDocumentRenderer(props: IProps): React.JSX.Element;
export {};
