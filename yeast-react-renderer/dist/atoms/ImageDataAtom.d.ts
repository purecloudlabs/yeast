/// <reference types="node" />
import { ImageNode } from "yeast-core";
interface ImageData {
    currentSrc: string;
    currentNode: ImageNode;
}
export declare const imageDataAtom: import("recoil").RecoilState<ImageData>;
export declare const timerAtom: import("recoil").RecoilState<NodeJS.Timeout>;
export declare const debounceAtom: import("recoil").RecoilState<boolean>;
export {};
