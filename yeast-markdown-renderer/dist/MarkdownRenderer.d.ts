import { DocumentNode, YeastBlockNodeTypes, YeastChild, YeastInlineNodeTypes } from 'yeast-core';
export interface NodeRendererPlugin {
    (node: YeastChild, renderer: MarkdownRenderer): string | undefined;
}
declare type NodeRendererMapKeys = YeastBlockNodeTypes | YeastInlineNodeTypes | string;
declare type NodeRendererMap = {
    [nodeType in NodeRendererMapKeys]: NodeRendererPlugin | undefined;
};
export declare class MarkdownRenderer {
    defaultRenderers: NodeRendererMap;
    customRenderers?: NodeRendererMap;
    unhandledNodeRenderer?: NodeRendererPlugin;
    constructor(customRenderers?: NodeRendererMap);
    renderComponents(nodes: YeastChild[] | undefined): string[];
    renderComponent(node: YeastChild, renderers: NodeRendererMap): string;
    renderMarkdown(astDocument: DocumentNode): string;
}
export {};
//# sourceMappingURL=MarkdownRenderer.d.ts.map