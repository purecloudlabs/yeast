import React from 'react';
import { ContentGroupNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: ContentGroupNode;
    renderer: ReactRenderer;
}
export default function ContentGroupNodeRenderer(props: IProps): React.JSX.Element;
export {};
