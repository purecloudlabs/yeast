/// <reference types="node" />
import { RecoilState } from "recoil";
import { ImageNode } from "yeast-core";
interface ImageData {
    currentSrc: string;
    currentNode: ImageNode;
    timer: NodeJS.Timeout;
    isDebouncing: boolean;
}
export declare const imageDataAtom: RecoilState<ImageData>;
export {};
