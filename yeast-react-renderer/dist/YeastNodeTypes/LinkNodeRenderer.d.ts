import React from 'react';
import { LinkNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: LinkNode;
    renderer: ReactRenderer;
}
export default function LinkNodeRenderer(props: IProps): React.JSX.Element;
export {};
