import { YeastChild, isYeastNode, isYeastTextNode, YeastNode } from 'yeast-core';
import { fragment } from 'xmlbuilder2';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

export default function renderCustomComponent(node: YeastChild): string {
	if (!isYeastNode(node) && !isYeastTextNode(node)) return;
	const root = fragment();

	const buildTree = (node: YeastChild, parent: XMLBuilder) => {
		if (!node) return;
		if (isYeastTextNode(node)) {
			parent.txt(node.text).up();
			return;
		}

		const typedNode = node as YeastNode;

		let elemProps = {};
		for (const property in typedNode) {
			if (property !== 'type' && property !== 'children' && property !== 'text') {
				elemProps[property] = typedNode[property];
			}
		}
		let elem = elemProps ? parent.ele(`yeast:${typedNode.type}`, elemProps) : parent.ele(`yeast:${typedNode.type}`);

		if (typedNode.children) {
			for (const child of typedNode.children) {
				buildTree(child as YeastNode, elem);
			}
		}
	};

	buildTree(node, root);
	return `\n${root.end({ prettyPrint: true })}\n`;
}
