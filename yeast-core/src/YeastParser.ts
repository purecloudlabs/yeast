import {
	BlockParserPlugin,
	DocumentNode,
	InlineTokenizerPlugin,
	PostProcessorPlugin,
	RootNodeParserPlugin,
	RootNodeParserPluginResult,
	Token,
	YeastInlineChild,
	YeastNode,
	YeastText,
} from '.';

export class YeastParser {
	rootPlugin?: RootNodeParserPlugin;
	blockPlugins: BlockParserPlugin[] = [];
	inlinePlugins: InlineTokenizerPlugin[] = [];
	postprocessors: PostProcessorPlugin[] = [];

	registerRootPlugin(plugin: RootNodeParserPlugin) {
		this.rootPlugin = plugin;
	}

	registerBlockPlugin(plugin: BlockParserPlugin) {
		this.blockPlugins.push(plugin);
	}

	clearBlockPlugins() {
		this.blockPlugins = [];
	}

	registerInlinePlugin(plugin: InlineTokenizerPlugin) {
		this.inlinePlugins.push(plugin);
	}

	clearInlinePlugins() {
		this.inlinePlugins = [];
	}

	registerPostProcessorPlugin(plugin: PostProcessorPlugin) {
		this.postprocessors.push(plugin);
	}

	clearPostProcessorPlugins() {
		this.postprocessors = [];
	}

	/**
	 * Parses the given text into a yeAST document
	 * @param text The text to parse
	 */
	parse(text: string): DocumentNode {
		if (!this.rootPlugin) throw Error('Parse failure: Root plugin not set');

		// console.log(`Parsing using ${this.blockPlugins.length} block plugins and ${this.inlinePlugins.length} inline plugins`);

		// Create root AST document
		const result: RootNodeParserPluginResult = this.rootPlugin.parse(text);
		let rootAst = result.document;
		rootAst.children = this.parseBlock(result.remainingText);
		rootAst = this.postProcess(rootAst);
		return rootAst;
	}

	/**
	 * Parses the text using block plugins.
	 *
	 * This function will parse the entire length of the text and return a collection of nodes representing the entire text. Any text that is unhandled
	 * by block plugins is discarded. Block plugins are processed sequentially in the order in which they were registered. Each is offered the remaining
	 * text for consideration. If a plugin returns nothing, the same offer will be made to the next plugin in the list. If the plugin returns something,
	 * the returned children are added to the collection and block plugins are reprocessed from the beginning of the list using the remaining text. This
	 * process repeats until no plugins produce a response or no text remains.
	 *
	 * @param text The text to parse
	 */
	parseBlock(text: string): YeastNode[] {
		let children: YeastNode[] = [];
		let remainingText = text;

		let pluginNumber = 0;
		while (true) {
			// Abort if no more text
			if (!remainingText || remainingText.trim() === '') break;
			// Abort if we reach the end
			if (pluginNumber >= this.blockPlugins.length) break;

			const result = this.blockPlugins[pluginNumber].parse(remainingText, this);
			if (result && result.nodes && result.nodes.length > 0) {
				// Append node and restart
				remainingText = result.remainingText;
				children = children.concat(result.nodes);
				pluginNumber = 0;
			} else {
				// Run next plugin
				pluginNumber++;
			}
		}

		return children;
	}

	/**
	 * Parses the text using inline plugins.
	 *
	 * This function will parse the entire text and return a collection of nodes representing the entire text. Inline parsers provide tokens
	 * identifying the start and end positions of the string for which it is providing nodes. In the case of overlapping tokens, priority is
	 * given to the earliest position and any overlapped tokens are ignored. All text not handled by any plugin is added to the children in
	 * plain text nodes.
	 *
	 * @param text The text to parse
	 */
	parseInline(text: string): YeastInlineChild[] {
		let children: YeastInlineChild[] = [];

		let tokens: Token[] = [];
		// Collect tokens from inline plugins and sort ascending by start position
		tokens = this.inlinePlugins.map((plugin) => plugin.tokenize(text, this) || []).flat(1);
		tokens = tokens.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));

		// Process tokens
		let lastEnd = 0;
		tokens.forEach((token) => {
			// Ignore overlapping tokens
			if (token.start < lastEnd) {
				// console.log(`Ignoring overlapping token from ${token.from || 'unidentified plugin'}: ${token.start}/${token.end}`);
				return;
			}

			// Add any plain text preceeding token
			const plainText = text.substring(lastEnd, token.start);
			if (plainText) {
				children.push({
					text: plainText,
				} as YeastText);
			}

			// Add nodes
			children = children.concat(token.nodes);

			// Update marker for what's been handled
			lastEnd = token.end;
		});

		// Add remaining text after last token
		const plainText = text.substring(lastEnd, text.length);
		if (plainText) {
			children.push({ text: plainText } as YeastText);
		}

		return children;
	}

	postProcess(document: DocumentNode) {
		this.postprocessors.forEach((postProcessorPlugin) => {
			document = postProcessorPlugin.parse(document, this);
		});

		return document;
	}
}
