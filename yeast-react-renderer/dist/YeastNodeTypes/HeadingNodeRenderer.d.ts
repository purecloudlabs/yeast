import React from 'react';
import { HeadingNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: HeadingNode;
    renderer: ReactRenderer;
}
export default function HeadingNodeRenderer(props: IProps): React.JSX.Element;
export {};
