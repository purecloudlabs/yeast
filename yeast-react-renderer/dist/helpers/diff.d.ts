import { ReactNode } from 'react';
import { YeastNode, YeastChild } from 'yeast-core';
export interface DiffRenderData {
    diffClass: string;
    renderedNodes?: RenderedNodes;
    renderedStrings?: RenderedStrings;
}
export type RenderedNodes = {
    [textProperty: string]: ReactNode;
};
export type RenderedStrings = {
    [textProperty: string]: {
        oldString: string;
        newString: string;
    };
};
export declare function getDiffRenderData(diffNode: YeastChild): DiffRenderData | undefined;
export declare function separateDiffChildren(node: YeastNode): {
    oldChildren: YeastChild[];
    newChildren: YeastChild[];
};
