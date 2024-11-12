import React from 'react';
import { ImageNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: ImageNode;
    renderer: ReactRenderer;
}
export default function ImageNodeRenderer(props: IProps): React.JSX.Element;
export {};
