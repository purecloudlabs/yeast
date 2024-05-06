import React from 'react';
import { BoldNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: BoldNode;
    renderer: ReactRenderer;
}
export default function BoldNodeRenderer(props: IProps): React.JSX.Element;
export {};
