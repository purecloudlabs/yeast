import { CMSProperties } from '../helpers/types';
export interface AssetInfo {
    property?: CMSProperties;
    keyPath?: string;
}
export declare const assetInfoAtom: import("recoil").RecoilState<AssetInfo>;
export declare const prevAssetInfoAtom: import("recoil").RecoilState<AssetInfo>;
