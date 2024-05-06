import React from 'react';
import { ItalicNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: ItalicNode;
    renderer: ReactRenderer;
}
export default function ItalicNodeRenderer(props: IProps): React.JSX.Element;
export {};
