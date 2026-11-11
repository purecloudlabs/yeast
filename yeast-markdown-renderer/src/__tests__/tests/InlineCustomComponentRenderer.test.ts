import { DocumentNode, YeastChild } from 'yeast-core';
import { MarkdownRenderer } from '../../MarkdownRenderer';

const FRONT_MATTER = '---\ntitle: Inline test\n---\n';

const doc = (...children: any[]): DocumentNode => ({ type: 'document', title: 'Inline test', children } as DocumentNode);
const para = (...children: any[]) => ({ type: 'paragraph', indentation: 0, children });
const icon = (props: Record<string, any> = { name: 'bell' }, children?: any[]) => {
	const node: any = { type: 'Icon', inline: true, ...props };
	if (children) node.children = children;
	return node;
};
const render = (document: DocumentNode, renderer = new MarkdownRenderer()) => renderer.renderMarkdown(document);

let logSpy: jest.SpyInstance;
beforeEach(() => {
	// The fallback path logs "Unhandled node" for every node it handles (existing behaviour).
	logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
});
afterEach(() => {
	logSpy.mockRestore();
});

describe('inline custom component fallback', () => {
	test('inline node mid-paragraph is written in place and the paragraph is not split', () => {
		const md = render(doc(para({ text: 'Tap ' }, icon(), { text: ' to continue.' })));
		expect(md).toBe(`${FRONT_MATTER}\nTap <yeastInline:Icon name="bell" /> to continue.\n`);
	});

	test('inline node at the start of a paragraph', () => {
		const md = render(doc(para(icon(), { text: ' first' })));
		expect(md).toBe(`${FRONT_MATTER}\n<yeastInline:Icon name="bell" /> first\n`);
	});

	test('inline node inside bold', () => {
		const md = render(doc(para({ text: 'A ' }, { type: 'bold', children: [{ text: 'bold ' }, icon()] }, { text: ' b' })));
		expect(md).toBe(`${FRONT_MATTER}\nA **bold <yeastInline:Icon name="bell" />** b\n`);
	});

	test('inline node inside link text', () => {
		const md = render(doc(para({ type: 'link', href: '/x', children: [icon(), { text: ' Open' }] })));
		expect(md).toBe(`${FRONT_MATTER}\n[<yeastInline:Icon name="bell" /> Open](/x)\n`);
	});

	test('inline node inside a heading', () => {
		const md = render(doc({ type: 'heading', level: 2, children: [{ text: 'Title ' }, icon()] }));
		expect(md).toBe(`${FRONT_MATTER}\n## Title <yeastInline:Icon name="bell" /> \n`);
	});

	test('inline node inside a list item', () => {
		const md = render(
			doc({
				type: 'list',
				ordered: false,
				level: 0,
				children: [{ type: 'listitem', level: 0, children: [{ text: 'Item ' }, icon(), { text: ' end' }] }],
			})
		);
		expect(md).toBe(`${FRONT_MATTER}\n- Item <yeastInline:Icon name="bell" /> end\n`);
	});

	test('inline node inside a table cell keeps the table as markdown', () => {
		const cell = (...children: any[]) => ({ type: 'tablecell', children: [para(...children)] });
		const md = render(
			doc({
				type: 'table',
				indentation: 0,
				children: [
					{ type: 'tablerow', header: true, children: [cell({ text: 'A' }), cell({ text: 'B' })] },
					{ type: 'tablerow', children: [cell({ text: 'x ' }, icon(), { text: ' y' }), cell({ text: 'z' })] },
				],
			})
		);
		expect(md).not.toContain('<yeast:');
		expect(md).toBe(`${FRONT_MATTER}\n| A | B |\n| :---: | :---: |\n| x <yeastInline:Icon name="bell" /> y | z |\n`);
	});

	test('inline node with text children', () => {
		const md = render(
			doc(para({ text: 'See ' }, { type: 'Tooltip', inline: true, tip: 'hi', children: [{ text: 'this' }] }, { text: '.' }))
		);
		expect(md).toBe(`${FRONT_MATTER}\nSee <yeastInline:Tooltip tip="hi">this</yeastInline:Tooltip>.\n`);
	});

	test('inline node with bold and nested inline children, no added whitespace', () => {
		const tooltip = {
			type: 'Tooltip',
			inline: true,
			tip: 'hi',
			children: [{ text: 'a ' }, { type: 'bold', children: [{ text: 'b' }] }, { text: ' ' }, icon({ name: 'x' }), { text: 'c' }],
		};
		const md = render(doc(para(tooltip)));
		expect(md).toBe(`${FRONT_MATTER}\n<yeastInline:Tooltip tip="hi">a **b** <yeastInline:Icon name="x" />c</yeastInline:Tooltip>\n`);
	});

	test('the inline marker and diff properties are not written as attributes', () => {
		const node = icon({
			name: 'bell',
			hasDiff: true,
			diffType: 'added',
			diffMods: {},
			diffPivots: {},
			isTextModification: false,
			containsDiff: true,
			diffSource: 'new',
			oldNodePath: [0, 1],
			newNodePath: [0, 1],
			skipped: undefined,
		});
		const md = render(doc(para(node)));
		expect(md).toBe(`${FRONT_MATTER}\n<yeastInline:Icon name="bell" />\n`);
		expect(md).not.toContain('inline=');
	});

	test('attribute values are stringified and escaped, order is stable', () => {
		const node = icon({ z: 'first', label: 'a "quoted" & <tagged> value', size: 2, on: false, data: { k: 'v' }, list: [1, 'two'] });
		const md = render(doc(para(node)));
		expect(md).toBe(
			`${FRONT_MATTER}\n<yeastInline:Icon z="first" label="a &quot;quoted&quot; &amp; &lt;tagged> value" size="2" on="false" data="{&quot;k&quot;:&quot;v&quot;}" list="[1,&quot;two&quot;]" />\n`
		);
	});

	test('newlines in attribute values are encoded so the tag stays on one line', () => {
		const md = render(doc(para(icon({ label: 'a\nb\r\nc' }))));
		expect(md).toBe(`${FRONT_MATTER}\n<yeastInline:Icon label="a&#10;b&#13;&#10;c" />\n`);
	});

	test('an empty children array is treated as self-closing', () => {
		const md = render(doc(para(icon({ name: 'bell' }, []))));
		expect(md).toBe(`${FRONT_MATTER}\n<yeastInline:Icon name="bell" />\n`);
	});

	test('inline: "true" (string) is not inline and keeps the block fallback', () => {
		const md = render(doc(para({ text: 'a ' }, { type: 'Icon', inline: 'true', name: 'bell' }, { text: ' b' })));
		expect(md).toBe(`${FRONT_MATTER}\na \n<yeast:Icon inline="true" name="bell"/>\n b\n`);
	});
});

describe('existing behaviour kept', () => {
	test('block custom component is unchanged', () => {
		const block = { type: 'OpenAPIExplorer', source: 'x.json', children: [{ type: 'Child', a: '1' }] };
		const md = render(doc(block as YeastChild));
		expect(md).toBe(`${FRONT_MATTER}\n<yeast:OpenAPIExplorer source="x.json">\n  <yeast:Child a="1"/>\n</yeast:OpenAPIExplorer>\n`);
	});

	test('a registered custom renderer wins over the inline fallback', () => {
		const renderer = new MarkdownRenderer({ Icon: (node: any) => `[icon:${node.name}]` } as any);
		const md = render(doc(para({ text: 'a ' }, icon(), { text: ' b' })), renderer);
		expect(md).toBe(`${FRONT_MATTER}\na [icon:bell] b\n`);
	});
});

describe('inline custom component fallback: text attribute, escapes and names', () => {
	test('a text property is not written as an attribute', () => {
		const md = render(doc(para({ text: 'Tap ' }, icon({ name: 'bell', text: 'hidden' }), { text: ' now' })));
		expect(md).toBe(`${FRONT_MATTER}\nTap <yeastInline:Icon name="bell" /> now\n`);
	});

	test('a __proto__ own property is not written as an attribute', () => {
		const node = JSON.parse('{"type":"Icon","inline":true,"name":"bell","__proto__":"x"}');
		const md = render(doc(para({ text: 'a ' }, node, { text: ' b' })));
		expect(md).toBe(`${FRONT_MATTER}\na <yeastInline:Icon name="bell" /> b\n`);
	});

	test('# in an attribute value is not escaped in a heading, # in text is', () => {
		const md = render(doc({ type: 'heading', level: 2, children: [{ text: 'Item #1 ' }, icon({ color: '#fff' })] } as any));
		expect(md).toContain('## Item \\#1 <yeastInline:Icon color="#fff" /> \n');
	});

	test('# in the children of a tag in a heading is escaped, in the tag markup it is not', () => {
		const md = render(doc({ type: 'heading', level: 1, children: [icon({ color: '#fff' }, [{ text: 'a #b' }])] } as any));
		expect(md).toContain('# <yeastInline:Icon color="#fff">a \\#b</yeastInline:Icon> \n');
	});

	test('~ in an attribute value is not escaped in strikethrough, ~ in text is', () => {
		const md = render(doc(para({ type: 'strikethrough', children: [{ text: 'a~b ' }, icon({ path: '~/x' })] })));
		expect(md).toContain('~~a\\~b <yeastInline:Icon path="~/x" />~~');
	});

	// The XML form rejects these names, exactly as it does for a block component today. What matters is that no tag
	// is written that the parser would read back as text.
	test('a node type that is not a valid tag name is not written as an inline tag', () => {
		const node = { type: 'My Icon', inline: true, name: 'x' };
		expect(() => render(doc(para({ text: 'a ' }, node, { text: ' b' })))).toThrow(/Invalid XML name/);
	});

	test('an attribute key that is not valid is not written as an inline tag', () => {
		expect(() => render(doc(para({ text: 'a ' }, icon({ 'bad key': 'x' }), { text: ' b' })))).toThrow(/Invalid XML name/);
	});
});
