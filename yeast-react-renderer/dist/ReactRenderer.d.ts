import './styles/ReactRenderer.scss';
import { ReactNode } from 'react';
import { YeastBlockNodeTypes, YeastInlineNodeTypes, YeastChild } from 'yeast-core';
export interface NodeRendererPlugin {
    (node: YeastChild, renderer: ReactRenderer): ReactNode | undefined;
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
    renderComponents(nodes: YeastChild[] | undefined): ReactNode;
    renderComponent(node: YeastChild, renderers: NodeRendererMap): ReactNode;
}
