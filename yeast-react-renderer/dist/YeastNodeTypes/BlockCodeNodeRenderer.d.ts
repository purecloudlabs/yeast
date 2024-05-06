import React from 'react';
import { BlockCodeNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: BlockCodeNode;
    renderer: ReactRenderer;
}
export default function BlockCodeNodeRenderer(props: IProps): React.JSX.Element;
export {};
