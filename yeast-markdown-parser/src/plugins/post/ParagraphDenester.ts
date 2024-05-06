import {
	DocumentNode,
	isYeastNodeType,
	ParagraphNode,
	PostProcessorPlugin,
	YeastBlockNodeTypes,
	YeastChild,
	YeastNode,
	YeastParser,
} from 'yeast-core';

export class ParagraphDenester implements PostProcessorPlugin {
	parse(document: DocumentNode, parser: YeastParser): DocumentNode {
		document.children = denest(document.children) as YeastNode[];
		return document;
	}
}

function denest(nodes: YeastChild[]) {
	let reprocess = false;

	// Process this list of children till it runs clean
	do {
		reprocess = false;

		// Check each node to pull up nested paragraphs
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			// Is this node a paragraph
			if (isYeastNodeType(node, YeastBlockNodeTypes.Paragraph)) {
				const typedNode = node as ParagraphNode;
				// Is there only one child that's also a paragraph?
				if (
					typedNode.children &&
					typedNode.children.length === 1 &&
					isYeastNodeType(typedNode.children[0], YeastBlockNodeTypes.Paragraph)
				) {
					// Then replace this node with the child!
					nodes[i] = typedNode.children[0];

					// Abort this loop to recheck this level
					reprocess = true;
					break;
				}
			}
		}
	} while (reprocess);

	// Process these nodes' children
	nodes.forEach((node) => {
		if ('type' in node && 'children' in node) {
			const typedNode = node as YeastNode;
			node.children = denest(node.children);
		}
	});

	// Return scrubbed nodes
	return nodes;
}
