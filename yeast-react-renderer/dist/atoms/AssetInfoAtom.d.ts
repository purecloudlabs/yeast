import { CMSProperties } from '../helpers/types';
export interface AssetInfo {
    property?: CMSProperties;
    keyPath?: string;
}
export declare const assetInfoAtom: import("recoil").RecoilState<AssetInfo>;
export declare function useAssetInfo(): AssetInfo;
export declare function setAssetInfo(assetInfo: AssetInfo): void;
export declare const prevAssetInfoAtom: import("recoil").RecoilState<AssetInfo>;
export declare function usePrevAssetInfo(): AssetInfo;
export declare function setPrevAssetInfo(assetInfo: AssetInfo): void;
