import { InlineTokenizerPlugin, Token, YeastParser } from 'yeast-core';
export declare const INLINE_CUSTOM_COMPONENT_PREFIX = "yeastInline";
export declare const MAX_INLINE_CUSTOM_COMPONENT_DEPTH = 32;
export declare class InlineCustomComponentPlugin implements InlineTokenizerPlugin {
    private depth;
    tokenize(text: string, parser: YeastParser): void | Token[];
}
export declare class TagPrecedencePlugin implements InlineTokenizerPlugin {
    private readonly inner;
    constructor(inner: InlineTokenizerPlugin);
    tokenize(text: string, parser: YeastParser): void | Token[];
}
//# sourceMappingURL=InlineCustomComponentPlugin.d.ts.map