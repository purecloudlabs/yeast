import { DocumentNode, PostProcessorPlugin } from '../../../';

/**
 * PostProcessor simply returns the DocumentNode it receives.
 * This plugin is for testing purposes only.
 */
export class PostProcessor implements PostProcessorPlugin {
	parse(ast: DocumentNode): DocumentNode {
		ast.title = ast.title.toUpperCase();
		return ast;
	}
}
