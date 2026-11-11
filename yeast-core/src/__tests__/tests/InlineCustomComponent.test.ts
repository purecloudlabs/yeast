import {
	CustomComponentNode,
	InlineCustomComponentNode,
	Token,
	YeastBlockNodeTypes,
	YeastChild,
	YeastInlineChild,
	YeastInlineNodeTypes,
	isInlineCustomComponentNode,
	isYeastBlockNode,
	isYeastInlineNode,
	isYeastNode,
	isYeastTextNode,
} from '../../';
import { blockNode, inlineNode, ogYeastNode, textNode } from '../resources/content/nodeSamples';

const inlineCustom: InlineCustomComponentNode = { type: 'Icon', inline: true, name: 'chevron-down' };

test('every built-in inline type is still inline', () => {
	for (const type of Object.values(YeastInlineNodeTypes)) {
		expect(isYeastInlineNode({ type } as YeastChild)).toBe(true);
	}
});

test('built-in block types stay block, even with an inline marker', () => {
	for (const type of Object.values(YeastBlockNodeTypes)) {
		expect(isYeastInlineNode({ type } as YeastChild)).toBe(false);
		expect(isYeastInlineNode({ type, inline: true } as YeastChild)).toBe(false);
		expect(isYeastBlockNode({ type, inline: true } as YeastChild)).toBe(true);
	}
});

test('a custom node marked inline: true is inline', () => {
	expect(isYeastInlineNode(inlineCustom)).toBe(true);
	expect(isInlineCustomComponentNode(inlineCustom)).toBe(true);
	expect(isYeastNode(inlineCustom)).toBe(true);
	expect(isYeastBlockNode(inlineCustom)).toBe(false);
	expect(isYeastTextNode(inlineCustom)).toBe(false);
});

test('a custom node with children marked inline: true is inline', () => {
	const node: InlineCustomComponentNode = { type: 'Tag', inline: true, children: [{ text: 'hi' }] };
	expect(isYeastInlineNode(node)).toBe(true);
});

test('only the boolean true counts as the marker', () => {
	// The old block rule stores attributes as strings, so <yeast:X inline="true"/> must not become inline.
	for (const inline of [false, 'true', 'false', 1, 0, null, undefined, {}]) {
		const node = { type: 'Icon', inline } as unknown as YeastChild;
		expect(isYeastInlineNode(node)).toBe(false);
		expect(isInlineCustomComponentNode(node)).toBe(false);
	}
});

test('existing samples behave as before', () => {
	expect(isYeastInlineNode(textNode)).toBe(false);
	expect(isYeastInlineNode(blockNode)).toBe(false);
	expect(isYeastInlineNode(ogYeastNode)).toBe(false);
	expect(isYeastInlineNode(inlineNode)).toBe(true);
	expect(isInlineCustomComponentNode(inlineNode)).toBe(false);
	expect(isInlineCustomComponentNode(textNode)).toBe(false);
});

test('types: an inline custom node can be used where inline children are expected', () => {
	// These lines are compile-time checks; ts-jest fails the suite if they stop type-checking.
	const children: YeastInlineChild[] = [{ text: 'Tap ' }, inlineCustom, { text: ' to expand.' }];
	const token: Token = { start: 0, end: 5, nodes: [inlineCustom] };
	const asCustom: CustomComponentNode = inlineCustom;
	const asChild: YeastChild = inlineCustom;
	expect(children).toHaveLength(3);
	expect(token.nodes[0]).toBe(inlineCustom);
	expect(asCustom.name).toBe('chevron-down');
	expect(asChild).toBe(inlineCustom);
});

test('types: narrowing still exposes the inline marker', () => {
	const node: YeastChild = inlineCustom;
	if (isInlineCustomComponentNode(node)) {
		const marker: true = node.inline;
		expect(marker).toBe(true);
	} else {
		throw new Error('expected an inline custom component');
	}
});
