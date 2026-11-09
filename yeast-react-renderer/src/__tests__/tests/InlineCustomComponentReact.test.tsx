import { DocumentNode, YeastChild } from 'yeast-core';
import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import YeastDocumentRenderer from '../../YeastDocumentRenderer';
import { NodeRendererMap, ReactRenderer } from '../../ReactRenderer';

function doc(...children: YeastChild[]): DocumentNode {
	return { type: 'document', title: 'Inline custom components', children } as DocumentNode;
}

function paragraph(...children: YeastChild[]): YeastChild {
	return { type: 'paragraph', children } as YeastChild;
}

async function renderDoc(ast: DocumentNode, customRenderers?: NodeRendererMap) {
	let result: ReturnType<typeof render>;
	await act(() => {
		result = render(<YeastDocumentRenderer ast={ast} customRenderers={customRenderers} />);
	});
	return result!;
}

let warnSpy: jest.SpyInstance;
let errorSpy: jest.SpyInstance;

beforeEach(() => {
	warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
	errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	warnSpy.mockRestore();
	errorSpy.mockRestore();
});

function keyWarnings(): unknown[][] {
	return errorSpy.mock.calls.filter((args) => args.some((a) => typeof a === 'string' && a.includes('unique "key"')));
}

test('unregistered inline node renders inline code with the raw self-closing tag inside the paragraph', async () => {
	const { container } = await renderDoc(
		doc(
			paragraph({ text: 'Click ' }, { type: 'Icon', inline: true, name: 'settings', size: 16, label: undefined } as YeastChild, {
				text: ' to open settings.',
			}),
		),
	);

	const p = container.querySelector('p');
	expect(p).not.toBeNull();
	const code = p!.querySelector('code');
	expect(code).not.toBeNull();
	expect(code!.textContent).toBe('<yeastInline:Icon name="settings" size="16" />');
	expect(code!.children.length).toBe(0);
	expect(p!.textContent).toBe('Click <yeastInline:Icon name="settings" size="16" /> to open settings.');
	// The paragraph stays a single paragraph: no block element is emitted
	expect(container.querySelectorAll('p').length).toBe(1);
	expect(container.querySelector('pre')).toBeNull();
	expect(warnSpy).toHaveBeenCalledWith(
		'Unhandled inline custom component, rendering it as inline code',
		expect.objectContaining({ type: 'Icon' }),
	);
});

test('unregistered inline node skips internal and diff properties and escapes attribute values', async () => {
	const { container } = await renderDoc(
		doc(
			paragraph({
				type: 'Icon',
				inline: true,
				name: 'say "hi" & <bye>',
				hasDiff: false,
				diffType: undefined,
				containsDiff: false,
				oldNodePath: [0, 1],
				newNodePath: [0, 1],
			} as YeastChild),
		),
	);

	const code = container.querySelector('p code');
	expect(code!.textContent).toBe('<yeastInline:Icon name="say &quot;hi&quot; &amp; &lt;bye>" />');
	// Text only: no element was created from the attribute value
	expect(container.querySelector('bye')).toBeNull();
});

test('unregistered inline node with children renders an opening and closing tag around the plain text', async () => {
	const { container } = await renderDoc(
		doc(
			paragraph(
				{ text: 'See ' },
				{
					type: 'Badge',
					inline: true,
					color: 'blue',
					children: [{ text: 'new ' }, { type: 'bold', children: [{ text: 'beta' }] }],
				} as YeastChild,
				{ text: '.' },
			),
		),
	);

	const code = container.querySelector('p code');
	expect(code!.textContent).toBe('<yeastInline:Badge color="blue">new beta</yeastInline:Badge>');
	// Children are plain text, not rendered nodes
	expect(code!.querySelector('strong')).toBeNull();
});

test('a registered custom renderer for the type still wins', async () => {
	const customRenderers = {
		Icon: (node: any) => <span key="icon" data-testid="icon" className={`icon-${node.name}`} />,
	} as unknown as NodeRendererMap;
	const { container } = await renderDoc(
		doc(paragraph({ text: 'a ' }, { type: 'Icon', inline: true, name: 'x' } as YeastChild)),
		customRenderers,
	);

	expect(container.querySelector('p span.icon-x')).not.toBeNull();
	expect(container.querySelector('code')).toBeNull();
	expect(warnSpy).not.toHaveBeenCalled();
});

test('a string "true" marker keeps today\'s behaviour: nothing rendered, same warning', async () => {
	const node = { type: 'Icon', inline: 'true', name: 'x' } as YeastChild;
	const { container } = await renderDoc(doc(paragraph({ text: 'a ' }, node, { text: ' b' })));

	expect(container.querySelector('code')).toBeNull();
	expect(container.querySelector('p')!.textContent).toBe('a  b');
	expect(warnSpy).toHaveBeenCalledWith('Unhandled node', node);
});

test("a node without the marker keeps today's behaviour: nothing rendered, same warning", async () => {
	const node = { type: 'Icon', name: 'x' } as YeastChild;
	const { container } = await renderDoc(doc(paragraph({ text: 'a ' }, node, { text: ' b' })));

	expect(container.querySelector('code')).toBeNull();
	expect(container.querySelector('p')!.textContent).toBe('a  b');
	expect(warnSpy).toHaveBeenCalledWith('Unhandled node', node);
});

test("an unregistered block node keeps today's behaviour", async () => {
	const node = { type: 'Panel', title: 'x', children: [{ text: 'body' }] } as YeastChild;
	const { container } = await renderDoc(doc(node, paragraph({ text: 'after' })));

	expect(container.querySelector('code')).toBeNull();
	expect(container.textContent).not.toContain('body');
	expect(warnSpy).toHaveBeenCalledWith('Unhandled node', node);
});

test('no React key warning when the fallback sits among siblings', async () => {
	await renderDoc(
		doc(
			paragraph(
				{ text: 'one ' },
				{ type: 'Icon', inline: true, name: 'a' } as YeastChild,
				{ text: ' two ' },
				{ type: 'Icon', inline: true, name: 'b' } as YeastChild,
				{ type: 'bold', children: [{ text: 'three' }] } as YeastChild,
				{ type: 'Badge', inline: true, children: [{ text: 'four' }] } as YeastChild,
			),
			{ type: 'Icon', inline: true, name: 'top-level' } as YeastChild,
		),
	);

	expect(keyWarnings()).toEqual([]);
});

describe('unregistered inline custom component: attribute rule set', () => {
	test('null and function values are skipped', async () => {
		const { container } = await renderDoc(doc(paragraph({ type: 'Icon', inline: true, name: 'x', gone: null, fn: () => 'y', size: '16' } as any)));
		expect(container.querySelector('code')?.textContent).toBe('<yeastInline:Icon name="x" size="16" />');
	});

	test('a text property is skipped and the node still reaches the fallback', async () => {
		const { container } = await renderDoc(
			doc(paragraph({ text: 'a ' } as any, { type: 'Icon', inline: true, name: 'x', text: 'hidden' } as any, { text: ' b' } as any))
		);
		expect(container.querySelector('code')?.textContent).toBe('<yeastInline:Icon name="x" />');
		expect(container.textContent).not.toContain('hidden');
	});

	test('CR and LF in a value are encoded, like the markdown fallback', async () => {
		const { container } = await renderDoc(doc(paragraph({ type: 'Icon', inline: true, label: 'a\r\nb' } as any)));
		expect(container.querySelector('code')?.textContent).toBe('<yeastInline:Icon label="a&#13;&#10;b" />');
	});

	test('an unhandledNodeRenderer wins over the inline fallback', () => {
		const renderer = new ReactRenderer();
		renderer.unhandledNodeRenderer = () => <span data-testid="custom">custom</span>;
		const { container } = render(<div>{renderer.renderComponents([{ type: 'Icon', inline: true, name: 'x' } as any])}</div>);
		expect(container.querySelector('[data-testid="custom"]')).not.toBeNull();
		expect(container.querySelector('code')).toBeNull();
	});
});
