# YEAST

Yuri's Empathetic Arbitrary Syntax Tree (yeast) is a common structure for describing content documents. This project contains TypeScript packages for parsing to and rendering from yeast document definitions. The primary pipeline is from Markdown to React, but the packages are modular support future expansion and additional use cases.

## Packages

### `yeast-core`

[![yeast-core](https://badge.fury.io/js/yeast-core.svg)](https://badge.fury.io/js/yeast-core)

core components and common types for working with yeast documents

### `yeast-markdown-parser`

[![yeast-markdown-parser](https://badge.fury.io/js/yeast-markdown-parser.svg)](https://badge.fury.io/js/yeast-markdown-parser)

parses markdown to a yeast document

### `yeast-markdown-renderer`

[![yeast-markdown-renderer](https://badge.fury.io/js/yeast-markdown-renderer.svg)](https://badge.fury.io/js/yeast-markdown-renderer)

renders a yesat document to markdown

### `yeast-react-renderer`

[![yeast-react-renderer](https://badge.fury.io/js/yeast-react-renderer.svg)](https://badge.fury.io/js/yeast-react-renderer)

renders a yeast document to react

## Documentation

See the README in each package's folder for package-specific instructions.

_Coming Soon™_

## Contributing

Public contributions are welcome! Breaking changes should be discussed first.

- Only make updates to one package per branch/PR
- Update tests whenever you make changes
- Bump package versions per semantic versionning rules
  - major - not backwards compatible/breaking change
  - minor - new features, backwards compatible/non-breaking
  - point - bugfixes, backwards compatible/non-breaking
- Publish a pre-release version before creating a PR (Genesys only)
- Update documentation to reflect changes

## Publishing

New versions are published to NPM by the Genesys Developer Engagement team.

## Support

No formal support is offered for this project. If you encounter problems with any of the packages, please create issues in this repo.
