import React, { ReactFragment } from 'react';
import { BlockCodeNode } from 'yeast-core';
import { CodeFence } from 'genesys-react-components';
import { useKey } from '../helpers/useKey';
import { ReactRenderer } from '../ReactRenderer';
import { getDiffRenderData, DiffRenderData } from '../helpers/diff';

interface IProps {
	node: BlockCodeNode;
	renderer: ReactRenderer;
}

export default function BlockCodeNodeRenderer(props: IProps) {
	let oldTitle: string = props.node.title;
	let newTitle: string = props.node.title;
	let oldValue: string = props.node.value;
	let newValue: string = props.node.value;
	let className: string = '';

	const diffRenderData: DiffRenderData = getDiffRenderData(props.node);
	if (diffRenderData) {
		className += `diff-block-padding ${diffRenderData.diffClass}`;
		if (diffRenderData.renderedStrings) {
			if (diffRenderData.renderedStrings['title']) {
				oldTitle = diffRenderData.renderedStrings['title'].oldString;
				newTitle = diffRenderData.renderedStrings['title'].newString;
			}
			if (diffRenderData.renderedStrings['value']) {
				oldValue = diffRenderData.renderedStrings['value'].oldString;
				newValue = diffRenderData.renderedStrings['value'].newString;
			}
		}
	}

	const key = useKey();
	let value = props.node.value;
	if (props.node.tabsToSpaces) {
		let spaces = ' ';
		spaces = spaces.repeat(props.node.tabsToSpaces);
		value = props.node.value.replace(/\t/gi, spaces);
	}
	const indentation = props.node.indentation ? props.node.indentation.toString() : '';
	return diffRenderData && diffRenderData.renderedStrings ? (
		<React.Fragment>
			<CodeFence
				key={key.current}
				value={oldValue}
				language={props.node.language}
				title={oldTitle}
				autoCollapse={props.node.autoCollapse}
				noCollapse={props.node.noCollapse}
				showLineNumbers={props.node.showLineNumbers}
				indentation={indentation}
				className="diff-modified-old diff-block-old"
			/>
			<CodeFence
				key={key.current}
				value={newValue}
				language={props.node.language}
				title={newTitle}
				autoCollapse={props.node.autoCollapse}
				noCollapse={props.node.noCollapse}
				showLineNumbers={props.node.showLineNumbers}
				indentation={indentation}
				className="diff-modified-new diff-block-new"
			/>
		</React.Fragment>
	) : (
		<CodeFence
			key={key.current}
			value={value}
			language={props.node.language}
			title={props.node.title}
			autoCollapse={props.node.autoCollapse}
			noCollapse={props.node.noCollapse}
			showLineNumbers={props.node.showLineNumbers}
			indentation={indentation}
			className={className}
		/>
	);
}
