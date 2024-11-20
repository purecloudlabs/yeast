/// <reference types="node" />
import { CMSProperties } from '../helpers/types';
export interface AssetInfo {
    property?: CMSProperties;
    keyPath?: string;
}
export interface TimerData {
    timer?: NodeJS.Timeout;
    timeoutMs?: number;
    remainingMs?: number;
    startTime?: number;
    cb?: () => any;
}
export declare const assetInfoAtom: import("recoil").RecoilState<AssetInfo>;
export declare function setAssetInfo(assetInfo: AssetInfo): void;
export declare function getAssetInfo(): AssetInfo;
export declare const prevAssetInfoAtom: import("recoil").RecoilState<AssetInfo>;
export declare function setPrevAssetInfo(prevAssetInfo: AssetInfo): void;
export declare function getPrevAssetInfo(): AssetInfo;
export declare const timerAtom: import("recoil").RecoilState<TimerData>;
export declare function setTimer(cb: () => any, timeoutMs: number): void;
export declare function useTimer(): TimerData;
export declare function clearTimer(): void;
export declare function pauseTimer(): void;
export declare const debounceAtom: import("recoil").RecoilState<boolean>;
export declare function setIsDebouncing(isDebouncing: boolean): void;
export declare function useIsDebouncing(): boolean;
