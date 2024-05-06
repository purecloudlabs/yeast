import React from 'react';
import { HorizontalRuleNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
interface IProps {
    node: HorizontalRuleNode;
    renderer: ReactRenderer;
}
export default function HorizontalRuleNodeRenderer(props: IProps): React.JSX.Element;
export {};
