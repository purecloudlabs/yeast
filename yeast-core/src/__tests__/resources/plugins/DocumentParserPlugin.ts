import { DocumentNode, RootNodeParserPlugin, RootNodeParserPluginResult, YeastBlockNodeTypes } from '../../../';

/**
 * DocumentParserPlugin simply returns a DocumentNode populated with default attribute values and the full input text as remaining text.
 * This plugin is for testing purposes only.
 */
export class DocumentParserPlugin implements RootNodeParserPlugin {
	parse(text: string): RootNodeParserPluginResult {
		return {
			remainingText: text,
			document: {
				type: YeastBlockNodeTypes.Document,
				title: 'Default Page Title',
				author: 'default.author',
				children: [],
			} as DocumentNode,
		};
	}
}
