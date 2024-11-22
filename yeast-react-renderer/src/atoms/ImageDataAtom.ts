import { atom, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { ImageNode } from 'yeast-core';

export interface ImageData {
	currentSrc: string;
	currentNode: ImageNode;
}

export const imageDataAtom = atom({
	key: 'image-data',
	default: {} as ImageData,
});

export function setImageData(data: ImageData) {
	setRecoil(imageDataAtom, data);
}

export function getImageData() {
	return useRecoilValue(imageDataAtom);
}
