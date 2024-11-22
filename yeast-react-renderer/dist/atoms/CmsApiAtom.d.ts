import CmsApi, { Toast } from '../helpers/types';
export declare const cmsApiAtom: import("recoil").RecoilState<CmsApi>;
export declare function useCmsApi(): CmsApi;
export declare function setCmsApi(cmsApi: CmsApi): void;
export declare const addToastAtom: import("recoil").RecoilState<(toast: Toast) => any>;
export declare function useAddToast(): (toast: Toast) => any;
export declare function setAddToast(addToast: (toast: Toast) => any): void;
