/// <reference types="node" />
import { RecoilState } from "recoil";
import { ImageNode } from "yeast-core";
interface ImageData {
    currentSrc: string;
    currentNode: ImageNode;
    timer: NodeJS.Timeout;
}
export declare const imageDataAtoms: {
    [key: string]: RecoilState<ImageData | undefined>;
};
export declare const imageDataAtom: RecoilState<ImageData>;
export declare function useImageDataAtom(): ImageData;
export declare function setImageDataAtom(data: ImageData): void;
export {};
