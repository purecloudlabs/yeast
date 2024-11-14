import { setRecoil } from "recoil-nexus";
import { useRecoilValue, atom, RecoilState } from "recoil";
import { ImageNode } from "yeast-core";
import { v4 as uuidv4 } from 'uuid';

interface ImageData {
    currentSrc: string;
    currentNode: ImageNode;
    timer: NodeJS.Timeout;
}

export const imageDataAtoms: { [key: string]: RecoilState<ImageData | undefined>} = {};

export function addImageDataAtom(data?: ImageData): string {
    const key = uuidv4();
    imageDataAtoms[key] = atom({ key, default: data });
    return key;
}

export function useImageDataAtom(key: string) {
    if (!imageDataAtoms[key]) return;
    return useRecoilValue(imageDataAtoms[key]);
}

export function setImageDataAtom(key: string, data: ImageData) {
    setRecoil(imageDataAtoms[key], data)
}