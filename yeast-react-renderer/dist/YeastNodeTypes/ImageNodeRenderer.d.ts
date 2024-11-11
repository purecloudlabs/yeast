import React from 'react';
import { ImageNode } from 'yeast-core';
import { ReactRenderer } from '../ReactRenderer';
import CmsApi, { CMSProperties } from '../helpers/types';
interface IProps {
    node: ImageNode;
    renderer: ReactRenderer;
    api: CmsApi;
    property: CMSProperties;
}
export default function ImageNodeRenderer(props: IProps): React.JSX.Element;
export {};
