global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

import { isInlineCustomComponentNode, isYeastInlineNode } from 'yeast-core';

import { MarkdownParser } from '../../MarkdownParser';
import { InlineCustomComponentPlugin, MAX_INLINE_CUSTOM_COMPONENT_DEPTH } from '../../plugins/inline/InlineCustomComponentPlugin';

// The tree is navigated freely in these tests, so it is typed loosely
const parse = (markdown: string): any => new MarkdownParser().parse(markdown);

/** Children of the first (and usually only) block in the document */
const firstBlockChildren = (markdown: string): any[] => parse(markdown).children[0].children;

const icon = (name: string, extra: { [key: string]: string } = {}) => ({ type: 'Icon', inline: true, name, ...extra });

describe('InlineCustomComponentPlugin: positions', () => {
	test('start of line', () => {
		expect(firstBlockChildren('<yeastInline:Icon name="check" /> Done')).toEqual([icon('check'), { text: ' Done' }]);
	});

	test('alone on a line', () => {
		const doc = parse('<yeastInline:Icon name="check" />');
		expect(doc.children).toEqual([{ type: 'paragraph', indentation: 0, children: [icon('check')] }]);
	});

	test('mid-sentence', () => {
		expect(firstBlockChildren('Click <yeastInline:Icon name="gear" /> to open settings.')).toEqual([
			{ text: 'Click ' },
			icon('gear'),
			{ text: ' to open settings.' },
		]);
	});

	test('inside bold', () => {
		expect(firstBlockChildren('**Click <yeastInline:Icon name="gear" /> now**')).toEqual([
			{ type: 'bold', children: [{ text: 'Click ' }, icon('gear'), { text: ' now' }] },
		]);
	});

	test('inside italic', () => {
		expect(firstBlockChildren('*Click <yeastInline:Icon name="gear" /> now*')).toEqual([
			{ type: 'italic', children: [{ text: 'Click ' }, icon('gear'), { text: ' now' }] },
		]);
	});

	test('inside link text', () => {
		expect(firstBlockChildren('[Open <yeastInline:Icon name="link" />](https://example.com/page)')).toEqual([
			{ type: 'link', href: 'https://example.com/page', title: 'Link', children: [{ text: 'Open ' }, icon('link')] },
		]);
	});

	test('inside a heading', () => {
		const doc = parse('## Settings <yeastInline:Icon name="gear" /> page');
		expect(doc.children[0]).toMatchObject({ type: 'heading', level: 2 });
		expect(doc.children[0].children).toEqual([{ text: 'Settings ' }, icon('gear'), { text: ' page' }]);
	});

	test('inside a list item', () => {
		const doc = parse('- first <yeastInline:Icon name="one" />\n- second');
		expect(doc.children[0].type).toBe('list');
		expect(doc.children[0].children[0].children).toEqual([{ text: 'first ' }, icon('one')]);
		expect(doc.children[0].children[1].children).toEqual([{ text: 'second' }]);
	});

	test('inside a table cell', () => {
		const doc = parse('| Name | Icon |\n|---|---|\n| Gear | <yeastInline:Icon name="gear" /> |');
		expect(doc.children[0].type).toBe('table');
		const cell = doc.children[0].children[1].children[1];
		expect(cell.type).toBe('tablecell');
		expect(cell.children).toEqual([{ type: 'paragraph', indentation: 0, children: [icon('gear')] }]);
	});

	test('inside a blockquote', () => {
		const doc = parse('> Note <yeastInline:Icon name="info" /> here');
		expect(doc.children[0].type).toBe('blockquote');
		expect(doc.children[0].children).toEqual([
			{ type: 'paragraph', indentation: 0, children: [{ text: 'Note ' }, icon('info'), { text: ' here' }] },
		]);
	});

	test('next to punctuation', () => {
		expect(firstBlockChildren('(<yeastInline:Icon name="a" />), <yeastInline:Icon name="b" />.')).toEqual([
			{ text: '(' },
			icon('a'),
			{ text: '), ' },
			icon('b'),
			{ text: '.' },
		]);
	});

	test('next to another tag', () => {
		expect(
			firstBlockChildren('<yeastInline:Icon name="a" /><yeastInline:Icon name="b" /><yeastInline:Badge>x</yeastInline:Badge>')
		).toEqual([icon('a'), icon('b'), { type: 'Badge', inline: true, children: [{ text: 'x' }] }]);
	});

	test('nodes are inline custom component nodes', () => {
		const [node] = firstBlockChildren('<yeastInline:Icon name="a" />');
		expect(isInlineCustomComponentNode(node)).toBe(true);
		expect(isYeastInlineNode(node)).toBe(true);
	});
});

describe('InlineCustomComponentPlugin: node shape', () => {
	test('self-closing tag has no children', () => {
		const [node] = firstBlockChildren('<yeastInline:Icon name="a" />');
		expect(node).toEqual(icon('a'));
		expect(node.children).toBeUndefined();
	});

	test('self-closing without whitespace before />', () => {
		expect(firstBlockChildren('<yeastInline:Icon name="a"/>')).toEqual([icon('a')]);
		expect(firstBlockChildren('<yeastInline:Divider/>')).toEqual([{ type: 'Divider', inline: true }]);
	});

	test('no attributes', () => {
		expect(firstBlockChildren('a <yeastInline:Divider /> b')).toEqual([{ text: 'a ' }, { type: 'Divider', inline: true }, { text: ' b' }]);
	});

	test('type keeps the case as written and allows digits, underscores and hyphens', () => {
		expect(firstBlockChildren('<yeastInline:my-Icon_2 />')).toEqual([{ type: 'my-Icon_2', inline: true }]);
	});

	test('name must start with a letter', () => {
		expect(firstBlockChildren('<yeastInline:2Icon /> <yeastInline:-x />')).toEqual([{ text: '<yeastInline:2Icon /> <yeastInline:-x />' }]);
	});

	test('multiple attributes are kept as strings', () => {
		expect(firstBlockChildren('<yeastInline:Icon name="a" size="16" spin="true" />')).toEqual([icon('a', { size: '16', spin: 'true' })]);
	});

	test('empty attribute value', () => {
		expect(firstBlockChildren('<yeastInline:Icon name="" />')).toEqual([icon('')]);
	});

	test('tag with children parses children as inline content', () => {
		expect(firstBlockChildren('See <yeastInline:Tooltip label="hi">**bold** and `code`</yeastInline:Tooltip> end')).toEqual([
			{ text: 'See ' },
			{
				type: 'Tooltip',
				inline: true,
				label: 'hi',
				children: [{ type: 'bold', children: [{ text: 'bold' }] }, { text: ' and ' }, { type: 'inlinecode', children: [{ text: 'code' }] }],
			},
			{ text: ' end' },
		]);
	});

	test('tag with empty children gets an empty children array', () => {
		expect(firstBlockChildren('<yeastInline:Tag></yeastInline:Tag>')).toEqual([{ type: 'Tag', inline: true, children: [] }]);
	});

	test('tag spanning two lines of one paragraph', () => {
		expect(firstBlockChildren('<yeastInline:Tag a="1">one\ntwo</yeastInline:Tag>')).toEqual([
			{ type: 'Tag', inline: true, a: '1', children: [{ text: 'one two' }] },
		]);
	});
});

describe('InlineCustomComponentPlugin: prefix and case', () => {
	test('lower-case prefix stays text', () => {
		expect(firstBlockChildren('a <yeastinline:Icon name="a" /> b')).toEqual([{ text: 'a <yeastinline:Icon name="a" /> b' }]);
	});

	test('capitalised prefix stays text', () => {
		expect(firstBlockChildren('a <YeastInline:Icon name="a" /> b')).toEqual([{ text: 'a <YeastInline:Icon name="a" /> b' }]);
	});

	test('upper-case prefix stays text', () => {
		expect(firstBlockChildren('a <YEASTINLINE:Icon name="a" /> b')).toEqual([{ text: 'a <YEASTINLINE:Icon name="a" /> b' }]);
	});

	test('close tag must match the open tag name exactly', () => {
		expect(firstBlockChildren('<yeastInline:Tag>x</yeastInline:tag>')).toEqual([{ text: '<yeastInline:Tag>x</yeastInline:tag>' }]);
	});
});

describe('InlineCustomComponentPlugin: nesting', () => {
	test('same tag nested inside itself', () => {
		expect(firstBlockChildren('<yeastInline:Tag>a <yeastInline:Tag>b</yeastInline:Tag> c</yeastInline:Tag>')).toEqual([
			{
				type: 'Tag',
				inline: true,
				children: [{ text: 'a ' }, { type: 'Tag', inline: true, children: [{ text: 'b' }] }, { text: ' c' }],
			},
		]);
	});

	test('three levels of the same tag', () => {
		expect(
			firstBlockChildren('<yeastInline:T>1<yeastInline:T>2<yeastInline:T>3</yeastInline:T>2</yeastInline:T>1</yeastInline:T>')
		).toEqual([
			{
				type: 'T',
				inline: true,
				children: [
					{ text: '1' },
					{
						type: 'T',
						inline: true,
						children: [{ text: '2' }, { type: 'T', inline: true, children: [{ text: '3' }] }, { text: '2' }],
					},
					{ text: '1' },
				],
			},
		]);
	});

	test('other tags inside children', () => {
		expect(
			firstBlockChildren(
				'<yeastInline:Tooltip label="t">Press <yeastInline:Icon name="gear" /> then <yeastInline:Kbd>Enter</yeastInline:Kbd></yeastInline:Tooltip>'
			)
		).toEqual([
			{
				type: 'Tooltip',
				inline: true,
				label: 't',
				children: [{ text: 'Press ' }, icon('gear'), { text: ' then ' }, { type: 'Kbd', inline: true, children: [{ text: 'Enter' }] }],
			},
		]);
	});

	test('sibling tags with children', () => {
		expect(firstBlockChildren('<yeastInline:A>1</yeastInline:A> and <yeastInline:A>2</yeastInline:A>')).toEqual([
			{ type: 'A', inline: true, children: [{ text: '1' }] },
			{ text: ' and ' },
			{ type: 'A', inline: true, children: [{ text: '2' }] },
		]);
	});

	test('a self-closing tag of the same name does not change the depth', () => {
		expect(firstBlockChildren('<yeastInline:A>x <yeastInline:A /> y</yeastInline:A>')).toEqual([
			{ type: 'A', inline: true, children: [{ text: 'x ' }, { type: 'A', inline: true }, { text: ' y' }] },
		]);
	});

	test('unclosed tag stays text', () => {
		expect(firstBlockChildren('a <yeastInline:Tag x="1">b c')).toEqual([{ text: 'a <yeastInline:Tag x="1">b c' }]);
	});

	test('unclosed outer tag stays text and a closed inner tag still parses', () => {
		expect(firstBlockChildren('<yeastInline:Tag>a <yeastInline:Tag>b</yeastInline:Tag>')).toEqual([
			{ text: '<yeastInline:Tag>a ' },
			{ type: 'Tag', inline: true, children: [{ text: 'b' }] },
		]);
	});

	test('stray close tag stays text', () => {
		expect(firstBlockChildren('a </yeastInline:Tag> b')).toEqual([{ text: 'a </yeastInline:Tag> b' }]);
	});

	test('stray close tag after a complete tag stays text', () => {
		expect(firstBlockChildren('<yeastInline:Tag>a</yeastInline:Tag></yeastInline:Tag>')).toEqual([
			{ type: 'Tag', inline: true, children: [{ text: 'a' }] },
			{ text: '</yeastInline:Tag>' },
		]);
	});
});

describe('InlineCustomComponentPlugin: attributes', () => {
	test('values may contain >, single quotes, & and /', () => {
		expect(firstBlockChildren(`<yeastInline:Icon title="a > b, it's R&D / ops" />`)).toEqual([
			{ type: 'Icon', inline: true, title: "a > b, it's R&D / ops" },
		]);
	});

	test('a value containing /> does not end the tag', () => {
		expect(firstBlockChildren('<yeastInline:Icon title="x />" name="a" /> y')).toEqual([icon('a', { title: 'x />' }), { text: ' y' }]);
	});

	test('&quot; &amp; &lt; &#13; &#10; are decoded in one pass; other entities are kept', () => {
		expect(
			firstBlockChildren('<yeastInline:Icon title="say &quot;hi&quot; &amp;quot; &amp; &lt;b&gt; a&#13;&#10;b &#39; &copy; R&D" />')
		).toEqual([{ type: 'Icon', inline: true, title: 'say "hi" &quot; & <b&gt; a\r\nb &#39; &copy; R&D' }]);
	});

	test('a raw < in a value is allowed', () => {
		expect(firstBlockChildren('<yeastInline:Icon title="a < b" />')).toEqual([{ type: 'Icon', inline: true, title: 'a < b' }]);
	});

	test('attributes on a tag with children', () => {
		expect(firstBlockChildren('<yeastInline:Tip label="a > b">c</yeastInline:Tip>')).toEqual([
			{ type: 'Tip', inline: true, label: 'a > b', children: [{ text: 'c' }] },
		]);
	});

	test('whitespace around = is allowed', () => {
		expect(firstBlockChildren('<yeastInline:Icon name = "a" />')).toEqual([icon('a')]);
	});

	test.each([
		['bare attribute', '<yeastInline:Icon spin />'],
		['bare attribute after a valued one', '<yeastInline:Icon name="a" spin />'],
		['single-quoted value', `<yeastInline:Icon name='a' />`],
		['unquoted value', '<yeastInline:Icon name=a />'],
		['unterminated value', '<yeastInline:Icon name="a />'],
		['no whitespace between attributes', '<yeastInline:Icon name="a"size="2" />'],
		['no whitespace after the name', '<yeastInline:Icon"a" />'],
		['unterminated tag', '<yeastInline:Icon name="a"'],
		['empty name', '<yeastInline: />'],
		['missing colon', '<yeastInline Icon />'],
		['duplicate attribute', '<yeastInline:Icon name="a" name="b" />'],
		['reserved attribute type', '<yeastInline:Icon type="x" />'],
		['reserved attribute inline', '<yeastInline:Icon inline="false" />'],
		['reserved attribute children', '<yeastInline:Icon children="x" />'],
		// core's isYeastTextNode() is `node.text !== undefined`, so a text attribute would turn the node into a text node
		['reserved attribute text', '<yeastInline:Icon text="x" />'],
		['reserved attribute text on a tag with children', '<yeastInline:Tip text="x">y</yeastInline:Tip>'],
		['space between / and >', '<yeastInline:Icon name="a" / >'],
	])('malformed tag stays text: %s', (_label, tag) => {
		expect(firstBlockChildren(`x ${tag} y`)).toEqual([{ text: `x ${tag} y` }]);
	});
});

describe('InlineCustomComponentPlugin: code and escapes', () => {
	test('tag inside inline code stays literal', () => {
		expect(firstBlockChildren('Write `<yeastInline:Icon name="a" />` to show it')).toEqual([
			{ text: 'Write ' },
			{ type: 'inlinecode', children: [{ text: '<yeastInline:Icon name="a" />' }] },
			{ text: ' to show it' },
		]);
	});

	test('tag inside double-backtick inline code stays literal', () => {
		expect(firstBlockChildren('``<yeastInline:Tag>x</yeastInline:Tag>``')).toEqual([
			{ type: 'inlinecode', children: [{ text: '<yeastInline:Tag>x</yeastInline:Tag>' }] },
		]);
	});

	test('tag inside a fenced code block stays literal', () => {
		const doc = parse('```html\n<yeastInline:Icon name="a" />\n<yeastInline:Tag>x</yeastInline:Tag>\n```');
		expect(doc.children).toHaveLength(1);
		expect(doc.children[0]).toMatchObject({ type: 'code', language: 'html' });
		expect(doc.children[0].value).toBe('<yeastInline:Icon name="a" />\n<yeastInline:Tag>x</yeastInline:Tag>');
		expect(doc.children[0].children).toEqual([]);
	});

	test('tag in a 4-space indented paragraph becomes a component (YEAST has no indented code)', () => {
		const doc = parse('Intro\n\n    <yeastInline:Icon name="a" /> indented');
		expect(doc.children[1]).toMatchObject({ type: 'paragraph' });
		expect(doc.children[1].children).toEqual([icon('a'), { text: ' indented' }]);
	});

	test('backslash before the tag stays as text and the tag still becomes a component', () => {
		expect(firstBlockChildren('a \\<yeastInline:Icon name="e" /> b')).toEqual([{ text: 'a \\' }, icon('e'), { text: ' b' }]);
	});
});

describe('InlineCustomComponentPlugin: old block rule is unaffected', () => {
	test('a yeast: block component on its own line still parses as a block', () => {
		const doc = parse('<yeast:Icon name="a" />');
		expect(doc.children).toEqual([{ type: 'Icon', name: 'a' }]);
	});
});

describe('InlineCustomComponentPlugin: pathological input', () => {
	const timeBoxMs = 2000;

	test('thousands of unclosed fragments parse within the time box', () => {
		const text = 'x <yeastInline:Icon name="a" '.repeat(3000) + '<yeastInline:Tag> y '.repeat(2000);
		const started = Date.now();
		const children = firstBlockChildren(text);
		const elapsed = Date.now() - started;
		expect(elapsed).toBeLessThan(timeBoxMs);
		expect(children).toEqual([{ text: text.trim() }]);
	});

	test('many unmatched opens followed by many closes parse within the time box', () => {
		const text = '<yeastInline:Tag>a '.repeat(2000) + '</yeastInline:Tag>'.repeat(1) + ' <yeastInline:Icon name="'.repeat(2000);
		const started = Date.now();
		firstBlockChildren(text);
		expect(Date.now() - started).toBeLessThan(timeBoxMs);
	});

	test('the plugin alone handles a long unclosed run within the time box', () => {
		const plugin = new InlineCustomComponentPlugin();
		const parser = new MarkdownParser();
		const text = '<yeastInline:A b="<yeastInline:A b="'.repeat(5000) + '<yeastInline:T>'.repeat(5000);
		const started = Date.now();
		const tokens = plugin.tokenize(text, parser) || [];
		expect(Date.now() - started).toBeLessThan(timeBoxMs);
		expect(tokens).toEqual([]);
	});

	test('deeply nested matched tags parse within the time box', () => {
		const depth = MAX_INLINE_CUSTOM_COMPONENT_DEPTH;
		const text = '<yeastInline:T>x'.repeat(depth) + '</yeastInline:T>'.repeat(depth);
		const started = Date.now();
		const children = firstBlockChildren(text);
		expect(Date.now() - started).toBeLessThan(timeBoxMs);
		let node: any = children[0];
		let levels = 0;
		while (node && node.type === 'T') {
			levels++;
			node = node.children[1];
		}
		expect(levels).toBe(depth);
	});
});

describe('InlineCustomComponentPlugin: nesting depth cap', () => {
	test(`tags nested deeper than ${MAX_INLINE_CUSTOM_COMPONENT_DEPTH} levels stay text inside the deepest component`, () => {
		const depth = MAX_INLINE_CUSTOM_COMPONENT_DEPTH + 2;
		const text = '<yeastInline:T>'.repeat(depth) + 'x' + '</yeastInline:T>'.repeat(depth);
		let node: any = firstBlockChildren(text)[0];
		let levels = 0;
		while (node && node.type === 'T') {
			levels++;
			if (levels === MAX_INLINE_CUSTOM_COMPONENT_DEPTH) break;
			node = node.children[0];
		}
		expect(levels).toBe(MAX_INLINE_CUSTOM_COMPONENT_DEPTH);
		expect(node.children).toEqual([{ text: '<yeastInline:T><yeastInline:T>x</yeastInline:T></yeastInline:T>' }]);
	});

	test('very deep nesting parses within the time box', () => {
		const depth = 5000;
		const text = '<yeastInline:T>'.repeat(depth) + 'x' + '</yeastInline:T>'.repeat(depth);
		const started = Date.now();
		firstBlockChildren(text);
		expect(Date.now() - started).toBeLessThan(2000);
	});
});

describe('InlineCustomComponentPlugin: attribute names', () => {
	test('constructor and toString are plain attributes', () => {
		const [node] = firstBlockChildren('<yeastInline:Icon constructor="y" toString="z" />');
		expect(Object.getPrototypeOf(node)).toBe(Object.prototype);
		expect(node.constructor).toBe('y');
		expect(node.toString).toBe('z');
	});

	test('reserved attribute __proto__ keeps the tag as text', () => {
		// Checked on the plugin alone: the emphasis plugin reads __proto__ as bold text
		expect(new InlineCustomComponentPlugin().tokenize('x <yeastInline:Icon __proto__="a" /> y', new MarkdownParser())).toEqual([]);
	});
});

describe('InlineCustomComponentPlugin: a complete tag beats tokens that end inside it', () => {
	test('underscore in a value after snake_case text', () => {
		expect(firstBlockChildren('snake_case <yeastInline:Icon name="arrow_right" /> end')).toEqual([
			{ text: 'snake_case ' },
			icon('arrow_right'),
			{ text: ' end' },
		]);
	});

	test('asterisk in a value after an opening asterisk', () => {
		expect(firstBlockChildren('a *b <yeastInline:Icon name="x*y" /> c')).toEqual([{ text: 'a *b ' }, icon('x*y'), { text: ' c' }]);
	});

	test('backtick in a value after an opening backtick', () => {
		expect(firstBlockChildren('a `b <yeastInline:Icon name="x`y" /> c')).toEqual([{ text: 'a `b ' }, icon('x`y'), { text: ' c' }]);
	});

	test('link syntax in a value after an opening bracket', () => {
		expect(firstBlockChildren('a [b <yeastInline:Icon name="x](http://u)" /> c')).toEqual([
			{ text: 'a [b ' },
			icon('x](http://u)'),
			{ text: ' c' },
		]);
	});

	test('a token that contains the whole tag still wins', () => {
		expect(firstBlockChildren('_a <yeastInline:Icon name="b" /> c_')).toEqual([
			{ type: 'italic', children: [{ text: 'a ' }, icon('b'), { text: ' c' }] },
		]);
	});

	test('a tag with children and an underscore inside them', () => {
		expect(firstBlockChildren('x_y <yeastInline:Box>p_q</yeastInline:Box> z')).toEqual([
			{ text: 'x_y ' },
			{ type: 'Box', inline: true, children: [{ text: 'p_q' }] },
			{ text: ' z' },
		]);
	});
});

describe('InlineCustomComponentPlugin: malformed and crossing input', () => {
	test('a close tag with another name does not close the open tag', () => {
		expect(firstBlockChildren('<yeastInline:A>x</yeastInline:B>')).toEqual([{ text: '<yeastInline:A>x</yeastInline:B>' }]);
	});

	test('crossing tags: the first close tag pairs by name, the rest stays text', () => {
		expect(firstBlockChildren('<yeastInline:A><yeastInline:B>x</yeastInline:A></yeastInline:B>')).toEqual([
			{ type: 'A', inline: true, children: [{ text: '<yeastInline:B>x' }] },
			{ text: '</yeastInline:B>' },
		]);
	});

	test('a close tag inside an attribute value is not a close tag', () => {
		expect(firstBlockChildren('<yeastInline:A title="</yeastInline:A>">x</yeastInline:A>')).toEqual([
			{ type: 'A', inline: true, title: '</yeastInline:A>', children: [{ text: 'x' }] },
		]);
	});

	test('bold that crosses the end of a tag is dropped, the tag wins', () => {
		expect(firstBlockChildren('**a <yeastInline:A>b**</yeastInline:A>')).toEqual([
			{ text: '**a ' },
			{ type: 'A', inline: true, children: [{ text: 'b**' }] },
		]);
	});

	test('a tag inside a link URL becomes a component and the link is text', () => {
		expect(firstBlockChildren('[link](http://a.com/<yeastInline:Icon name="x" />)')).toEqual([
			{ text: '[link](http://a.com/' },
			icon('x'),
			{ text: ')' },
		]);
	});

	test('a tag in image alt text stays inside the image title', () => {
		expect(firstBlockChildren('![alt <yeastInline:Icon name="x" />](http://a.com/i.png)')).toEqual([
			{ type: 'image', src: 'http://a.com/i.png', title: 'alt <yeastInline:Icon name="x" />' },
		]);
	});

	test('emphasis after a tag with an underscore value still works', () => {
		expect(firstBlockChildren('<yeastInline:A name="a_b" /> and _c_')).toEqual([
			{ type: 'A', inline: true, name: 'a_b' },
			{ text: ' and ' },
			{ type: 'italic', children: [{ text: 'c' }] },
		]);
	});
});
