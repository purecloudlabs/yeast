# yeast-markdown-parser

The `yeast-markdown-parser` project provides a set of yeast parsers to parse markdown content into a yeast document.

## Inline custom components

A custom component written with the `yeastInline:` prefix is parsed as an inline element, so it can sit inside a sentence, a heading, a list item, a table cell, bold text or link text:

```markdown
Tap <yeastInline:Icon name="gear" /> to open settings.

<yeastInline:Badge color="blue">New **feature**</yeastInline:Badge>
```

Each tag becomes a node with the tag name as its `type` and `inline: true`. Attributes become string properties, and a tag with children gets a `children` array parsed as inline content (nested tags work, up to 32 levels). A self-closing tag has no `children` property.

```json
{ "type": "Icon", "inline": true, "name": "gear" }
```

Rules to know:

- The prefix is case-sensitive: `<yeastinline:Icon />` stays text. Tag names start with a letter and may contain letters, digits, `_` and `-`.
- Attribute values are double-quoted. The five XML entities (`&quot;`, `&amp;`, `&lt;`, `&gt;`, `&apos;`) and numeric references (`&#10;`, `&#x3E;`) are decoded. Any other `&` sequence (for example `&copy;`) is kept as written.
- `type`, `inline`, `children`, `text` and `__proto__` are reserved. A tag that uses one of them as an attribute name, or repeats an attribute, stays text. In particular, a component cannot carry an attribute named `text`.
- Unclosed open tags, stray or mismatched close tags and malformed tags stay text.
- Only backticks protect a tag. Inline code and fenced code blocks keep it as literal text. An indented paragraph is not code, and a backslash does not escape a tag.
- A complete tag wins over bold, italic, code and link syntax that would end inside it, so `snake_case <yeastInline:Icon name="arrow_right" />` keeps the tag. Formatting that wraps the whole tag still works.
- Known limit: a `*` in an attribute value inside `**bold**`, a `_` inside `_italic_`, or `](` inside link text can end that formatting early, the same way those characters do in plain text. The tag itself survives, but the surrounding formatting may not round trip. Avoid those characters in attribute values that sit inside such formatting.
- The block syntax `<yeast:Name ... />` is unchanged.

This package needs `yeast-core` 1.4.0 or later, which defines the `inline` marker. `yeast-markdown-renderer` writes these nodes back as the same tag.

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
