import { DocumentNode } from 'yeast-core';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CmsApi from '../../helpers/types';

import YeastDocumentRenderer from '../../YeastDocumentRenderer';

// Import data resources
import { default as CodeData } from '../resources/CodeData';
import { default as MixedData } from '../resources/MixedData';
import { default as NestedData } from '../resources/NestedData';
import { default as TableData } from '../resources/TableData';
import { default as ContentGroupData } from '../resources/ContentGroup';
import { default as ParagraphData } from '../resources/ParagraphData';

test('testing paragraph node', async () => {
	const IProp = {
		ast: MixedData as DocumentNode,
		api: {} as CmsApi

	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	const paragraphNode = screen.getByText('dummy text level 2');

	expect(paragraphNode.tagName).toBe('P');
});

test('testing heading node', async () => {
	const IProp = {
		ast: MixedData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	const headingNode = screen.getAllByText(/heading/);

	expect(headingNode[0].tagName).toBe('H1');
	expect(headingNode[1].tagName).toBe('H2');
	expect(headingNode[2].tagName).toBe('H3');
	expect(headingNode[3].tagName).toBe('H4');
	expect(headingNode[4].tagName).toBe('H5');
	expect(headingNode[5].tagName).toBe('H6');
	expect(headingNode[6].tagName).toBe('SPAN');
});

test('testing list node', async () => {
	const IProp = {
		ast: MixedData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	const listNode = screen.getAllByRole('list');

	expect(listNode[0].tagName).toBe('UL');
	expect(listNode[1].tagName).toBe('OL');
});

test('testing listitem node', async () => {
	const IProp = {
		ast: MixedData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	const listItemNode = screen.getAllByRole('listitem');

	expect(listItemNode[0].tagName).toBe('LI');
	expect(listItemNode[1].tagName).toBe('LI');
});

test('testing BlockType and Inline code node', async () => {
	const IProp = {
		ast: CodeData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	const mainContainer = screen.getAllByRole('generic')[0];
	let elements: any = [];
	const getNodeNames = (node: any) => {
		let children = node.childNodes;
		if (children.length === 0) {
			return;
		}

		for (let index = 0; index < children.length; index++) {
			elements.push(children[index].nodeName);
			getNodeNames(children[index]);
		}
	};

	getNodeNames(mainContainer);
	const results = elements.filter((element) => element !== '#text');

	expect(results.filter((element) => element === 'PRE').length).toBe(2);
});

test('testing link node', async () => {
	const IProp = {
		ast: MixedData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	const codeNode = screen.getByRole('link');

	expect(codeNode.tagName).toBe('A');
});

test('testing callout node', async () => {
	const IProp = {
		ast: MixedData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	expect(screen.getByText('warning you')).toBeTruthy();
});

test('testing bold and italic node', async () => {
	const IProp = {
		ast: MixedData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	const boldNode = screen.getByText('testing bold');
	const italicNode = screen.getByText('testing italic');

	expect(boldNode.tagName).toBe('STRONG');
	expect(italicNode.tagName).toBe('EM');
});

test('testing tableCellHeader and tablecell node', async () => {
	const IProp = {
		ast: TableData as DocumentNode,
		api: {} as CmsApi
	};
	render(<YeastDocumentRenderer {...IProp} />);

	expect(screen.getByText('0000')).toBeTruthy();
	expect(screen.getByText('code')).toBeTruthy();
});

test('testing blockquote node', async () => {
	const IProp = {
		ast: MixedData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	const blockquoteNode = screen.getByText('Welcome to the Genesys Cloud Developer Guides.');
	expect(blockquoteNode.tagName).toBe('BLOCKQUOTE');
});

test('testing strikethrough node', async () => {
	const IProp = {
		ast: MixedData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	const strikethroughNode = screen.getByText('strikethroughContent');
	expect(strikethroughNode.tagName).toBe('S');
});

test('testing nested Paragraph/Bold/Italic/Strikethrough Node', async () => {
	const IProp = {
		ast: NestedData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	const paragraphNode = screen.getByText('a bold strikethrough text');

	expect(paragraphNode.tagName).toBe('EM');
});

test('testing contentgroup & conntentgroupitem node', async () => {
	const IProp = {
		ast: MixedData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});

	expect(screen.getByText('i am tabbedcontent')).toBeTruthy();
});

test('inlinecode as a table child', async () => {
	const IProp = {
		ast: NestedData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	expect(screen.getByText('printf()')).toBeTruthy();
});

test('testing for unexpected html elements', async () => {
	const IProp = {
		ast: MixedData as DocumentNode,
		api: {} as CmsApi
	};

	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});

	const mainContainer = screen.getAllByRole('generic')[0];
	let elements: any = [];
	const getNodeNames = (node: any) => {
		let children = node.childNodes;
		if (children.length === 0) {
			return;
		}

		for (let index = 0; index < children.length; index++) {
			elements.push(children[index].nodeName);
			getNodeNames(children[index]);
		}
	};

	getNodeNames(mainContainer);
	const results = elements.filter((element) => element !== '#text');
	expect(results.filter((element) => element === 'H1').length).toBe(2);
	expect(results.filter((element) => element === 'H2').length).toBe(2);
	expect(results.filter((element) => element === 'H3').length).toBe(1);
	expect(results.filter((element) => element === 'H4').length).toBe(1);
	expect(results.filter((element) => element === 'H5').length).toBe(1);
	expect(results.filter((element) => element === 'H6').length).toBe(1);
	expect(results.filter((element) => element === 'OL').length).toBe(1);
	expect(results.filter((element) => element === 'UL').length).toBe(1);
	expect(results.filter((element) => element === 'LI').length).toBe(6);
	expect(results.filter((element) => element === 'A').length).toBe(1);
	expect(results.filter((element) => element === 'STRONG').length).toBe(1);
	expect(results.filter((element) => element === 'EM').length).toBe(1);
	expect(results.filter((element) => element === 'TABLE').length).toBe(2);
	expect(results.filter((element) => element === 'TR').length).toBe(4);
	expect(results.filter((element) => element === 'TD').length).toBe(4);
	expect(results.filter((element) => element === 'THEAD').length).toBe(1);
	expect(results.filter((element) => element === 'P').length).toBe(1);
	expect(results.filter((element) => element === 'BLOCKQUOTE').length).toBe(1);
	expect(results.filter((element) => element === 'S').length).toBe(1);
});

test('blockcode as a table child', async () => {
	const IProp = {
		ast: TableData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});
	expect(screen.getByText('printd')).toBeTruthy();
});

test('contengroupitem title', async () => {
	const IProp = {
		ast: ContentGroupData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});

	expect(screen.getByText('tab two')).toBeTruthy();
});

test('testing case insensitive nodes', async () => {
	const IProp = {
		ast: ParagraphData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});

	expect(screen.getByText("this text won't show because the node type doesn't match")).toBeTruthy();
});

test('indent implemented in paragraph', async () => {
	const IProp = {
		ast: ParagraphData as DocumentNode,
		api: {} as CmsApi
	};
	await act(() => {
		render(<YeastDocumentRenderer {...IProp} />);
	});

	const paragraphElem = screen.getByText('(end of document)');
	expect(paragraphElem.className.trim()).toBe('indent-1');
});
