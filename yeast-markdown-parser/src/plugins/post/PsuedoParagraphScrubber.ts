import {
	DocumentNode,
	PostProcessorPlugin,
	YeastNodeFactory,
	YeastText,
	YeastParser,
	YeastBlockNodeTypes,
	PseudoParagraphNode,
} from 'yeast-core';

/**
 * This plugin takes the final AST from the parsing process and recursively concatenates ajacent paragraph nodes.
 */
export class PsuedoParagraphScrubber implements PostProcessorPlugin {
	parse(astDoc: DocumentNode, parser: YeastParser): DocumentNode {
		return joinAdjacentParagraphNode(astDoc, parser);
	}
}

const joinAdjacentParagraphNode = (node: DocumentNode, parser: YeastParser) => {
	let paragraphNode = YeastNodeFactory.CreateParagraphNode();
	let paragraphText = '';
	for (let i = 0; i < node.children.length; i++) {
		if (node.children[i].children && node.children[i].type !== YeastBlockNodeTypes.PseudoParagraph) {
			node.children[i] = joinAdjacentParagraphNode(node.children[i] as DocumentNode, parser);
		}

		if (node.children[i].type !== YeastBlockNodeTypes.PseudoParagraph) {
			continue;
		}

		if ((node.children[i] as PseudoParagraphNode).isLastLine === false) {
			let j = i;
			let paragraphIndentation = 0;
			//We only care about the indentation of the first line of the paragraph
			if ((node.children[j].children[0] as YeastText).text.trim() === '') {
				//Use the indentation of the next pseudonode because we are going to delete this white space node.
				paragraphIndentation = (node.children[j + 1] as PseudoParagraphNode).indentation;
			} else {
				paragraphIndentation = (node.children[j] as PseudoParagraphNode).indentation;
			}

			while (node.children[j] && (node.children[j] as PseudoParagraphNode).isLastLine === false) {
				//Delete white space pseudonodes
				if ((node.children[j].children[0] as YeastText).text.trim() === '') {
					node.children.splice(j, 1);
					//A lastline psuedonode right after a white space psuedonode signifies a standalone paragraph.
					//We break back into the for loop so it could be processed by the standalone paragraph logic.
					if ((node.children[j] as PseudoParagraphNode).isLastLine === true) {
						i--;
						break;
					}
					continue;
				}

				paragraphText += (node.children[j].children[0] as YeastText).text + ' ';
				j++;

				// Final line in paragraph
				if ((node.children[j] as PseudoParagraphNode).isLastLine === true) {
					paragraphText += (node.children[j].children[0] as YeastText).text + ' ';
					paragraphNode.children = parser.parseInline(paragraphText.trimEnd());
					paragraphNode.indentation = paragraphIndentation;

					//Replace concatenated nodes with new giga node
					node.children.splice(i, j - i + 1, paragraphNode);

					//reset paragraph node
					paragraphNode = YeastNodeFactory.CreateParagraphNode();
					paragraphText = '';
					break;
				} else if (node.children[j].type !== YeastBlockNodeTypes.PseudoParagraph) {
					paragraphNode.children = parser.parseInline(paragraphText.trimEnd());
					paragraphNode.indentation = paragraphIndentation;
					node.children.splice(i, j - i, paragraphNode);

					paragraphNode = YeastNodeFactory.CreateParagraphNode();
					paragraphText = '';
					break;
				}
			}
		} else {
			//Process standalone paragraphs
			paragraphText += (node.children[i].children[0] as YeastText).text;
			paragraphNode.children = parser.parseInline(paragraphText);
			paragraphNode.indentation = (node.children[i] as PseudoParagraphNode).indentation;
			//Delete white space pseudonodes
			if (paragraphText.trim() === '') {
				node.children.splice(i, 1);
				i--;
			} else {
				node.children.splice(i, 1, paragraphNode);
			}
			paragraphText = '';
			paragraphNode = YeastNodeFactory.CreateParagraphNode();
		}
	}

	return node;
};
