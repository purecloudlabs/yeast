import { atom } from 'recoil';
import { CMSProperties } from '../helpers/types';

export interface AssetInfo {
    property?: CMSProperties;
    keyPath?: string;
}

export const assetInfoAtom = atom<AssetInfo>({
    key: 'asset-info',
    default: {} as AssetInfo
});

/*
 * The "previous" atom is needed because ImageNodeRenderer.tsx is unmounting and remounting between renders,
 * which causes refs that would normally be used for this purpose to be reinitialized on those renders, making them useless.
 */

export const prevAssetInfoAtom = atom<AssetInfo>({
    key: 'prev-asset-info',
    default: {} as AssetInfo
});

/*
 * Asset updates need to be debounced to avoid API errors in ImageNodeRenderer.tsx
 */

export const timerAtom = atom({
    key: 'asset-timer',
    default: {} as NodeJS.Timeout
});

export const debounceAtom = atom({
    key: 'asset-debounce',
    default: false
});

export const timerCallbackAtom = atom({
    key: 'asset-timer-callback',
    default: () => {}
});