import React, { ReactNode } from 'react';
import {
	YeastNode,
	isYeastNode,
	YeastChild,
	DiffType,
	DiffSource,
	ModificationAssignment,
	ModificationData,
	ModificationDiffMap,
	DiffPivotMap,
} from 'yeast-core';

export interface DiffRenderData {
	diffClass: string;
	renderedNodes?: RenderedNodes;
	renderedStrings?: RenderedStrings;
}

export type RenderedNodes = {
	[textProperty: string]: ReactNode;
};
export type RenderedStrings = {
	[textProperty: string]: {
		oldString: string;
		newString: string;
	};
};

const addedClass: string = 'diff-added';
const removedClass: string = 'diff-removed';
const modifiedClassPrefix: string = 'diff-modified-';

// Interprets the diff data associated with a yeast node and returns css classes, strings, and react nodes for display.
export function getDiffRenderData(diffNode: YeastChild): DiffRenderData | undefined {
	if (!diffNode.hasDiff) return;

	// init
	const data: DiffRenderData = { diffClass: '' };

	// Class assignment for added/removed type is straightforward.
	if (diffNode.diffType === DiffType.Added) data.diffClass = addedClass;
	if (diffNode.diffType === DiffType.Removed) data.diffClass = removedClass;

	// Modification diff type requires more processing.
	const isModification: boolean = diffNode.diffType === DiffType.Modified;
	const isTextModification: boolean | undefined = diffNode.isTextModification;
	const containsTextModification: boolean | undefined = diffNode.containsTextModification;
	const areDiffPivotsPresent: boolean = diffNode.diffPivots && Object.keys(diffNode.diffPivots).length > 0;

	if (isModification) {
		// If the diff node includes text modifications, multiple node segments are needed for display
		if (isTextModification && areDiffPivotsPresent) {
			// Some node renderers require the rendered text modifications in string form, while others require nodes. Both are constructed here to be used as needed.
			const renderedNodes: RenderedNodes = {};
			const renderedStrings: RenderedStrings = {};

			/*
			 * In a diff node, properties that have modified text contain the concatenation of the old and new string.
			 * Diff mods contain the string index boundaries for the modified segments of the overall text of a modified property.
			 * Diff pivots map a modified property to the string inded that separates the old and new segments of the concatenated string.
			 * These are all used here to construct the appropriate node and string segments for displaying the diff.
			 */
			for (const [prop, pivot] of Object.entries(diffNode.diffPivots)) {
				// If submodications occur within the modified text, pass them to the renderNodeSegments function for further processing.
				if (diffNode.diffMods && diffNode.diffMods[prop]) {
					renderedNodes[prop] = React.createElement(React.Fragment, {}, ...renderNodeSegments(prop, diffNode.diffMods[prop], diffNode));
				}
				// Otherwise, just use the old and new strings in their entirety since no internal divisions are needed for diff display.
				else {
					renderedNodes[prop] = React.createElement(
						React.Fragment,
						{},
						React.createElement('span', { className: `${modifiedClassPrefix}old` }, diffNode[prop].substring(0, pivot)),
						React.createElement('span', { className: `${modifiedClassPrefix}new` }, diffNode[prop].substring(pivot, diffNode[prop.length]))
					);
				}

				// The string representation of modified text does not include css styling, so just split the old and new strings off of the concatenated string.
				renderedStrings[prop] = {
					oldString: diffNode[prop].substring(0, pivot),
					newString: diffNode[prop].substring(pivot, diffNode[prop].length),
				};
			}

			// Append the rendered nodes and strings to the diff render data.
			data.renderedNodes = renderedNodes;
			data.renderedStrings = renderedStrings;
		}
		// If there is no text modification in either the node or its children, this is the right node depth at which to display the diff.
		else if (containsTextModification === false) {
			if (diffNode.diffSource === DiffSource.Old) {
				data.diffClass = `${modifiedClassPrefix}old`;
			}
			if (diffNode.diffSource === DiffSource.New) {
				data.diffClass = `${modifiedClassPrefix}new`;
			}
		}
	}

	// Return the diff render data.
	return data;
}

// Interprets text modfication data to construct react nodes for displaying the diff.
function renderNodeSegments(prop: string, modAssignment: ModificationAssignment, diffNode: YeastChild): ReactNode[] {
	// init
	const { oldModData, newModData } = modAssignment;
	const oldSegments: ReactNode[] = [];
	const newSegments: ReactNode[] = [];
	const renderedSegments: ReactNode[] = [];

	// Process the old and new modification data.
	processModAssignment(oldModData, prop, diffNode, oldSegments, DiffSource.Old);
	processModAssignment(newModData, prop, diffNode, newSegments, DiffSource.New);

	// If both old and new segments are present, nest them both in an outer span element.
	if (oldSegments.length > 0 && newSegments.length > 0) {
		const oldWrapper = React.createElement('span', { className: `${modifiedClassPrefix}old-wrapper` }, ...oldSegments);
		const newWrapper = React.createElement('span', { className: `${modifiedClassPrefix}new-wrapper` }, ...newSegments);
		const fullWrapper = React.createElement('span', { className: `${modifiedClassPrefix}full-wrapper` }, oldWrapper, newWrapper);
		renderedSegments.push(fullWrapper);
	}
	// If only old segments are present, nest them in an outer span element.
	else if (oldSegments.length > 0) {
		const oldWrapper = React.createElement('span', { className: `${modifiedClassPrefix}old-wrapper` }, ...oldSegments);

		const fullWrapper = React.createElement('span', { className: `${modifiedClassPrefix}full-wrapper` }, oldWrapper);
		renderedSegments.push(fullWrapper);
	}
	// If only new segments are present, nest them in an outer span element.
	else if (newSegments.length > 0) {
		const newWrapper = React.createElement('span', { className: `${modifiedClassPrefix}new-wrapper` }, ...newSegments);

		const fullWrapper = React.createElement('span', { className: `${modifiedClassPrefix}full-wrapper` }, newWrapper);
		renderedSegments.push(fullWrapper);
	}

	return renderedSegments;
}

/*
 * Escape pure whitespace segments.
 * React nodes with inner text containing only whitespace need the whitespace escaped with the html space entity.
 * This ensures that the whitespace will display in the diff.
 */
function escapeHtmlText(s: string): string {
	let escapedString = s;
	if (s.trim() === '') {
		escapedString = s.replace(/\s/g, '\u00A0');
	}

	return escapedString;
}	

// Processes text modification data, creates and collects react nodes for displaying text diffs
function processModAssignment(
	modData: ModificationData[],
	prop: string,
	diffNode: YeastChild,
	renderedSegments: ReactNode[],
	diffSource: DiffSource
) {
	// Initialize css class suffixes.
	let innerClassSuffix: string;
	let outerClassSuffix: string;
	if (diffSource === DiffSource.Old) {
		innerClassSuffix = 'removed';
		outerClassSuffix = 'old';
	} else {
		innerClassSuffix = 'added';
		outerClassSuffix = 'new';
	}

	/*
	 * Initialize the start and end indices.
	 * If processing modification data of text from the old node, start at 0 and stop at the diff pivot.
	 * If processing the same from the new node, start at the diff pivot and stop at the end of the string.
	 */
	let startIndex: number;
	let endIndex: number;
	if (diffSource === DiffSource.Old) {
		startIndex = 0;
		endIndex = diffNode.diffPivots[prop];
	} else {
		startIndex = diffNode.diffPivots[prop];
		endIndex = diffNode[prop].length;
	}

	// If no modification data is present, inject the entire segment into a span and return.
	if (modData.length === 0) {
		const postSegment: ReactNode = React.createElement(
			'span',
			{ className: `${modifiedClassPrefix}${outerClassSuffix}` },
			escapeHtmlText(diffNode[prop].substring(startIndex, endIndex))
		);
		renderedSegments.push(postSegment);

		return;
	}

	// Process the modification data.
	for (let i: number = 0; i < modData.length; i++) {
		const isFirstModOffset: boolean = i === 0 && modData[0].startIndex > startIndex;

		// If there are characters before the first modification, treat those as the first segment.
		if (isFirstModOffset) {
			const preSegment: ReactNode = React.createElement(
				'span',
				{ className: `${modifiedClassPrefix}${outerClassSuffix}` },
				escapeHtmlText(diffNode[prop].substring(startIndex, modData[0].startIndex))
			);
			renderedSegments.push(preSegment);
		}

		// Construct a node for the span indicated by the modification data.
		const segment: ReactNode = React.createElement(
			'span',
			{ className: `diff-${innerClassSuffix}` },
			escapeHtmlText(diffNode[prop].substring(modData[i].startIndex, modData[i].endIndex))
		);
		renderedSegments.push(segment);

		const isLastMod: boolean = i === modData.length - 1;
		const isLastModOffset: boolean = modData[i].endIndex < diffNode[prop].length;
		const isConsecutive: boolean = !isLastMod && modData[i + 1].startIndex - modData[i].endIndex === 0;

		// If there are chars remaining after the last modification, treat those as the last segment.
		if (isLastMod && isLastModOffset) {
			const postSegment: ReactNode = React.createElement(
				'span',
				{ className: `${modifiedClassPrefix}${outerClassSuffix}` },
				escapeHtmlText(diffNode[prop].substring(modData[i].endIndex, endIndex))
			);
			renderedSegments.push(postSegment);
		}
		// If this is not the last modification, and there are chars between the current and next mod, add a segment for those gap chars.
		else if (!isConsecutive && !isLastMod) {
			const postSegmentEndIndex: number = modData[i + 1].startIndex;
			const postSegment: ReactNode = React.createElement(
				'span',
				{ className: `${modifiedClassPrefix}${outerClassSuffix}` },
				escapeHtmlText(diffNode[prop].substring(modData[i].endIndex, postSegmentEndIndex))
			);
			renderedSegments.push(postSegment);
		}
	}
}

/*
 * Splits a diff node with text modifications into before and after nodes.
 * This is needed under the following circumstances
 * 1) A diff node has a text modification on a property where classes/nodes cannot be injected to display the diff side-by-side.
 * 2) As a result, the node will be split and displayed as before and after nodes to show modification on the whole node instead of just the localized text diff.
 * 3) Sometimes, this method fails because the node contains children with text modification that are displayed side-by-side, and thus there are duplicate text mods (in both before and after nodes).
 * 4) To combat that case, this function is used to split those inner child text mods and segregate them to the before and after nodes.
 */
export function separateDiffChildren(node: YeastNode): { oldChildren: YeastChild[]; newChildren: YeastChild[] } {
	// init
	let children: YeastChild[] = node.children;
	const oldChildren: YeastChild[] = [];
	const newChildren: YeastChild[] = [];

	// Iterate throught the child nodes.
	if (children && children.length > 0) {
		for (const child of children) {
			// Make an "old" and "new" copy of the unified diff node.
			let oldChild: YeastChild = Object.assign({}, child);
			let newChild: YeastChild = Object.assign({}, child);

			// If the child has or contains text modifications, further processing is needed.
			if (child.hasDiff && (child.isTextModification || child.containsTextModification)) {
				// init
				const mods: ModificationDiffMap = child.diffMods;
				const pivots: DiffPivotMap = child.diffPivots;
				const oldModDiffMap: ModificationDiffMap = {};
				const newModDiffMap: ModificationDiffMap = {};
				const rebasedPivots: DiffPivotMap = {};

				// If the child has a text modification at the current level, commence splitting.
				const shouldProcess: boolean = child.isTextModification && mods && Object.keys(mods)?.length > 0;
				if (shouldProcess) {
					// Iterate through the diff mods.
					for (const [textProp, modData] of Object.entries(mods)) {
						// Obtain the matching pivot index separated the old and new strings.
						const pivot: number = pivots[textProp] || 0;

						// Segregate the old and new strings.
						const oldString: string = child[textProp].substring(0, pivot);
						const newString: string = child[textProp].substring(pivot);

						/*
						 * The modification data for the separated diff nodes is going to be processed again downstream by the getDiffRenderData function when the child nodes are rendered.
						 * Therefore, the modification data for the new node needs to be rebased by subtracting each index by the pivot, and the pivot becomes 0.
						 * That's because the old and new strings are no longer concatenated.
						 * The old modification data oesn't need the same adjustment, because the old string comes first in the concatenated string.
						 */
						rebasedPivots[textProp] = 0;
						let oldData: ModificationData[] = (modData as ModificationAssignment).oldModData;
						let newData: ModificationData[] = (modData as ModificationAssignment).newModData.map((data: ModificationData) => {
							const rebasedData: ModificationData = Object.assign({}, data);
							rebasedData.startIndex = data.startIndex - pivot;
							rebasedData.endIndex = data.endIndex - pivot;

							return rebasedData;
						});

						// The old node only needs the old mod data.
						let oldAssignment: ModificationAssignment = {
							oldModData: oldData,
							newModData: [],
						};
						// The new node only needs the old mod data.
						let newAssignment: ModificationAssignment = {
							oldModData: [],
							newModData: newData,
						};

						// append data
						oldModDiffMap[textProp] = oldAssignment;
						newModDiffMap[textProp] = newAssignment;
						oldChild[textProp] = oldString;
						newChild[textProp] = newString;
					}

					// append data
					oldChild.diffMods = oldModDiffMap;
					oldChild.diffPivots = pivots;

					newChild.diffMods = newModDiffMap;
					newChild.diffPivots = rebasedPivots;
				}

				// If the current child has no text modification, but contains a text modification within its children, recursively call the function to process them.
				if (isYeastNode(child)) {
					const separatedChildren = separateDiffChildren(child);
					if (separatedChildren.oldChildren) (oldChild as YeastNode).children = separatedChildren.oldChildren;
					if (separatedChildren.newChildren) (newChild as YeastNode).children = separatedChildren.newChildren;
				}
			}

			// append
			oldChildren.push(oldChild);
			newChildren.push(newChild);
		}
	}

	// Return the separated children.
	return {
		oldChildren,
		newChildren,
	};
}
