# Custom Components

In yeast documents, custom components provide a standard syntax to allow extension of the yeast toolkit beyond the built-in node types.

## In Yeast Documents

A custom component node:

- is of type `customcomponent`
- may have children
- has any arbitrary properties on the node used by the component's renderer and parser implementations

## In Markdown

When a custom component is represented in markdown, it is expected to follow the format of a namespaced XML tag:

```xml
<yeast:ComponentName myString="a string value" myNumber="5" myObject="{\"myVarName\":\"A value\",\"intVar\":5,\"myArr\":[\"a value\"]}" />
```

### Parsing

The custom component parses the component's name (case insensitive) from the tag name that is namespaced with `yeast:`. All arbitrary properties are parsed from the XML tag and stored on the AST node. The property types are inferred using JSON deserialization. Any values that fail JSON deserialization are be stored as a string.

### Rendering

The custom component node is rendered as a namespaced XML tag using the component's name as the tag name. Properties that are objects or arrays are rendered as serialized JSON objects. All other property types are rendered as strings.

### As an Override for Built-in Types

The built-in yeast node types support shorthand markdown syntax (e.g. `### Heading` for a level 3 heading). However, the yeast toolkit has extended the typical configuration for some types. In some cases, that extended data does not fit into the existing markdown format without interfering with the de-facto standard format. In these cases, the node can be represented using the custom component notation.

An example of this is a `link` node. This type supports a `forceNewTab` option. When this property has a non-default value in the AST node, it will be rendered as a custom component instead of in markdown. The following examples are exactly equivalent (because `false` is the default value for `forceNewTab`):

```markdown
[display text](/path/to/page "Opens the Display Text page")
```

```xml
<yeast:link href="/path/to/page" title="Opens the Display Text page" forceNewTab="false">display text</yeast:link>
```
