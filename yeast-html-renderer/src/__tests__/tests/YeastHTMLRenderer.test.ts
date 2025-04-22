import { DocumentNode, isYeastTextNode, isYeastNode, YeastChild, YeastNode, YeastText } from 'yeast-core';

import { HTMLRenderer } from '../../HTMLRenderer';
import { GENERAL_DATA, GENERAL_DATA_STRING } from '../resources/GENERAL_DATA';

test('general data rendering', () => {
	const htmlString = new HTMLRenderer().renderHTMLString(GENERAL_DATA as DocumentNode);
	expect(htmlString).toBe(GENERAL_DATA_STRING);
});
