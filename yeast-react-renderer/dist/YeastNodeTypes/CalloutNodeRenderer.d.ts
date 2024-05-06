import React from 'react';
import { CalloutNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: CalloutNode;
    renderer: ReactRenderer;
}
export default function CalloutNodeRenderer(props: IProps): React.JSX.Element;
export {};
