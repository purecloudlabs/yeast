import React from 'react';
import { TableNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
import '../styles/Table.scss';
interface IProps {
    node: TableNode;
    renderer: ReactRenderer;
}
export default function TableNodeRenderer(props: IProps): React.JSX.Element;
export {};
