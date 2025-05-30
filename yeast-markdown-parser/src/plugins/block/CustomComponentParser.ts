import { BlockParserPlugin, YeastParser, BlockParserPluginResult, YeastNode } from 'yeast-core';

import { XMLParser } from 'fast-xml-parser';

const CUSTOM_COMPONENT_REGEX = /^\s*(<(?:yeast|dxui):.*)([\s\S]*)$/i;

export class CustomComponentParserPlugin implements BlockParserPlugin {
	parse(text: string, parser: YeastParser): void | BlockParserPluginResult {
		const match = text.match(CUSTOM_COMPONENT_REGEX);
		if (!match) return;

		const parserOptions = {
			ignoreAttributes: false,
			allowBooleanAttributes: true,
			parseTagValue: false,
			preserveOrder: true,
			isArray: () => {
				return true;
			},
		};
		const xmlParser = new XMLParser(parserOptions);

		let xmlJson: any;
		let rawXml = '';
		let remainingText = '';

		try {
			//If custom component is a one-liner
			xmlJson = xmlParser.parse(match[1], true);
			remainingText = match[2];
		} catch (err) {
			//Parse line by line
			const lines = text.trim().split('\n');
			let i = 0;
			while (lines[i] && lines[i] !== '\n') {
				rawXml += lines[i] + '\n';
				i++;
			}
			remainingText = lines.splice(i + 1).join('\n');

			try {
				xmlJson = xmlParser.parse(rawXml, true);
			} catch (err) {
				//Invalid XML i.e no closing tag
				return;
			}
		}

		/**
		 * Here is a sample JSON result of a parsed XML string for reference:
		 *
		 * XML: <yeast:link href="/path/to/page" title="Opens the Display Text page" forceNewTab="false"> <yeast:strikethrough>link</yeast:strikethrough> </yeast:link>
		 * Result:
		 * [
  			{
    		  "yeast:link": [{ "yeast:strikethrough": [{ "#text": "link" }] }],
    		  ":@": {
      				"@_href": "/path/to/page",
    			 	"@_title": "Opens the Display Text page",
      				"@_forceNewTab": "false"
    		   }
  			}
		  ]
		 * 
		 */
		const parseXmlJson = (parentNode: YeastNode, childrenArray: any[]) => {
			const children = [];
			for (const child of childrenArray) {
				let keys = Object.keys(child);
				if (keyExists(keys, 'yeast')) {
					let childNode = {} as YeastNode;
					let componentName = '';
					let rawKey = '';
					keys.forEach((k) => {
						//Custom component node
						if (k.includes('yeast')) {
							componentName = k.split(':')[1];
							childNode.type = componentName;
							rawKey = k;
						}
						//Attributes
						if (k.includes(':@')) {
							for (const attr in child[':@']) {
								const attribute = attr.slice(2); //remove prefix "@_"
								childNode[attribute] = child[':@'][attr];
							}
						}
					});
					children.push(parseXmlJson(childNode, child[rawKey]));
				} else if (keyExists(keys, '#text')) {
					children.push(
						...parser.parseBlock(child['#text'])
							.map((child) => {
								if (child.type === 'pseudoParagraph' && child.children?.length === 1) {
									return child.children[0];
								}
								return child;
							})
					);
				}
			}

			//Don't create children[] for parentnode if there are no children because some nodes aren't supposed to have children[].
			if (children.length > 0) {
				if (!parentNode.children) parentNode.children = [];
				parentNode.children = [...parentNode.children, ...children];
			}

			return parentNode;
		};

		let rootComponent = '';
		let rootComponentChildren = [];
		const node = {} as YeastNode;

		//XMLJson should only contain one root node
		const rootNode = xmlJson[0];

		//Get root node from the parsed XML
		for (const p in rootNode) {
			if (p.includes('yeast') || p.includes('dxui')) {
				rootComponent = p.split(':')[1];
				rootComponentChildren = rootNode[p];
			}
			if (p.includes(':@')) {
				for (const attr in rootNode[p]) {
					const attribute = attr.slice(2); //remove prefix "@_"
					node[attribute] = rootNode[p][attr];
				}
			}
		}

		node.type = rootComponent;

		return {
			remainingText: remainingText,
			nodes: rootComponentChildren.length === 0 ? [node] : [parseXmlJson(node, rootComponentChildren)],
		};
	}
}

const keyExists = (arr: string[], key: string) => {
	return arr.find((k) => {
		return k.includes(key);
	});
};
