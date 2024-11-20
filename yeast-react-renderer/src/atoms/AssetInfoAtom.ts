import { atom, useRecoilValue } from 'recoil';
import { CMSProperties } from '../helpers/types';
import { setRecoil } from 'recoil-nexus';

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

export const assetInfoAtom = atom<AssetInfo>({
    key: 'asset-info',
    default: JSON.parse(localStorage.getItem('asset-info')) || {} as AssetInfo
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
    default: JSON.parse(localStorage.getItem('prev-asset-info')) || {} as AssetInfo
});

export function setPrevAssetInfo(prevAssetInfo: AssetInfo) {
    setRecoil(prevAssetInfoAtom, prevAssetInfo);
    localStorage.setItem('prev-asset-info', JSON.stringify(prevAssetInfo));
}

export function getPrevAssetInfo() {
    return useRecoilValue(prevAssetInfoAtom);
}

/*
 * Asset updates need to be debounced to avoid API errors in ImageNodeRenderer.tsx
 */

export const timerAtom = atom({
    key: 'asset-timer',
    default: initializeTimer()
});

function initializeTimer() {
    const existingTimer: TimerData | null = JSON.parse(localStorage.getItem('asset-timer')) as TimerData | null;
    if (existingTimer && existingTimer.remainingMs && existingTimer.cb) {
        return {
            timer: setTimeout(existingTimer.cb, existingTimer.remainingMs),
            remainingMs: existingTimer.remainingMs,
            cb: existingTimer.cb
        };
    }

    return {} as TimerData;
}

export function setTimer(cb: () => any, timeoutMs: number) {
    const timerData: TimerData = {
        timer: setTimeout(cb, timeoutMs),
        timeoutMs,
        startTime: Date.now(),
        remainingMs: timeoutMs
    };
    setRecoil(timerAtom, timerData);
    localStorage.setItem('asset-timer', JSON.stringify(timerData));
}

export function useTimer() {
    return useRecoilValue(timerAtom);
}

export function clearTimer() {
    const timerData: TimerData = useRecoilValue(timerAtom);
    if (timerData.timer) clearTimeout(timerData.timer);
    setRecoil(timerAtom, {} as TimerData);
    localStorage.removeItem('asset-timer');
}

export function pauseTimer() {
    const existingTimer = useRecoilValue(timerAtom);
    if (existingTimer.timer && existingTimer.cb) {
        clearTimeout(existingTimer.timer);
        const now = Date.now();
        const remainingMs = existingTimer.timeoutMs - (now - existingTimer.startTime);
        setRecoil(timerAtom, {
            remainingMs,
            cb: existingTimer.cb,
        });
        localStorage.setItem('asset-timer', JSON.stringify(existingTimer));
    }
}

export const debounceAtom = atom({
    key: 'asset-debounce',
    default: localStorage.getItem('asset-debounce') === 'true' || false
});

export function setIsDebouncing(isDebouncing: boolean) {
    setRecoil(debounceAtom, isDebouncing);
    localStorage.setItem('asset-debounce', isDebouncing.toString());
}

export function useIsDebouncing() {
    return useRecoilValue(debounceAtom);
}