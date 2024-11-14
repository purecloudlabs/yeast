import { ImageNode } from "yeast-core";
interface ImageData {
    currentSrc: string;
    currentNode: ImageNode;
}
export declare const imageDataAtom: import("recoil").RecoilState<ImageData>;
export {};
