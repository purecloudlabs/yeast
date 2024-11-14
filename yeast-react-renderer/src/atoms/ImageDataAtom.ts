import { atom } from "recoil";
import { ImageNode } from "yeast-core";

interface ImageData {
    currentSrc: string;
    currentNode: ImageNode;
}

export const imageDataAtom = atom({
    key: 'image-data',
    default: {} as ImageData
});