import React from 'react';
import { ListItemNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: ListItemNode;
    renderer: ReactRenderer;
}
export default function ListItemNodeRenderer(props: IProps): React.JSX.Element;
export {};
