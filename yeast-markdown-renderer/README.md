# yeast-markdown-renderer

The `yeast-markdown-renderer` project renders a yeast document into markdown.

## Inline custom components

A custom component node with `inline: true` that has no registered renderer is written in place, on one line, as the tag `yeast-markdown-parser` reads back:

```markdown
Tap <yeastInline:Icon name="gear" /> to open settings.
```

With children, the open tag, the rendered children and the close tag are written together. A paragraph is no longer split around the node, and a table that holds an inline tag stays a markdown table (this needs `yeast-core` 1.4.0 or later). Block custom components keep their previous output, and a renderer registered for the type always wins.

Details:

- Attribute values are written as strings (objects as JSON). `&`, `"`, `<`, CR and LF are written as `&amp;`, `&quot;`, `&lt;`, `&#13;` and `&#10;`, which the parser decodes.
- These properties are never written as attributes: `type`, `children`, `inline`, `text`, `__proto__`, YEAST's diff properties, and any `undefined`, `null` or function value.
- The `#` of a heading and the `~` of strikethrough are escaped in text but not inside tag markup, so `color="#fff"` is not changed on every save.
- The node type and attribute names must follow the parser's grammar. A node that does not falls through to the XML form, which throws for names XML rejects, as it does for a block component.
- Known limit: a `*` in an attribute value inside bold, a `_` inside italic, or `](` inside link text does not round trip, because the surrounding formatting ends early when the markdown is parsed again. The tag survives.

## Getting Started

### Prerequisites

Use the designated version of node and install dependencies:

```sh
nvm use
npm i
```

### Compile

Run `npm run build` to compile the TypeScript source into a JavaScript module with TypeScript typings.

### Tests

Run `npm run test` to run the Jest unit tests.
