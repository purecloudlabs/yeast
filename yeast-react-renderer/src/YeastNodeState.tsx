import React, { useEffect } from 'react';

import CmsApi, { CMSProperties } from './helpers/types';
import { setProperty, useProperty } from './atoms/PropertyAtom';
import { setCmsApi, useCmsApi } from './atoms/CmsApiAtom';

export interface YeastNodeStateProps {
	api: CmsApi;
	property: CMSProperties;
}

export default function YeastNodeState(props: YeastNodeStateProps) {
    const property = useProperty();
    const cmsApi = useCmsApi();

    useEffect(() => {
		if (props.property !== property) setProperty(props.property);
		if (props.api !== cmsApi) setCmsApi(props.api);
	}, [props.api, props.property]);

    return <></>;
}