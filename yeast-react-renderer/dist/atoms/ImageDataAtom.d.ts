/// <reference types="node" />
import { ImageNode } from "yeast-core";
interface ImageData {
    currentSrc: string;
    currentNode: ImageNode;
    timer: NodeJS.Timeout;
    isDebouncing: boolean;
}
export declare const imageDataAtom: import("recoil").RecoilState<ImageData>;
export {};
