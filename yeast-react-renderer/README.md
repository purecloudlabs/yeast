# yeast-react-renderer

The `yeast-react-renderer` project provides a React component to render yeast documents in a React app.

## Inline custom components

A custom component node with `inline: true` that has no registered renderer is rendered as inline `<code>` showing the raw tag, for example `<yeastInline:Icon name="gear" />`, and a warning is logged, so the sentence stays intact and a missing registration is easy to spot. Before, such a node was dropped silently. Children are shown as plain text. A renderer registered for the component type, or an `unhandledNodeRenderer`, takes precedence.

The tag shown follows the same attribute rules as `yeast-markdown-renderer`: `type`, `children`, `inline`, `text`, `__proto__`, diff properties and `undefined`, `null` or function values are left out, and `&`, `"`, `<`, CR and LF are encoded. A node with a `text` property is still treated as an inline component, not as text. This needs `yeast-core` 1.4.0 or later.

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
