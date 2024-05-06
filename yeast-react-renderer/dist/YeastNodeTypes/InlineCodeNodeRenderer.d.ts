import React from 'react';
import { InlineCodeNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: InlineCodeNode;
    renderer: ReactRenderer;
}
export default function InlineCodeNodeRenderer(props: IProps): React.JSX.Element;
export {};
