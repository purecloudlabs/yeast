import { atom, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import CmsApi, { CMSProperties } from '../helpers/types';

export interface AssetInfo {
    property?: CMSProperties;
    keyPath?: string;
}

export const assetInfoAtom = atom<AssetInfo>({
    key: 'asset-info',
    default: {} as AssetInfo
});

export function useAssetInfo() {
	return useRecoilValue(assetInfoAtom);
}

export function setAssetInfo(assetInfo: AssetInfo) {
	setRecoil(assetInfoAtom, assetInfo);
}

/*
 * The "previous" atom is needed because ImageNodeRenderer.tsx is unmounting and remounting between renders,
 * which causes refs that would normally be used for this purpose to be reinitialized on those renders, making them useless.
 */

export const prevAssetInfoAtom = atom<AssetInfo>({
    key: 'prev-asset-info',
    default: {} as AssetInfo
});

export function usePrevAssetInfo() {
	return useRecoilValue(assetInfoAtom);
}

export function setPrevAssetInfo(assetInfo: AssetInfo) {
	setRecoil(assetInfoAtom, assetInfo);
}
