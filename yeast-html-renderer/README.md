# yeast-html-renderer

The `yeast-html-renderer` project renders a yeast document into HTML.

## Usage Considerations

### Node.js

This project is expected to be used in a node.js environment and uses [jsdom](https://github.com/jsdom/jsdom) to safely build HTML elements.

### Styling the Output

This package does not provide any mechanism for styling. The expectation is that any consumer of this output will use HTML tag CSS selectors to apply the desired appearance to the elements.

### Lossy Output

At the time of creation, this is a naieve implementation and not all known node properties are utilized or reflected in the rendered output. Were an HTML to AST parser to parse the HTML output of this package, it may result in a different AST than was used to generate the output.

Unused properties can be supported in the rendered output in the future, though that is not planned.

## Getting Started

1. Install the package:

```sh
npm i yeast-html-renderer
```

2. Use it to render an AST document to HTML:

```typescript
import { MarkdownParser } from 'yeast-markdown-parser';
import { HTMLRenderer } from 'yeast-html-renderer';
import fs from 'fs';

// Get an AST. In this example, by parsing markdown
const parser = new MarkdownParser();
const ast = parser.parse('# Hello World\n\nNow **this** is _hypertext_ using a `markup` ~language~!');

// Render the AST to HTML (as a string)
const renderer = new HTMLRenderer();
const html = renderer.renderHTMLString(ast);

// Write the AST to a file
fs.writeFileSync('rendered.html', html);
```

## Local Development

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
