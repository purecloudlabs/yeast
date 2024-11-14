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

export const timerAtom = atom({
    key: 'image-timer',
    default: {} as NodeJS.Timeout
});

export const debounceAtom = atom({
    key: 'image-debounce',
    default: false
});