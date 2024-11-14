/// <reference types="node" />
import { CMSProperties } from '../helpers/types';
export interface AssetInfo {
    property?: CMSProperties;
    keyPath?: string;
}
export declare const assetInfoAtom: import("recoil").RecoilState<AssetInfo>;
export declare const prevAssetInfoAtom: import("recoil").RecoilState<AssetInfo>;
export declare const timerAtom: import("recoil").RecoilState<NodeJS.Timeout>;
export declare const debounceAtom: import("recoil").RecoilState<boolean>;
