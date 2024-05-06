import React from 'react';
import { ParagraphNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: ParagraphNode;
    renderer: ReactRenderer;
}
export default function ParagraphNodeRenderer(props: IProps): React.JSX.Element;
export {};
