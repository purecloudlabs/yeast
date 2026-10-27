---
name: yeast-custom-components
description: >-
  Implements and debugs YEAST custom components: namespaced markdown tags such as
  <yeast:Name /> that parse into AST nodes and render as React
  components through yeast-markdown-parser and yeast-react-renderer. Use when
  adding, registering, or debugging a custom component, when a component renders
  nothing or silently resets, when working with CustomComponentParserPlugin,
  ReactRenderer, NodeRendererPlugin, or a custom renderer map, or when deciding
  whether a shared YEAST package release is required.
---

# YEAST custom components

YEAST parses markdown into an AST (`yeast-markdown-parser`) and renders that AST to React
(`yeast-react-renderer`), with shared contracts in `yeast-core`. A **custom component** is a
namespaced tag an author writes in markdown that a consuming application renders as its own
React component.

## Governing rule

**Adding a custom component is application-only work.** The parser already turns any namespaced
tag into a typed AST node with arbitrary attributes. You add one renderer-map key and one switch
case in your own repo.

Change and publish a shared YEAST package **only** when:

- the namespaced-tag form genuinely cannot express the syntax you need, or
- `yeast-core` node contracts or helpers must change, or
- generic renderer behavior (not one component) must change.

Decision test: *could another application parse this tag correctly today, even if it cannot render
it?* If yes, stay in the application.

## Pipeline

```
markdown tag  ->  CustomComponentParserPlugin  ->  AST node (type = component name)
              ->  ReactRenderer key lookup (case-insensitive)
              ->  your NodeRendererPlugin switch  ->  your React component
```

If no renderer claims the node, `ReactRenderer` logs `Unhandled node` and renders **nothing**. The
surrounding page still renders successfully, so the failure is silent.

## Tag syntax and AST contract

Always use the `yeast:` namespace.

```xml
<yeast:OpenAPIExplorer verb="get" path="/api/v2/users/me" />
```

parses to:

```json
{ "type": "OpenAPIExplorer", "verb": "get", "path": "/api/v2/users/me" }
```

Four rules that are easy to get wrong:

1. **The root tag must be namespaced `yeast:`.** An un-namespaced tag is not recognized and falls
   through to the paragraph parser as literal text.
2. **`type` is the component name exactly as written in the tag** — `"OpenAPIExplorer"`, not
   `"customcomponent"`. The namespace prefix is stripped; casing is preserved.
3. **Every attribute value arrives as a string.** `showExpanded="false"` becomes the string
   `"false"`, which is truthy in JavaScript. Coerce deliberately.
4. **Children are optional and may be absent entirely.** The parser only creates `children` when
   the tag has content, so `node.children` can be `undefined`. Guard before mapping.

`MarkdownParser` registers `CustomComponentParserPlugin` by default (just before the paragraph
fallback), so no parser setup is needed to author tags.

### Legacy `dxui:` namespace (deprecated)

<details>
<summary>Existing content may use <code>dxui:</code> — never write new tags with it</summary>

The parser still matches a legacy `dxui:` root namespace alongside `yeast:`
(`/^\s*(<(?:yeast|dxui):.*)([\s\S]*)$/i`), and a large amount of existing Yeti UI content uses it.
Both produce an identical AST node, so the rest of this skill applies unchanged.

Rules:

- **Write `yeast:` in all new tags, examples, docs, and tests.**
- Do not introduce `dxui:` anywhere, including when copying an existing page as a starting point.
- When editing a page that already uses `dxui:`, converting those tags to `yeast:` is safe and
  preferred. Do not treat it as a required prerequisite for unrelated work.

</details>

## Add a component

**1. Pick a name.** Unique, and used consistently across tag, enum, map key, and switch case.

**2. Declare the expected node shape.** Model every attribute as `string`, because that is what the
parser produces:

```ts
interface StatusBadgeNode {
  type: 'statusbadge';
  label?: string;
  tone?: string; // "critical" | "warning" | "success" arrives as a raw string
}
```

**3. Write the React component** with bounded, accessible states: loading, error, empty, and
unknown-attribute fallback.

**4. Write or extend the renderer plugin.** The contract is
`(node: YeastChild, renderer: ReactRenderer) => ReactNode | undefined`:

```tsx
import { YeastChild, YeastNode } from 'yeast-core';
import { NodeRendererPlugin, ReactRenderer, useKey } from 'yeast-react-renderer';

const CustomComponentRendererPlugin: NodeRendererPlugin = (node: YeastChild, renderer: ReactRenderer) => {
  const key = useKey();
  const typedNode = node as YeastNode;
  if (!typedNode.type) return;

  switch (typedNode.type.toLowerCase()) {
    case 'statusbadge': {
      const badge = node as unknown as StatusBadgeNode;
      return <StatusBadge key={key.current} label={badge.label} tone={normalizeTone(badge.tone)} />;
    }
  }
};
```

Returning `undefined` is meaningful: the renderer keeps looking, falling through to built-in
defaults and then the unhandled path. Never return `null` to mean "not mine".

**5. Register the key** in the map passed to `ReactRenderer`:

```tsx
const customRenderers = {
  [YeastBlockNodeTypes.Heading]: HeadingRendererPlugin, // overriding a built-in type is allowed
  statusbadge: CustomComponentRendererPlugin,
};

const renderer = new ReactRenderer(customRenderers);
const parser = new MarkdownParser();

const document = parser.parse(markdown) as DocumentNode;
const output = renderer.renderComponents(document.children);
```

Registration is **two layers**. The map gets the node into your plugin; the switch gets it into your
component. Missing either renders nothing.

**6. Render children** by delegating back to the renderer:

```tsx
{node.children ? renderer.renderComponents(node.children) : null}
```

**7. Test** valid input, missing attributes, malformed attributes, mixed-case tag names, and a tag
with no children.

## Debugging

| Symptom | Cause |
|---|---|
| Nothing renders, console shows `Unhandled node` | Type not in the renderer map, or no matching switch case |
| Nothing renders, no warning | Your plugin returned `undefined`, so lookup fell through to defaults |
| Boolean prop always behaves as true | Attribute is the string `"false"`, which is truthy |
| Numeric prop misbehaves | Attribute is a string; parse it explicitly |
| Component resets or refetches in a loop | Rendered output is not memoized — see below |
| Tag renders as a paragraph of literal text | Missing the `yeast:` namespace, or the XML is malformed (often an unclosed tag) |
| Nested custom tag ignored | Nested-child detection is not symmetric with root detection; verify with a focused parser test rather than assuming |

Key lookup is **case-insensitive** on both sides, so `statusbadge` matches `StatusBadge`. Casing
mismatches are safe; a misspelled name is not.

## The re-render trap

`ReactRenderer.renderComponents` returns fresh React elements on every call. Components that
lazy-load data will reset and reinitialize repeatedly if you call it during every render — this
affects the out-of-the-box `YeastNodeRenderer` component too.

Store the rendered output instead of recomputing it:

```tsx
const renderedNodes = useRef<ReactNode>();
const [renderTrigger, setRenderTrigger] = useState(0);

useEffect(() => {
  const document = parser.parse(markdown) as DocumentNode;
  renderedNodes.current = renderer.renderComponents(document.children);
  setRenderTrigger(Date.now());
}, [markdown]);

return <React.Fragment key={renderTrigger}>{renderedNodes.current}</React.Fragment>;
```

Note that `useKey()` from `yeast-react-renderer` is **not** a real React ref — it returns a new
`{ current: uuid }` on every call. It gives you a key, not a stable identity across renders.

## Before you write code

1. **Resolve installed versions** from the consuming app's lockfile. Do not assume the API matches
   the latest npm release or this skill.
2. **Read the installed types**, not the source repo: `node_modules/yeast-*/dist/*.d.ts`.
3. **Trace one existing custom component end to end** in the target repo before adding another. Find
   the `new ReactRenderer(...)` call — that is the registration point.
4. **Check peer dependencies.** `yeast-react-renderer` peers on `genesys-react-components`,
   `genesys-dev-icons`, `react-syntax-highlighter`, `moment`, `uuid`, and `react >= 18`.
   `yeast-markdown-parser` peers on `fast-xml-parser` and `yaml`. A new consuming app must install
   these itself.

Report back the tag syntax, AST shape, resolved package versions, and the registration file path
before implementing.

## Publishing a shared package

Only after confirming the change cannot be application-only. Per the YEAST repo's contribution
rules:

- one package per branch and PR
- bump the version per semver: major for breaking, minor for new features, patch for fixes
- update tests and package documentation
- publish a pre-release version before opening the PR

Publish job: <https://jenkins.ininica.com/view/developer-engagement/job/devengage-publish-npm-package>

## Not this

- **Full-page component lists are a different mechanism.** A host app may separately whitelist
  page-level component names (Yeti UI keeps a `PageComponentNames` array in `PageContent.tsx`).
  That is not the markdown custom-component path and registering there does nothing for a tag.
- **`yeast-markdown-renderer` is the round-trip path** (AST back to markdown), not the React display
  path. It emits unknown nodes as namespaced tags. Do not add React rendering there.

## Reference

Packages: [yeast-core](https://www.npmjs.com/package/yeast-core) ·
[yeast-markdown-parser](https://www.npmjs.com/package/yeast-markdown-parser) ·
[yeast-react-renderer](https://www.npmjs.com/package/yeast-react-renderer) ·
[yeast-markdown-renderer](https://www.npmjs.com/package/yeast-markdown-renderer)

Repository: <https://github.com/purecloudlabs/yeast>

Repo documentation and source:

- `docs/custom-components.md` — tag syntax, parsing, and AST shape
- `yeast-markdown-parser/src/plugins/block/CustomComponentParser.ts` — tag detection and node construction
- `yeast-markdown-parser/src/MarkdownParser.ts` — default plugin registration order
- `yeast-react-renderer/src/ReactRenderer.tsx` — key lookup and fallback chain
- `yeast-core/src/index.ts` — `CustomComponentNode` and node type contracts

Reference implementation in a consuming app (Yeti UI):

- [`CustomComponentRendererPlugin.tsx`](https://bitbucket.org/inindca/yeti-ui/src/main/app/src/components/markdown/display/plugins/CustomComponentRendererPlugin.tsx) — switch and prop mapping
- `app/src/components/markdown/display/MarkdownDisplay.tsx` — renderer map and the memoization pattern above
