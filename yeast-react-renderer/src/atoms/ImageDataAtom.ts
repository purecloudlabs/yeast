import { setRecoil } from "recoil-nexus";
import { useRecoilValue, atom, RecoilState } from "recoil";
import { ImageNode } from "yeast-core";

interface ImageData {
    currentSrc: string;
    currentNode: ImageNode;
    timer: NodeJS.Timeout;
    isDebouncing: boolean;
}

export const imageDataAtom = atom({
    key: 'image-data',
    default: {} as ImageData
});