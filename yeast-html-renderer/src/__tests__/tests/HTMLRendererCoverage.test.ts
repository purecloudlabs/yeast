import { DocumentNode } from 'yeast-core';

import { HTMLRenderer, RenderedNode } from '../../HTMLRenderer';

// Coverage of the renderer's behaviour as of 1.0.4, written before the inline custom component change.
// Fixtures are small hand-built trees in the shape the markdown parser produces.

const doc = (...children: any[]): DocumentNode => ({ type: 'document', title: 'Test', children } as DocumentNode);
const p = (...children: any[]): any => ({ type: 'paragraph', children });
const render = (...children: any[]) => new HTMLRenderer().renderHTMLString(doc(...children));

describe('paragraphs and headings', () => {
	test('paragraph with text', () => {
		expect(render(p({ text: 'Hello world' }))).toBe('<p>Hello world</p>');
	});

	test('text is escaped inside elements', () => {
		expect(render(p({ text: 'a < b & c > d' }))).toBe('<p>a &lt; b &amp; c &gt; d</p>');
	});

	test('top-level blocks are joined with a newline', () => {
		expect(render(p({ text: 'one' }), p({ text: 'two' }))).toBe('<p>one</p>\n<p>two</p>');
	});

	test.each([
		[1, '<h1>T</h1>'],
		[3, '<h3>T</h3>'],
		[6, '<h6>T</h6>'],
		[7, '<span class="h7">T</span>'],
		[9, '<span class="h7">T</span>'],
		[0, '<h1>T</h1>'],
		[undefined, '<h1>T</h1>'],
	])('heading level %p', (level, expected) => {
		expect(render({ type: 'heading', level, id: 't', children: [{ text: 'T' }] })).toBe(expected);
	});
});

describe('inline formatting', () => {
	test('bold, italic and strikethrough', () => {
		expect(
			render(
				p(
					{ text: 'a ' },
					{ type: 'bold', children: [{ text: 'b' }] },
					{ text: ' ' },
					{ type: 'italic', children: [{ text: 'c' }] },
					{ text: ' ' },
					{ type: 'strikethrough', children: [{ text: 'd' }] }
				)
			)
		).toBe('<p>a <strong>b</strong> <i>c</i> <s>d</s></p>');
	});

	test('nested bold italic', () => {
		expect(render(p({ type: 'bold', children: [{ type: 'italic', children: [{ text: 'x' }] }] }))).toBe('<p><strong><i>x</i></strong></p>');
	});

	test('link with title', () => {
		expect(render(p({ type: 'link', href: 'https://example.com', title: 'Example', children: [{ text: 'go' }] }))).toBe(
			'<p><a href="https://example.com" title="Example">go</a></p>'
		);
	});

	test('link with forceNewTab', () => {
		expect(render(p({ type: 'link', href: '/a', forceNewTab: true, children: [{ text: 'x' }] }))).toBe(
			'<p><a href="/a" target="_blank">x</a></p>'
		);
	});

	test('inline code is escaped text', () => {
		expect(render(p({ text: 'run ' }, { type: 'inlinecode', children: [{ text: 'a < b && <yeast:X />' }] }))).toBe(
			'<p>run <code>a &lt; b &amp;&amp; &lt;yeast:X /&gt;</code></p>'
		);
	});

	test('image with title and alt', () => {
		expect(render(p({ type: 'image', src: 'https://example.com/i.png', alt: 'alt', title: 'title' }))).toBe(
			'<p><img title="title" alt="alt" src="https://example.com/i.png"></p>'
		);
	});
});

describe('blocks', () => {
	test('code block with language and title', () => {
		expect(render({ type: 'code', language: 'ts', title: 'file.ts', value: 'const a = 1 < 2;\n<b>x</b>' })).toBe(
			'<div><p>file.ts</p><pre><code class="language-ts">const a = 1 &lt; 2;\n&lt;b&gt;x&lt;/b&gt;</code></pre></div>'
		);
	});

	test('code block without language', () => {
		expect(render({ type: 'code', value: 'plain' })).toBe('<div><pre><code>plain</code></pre></div>');
	});

	test('unordered list with nested list', () => {
		expect(
			render({
				type: 'list',
				ordered: false,
				children: [
					{ type: 'listitem', children: [{ text: 'one' }] },
					{ type: 'list', ordered: false, children: [{ type: 'listitem', children: [{ text: 'nested' }] }] },
				],
			})
		).toBe('<ul><li>one</li><ul><li>nested</li></ul></ul>');
	});

	test('ordered list with start', () => {
		expect(
			render({
				type: 'list',
				ordered: true,
				start: 3,
				children: [{ type: 'listitem', children: [p({ text: 'three' })] }],
			})
		).toBe('<ol start="3"><li><p>three</p></li></ol>');
	});

	test('table with header row and alignment', () => {
		const cell = (text: string, align?: string) => ({ type: 'tablecell', align, children: [p({ text })] });
		expect(
			render({
				type: 'table',
				children: [
					{ type: 'tablerow', header: true, children: [cell('H1', 'left'), cell('H2', 'center')] },
					{ type: 'tablerow', children: [cell('a'), cell('b')] },
				],
			})
		).toBe(
			'<table><thead><tr><td style="text-align: left;"><p>H1</p></td><td style="text-align: center;"><p>H2</p></td></tr></thead>' +
				'<tbody><tr><td><p>a</p></td><td><p>b</p></td></tr></tbody></table>'
		);
	});

	test('table with a single header row has no thead', () => {
		expect(
			render({
				type: 'table',
				children: [{ type: 'tablerow', header: true, children: [{ type: 'tablecell', children: [{ text: 'only' }] }] }],
			})
		).toBe('<table><tbody><tr><td>only</td></tr></tbody></table>');
	});

	test('callout with type and title', () => {
		expect(render({ type: 'callout', alertType: 'warning', title: 'Heads up', children: [p({ text: 'Body' })] })).toBe(
			'<div class="callout callout-warning"><p>Heads up</p><p>Body</p></div>'
		);
	});

	test('callout without type', () => {
		expect(render({ type: 'callout', children: [p({ text: 'Body' })] })).toBe('<div class="callout"><p>Body</p></div>');
	});

	test('blockquote', () => {
		expect(render({ type: 'blockquote', children: [p({ text: 'quoted' })] })).toBe('<blockquote><p>quoted</p></blockquote>');
	});

	test('horizontal rule', () => {
		expect(render({ type: 'horizontalrule' })).toBe('<hr>');
	});
});

describe('custom components (unregistered)', () => {
	test('block custom component is dumped as XML in a code fence', () => {
		expect(render({ type: 'OpenAPIExplorer', search: 'true', showAll: 'true' })).toBe(
			'<pre><code>&lt;yeast:OpenAPIExplorer search="true" showAll="true"/&gt;</code></pre>'
		);
	});

	test('block custom component with children dumps the children', () => {
		expect(render({ type: 'Widget', name: 'x', children: [p({ text: 'hi' })] })).toMatchInlineSnapshot(`
		"<pre><code>&lt;yeast:Widget name=\\"x\\"&gt;
		  &lt;yeast:paragraph&gt;hi&lt;/yeast:paragraph&gt;
		&lt;/yeast:Widget&gt;</code></pre>"
	`);
	});

	test('unregistered custom node inside a paragraph is a pre block inside the p', () => {
		expect(render(p({ text: 'a ' }, { type: 'Widget', name: 'x' }, { text: ' b' }))).toBe(
			'<p>a <pre><code>&lt;yeast:Widget name="x"/&gt;</code></pre> b</p>'
		);
	});

	test('string inline marker is dumped like any other attribute', () => {
		expect(render(p({ type: 'Icon', inline: 'true', name: 'x' }))).toBe(
			'<p><pre><code>&lt;yeast:Icon inline="true" name="x"/&gt;</code></pre></p>'
		);
	});
});

describe('custom renderers', () => {
	const widget = (node: any, renderer: HTMLRenderer): RenderedNode => {
		const span = renderer.document.createElement('span');
		span.className = 'widget';
		span.textContent = node.name;
		return span;
	};

	test('a registered renderer renders a custom node', () => {
		const html = new HTMLRenderer({ Widget: widget }).renderHTMLString(doc(p({ text: 'a ' }, { type: 'Widget', name: 'x' })));
		expect(html).toBe('<p>a <span class="widget">x</span></p>');
	});

	test('a registered renderer overrides a default renderer', () => {
		const html = new HTMLRenderer({
			paragraph: (node: any, renderer: HTMLRenderer) => {
				const div = renderer.document.createElement('div');
				div.append(...renderer.renderComponents(node.children));
				return div;
			},
		}).renderHTMLString(doc(p({ text: 'x' })));
		expect(html).toBe('<div>x</div>');
	});

	test('a renderer returning undefined falls through to the default', () => {
		const html = new HTMLRenderer({ paragraph: () => undefined }).renderHTMLString(doc(p({ text: 'x' })));
		expect(html).toBe('<p>x</p>');
	});

	test('unhandledNodeRenderer runs before the code-fence fallback', () => {
		const renderer = new HTMLRenderer();
		renderer.unhandledNodeRenderer = (node: any) => `[${node.type}]`;
		expect(renderer.renderHTMLString(doc(p({ type: 'Widget' })))).toBe('<p>[Widget]</p>');
	});
});
