import { YeastParser } from 'yeast-core';

import { FrontmatterParserPlugin } from './plugins/root/FrontmatterParserPlugin';
import { ParagraphParserPlugin } from './plugins/block/ParagraphParserPlugin';
import { ItalicsInlinePlugin } from './plugins/inline/ItalicsInlinePlugin';
import { BoldInlinePlugin } from './plugins/inline/BoldInlinePlugin';
import { HeadingParserPlugin } from './plugins/block/HeadingParserPlugin';
import { ListParserPlugin } from './plugins/block/ListParserPlugin';
import { ImageParserPlugin } from './plugins/block/ImageParserPlugin';
import { InlineStrikeThroughPlugin } from './plugins/inline/InlineStrikeThroughPlugin';
import { InlineCodePlugin } from './plugins/inline/InlineCodePlugin';
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
import { InlineTextLinkPlugin } from './plugins/inline/InlineTextLinkPlugin';

export class MarkdownParser extends YeastParser {
	constructor() {
		super();

		// Load defaults
		this.registerRootPlugin(new FrontmatterParserPlugin());
		this.registerPostProcessorPlugin(new PsuedoParagraphScrubber());
		this.registerPostProcessorPlugin(new ParagraphDenester());

		this.registerBlockPlugin(new HeadingParserPlugin());
		this.registerBlockPlugin(new HorizontalRuleParserPlugin());
		this.registerBlockPlugin(new CalloutParserPlugin());
		this.registerBlockPlugin(new CodeParserPlugin());
		this.registerBlockPlugin(new ContentGroupParserPlugin());
		this.registerBlockPlugin(new BlockquoteParserPlugin());
		this.registerBlockPlugin(new ListParserPlugin());
		this.registerBlockPlugin(new TableParserPlugin());
		this.registerBlockPlugin(new ImageParserPlugin());
		this.registerBlockPlugin(new CustomComponentParserPlugin());
		this.registerBlockPlugin(new ParagraphParserPlugin()); // ParagraphParserPlugin must always be last

		this.registerInlinePlugin(new InlineCodePlugin());
		this.registerInlinePlugin(new InlineStrikeThroughPlugin());
		this.registerInlinePlugin(new ItalicsInlinePlugin());
		this.registerInlinePlugin(new BoldInlinePlugin());
		this.registerInlinePlugin(new InlineLinkPlugin());
		this.registerInlinePlugin(new InlineTextLinkPlugin());
	}
}
