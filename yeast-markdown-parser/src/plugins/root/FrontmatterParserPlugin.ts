import { DocumentNode, RootNodeParserPlugin, RootNodeParserPluginResult, YeastBlockNodeTypes } from 'yeast-core';
import { parse } from 'yaml';

const FRONTMATTER_REGEX = /^\s*-{3,}\s*?\n([\s\S]+?)\n-{3,}\s*?\n([\s\S]*)/i;

/**
 * FrontmatterParserPlugin optionally parses frontmatter from the document and sets the frontmatter data on the root node
 */
export class FrontmatterParserPlugin implements RootNodeParserPlugin {
	parse(text: string): RootNodeParserPluginResult {
		let newText = text;
		let document: DocumentNode = {
			type: YeastBlockNodeTypes.Document,
			title: 'Default Page Title',
			children: [],
		};

		// Parse frontmatter and copy properties to data
		const match = text.match(FRONTMATTER_REGEX);
		if (match) {
			// Parse
			const yaml = parse(match[1]);

			// Copy properties to data
			Object.entries(yaml).forEach(([key, value]) => {
				if (value) document[key] = value;
			});

			// Set remaining text
			newText = match[2];
		}

		return {
			remainingText: newText,
			document,
		};
	}
}
