import { atom, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import CmsApi, { Toast } from '../helpers/types';

export const cmsApiAtom = atom<CmsApi>({
    key: 'CmsApi',
    default: {} as CmsApi
});

export function useCmsApi() {
	return useRecoilValue(cmsApiAtom);
}

export function setCmsApi(cmsApi: CmsApi) {
	setRecoil(cmsApiAtom, cmsApi);
}

export const addToastAtom = atom<(toast: Toast) => any>({ key: 'addToast', default: undefined });

export function useAddToast() {
	return useRecoilValue(addToastAtom);
}

export function setAddToast(addToast: (toast: Toast) => any) {
	setRecoil(addToastAtom, addToast);
}
