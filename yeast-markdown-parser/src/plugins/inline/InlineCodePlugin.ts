import { InlineTokenizerPlugin, Token, YeastParser, YeastNodeFactory } from 'yeast-core';

export class InlineCodePlugin implements InlineTokenizerPlugin {
	tokenize(text: string, parser: YeastParser): void | Token[] {
		const tokens: Token[] = [];
		const textArr = text.split('');
		let index = 0;
		try {
			while (index < textArr.length) {
				//Single backtick parser
				if (textArr[index] === '`' && textArr[index + 1] !== '`' && textArr[index + 1] !== ' ') {
					if (index >= 0 && textArr[index - 1] !== '`') {
						let code = '';
						let startIndex = index;
						let isInvalidSyntax = false;
						do {
							if (textArr[index + 1]) {
								code += textArr[++index];
							} else {
								//There was probably no closing tag
								isInvalidSyntax = true;
								break;
							}
						} while (textArr[index + 1] !== '`' && index < textArr.length);

						if (isInvalidSyntax) {
							index++;
							continue;
						}

						const node = YeastNodeFactory.CreateInlineCodeNode();
						node.children = [{ text: code }];
						tokens.push({
							start: startIndex,
							end: startIndex + code.length + 2,
							from: 'InlineCodePlugin',
							nodes: [node],
						});
						index++; //for the closing backtick
					}
				}

				//Double backtick parser
				if (textArr[index] === '`' && textArr[index + 1] === '`' && textArr[index + 2] !== ' ') {
					let code = '';
					let startIndex = index;
					let isInvalidSyntax = false;
					//Skip the second back tick
					index += 1;
					do {
						if (textArr[index + 1]) {
							code += textArr[++index];
						} else {
							isInvalidSyntax = true;
							break;
						}
					} while (!(textArr[index + 1] === '`' && textArr[index + 2] === '`') && index < textArr.length);
					if (isInvalidSyntax) {
						index++;
						continue;
					}
					const node = YeastNodeFactory.CreateInlineCodeNode();
					node.children = [{ text: code }];
					tokens.push({
						start: startIndex,
						end: startIndex + code.length + 4,
						from: 'InlineCodePlugin',
						nodes: [node],
					});
					index += 2; //for the double closing backticks
				}
				index++;
			}
		} catch (err) {
			console.log(err);
			console.log(text);
		}

		return tokens;
	}
}
