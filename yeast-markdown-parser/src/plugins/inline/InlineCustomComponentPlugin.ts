import { InlineCustomComponentNode, InlineTokenizerPlugin, Token, YeastParser } from 'yeast-core';

/**
 * Prefix of an inline custom component tag, matched exactly (case-sensitive).
 * `<yeastInline:Icon name="gear" />` is a component; `<yeastinline:Icon />` and `<YeastInline:Icon />` stay text.
 */
export const INLINE_CUSTOM_COMPONENT_PREFIX = 'yeastInline';

const OPEN_MARKER = `<${INLINE_CUSTOM_COMPONENT_PREFIX}:`;
const CLOSE_MARKER = `</${INLINE_CUSTOM_COMPONENT_PREFIX}:`;

/**
 * Attribute names a tag may not use; a tag using one stays text. `type`, `inline` and `children` would overwrite the
 * node's own properties, `text` would make yeast-core's isYeastTextNode() treat the node as a text node, and
 * `__proto__` would set the node's prototype instead of a property.
 */
const RESERVED_ATTRIBUTES = ['type', 'inline', 'children', 'text', '__proto__'];

/**
 * Entities decoded in attribute values, in a single pass (so `&amp;quot;` becomes the literal text `&quot;`).
 * This is the set yeast-markdown-renderer encodes: `&` as `&amp;` (first), `"` as `&quot;`, `<` as `&lt;`, CR as `&#13;`, LF as `&#10;`.
 * Any other `&` sequence is kept as written.
 */
const ATTRIBUTE_ENTITY_REGEX = /&(quot|amp|lt|#13|#10);/g;
const ATTRIBUTE_ENTITIES: { [entity: string]: string } = { quot: '"', amp: '&', lt: '<', '#13': '\r', '#10': '\n' };

interface OpenTag {
	kind: 'open';
	start: number;
	end: number;
	name: string;
	attributes: { [name: string]: string };
	selfClosing: boolean;
}

interface CloseTag {
	kind: 'close';
	start: number;
	end: number;
	name: string;
}

type TagEvent = OpenTag | CloseTag;

const isLetter = (c: string) => (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');
const isNameChar = (c: string) => isLetter(c) || (c >= '0' && c <= '9') || c === '_' || c === '-';
const isWhitespace = (c: string) => c === ' ' || c === '\t' || c === '\n' || c === '\r';

/** Reads a tag or attribute name ([A-Za-z_]? first char per caller, then [\w-]*) starting at pos; returns the end index */
const readName = (text: string, pos: number, allowUnderscoreFirst: boolean): number => {
	const first = text.charAt(pos);
	if (!(isLetter(first) || (allowUnderscoreFirst && first === '_'))) return pos;
	let i = pos + 1;
	while (i < text.length && isNameChar(text.charAt(i))) i++;
	return i;
};

const skipWhitespace = (text: string, pos: number): number => {
	while (pos < text.length && isWhitespace(text.charAt(pos))) pos++;
	return pos;
};

/**
 * Parses `<yeastInline:Name attr="value" ...>` or `.../>` starting at `start` (which points at `<`).
 * Every step moves forward; attribute values end at the next `"`, so the work is linear in the tag length.
 * Returns undefined for anything malformed.
 */
const parseOpenTag = (text: string, start: number): OpenTag | undefined => {
	const nameStart = start + OPEN_MARKER.length;
	const nameEnd = readName(text, nameStart, false);
	if (nameEnd === nameStart) return;
	const name = text.substring(nameStart, nameEnd);
	// No prototype, so names such as constructor or toString are plain keys
	const attributes: { [name: string]: string } = Object.create(null);

	let pos = nameEnd;
	while (pos < text.length) {
		const afterWhitespace = skipWhitespace(text, pos);
		const c = text.charAt(afterWhitespace);
		if (c === '>') return { kind: 'open', start, end: afterWhitespace + 1, name, attributes, selfClosing: false };
		if (c === '/') {
			if (text.charAt(afterWhitespace + 1) !== '>') return;
			return { kind: 'open', start, end: afterWhitespace + 2, name, attributes, selfClosing: true };
		}
		// Anything else must be an attribute, separated from what precedes it by whitespace
		if (afterWhitespace === pos) return;
		const attrEnd = readName(text, afterWhitespace, true);
		if (attrEnd === afterWhitespace) return;
		const attrName = text.substring(afterWhitespace, attrEnd);
		if (RESERVED_ATTRIBUTES.includes(attrName) || attrName in attributes) return;

		// ="value" (whitespace around = allowed; bare attributes are malformed)
		let p = skipWhitespace(text, attrEnd);
		if (text.charAt(p) !== '=') return;
		p = skipWhitespace(text, p + 1);
		if (text.charAt(p) !== '"') return;
		const valueEnd = text.indexOf('"', p + 1);
		if (valueEnd < 0) return;
		attributes[attrName] = text.substring(p + 1, valueEnd).replace(ATTRIBUTE_ENTITY_REGEX, (_m, entity) => ATTRIBUTE_ENTITIES[entity]);
		pos = valueEnd + 1;
	}
	return;
};

/** Parses `</yeastInline:Name>` (optional whitespace before `>`) starting at `start` */
const parseCloseTag = (text: string, start: number): CloseTag | undefined => {
	const nameStart = start + CLOSE_MARKER.length;
	const nameEnd = readName(text, nameStart, false);
	if (nameEnd === nameStart) return;
	const end = skipWhitespace(text, nameEnd);
	if (text.charAt(end) !== '>') return;
	return { kind: 'close', start, end: end + 1, name: text.substring(nameStart, nameEnd) };
};

/**
 * Finds all well-formed open and close tags, left to right, without overlap:
 * after a tag parses, scanning resumes at its end (so tag-like text inside an attribute value is not a tag).
 */
const scanTags = (text: string): TagEvent[] => {
	const events: TagEvent[] = [];
	let pos = text.indexOf('<');
	while (pos >= 0) {
		let event: TagEvent | undefined;
		if (text.startsWith(OPEN_MARKER, pos)) event = parseOpenTag(text, pos);
		else if (text.startsWith(CLOSE_MARKER, pos)) event = parseCloseTag(text, pos);

		if (event) {
			events.push(event);
			pos = text.indexOf('<', event.end);
		} else {
			pos = text.indexOf('<', pos + 1);
		}
	}
	return events;
};

const createNode = (tag: OpenTag): InlineCustomComponentNode =>
	({ type: tag.name, inline: true, ...tag.attributes } as InlineCustomComponentNode);

/**
 * How deep components may nest inside each other's children. Deeper tags stay text inside the deepest component's children.
 * This bounds the work on pathological input (each level re-parses its children); real content nests one or two levels.
 */
export const MAX_INLINE_CUSTOM_COMPONENT_DEPTH = 32;

interface PendingComponent {
	token: Token;
	node: InlineCustomComponentNode;
	childrenStart?: number;
	childrenEnd?: number;
}

/**
 * InlineCustomComponentPlugin tokenizes inline custom components:
 * - `<yeastInline:Name attr="value" />` (self-closing; the node has no children property, like an image)
 * - `<yeastInline:Name attr="value">children</yeastInline:Name>` (children parsed with parser.parseInline)
 *
 * Open and close tags are paired with a stack per tag name, so the same tag nests correctly.
 * Unclosed open tags, stray close tags and malformed tags stay text.
 * Only the outermost components of this text become tokens; nested ones are found when the children are parsed.
 */
export class InlineCustomComponentPlugin implements InlineTokenizerPlugin {
	private depth = 0;

	tokenize(text: string, parser: YeastParser): void | Token[] {
		if (this.depth >= MAX_INLINE_CUSTOM_COMPONENT_DEPTH || !text.includes(OPEN_MARKER)) return [];

		const pending = findOutermostComponents(text);

		// Parse children after the scan, so the scan's data is not held while recursing
		for (const component of pending) {
			if (component.childrenStart === undefined) continue;
			this.depth++;
			try {
				component.node.children = parser.parseInline(text.substring(component.childrenStart, component.childrenEnd));
			} finally {
				this.depth--;
			}
		}
		return pending.map((component) => component.token);
	}
}

const findOutermostComponents = (text: string): PendingComponent[] => {
	const events = scanTags(text);

	// Pair each close tag with the innermost unclosed open tag of the same name
	const closeFor = new Map<OpenTag, CloseTag>();
	const openStacks = new Map<string, OpenTag[]>();
	for (const event of events) {
		if (event.kind === 'open') {
			if (event.selfClosing) continue;
			if (!openStacks.has(event.name)) openStacks.set(event.name, []);
			openStacks.get(event.name).push(event);
		} else {
			const open = openStacks.get(event.name)?.pop();
			if (open) closeFor.set(open, event);
		}
	}

	// Keep the outermost components only
	const pending: PendingComponent[] = [];
	let lastEnd = 0;
	for (const event of events) {
		if (event.kind !== 'open' || event.start < lastEnd) continue;
		const node = createNode(event);
		const component: PendingComponent = {
			node,
			token: { start: event.start, end: event.end, from: 'InlineCustomComponentPlugin', nodes: [node] },
		};
		if (!event.selfClosing) {
			const close = closeFor.get(event);
			if (!close) continue;
			component.childrenStart = event.end;
			component.childrenEnd = close.start;
			component.token.end = close.end;
		}
		pending.push(component);
		lastEnd = component.token.end;
	}
	return pending;
};

let lastSpanText: string | undefined;
let lastSpans: { start: number; end: number }[] = [];

/** Start and end of each outermost complete component in the text. The last result is cached, because every wrapped plugin asks for the same text. */
const findComponentSpans = (text: string): { start: number; end: number }[] => {
	if (text !== lastSpanText) {
		lastSpans = text.includes(OPEN_MARKER)
			? findOutermostComponents(text).map(({ token }) => ({ start: token.start, end: token.end }))
			: [];
		lastSpanText = text;
	}
	return lastSpans;
};

/**
 * Wraps another inline plugin so that a complete inline component tag beats its tokens.
 * Core keeps the token that starts first, so `snake_case <yeastInline:Icon name="arrow_right" />` would otherwise become an
 * italic span that ends inside the attribute value, and the tag would be lost. A token that starts before a tag and ends
 * inside it is dropped. A token that contains the whole tag is kept (its children are parsed again, and find the tag).
 */
export class TagPrecedencePlugin implements InlineTokenizerPlugin {
	constructor(private readonly inner: InlineTokenizerPlugin) {}

	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens = this.inner.tokenize(text, parser);
		if (!tokens || tokens.length === 0 || !text.includes(OPEN_MARKER)) return tokens;
		const spans = findComponentSpans(text);
		if (spans.length === 0) return tokens;
		return tokens.filter((token) => !spans.some((span) => token.start < span.start && token.end > span.start && token.end < span.end));
	}
}
