import { ImageNode } from 'yeast-core';
export interface ImageData {
    currentSrc: string;
    currentNode: ImageNode;
}
export declare const imageDataAtom: import("recoil").RecoilState<ImageData>;
export declare function setImageData(data: ImageData): void;
export declare function getImageData(): ImageData;
