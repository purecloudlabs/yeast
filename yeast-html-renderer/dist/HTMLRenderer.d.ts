import { DocumentNode, YeastBlockNodeTypes, YeastChild, YeastInlineNodeTypes } from 'yeast-core';
export interface NodeRendererPlugin {
    (node: YeastChild, renderer: HTMLRenderer): string | undefined;
}
type NodeRendererMapKeys = YeastBlockNodeTypes | YeastInlineNodeTypes | string;
type NodeRendererMap = {
    [nodeType in NodeRendererMapKeys]: NodeRendererPlugin | undefined;
};
export declare class HTMLRenderer {
    defaultRenderers: NodeRendererMap;
    customRenderers?: NodeRendererMap;
    unhandledNodeRenderer?: NodeRendererPlugin;
    constructor(customRenderers?: NodeRendererMap);
    renderComponents(nodes: YeastChild[] | undefined): string[];
    renderComponent(node: YeastChild, renderers: NodeRendererMap): string;
    renderHTML(astDocument: DocumentNode): string;
}
export {};
//# sourceMappingURL=HTMLRenderer.d.ts.map