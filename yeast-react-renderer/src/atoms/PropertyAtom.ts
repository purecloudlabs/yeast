import { atom, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { CMSProperties } from '../helpers/types';

export const propertyAtom = atom<CMSProperties>({
	key: 'property',
	default: CMSProperties.None,
});

export function useProperty() {
	return useRecoilValue(propertyAtom);
}

export function setProperty(property: CMSProperties) {
	if (Object.values(CMSProperties).includes(property)) setRecoil(propertyAtom, property);
	else setRecoil(propertyAtom, CMSProperties.None);
}
