import { atom, useRecoilValue } from 'recoil';
import { CMSProperties } from '../helpers/types';
import { setRecoil } from 'recoil-nexus';

export interface AssetInfo {
	property?: CMSProperties;
	keyPath?: string;
}

export const assetInfoAtom = atom<AssetInfo>({
	key: 'asset-info',
	default: JSON.parse(localStorage.getItem('asset-info')) || ({} as AssetInfo),
});

export function setAssetInfo(assetInfo: AssetInfo) {
	setRecoil(assetInfoAtom, assetInfo);
	localStorage.setItem('asset-info', JSON.stringify(assetInfo));
}

export function getAssetInfo() {
	return useRecoilValue(assetInfoAtom);
}

/*
 * The "previous" atom is needed because ImageNodeRenderer.tsx is unmounting and remounting between renders,
 * which causes refs that would normally be used for this purpose to be reinitialized on those renders, making them useless.
 */

export const prevAssetInfoAtom = atom<AssetInfo>({
	key: 'prev-asset-info',
	default: JSON.parse(localStorage.getItem('prev-asset-info')) || ({} as AssetInfo),
});

export function setPrevAssetInfo(prevAssetInfo: AssetInfo) {
	setRecoil(prevAssetInfoAtom, prevAssetInfo);
	localStorage.setItem('prev-asset-info', JSON.stringify(prevAssetInfo));
}

export function getPrevAssetInfo() {
	return useRecoilValue(prevAssetInfoAtom);
}
