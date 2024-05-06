import React from 'react';
import { YeastChild } from 'yeast-core';
import { NodeRendererMap } from './ReactRenderer';
export interface YeastNodeRendererProps {
    nodes: YeastChild[];
    customRenderers?: NodeRendererMap;
}
export default function YeastNodeRenderer(props: YeastNodeRendererProps): React.JSX.Element;
