import './styles/ReactRenderer.scss';
import { ReactNode } from 'react';
import { YeastBlockNodeTypes, YeastInlineNodeTypes, YeastChild } from 'yeast-core';
import CmsApi from './helpers/types';
export interface NodeRendererPlugin {
    (node: YeastChild, renderer: ReactRenderer, api?: CmsApi): ReactNode | undefined;
}
export type NodeRendererMapKeys = YeastBlockNodeTypes | YeastInlineNodeTypes | string;
export type NodeRendererMap = {
    [nodeType in NodeRendererMapKeys]: NodeRendererPlugin | undefined;
};
export type RenderComponentsFunction = {
    (nodes: YeastChild[] | undefined, renderers: NodeRendererMap, unhandledNodeRenderer?: NodeRendererPlugin): ReactNode;
};
export declare class ReactRenderer {
    defaultRenderers: NodeRendererMap;
    customRenderers?: NodeRendererMap;
    unhandledNodeRenderer?: NodeRendererPlugin;
    constructor(customRenderers?: NodeRendererMap);
    renderComponents(nodes: YeastChild[] | undefined, api?: CmsApi): ReactNode;
    renderComponent(node: YeastChild, renderers: NodeRendererMap, api: CmsApi): ReactNode;
}
