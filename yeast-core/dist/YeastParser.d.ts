import { BlockParserPlugin, DocumentNode, InlineTokenizerPlugin, PostProcessorPlugin, RootNodeParserPlugin, YeastInlineChild, YeastNode } from '.';
export declare class YeastParser {
    rootPlugin?: RootNodeParserPlugin;
    blockPlugins: BlockParserPlugin[];
    inlinePlugins: InlineTokenizerPlugin[];
    postprocessors: PostProcessorPlugin[];
    registerRootPlugin(plugin: RootNodeParserPlugin): void;
    registerBlockPlugin(plugin: BlockParserPlugin): void;
    clearBlockPlugins(): void;
    registerInlinePlugin(plugin: InlineTokenizerPlugin): void;
    clearInlinePlugins(): void;
    registerPostProcessorPlugin(plugin: PostProcessorPlugin): void;
    clearPostProcessorPlugins(): void;
    parse(text: string): DocumentNode;
    parseBlock(text: string): YeastNode[];
    parseInline(text: string): YeastInlineChild[];
    postProcess(document: DocumentNode): DocumentNode;
}
//# sourceMappingURL=YeastParser.d.ts.map