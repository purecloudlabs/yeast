import { DocumentNode, YeastBlockNodeTypes, YeastChild, YeastInlineNodeTypes } from 'yeast-core';
export type RenderedNode = HTMLElement | string;
export interface NodeRendererPlugin {
    (node: YeastChild, renderer: HTMLRenderer): RenderedNode | undefined;
}
type NodeRendererMapKeys = YeastBlockNodeTypes | YeastInlineNodeTypes | string;
type NodeRendererMap = {
    [nodeType in NodeRendererMapKeys]: NodeRendererPlugin | undefined;
};
export declare class HTMLRenderer {
    document: Document;
    defaultRenderers: NodeRendererMap;
    customRenderers?: NodeRendererMap;
    unhandledNodeRenderer?: NodeRendererPlugin;
    constructor(customRenderers?: NodeRendererMap);
    renderComponents(nodes: YeastChild[] | undefined): RenderedNode[];
    renderComponent(node: YeastChild, renderers: NodeRendererMap): RenderedNode;
    renderHTML(astDocument: DocumentNode): RenderedNode[];
    renderHTMLString(astDocument: DocumentNode): string;
}
export {};
//# sourceMappingURL=HTMLRenderer.d.ts.map