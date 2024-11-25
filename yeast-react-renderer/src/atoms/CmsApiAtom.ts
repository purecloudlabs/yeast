import { atom, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import CmsApi from '../helpers/types';

export const cmsApiAtom = atom<CmsApi>({
	key: 'CmsApi',
	default: {} as CmsApi,
});

export function useCmsApi() {
	return useRecoilValue(cmsApiAtom);
}

export function setCmsApi(cmsApi: CmsApi) {
	setRecoil(cmsApiAtom, cmsApi);
}