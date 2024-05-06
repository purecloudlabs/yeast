import { YeastParser } from '../../YeastParser';

import * as fs from 'fs';
import * as path from 'path';
import { LineParserPlugin } from '../resources/plugins/LineParserPlugin';
import { DocumentParserPlugin } from '../resources/plugins/DocumentParserPlugin';
import { BoldInlinePlugin } from '../resources/plugins/BoldInlinePlugin';
import { ItalicsInlinePlugin } from '../resources/plugins/ItalicsInlinePlugin';
import { PostProcessor } from '../resources/plugins/PostProcessor';

const BLOCK_TEXT = fs.readFileSync(path.join(__dirname, '../resources/content/block.md'), 'utf8');
const INLINE_TEXT = fs.readFileSync(path.join(__dirname, '../resources/content/inline.md'), 'utf8');

test('YeastParser with no configuration should fail', () => {
	// Create and run parser with no config
	const parser = new YeastParser();

	// Check no plugins loaded
	expect((parser as any).rootPlugin).toBeUndefined();
	expect((parser as any).blockPlugins).toBeInstanceOf(Array);
	expect((parser as any).blockPlugins.length).toBe(0);
	expect((parser as any).inlinePlugins).toBeInstanceOf(Array);
	expect((parser as any).inlinePlugins.length).toBe(0);

	// Expect a configuration error when parsing
	expect(() => parser.parse(BLOCK_TEXT)).toThrowError('Parse failure: Root plugin not set');
});

test('YeastParser with no block plugins yields no children', () => {
	// Create and run parser with no config
	const parser = new YeastParser();
	parser.registerRootPlugin(new DocumentParserPlugin());
	parser.registerPostProcessorPlugin(new PostProcessor());

	// Check root plugin is loaded
	expect((parser as any).rootPlugin).not.toBeUndefined();

	// Check no plugins loaded
	expect((parser as any).blockPlugins).toBeInstanceOf(Array);
	expect((parser as any).blockPlugins.length).toBe(0);
	expect((parser as any).inlinePlugins).toBeInstanceOf(Array);
	expect((parser as any).inlinePlugins.length).toBe(0);

	// Parse
	const ast = parser.parse(BLOCK_TEXT);
	// console.log(JSON.stringify(ast, null, 2));

	// Check result
	expect(ast).not.toBeUndefined();
	expect(ast.type).toBe('document');
	expect(ast.title).toBe('DEFAULT PAGE TITLE');
	expect(ast.author).toBe('default.author');
	expect(ast.children).not.toBeUndefined();
	expect(ast.children.length).toBe(0);
});

test('YeastParser uses block parser successfully', () => {
	// Create and run parser with no config
	const parser = new YeastParser();
	parser.registerRootPlugin(new DocumentParserPlugin());
	parser.registerBlockPlugin(new LineParserPlugin());
	parser.registerPostProcessorPlugin(new PostProcessor());

	// Check plugins loaded
	expect((parser as any).rootPlugin).not.toBeUndefined();
	expect((parser as any).blockPlugins).toBeInstanceOf(Array);
	expect((parser as any).blockPlugins.length).toBe(1);
	expect((parser as any).inlinePlugins).toBeInstanceOf(Array);
	expect((parser as any).inlinePlugins.length).toBe(0);

	// Parse
	const ast = parser.parse(BLOCK_TEXT);
	// console.log(JSON.stringify(ast, null, 2));

	// Check result of parsing behavior
	expect(ast).not.toBeUndefined();
	expect(ast.type).toBe('document');
	expect(ast.title).toBe('DEFAULT PAGE TITLE');
	expect(ast.author).toBe('default.author');
	expect(ast.children).not.toBeUndefined();
	expect(ast.children.length).toBe(8);
});

test('YeastParser uses simple inline parser successfully', () => {
	// Create and run parser with no config
	const parser = new YeastParser();
	parser.registerRootPlugin(new DocumentParserPlugin());
	parser.registerBlockPlugin(new LineParserPlugin());
	parser.registerInlinePlugin(new BoldInlinePlugin());
	parser.registerInlinePlugin(new ItalicsInlinePlugin());
	parser.registerPostProcessorPlugin(new PostProcessor());

	// Check plugins loaded
	expect((parser as any).rootPlugin).not.toBeUndefined();
	expect((parser as any).blockPlugins).toBeInstanceOf(Array);
	expect((parser as any).blockPlugins.length).toBe(1);
	expect((parser as any).inlinePlugins).toBeInstanceOf(Array);
	expect((parser as any).inlinePlugins.length).toBe(2);

	// Parse
	const ast = parser.parse(INLINE_TEXT);
	// console.log(JSON.stringify(ast, null, 2));

	// Check result of parsing behavior
	expect(ast).not.toBeUndefined();
	expect(ast.type).toBe('document');
	expect(ast.title).toBe('DEFAULT PAGE TITLE');
	expect(ast.author).toBe('default.author');
	expect(ast.children).not.toBeUndefined();
	expect(ast.children.length).toBe(1);
});

test('YeastParser uses complex inline parser successfully', () => {
	// Create and run parser with no config
	const parser = new YeastParser();
	parser.registerRootPlugin(new DocumentParserPlugin());
	parser.registerPostProcessorPlugin(new PostProcessor());
	parser.registerBlockPlugin(new LineParserPlugin());
	parser.registerInlinePlugin(new BoldInlinePlugin());
	parser.registerInlinePlugin(new ItalicsInlinePlugin());

	// Check plugins loaded
	expect((parser as any).rootPlugin).not.toBeUndefined();
	expect((parser as any).blockPlugins).toBeInstanceOf(Array);
	expect((parser as any).blockPlugins.length).toBe(1);
	expect((parser as any).inlinePlugins).toBeInstanceOf(Array);
	expect((parser as any).inlinePlugins.length).toBe(2);

	// Parse
	const ast = parser.parse(BLOCK_TEXT);
	// console.log(JSON.stringify(ast, null, 2));

	// Check result of parsing behavior
	expect(ast).not.toBeUndefined();
	expect(ast.type).toBe('document');
	expect(ast.title).toBe('DEFAULT PAGE TITLE');
	expect(ast.author).toBe('default.author');
	expect(ast.children).not.toBeUndefined();
	expect(ast.children.length).toBe(8);
});
