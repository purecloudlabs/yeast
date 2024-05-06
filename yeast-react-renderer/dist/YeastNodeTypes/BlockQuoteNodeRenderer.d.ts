import React from 'react';
import { BlockquoteNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: BlockquoteNode;
    renderer: ReactRenderer;
}
export default function BlockQuoteNodeRenderer(props: IProps): React.JSX.Element;
export {};
