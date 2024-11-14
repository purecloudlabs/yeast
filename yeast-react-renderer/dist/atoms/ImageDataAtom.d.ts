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
export declare function addImageDataAtom(data?: ImageData): string;
export declare function useImageDataAtom(key: string): ImageData;
export declare function setImageDataAtom(key: string, data: ImageData): void;
export {};
