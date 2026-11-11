import { DocumentNode } from 'yeast-core';

import { HTMLRenderer, RenderedNode } from '../../HTMLRenderer';

// Unregistered inline custom components (nodes with the boolean `inline: true`) render as inline code
// showing the raw tag, inside their paragraph. Everything else keeps the code-fence dump.

const doc = (...children: any[]): DocumentNode => ({ type: 'document', title: 'Test', children } as DocumentNode);
const p = (...children: any[]): any => ({ type: 'paragraph', children });
const render = (...children: any[]) => new HTMLRenderer().renderHTMLString(doc(...children));
const renderElements = (...children: any[]) => new HTMLRenderer().renderHTML(doc(...children)) as HTMLElement[];

describe('unregistered inline custom component', () => {
	test('renders as inline code with the self-closing tag, inside the paragraph', () => {
		expect(render(p({ text: 'Click ' }, { type: 'Icon', inline: true, name: 'x' }, { text: ' now' }))).toBe(
			'<p>Click <code>&lt;yeastInline:Icon name="x" /&gt;</code> now</p>'
		);
	});

	test('no block element is inserted into the paragraph', () => {
		const [paragraph] = renderElements(p({ text: 'a ' }, { type: 'Icon', inline: true, name: 'x' }, { text: ' b' }));
		expect(paragraph.tagName).toBe('P');
		expect(paragraph.querySelector('pre')).toBeNull();
		expect(paragraph.children.length).toBe(1);
		expect(paragraph.children[0].tagName).toBe('CODE');
		expect(paragraph.childNodes.length).toBe(3);
	});

	test('tag with no attributes', () => {
		expect(render(p({ type: 'Icon', inline: true }))).toBe('<p><code>&lt;yeastInline:Icon /&gt;</code></p>');
	});

	test('several attributes keep their order', () => {
		expect(render(p({ type: 'Icon', inline: true, name: 'check', size: '16', label: 'Done' }))).toBe(
			'<p><code>&lt;yeastInline:Icon name="check" size="16" label="Done" /&gt;</code></p>'
		);
	});

	test('tag with text children', () => {
		expect(render(p({ type: 'Badge', inline: true, tone: 'info', children: [{ text: 'New' }] }))).toBe(
			'<p><code>&lt;yeastInline:Badge tone="info"&gt;New&lt;/yeastInline:Badge&gt;</code></p>'
		);
	});

	test('children are written as plain text, formatting dropped, no separators added', () => {
		expect(
			render(
				p({
					type: 'Badge',
					inline: true,
					children: [{ type: 'bold', children: [{ text: 'very' }] }, { text: ' new' }, { type: 'italic', children: [{ text: '!' }] }],
				})
			)
		).toBe('<p><code>&lt;yeastInline:Badge&gt;very new!&lt;/yeastInline:Badge&gt;</code></p>');
	});

	test('skips type, children, inline, undefined values and YEAST internal diff properties', () => {
		expect(
			render(
				p({
					type: 'Icon',
					inline: true,
					name: 'x',
					missing: undefined,
					hasDiff: true,
					diffType: 'added',
					diffSource: 'new',
					diffMods: {},
					diffPivots: {},
					isTextModification: false,
					containsDiff: true,
					oldNodePath: [0, 1],
					newNodePath: [0, 1],
				})
			)
		).toBe('<p><code>&lt;yeastInline:Icon name="x" /&gt;</code></p>');
	});

	test('non-string attribute values are stringified', () => {
		expect(render(p({ type: 'Icon', inline: true, size: 16, filled: false }))).toBe(
			'<p><code>&lt;yeastInline:Icon size="16" filled="false" /&gt;</code></p>'
		);
	});

	test('tag text is set as text, not HTML', () => {
		const [paragraph] = renderElements(
			p({ type: 'Icon', inline: true, name: '<script>alert(1)</script>', children: [{ text: '<b>x</b> & y' }] })
		);
		expect(paragraph.querySelector('script')).toBeNull();
		expect(paragraph.querySelector('b')).toBeNull();
		const code = paragraph.querySelector('code');
		expect(code.childNodes.length).toBe(1);
		expect(code.textContent).toBe('<yeastInline:Icon name="&lt;script>alert(1)&lt;/script>"><b>x</b> & y</yeastInline:Icon>');
		expect(paragraph.outerHTML).toBe(
			'<p><code>&lt;yeastInline:Icon name="&amp;lt;script&gt;alert(1)&amp;lt;/script&gt;"&gt;&lt;b&gt;x&lt;/b&gt; &amp; y&lt;/yeastInline:Icon&gt;</code></p>'
		);
	});

	test('attribute values escape &, " and < like the other renderers; children text is raw', () => {
		const [paragraph] = renderElements(p({ type: 'Icon', inline: true, label: 'say "hi" & <bye>', data: { k: 'v' } }));
		expect(paragraph.querySelector('code').textContent).toBe(
			'<yeastInline:Icon label="say &quot;hi&quot; &amp; &lt;bye>" data="{&quot;k&quot;:&quot;v&quot;}" />'
		);
	});

	test('renders inline inside a link, list item and table cell', () => {
		const icon = { type: 'Icon', inline: true, name: 'x' };
		const code = '<code>&lt;yeastInline:Icon name="x" /&gt;</code>';
		expect(render(p({ type: 'link', href: '/a', children: [{ ...icon }] }))).toBe(`<p><a href="/a">${code}</a></p>`);
		expect(render({ type: 'list', children: [{ type: 'listitem', children: [{ text: 'a ' }, { ...icon }] }] })).toBe(
			`<ul><li>a ${code}</li></ul>`
		);
		expect(render({ type: 'table', children: [{ type: 'tablerow', children: [{ type: 'tablecell', children: [{ ...icon }] }] }] })).toBe(
			`<table><tbody><tr><td>${code}</td></tr></tbody></table>`
		);
	});
});

describe('registered renderers still win', () => {
	const icon = (node: any, renderer: HTMLRenderer): RenderedNode => {
		const span = renderer.document.createElement('span');
		span.setAttribute('data-spark-icon', node.name);
		return span;
	};

	test('a registered renderer for the type wins over the inline fallback', () => {
		const html = new HTMLRenderer({ Icon: icon }).renderHTMLString(doc(p({ text: 'a ' }, { type: 'Icon', inline: true, name: 'x' })));
		expect(html).toBe('<p>a <span data-spark-icon="x"></span></p>');
	});

	test('unhandledNodeRenderer still runs before the inline fallback', () => {
		const renderer = new HTMLRenderer();
		renderer.unhandledNodeRenderer = (node: any) => `[${node.type}]`;
		expect(renderer.renderHTMLString(doc(p({ type: 'Icon', inline: true })))).toBe('<p>[Icon]</p>');
	});
});

describe('everything else keeps the code-fence dump', () => {
	test('string "true" marker is not the inline marker', () => {
		expect(render(p({ type: 'Icon', inline: 'true', name: 'x' }))).toBe(
			'<p><pre><code>&lt;yeast:Icon inline="true" name="x"/&gt;</code></pre></p>'
		);
	});

	test('no marker inside a paragraph', () => {
		expect(render(p({ type: 'Icon', name: 'x' }))).toBe('<p><pre><code>&lt;yeast:Icon name="x"/&gt;</code></pre></p>');
	});

	test('inline: false', () => {
		expect(render(p({ type: 'Icon', inline: false, name: 'x' }))).toBe(
			'<p><pre><code>&lt;yeast:Icon inline="false" name="x"/&gt;</code></pre></p>'
		);
	});

	test('block custom component unchanged', () => {
		expect(render({ type: 'OpenAPIExplorer', search: 'true', showAll: 'true' })).toBe(
			'<pre><code>&lt;yeast:OpenAPIExplorer search="true" showAll="true"/&gt;</code></pre>'
		);
	});

	test('built-in types ignore the marker', () => {
		expect(render(p({ type: 'bold', inline: true, children: [{ text: 'b' }] }))).toBe('<p><strong>b</strong></p>');
	});
});

// One attribute rule set across the markdown, HTML and React fallbacks: `text`, `__proto__`, undefined, null and
// function values are never shown; `&`, `"`, `<`, CR and LF are encoded.
describe('unregistered inline custom component: attribute rule set', () => {
	test('null and function values are skipped', () => {
		expect(render(p({ type: 'Icon', inline: true, name: 'x', gone: null, fn: () => 'y', size: '16' }))).toBe(
			'<p><code>&lt;yeastInline:Icon name="x" size="16" /&gt;</code></p>'
		);
	});

	test('a text property is skipped and the node still reaches the fallback', () => {
		expect(render(p({ text: 'a ' }, { type: 'Icon', inline: true, name: 'x', text: 'hidden' }, { text: ' b' }))).toBe(
			'<p>a <code>&lt;yeastInline:Icon name="x" /&gt;</code> b</p>'
		);
	});

	test('CR and LF in a value are encoded, like the markdown fallback', () => {
		expect(render(p({ type: 'Icon', inline: true, label: 'a\r\nb' }))).toBe(
			'<p><code>&lt;yeastInline:Icon label="a&amp;#13;&amp;#10;b" /&gt;</code></p>'
		);
	});

	test('an inline node outside a paragraph is still inline code', () => {
		expect(render({ type: 'Icon', inline: true, name: 'x' })).toBe('<code>&lt;yeastInline:Icon name="x" /&gt;</code>');
	});
});
