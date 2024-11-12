import { atom, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import CmsApi, { CMSProperties } from '../helpers/types';

export interface AssetInfo {
    property: CMSProperties | undefined;
    keyPath: string;
}

export const assetInfoAtom = atom<AssetInfo>({
    key: 'AssetInfo',
    default: {} as AssetInfo
});

export function useAssetInfo() {
	return useRecoilValue(assetInfoAtom);
}

export function setAssetInfo(assetInfo: AssetInfo) {
	setRecoil(assetInfoAtom, assetInfo);
}
