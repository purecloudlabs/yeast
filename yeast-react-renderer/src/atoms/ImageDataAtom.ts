import { atom, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";
import { ImageNode } from "yeast-core";

interface ImageData {
    currentSrc: string;
    currentNode: ImageNode;
}

export const imageDataAtom = atom({
    key: 'image-data',
    default: JSON.parse(localStorage.getItem('image-data')) || {} as ImageData
});

export function setImageData(data: ImageData) {
    setRecoil(imageDataAtom, data);
    localStorage.setItem('image-data', JSON.stringify(data));
}

export function getImageData() {
    return useRecoilValue(imageDataAtom);
}