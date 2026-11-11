/**
 * Matches the markup of an inline custom component tag: `<yeastInline:Name a="v" />`, `<yeastInline:Name a="v">` or
 * `</yeastInline:Name>`. Attribute values never hold a raw `"`, because the renderer writes it as `&quot;`.
 */
const INLINE_TAG_MARKUP = /<\/?yeastInline:[A-Za-z][\w-]*(?:\s+[A-Za-z_][\w-]*\s*=\s*"[^"]*")*\s*\/?>/g;

/**
 * Applies a text escape (such as `#` for headings) to everything except inline tag markup, so attribute values are
 * not changed (and do not gain another backslash on every save). Text between an open and a close tag is escaped.
 */
export default function escapeOutsideInlineTags(content: string, escape: (text: string) => string): string {
	let result = '';
	let last = 0;
	for (const match of content.matchAll(INLINE_TAG_MARKUP)) {
		result += escape(content.substring(last, match.index)) + match[0];
		last = match.index + match[0].length;
	}
	return result + escape(content.substring(last));
}
