import { InlineCustomComponentNode, YeastChild } from 'yeast-core';
/** Inline custom component tag prefix, as written in markdown */
export declare const INLINE_TAG_PREFIX = "yeastInline";
/** Concatenates the text of the children, depth first, with no separator */
export declare function getPlainText(nodes: YeastChild[] | undefined): string;
/**
 * Builds the raw tag text for an inline custom component, e.g. `<yeastInline:Icon name="x" />`,
 * or `<yeastInline:Badge color="blue">text</yeastInline:Badge>` when the node has children.
 * Children are written as plain text. The result is text, to be escaped by React.
 */
export declare function formatInlineCustomComponentTag(node: InlineCustomComponentNode): string;
