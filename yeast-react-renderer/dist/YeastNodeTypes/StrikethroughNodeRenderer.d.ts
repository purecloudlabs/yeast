import React from 'react';
import { StrikethroughNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: StrikethroughNode;
    renderer: ReactRenderer;
}
export default function StrikethroughNodeRenderer(props: IProps): React.JSX.Element;
export {};
