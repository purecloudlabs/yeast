import {
	DocumentNode,
	isYeastBlockNode,
	isYeastNodeType,
	isYeastTextNode,
	ParagraphNode,
	PostProcessorPlugin,
	YeastBlockNodeTypes,
	YeastChild,
	YeastInlineNodeTypes,
	YeastNode,
	YeastParser,
	YeastText,
} from 'yeast-core';

export class AdjacentTextCombiner implements PostProcessorPlugin {
	parse(document: DocumentNode, parser: YeastParser): DocumentNode {
		document.children = combine(document.children) as YeastNode[];
		return document;
	}
}

function combine(nodes?: YeastChild[]) {
	if (!nodes) return undefined;

	let newNodes: YeastChild[] = [];

	// Copy nodes to new list
	nodes.forEach((node) => {
		if (newNodes.length > 0 && isYeastTextNode(node) && isYeastTextNode(newNodes[newNodes.length - 1])) {
			// Append text to last node
			(newNodes[newNodes.length - 1] as YeastText).text += (node as YeastText).text;
		} else {
			// Process node's children
			if (isYeastBlockNode(node)) {
				node.children = combine(node.children);
			}

			// Add node to list
			newNodes.push(node);
		}
	});

	// Return scrubbed nodes
	return newNodes;
}
