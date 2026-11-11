# Custom Components

In yeast documents, custom components provide a standard syntax to allow extension of the yeast toolkit beyond the built-in node types.

## In Yeast Documents

A custom component node:

- has the component's name as its `type` (for example `Icon` for `<yeast:Icon />`), in the case it was written
- may have children
- has any arbitrary properties on the node used by the component's renderer and parser implementations

### Inline custom components

A custom component is a block element by default. Set the property `inline: true` (the boolean, not the string `"true"`) on the node to mark it as an inline element that sits inside a line of text, such as an icon in a sentence:

```json
{ "type": "Icon", "inline": true, "name": "chevron-down" }
```

`isYeastInlineNode` returns `true` for such a node, and `isInlineCustomComponentNode` checks for the marker alone. Built-in types ignore the marker. A node without the marker behaves exactly as before.

This marker lives on the node, not in markdown. In markdown, an inline custom component is written with its own prefix, `<yeastInline:ComponentName ... />`, which the markdown parser turns into a node with `inline: true`. Writing `<yeast:ComponentName inline="true" />` does **not** make a component inline: that tag is still read by the block rule, which stores attribute values as strings, so `inline` becomes `"true"` and the marker does not apply.

## In Markdown

When a custom component is represented in markdown, it is expected to follow the format of a namespaced XML tag:

```xml
<yeast:ComponentName myString="a string value" myNumber="5" myObject="{\"myVarName\":\"A value\",\"intVar\":5,\"myArr\":[\"a value\"]}" />
```

### Parsing

The custom component parses the component's name from the tag name that is namespaced with `yeast:`. Write the prefix in lowercase; the name keeps the case it was written in (`<yeast:Icon />` gives `Icon`). All arbitrary properties are parsed from the XML tag and stored on the AST node as strings: `myNumber="5"` gives the string `"5"`, and `myObject` gives the JSON text, not an object. A component that needs a number, a boolean or an object converts the string itself (for example with `JSON.parse`).

### Rendering

The custom component node is rendered as a namespaced XML tag using the component's name as the tag name. Properties that are objects or arrays are rendered as serialized JSON objects. All other property types are rendered as strings.

### Inline custom components in markdown

An inline custom component is written with the `yeastInline:` prefix, on its own or with children:

```markdown
Tap <yeastInline:Icon name="gear" /> to open settings.

<yeastInline:Badge color="blue">New **feature**</yeastInline:Badge>
```

- The tag can sit anywhere inline content can: a sentence, a heading, a list item, a table cell, bold text or link text.
- The parser gives the node the tag name as its `type` and `inline: true`. Children are parsed as inline content. A self-closing tag has no `children` property.
- Attribute values are always strings.
- The prefix `yeastInline:` is case-sensitive. The name keeps the case it was written in.
- A component cannot have an attribute named `text`, `type`, `inline`, `children` or `__proto__`; a tag that uses one stays plain text.
- Only backticks protect a tag: inline code and fenced code blocks keep it as literal text. A backslash does not escape it, and an indented paragraph is not code.
- The markdown renderer writes the node back as the same tag, in place, with no added line breaks.

The full rules (entities in attribute values, nesting, malformed tags, known limits with `*`, `_` and `](` inside formatting) are in the [yeast-markdown-parser README](../yeast-markdown-parser/README.md#inline-custom-components) and the [yeast-markdown-renderer README](../yeast-markdown-renderer/README.md#inline-custom-components).

### As an Override for Built-in Types

The built-in yeast node types support shorthand markdown syntax (e.g. `### Heading` for a level 3 heading). However, the yeast toolkit has extended the typical configuration for some types. In some cases, that extended data does not fit into the existing markdown format without interfering with the de-facto standard format. In these cases, the node can be represented using the custom component notation.

An example of this is a `link` node. This type supports a `forceNewTab` option. When this property has a non-default value in the AST node, it will be rendered as a custom component instead of in markdown. The following examples are exactly equivalent (because `false` is the default value for `forceNewTab`):

```markdown
[display text](/path/to/page 'Opens the Display Text page')
```

```xml
<yeast:link href="/path/to/page" title="Opens the Display Text page" forceNewTab="false">display text</yeast:link>
```

## Rendering a Custom Component

Each renderer takes a map of custom renderers in its constructor, keyed by component name. A renderer is a function `(node, renderer) => output`; return `undefined` to leave the node to the next renderer. Custom renderers are tried before the built-in ones, then the optional `unhandledNodeRenderer`, then the fallback below.

```ts
const htmlRenderer = new HTMLRenderer({
	Icon: (node, renderer) => {
		const span = renderer.document.createElement('span');
		span.setAttribute('data-icon', (node as any).name);
		return span;
	},
});
```

### Matching the component name

The key is matched against the node's `type`, which is the name as written in the markdown. The renderers do not match it the same way:

| Renderer                  | Key match                                       |
| ------------------------- | ----------------------------------------------- |
| `yeast-markdown-renderer` | Exact: `Icon` matches only `Icon`               |
| `yeast-html-renderer`     | Exact: `Icon` matches only `Icon`               |
| `yeast-react-renderer`    | Any case: `Icon` also matches `icon` and `ICON` |

So a tag written `<yeastInline:icon />` and a renderer registered as `Icon` works in React but falls back in HTML. Pick one spelling for each component and use it in both the markdown and the renderer keys. If content may use more than one spelling, use `unhandledNodeRenderer` to catch the others.

### When no renderer is registered

| Renderer                  | Inline component (`inline: true`)                      | Block component                          |
| ------------------------- | ------------------------------------------------------ | ---------------------------------------- |
| `yeast-markdown-renderer` | The tag, written in place                              | The XML tag on its own lines             |
| `yeast-html-renderer`     | Inline `<code>` showing the tag                        | The XML in a `<pre><code>` block         |
| `yeast-react-renderer`    | Inline `<code>` showing the tag, and a console warning | Nothing (dropped), and a console warning |

Writing the tag back is the expected behaviour in markdown, so an inline component needs no markdown renderer to round trip. In HTML and React, inline code means the component has no renderer registered.

### Package versions

Inline custom components need `yeast-core` 1.4.0, `yeast-markdown-parser` 1.6.0, `yeast-markdown-renderer` 1.3.0, `yeast-html-renderer` 1.1.0 and `yeast-react-renderer` 1.2.0, or later.
