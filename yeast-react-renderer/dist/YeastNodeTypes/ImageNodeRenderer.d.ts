import React from 'react';
import { ImageNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
import CmsApi from '../helpers/types';
interface IProps {
    node: ImageNode;
    renderer: ReactRenderer;
    api: CmsApi;
}
export default function ImageNodeRenderer(props: IProps): React.JSX.Element;
export {};
