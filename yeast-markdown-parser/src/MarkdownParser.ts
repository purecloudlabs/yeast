import { YeastParser } from 'yeast-core';

import { FrontmatterParserPlugin } from './plugins/root/FrontmatterParserPlugin';
import { ParagraphParserPlugin } from './plugins/block/ParagraphParserPlugin';
import { InlineEmphasisPlugin } from './plugins/inline/InlineEmphasisPlugin';
import { HeadingParserPlugin } from './plugins/block/HeadingParserPlugin';
import { ListParserPlugin } from './plugins/block/ListParserPlugin';
import { InlineStrikeThroughPlugin } from './plugins/inline/InlineStrikeThroughPlugin';
import { InlineCodePlugin } from './plugins/inline/InlineCodePlugin';
import { InlineCustomComponentPlugin, TagPrecedencePlugin } from './plugins/inline/InlineCustomComponentPlugin';
import { InlineLinkPlugin } from './plugins/inline/InlineLinkPlugin';
import { CodeParserPlugin } from './plugins/block/CodeParserPlugin';
import { CalloutParserPlugin } from './plugins/block/CalloutParserPlugin';
import { BlockquoteParserPlugin } from './plugins/block/BlockquoteParserPlugin';
import { HorizontalRuleParserPlugin } from './plugins/block/HorizontalRuleParserPlugin';
import { ContentGroupParserPlugin } from './plugins/block/ContentGroupParserPlugin';
import { CustomComponentParserPlugin } from './plugins/block/CustomComponentParser';
import { TableParserPlugin } from './plugins/block/TableParser';
import { PsuedoParagraphScrubber } from './plugins/post/PsuedoParagraphScrubber';
import { ParagraphDenester } from './plugins/post/ParagraphDenester';
import { AdjacentTextCombiner } from './plugins/post/AdjacentTextCombiner';
import { UnescapeDanglingEscapes } from './plugins/post/UnescapeDanglingEscapes';
import { InlineTextLinkPlugin } from './plugins/inline/InlineTextLinkPlugin';
import { InlineImagePlugin } from './plugins/inline/InlineImagePlugin';
import { InlineImageLinkPlugin } from './plugins/inline/InlineImageLinkPlugin';

export class MarkdownParser extends YeastParser {
	constructor() {
		super();

		// Load defaults
		this.registerRootPlugin(new FrontmatterParserPlugin());
		this.registerPostProcessorPlugin(new PsuedoParagraphScrubber());
		this.registerPostProcessorPlugin(new ParagraphDenester());
		this.registerPostProcessorPlugin(new AdjacentTextCombiner());
		this.registerPostProcessorPlugin(new UnescapeDanglingEscapes());

		this.registerBlockPlugin(new HeadingParserPlugin());
		this.registerBlockPlugin(new HorizontalRuleParserPlugin());
		this.registerBlockPlugin(new CalloutParserPlugin());
		this.registerBlockPlugin(new CodeParserPlugin());
		this.registerBlockPlugin(new ContentGroupParserPlugin());
		this.registerBlockPlugin(new BlockquoteParserPlugin());
		this.registerBlockPlugin(new ListParserPlugin());
		this.registerBlockPlugin(new TableParserPlugin());
		this.registerBlockPlugin(new CustomComponentParserPlugin());
		this.registerBlockPlugin(new ParagraphParserPlugin()); // ParagraphParserPlugin must always be last

		this.registerInlinePlugin(new TagPrecedencePlugin(new InlineCodePlugin()));
		// Tokens are ordered by start position, and this order only breaks ties. No other inline token can start at `<`,
		// so this position is for readability: code first (a tag inside backticks starts later, so code wins), then tags,
		// then emphasis and links, whose text is re-parsed and so may contain tags.
		this.registerInlinePlugin(new InlineCustomComponentPlugin());
		this.registerInlinePlugin(new TagPrecedencePlugin(new InlineStrikeThroughPlugin()));
		this.registerInlinePlugin(new TagPrecedencePlugin(new InlineEmphasisPlugin()));
		this.registerInlinePlugin(new TagPrecedencePlugin(new InlineImageLinkPlugin()));
		this.registerInlinePlugin(new TagPrecedencePlugin(new InlineImagePlugin()));
		this.registerInlinePlugin(new TagPrecedencePlugin(new InlineLinkPlugin()));
		this.registerInlinePlugin(new TagPrecedencePlugin(new InlineTextLinkPlugin()));
	}
}
