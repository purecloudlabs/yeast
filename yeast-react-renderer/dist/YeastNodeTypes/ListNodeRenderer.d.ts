import React from 'react';
import { ListNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: ListNode;
    renderer: ReactRenderer;
}
export default function ListNodeRenderer(props: IProps): React.JSX.Element;
export {};
