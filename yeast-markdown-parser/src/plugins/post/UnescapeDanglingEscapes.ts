import { DocumentNode, isYeastNode, isYeastTextNode, PostProcessorPlugin, YeastChild, YeastNode, YeastParser, YeastText } from 'yeast-core';

export class UnescapeDanglingEscapes implements PostProcessorPlugin {
	parse(document: DocumentNode, parser: YeastParser): DocumentNode {
		document.children = unescapeStuff(document.children) as YeastNode[];
		return document;
	}
}

// Matches a backslash before double: underscores, double asterisks, single underscores, single asterisks, pipes
const ESCAPED_STUFF_REGEX = /\\(__|\*\*|_|\*|\||\[|\])/g;

function unescapeStuff(nodes?: YeastChild[]) {
	if (!nodes) return undefined;

	// Process nodes
	nodes.forEach((node) => {
		// Replace escaped chars in text nodes
		if (isYeastTextNode(node)) {
			node.text = node.text.replaceAll(ESCAPED_STUFF_REGEX, '$1');
		}

		// Process node's children
		if (isYeastNode(node)) {
			node.children = unescapeStuff(node.children);
		}
	});

	// Return scrubbed nodes
	return nodes;
}
