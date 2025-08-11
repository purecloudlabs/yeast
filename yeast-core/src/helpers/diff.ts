import {
	DocumentNode,
	YeastNode,
	YeastBlockNodeTypes,
	YeastInlineNodeTypes,
	YeastChild,
	YeastText,
	DiffSource,
	DiffType,
	DiffEntity,
	ModificationData,
	ModificationDiffMap,
	isYeastTextNode,
	ImageNode,
	BlockCodeNode,
	CalloutNode,
	ContentGroupItemNode,
	ModificationAssignment,
	DiffPivotMap,
	isYeastNode,
	scrapeText,
} from '../index';

interface WordBoundaryData {
	wordStart: number;
	wordEnd: number;
}

interface DiffData {
	diffType: DiffType;
	nextOldIdx: number;
	nextNewIdx: number;
	oldMatchIdx?: number;
	newMatchIdx?: number;
}

interface DiffTypeScoreMap {
	[scoreKey: string]: number;
}

interface ScoreData {
	score: number;
	nextOldIdx?: number;
	nextNewIdx?: number;
	oldMatchIdx?: number;
	newMatchIdx?: number;
}

interface EntityMatchData {
	isMatch: boolean;
	isTextModification?: boolean;
	textProperties?: string[];
}

interface SpaceDiffData {
	spaceDiff: number;
	spaceDiffType: DiffType;
}

export interface AnchorPathMapping {
	newPath?: number;
	oldPath?: number;
	isOrphaned: boolean;
}

// Recursively search for a diff node with the specified old path
function findDiffNodeByOldPath(diffNode: YeastNode, targetOldPath: number): YeastNode | null {
	// Check if this node has the target old path
	if (diffNode.oldNodePath === targetOldPath) {
		return diffNode;
	}

	// Recursively search children
	if (diffNode.children) {
		for (const child of diffNode.children) {
			if (isYeastNode(child)) {
				const found = findDiffNodeByOldPath(child, targetOldPath);
				if (found) {
					return found;
				}
			}
		}
	}

	return null;
}

export function mapAnchorPath(anchorPath: string, oldNode: DocumentNode, newNode: DocumentNode): AnchorPathMapping {
	// Generate the diff document to get path mapping information
	const diffDocument = diff(oldNode, newNode);
	if (!diffDocument) {
		return { newPath: undefined, isOrphaned: true };
	}

	// Find the diff node that has the old path matching our anchor path
	const targetOldPath = Number(anchorPath);
	const diffNode = findDiffNodeByOldPath(diffDocument, targetOldPath);
	
	if (!diffNode) {
		return { newPath: undefined, isOrphaned: true };
	}

	if (diffNode.diffType === DiffType.Removed) {
		return { newPath: undefined, oldPath: diffNode.oldNodePath, isOrphaned: true };
	} else if (diffNode.diffType === DiffType.Added) {
		return { newPath: diffNode.newNodePath, oldPath: undefined, isOrphaned: true };
	} else if (diffNode.diffType === DiffType.Modified) {
		// For modified nodes, we need to handle split nodes properly
		let actualNewPath: number | undefined;
		if (diffNode.newNodePath !== undefined) {
			// If this node has newNodePath, use it directly
			actualNewPath = diffNode.newNodePath;
		} else {
			// The corresponding new pair should be the next node in the array
			const currentIndex = diffDocument.children.indexOf(diffNode);
			const nextNode = diffDocument.children[currentIndex + 1];
			
			if (nextNode && 
				nextNode.diffType === DiffType.Modified && 
				nextNode.diffSource === DiffSource.New &&
				nextNode.newNodePath !== undefined) {
				actualNewPath = nextNode.newNodePath;
			}
		}
		
		return { newPath: actualNewPath, oldPath: diffNode.oldNodePath, isOrphaned: true };
	} else {
		return { newPath: diffNode.newNodePath, oldPath: diffNode.oldNodePath, isOrphaned: false };
	}
}

// Gets the index boundaries for a word in a modified string.
function getWordBoundaries(s: string, wordPos: number): WordBoundaryData {
	// init
	let boundaries: WordBoundaryData = {} as WordBoundaryData;
	let temp: string = s;
	let tempStartIdx: number = 0;

	// Iterate through the string to find the Nth word and determine its start and end indices.
	for (let i = 0; i <= wordPos; i++) {
		const wordStart: number = temp.search(/[^\s]/);

		let sliceIdx: number = temp.slice(wordStart).search(/\s/);
		let wordEnd: number;
		if (sliceIdx === -1) {
			wordEnd = s.length;
		} else {
			wordEnd = sliceIdx + wordStart;
		}
		if (i === wordPos) {
			boundaries.wordStart = tempStartIdx + wordStart;
			boundaries.wordEnd = sliceIdx === -1 ? wordEnd : tempStartIdx + wordEnd;
		}
		temp = s.slice(tempStartIdx + wordEnd);
		tempStartIdx += wordEnd;
	}
	return boundaries;
}

// Calculates the diff in the number of spaces between words
function calculateSpaceDiff(
	oldString: string,
	newString: string,
	oldIdx: number,
	newIdx: number,
	oldWords: string[],
	newWords: string[]
): SpaceDiffData {
	// init
	let oldSpace: number;
	let newSpace: number;
	let spaceDiffType: DiffType = DiffType.Modified;

	let oldPrevBounds: WordBoundaryData;
	let oldNextBounds: WordBoundaryData;
	let newPrevBounds: WordBoundaryData;
	let newNextBounds: WordBoundaryData;

	// If calculating space diff at the start of the string, there is no word to the left.
	const isInitSpaceDiff: boolean = oldIdx === 0 && newIdx === 0;
	if (isInitSpaceDiff) {
		oldNextBounds = getWordBoundaries(oldString, oldIdx);
		newNextBounds = getWordBoundaries(newString, newIdx);

		const isAdded: boolean = oldNextBounds.wordStart === 0 && newNextBounds.wordStart > 0;
		const isRemoved: boolean = oldNextBounds.wordStart > 0 && newNextBounds.wordStart === 0;
		if (isAdded) {
			spaceDiffType = DiffType.Added;
		}
		if (isRemoved) {
			spaceDiffType = DiffType.Removed;
		}

		return {
			spaceDiff: newNextBounds.wordStart - oldNextBounds.wordStart,
			spaceDiffType,
		};
	}

	// If the right-hand word comparison index is out of bounds, calculate the space at the end of the string.
	const isOutOfBounds: boolean = oldIdx >= oldWords.length && newIdx >= newWords.length;
	if (isOutOfBounds) {
		const lastOldWordBounds: WordBoundaryData = getWordBoundaries(oldString, oldWords.length - 1);
		const lastNewWordBounds: WordBoundaryData = getWordBoundaries(newString, newWords.length - 1);
		const oldDiff: number = oldString.length - lastOldWordBounds.wordEnd;
		const newDiff: number = newString.length - lastNewWordBounds.wordEnd;

		const isAdded: boolean = oldDiff === 0 && newDiff > 0;
		const isRemoved: boolean = oldDiff > 0 && newDiff === 0;
		if (isAdded) {
			spaceDiffType = DiffType.Added;
		}
		if (isRemoved) {
			spaceDiffType = DiffType.Removed;
		}

		return {
			spaceDiff: newDiff - oldDiff,
			spaceDiffType,
		};
	}

	// Otherwise, get the boundaries for words on the left and right side of the comparison, and calculate the space difference.
	oldPrevBounds = getWordBoundaries(oldString, oldIdx - 1);
	oldNextBounds = getWordBoundaries(oldString, oldIdx);
	newPrevBounds = getWordBoundaries(newString, newIdx - 1);
	newNextBounds = getWordBoundaries(newString, newIdx);

	oldSpace = oldNextBounds.wordStart - oldPrevBounds.wordEnd;
	newSpace = newNextBounds.wordStart - newPrevBounds.wordEnd;

	return {
		spaceDiff: newSpace - oldSpace,
		spaceDiffType,
	};
}

// Processes and adds space modification to the list of modification data for a string when a space diff is found.
function addSpaceMod(
	s: string,
	boundaries: WordBoundaryData,
	idx: number,
	mods: ModificationData[],
	diffSource: DiffSource,
	diffType: DiffType
) {
	// init
	let startIndex: number = 0;
	let endIndex: number = boundaries.wordStart;

	// set the start index to the end of the previous word when index greater than 0.
	if (idx > 0) {
		const prevOldBounds: WordBoundaryData = getWordBoundaries(s, idx - 1);
		startIndex = prevOldBounds.wordEnd;
	}

	// add the modification data
	mods.push({
		startIndex: startIndex,
		endIndex: endIndex,
		diffSource,
		modSubtype: diffType,
	});
}

// Processes and adds modification data to an array of ModificationData.
function addMod(
	s: string,
	words: string[],
	wordPos: number,
	mods: ModificationData[],
	boundaries: WordBoundaryData,
	modSubtype: DiffType,
	diffSource: DiffSource,
	spaceDiff?: number,
	initSpaceDiff?: number
) {
	// init
	let endIndex: number = s.length;
	let startIndex: number = boundaries.wordStart;

	// process modification data
	if (wordPos + 1 < words.length) {
		const preMatchBoundaries: WordBoundaryData = getWordBoundaries(s, wordPos);
		const matchBoundaries: WordBoundaryData = getWordBoundaries(s, wordPos + 1);
		// if there is a diff in the number of spaces after the word, include that in the modification boundaries
		if (spaceDiff) {
			endIndex = matchBoundaries.wordStart - 1;
		} else {
			endIndex = preMatchBoundaries.wordEnd;
		}
		// if there is a diff in the number of spaces at the beginning of the string, include that in the modification boundaries.
		if (initSpaceDiff) {
			startIndex = 0;
		}
	}

	// add the modification data
	mods.push({
		startIndex,
		endIndex,
		diffSource,
		modSubtype,
	});
}

// Gets data for the changes within a modified string.
function getModificationData(_oldString: string, _newString: string): ModificationAssignment {
	// initialize
	const oldString = _oldString || '';
	const newString = _newString || '';
	const oldMods: ModificationData[] = [];
	const newMods: ModificationData[] = [];
	let oldIdx: number = 0; // start index for the old node
	let newIdx: number = 0; // start index for the new node
	const oldWords: string[] = oldString.split(' ').filter((word) => word);
	const newWords: string[] = newString.split(' ').filter((word) => word);

	/*
	 * Line the old and new nodes up at their beginnings and process them in parallel.
	 * Go through word by word and mark the modifications in the old node.
	 */
	while (oldIdx < oldWords.length && newIdx < newWords.length) {
		// Get word index boundaries and initialize comparison index increment values.
		const oldBoundaries: WordBoundaryData = getWordBoundaries(oldString, oldIdx);
		const newBoundaries: WordBoundaryData = getWordBoundaries(newString, newIdx);
		let nextOldIndex: number = oldIdx + 1;
		let nextNewIndex: number = newIdx + 1;
		let modificationSubtype: DiffType;

		// On word mismatch, determine the diff type and build modification data.
		if (oldWords[oldIdx] !== newWords[newIdx]) {
			// Get the diff data.
			const { diffType, nextNewIdx, nextOldIdx, oldMatchIdx, newMatchIdx }: DiffData = getDiffData(oldIdx, newIdx, oldWords, newWords);
			modificationSubtype = diffType;

			if (nextOldIdx) nextOldIndex = nextOldIdx;
			if (nextNewIdx) nextNewIndex = nextNewIdx;
			const oldDiffEndIdx: number = (oldMatchIdx || nextOldIdx || oldIdx + 1) - 1;
			const newDiffEndIdx: number = (newMatchIdx || nextNewIdx || newIdx + 1) - 1;

			// Determine if there is a difference in the number of spaces around the words being compared.
			const { spaceDiff } = calculateSpaceDiff(oldString, newString, oldDiffEndIdx + 1, newDiffEndIdx + 1, oldWords, newWords);
			let initSpaceDiff: number = 0;
			const isFirstWord: boolean = oldIdx === 0 && newIdx === 0;
			if (isFirstWord) {
				const initDiff: SpaceDiffData = calculateSpaceDiff(oldString, newString, 0, 0, oldWords, newWords);
				initSpaceDiff = initDiff.spaceDiff;
			}

			// Process the modification data into a consumable form.
			if (modificationSubtype === DiffType.Added) {
				addMod(newString, newWords, newDiffEndIdx, newMods, newBoundaries, DiffType.Added, DiffSource.New, spaceDiff, initSpaceDiff);
			}
			if (modificationSubtype === DiffType.Removed) {
				addMod(oldString, oldWords, oldDiffEndIdx, oldMods, oldBoundaries, DiffType.Removed, DiffSource.Old, spaceDiff, initSpaceDiff);
			}
			if (modificationSubtype === DiffType.Modified) {
				addMod(oldString, oldWords, oldDiffEndIdx, oldMods, oldBoundaries, DiffType.Modified, DiffSource.Old, spaceDiff, initSpaceDiff);
				addMod(newString, newWords, newDiffEndIdx, newMods, newBoundaries, DiffType.Modified, DiffSource.New, spaceDiff, initSpaceDiff);
			}
		}
		// If the words being compared match, still check for diff in number of spaces around the words.
		else {
			let { spaceDiff, spaceDiffType } = calculateSpaceDiff(oldString, newString, oldIdx, newIdx, oldWords, newWords);
			if (spaceDiff) {
				if (spaceDiffType === DiffType.Added) {
					addSpaceMod(newString, newBoundaries, newIdx, newMods, DiffSource.New, DiffType.Added);
				} else if (spaceDiffType === DiffType.Removed) {
					addSpaceMod(oldString, oldBoundaries, oldIdx, oldMods, DiffSource.Old, DiffType.Removed);
				} else {
					addSpaceMod(oldString, oldBoundaries, oldIdx, oldMods, DiffSource.Old, DiffType.Modified);
					addSpaceMod(newString, newBoundaries, newIdx, newMods, DiffSource.New, DiffType.Modified);
				}
			}
		}

		// If there are more words in the old node but no more words in the new node after the current comparison is done, then the remaining words are removals.
		let isLast: boolean = newIdx === newWords.length - 1 && nextOldIndex < oldWords.length;
		let isNextOutOfBounds: boolean = nextNewIndex >= newWords.length && nextOldIndex < oldWords.length;
		const areRemainingWordsRemovals: boolean = isLast || isNextOutOfBounds;

		if (areRemainingWordsRemovals) {
			let startIndex: number;
			if (isLast) {
				startIndex = oldBoundaries.wordEnd;
			} else {
				const beforeNextBounds: WordBoundaryData = getWordBoundaries(oldString, nextOldIndex - 1);
				startIndex = beforeNextBounds.wordEnd;
			}
			oldMods.push({
				startIndex,
				endIndex: oldString.length,
				diffSource: DiffSource.Old,
				modSubtype: DiffType.Removed,
			});
		}

		// If there are more words in the new node but no more words in the old node after the current comparison is processed, then the remaining words are additions.
		isLast = oldIdx === oldWords.length - 1 && nextNewIndex < newWords.length;
		isNextOutOfBounds = nextOldIndex >= oldWords.length && nextNewIndex < newWords.length;
		const areRemainingWordsAdditions: boolean = isLast || isNextOutOfBounds;

		if (areRemainingWordsAdditions) {
			let startIndex: number;
			if (isLast) {
				startIndex = newBoundaries.wordEnd;
			} else {
				const beforeNextBounds: WordBoundaryData = getWordBoundaries(newString, nextNewIndex - 1);
				startIndex = beforeNextBounds.wordEnd;
			}
			newMods.push({
				startIndex,
				endIndex: newString.length,
				diffSource: DiffSource.New,
				modSubtype: DiffType.Added,
			});
		}

		// Set the indices for the next comparison.
		oldIdx = nextOldIndex;
		newIdx = nextNewIndex;
	}

	// mark any space diff at the end of the string
	let { spaceDiff, spaceDiffType } = calculateSpaceDiff(oldString, newString, oldWords.length, newWords.length, oldWords, newWords);
	if (spaceDiff) {
		const newLastBounds: WordBoundaryData = getWordBoundaries(newString, newWords.length - 1);
		const oldLastBounds: WordBoundaryData = getWordBoundaries(oldString, oldWords.length - 1);

		if (spaceDiffType === DiffType.Added) {
			newMods.push({
				startIndex: newLastBounds.wordEnd,
				endIndex: newString.length,
				diffSource: DiffSource.New,
				modSubtype: DiffType.Added,
			});
		} else if (spaceDiffType === DiffType.Removed) {
			oldMods.push({
				startIndex: oldLastBounds.wordEnd,
				endIndex: oldString.length,
				diffSource: DiffSource.Old,
				modSubtype: DiffType.Removed,
			});
		} else {
			oldMods.push({
				startIndex: oldLastBounds.wordEnd,
				endIndex: oldString.length,
				diffSource: DiffSource.Old,
				modSubtype: DiffType.Modified,
			});
			newMods.push({
				startIndex: newLastBounds.wordEnd,
				endIndex: newString.length,
				diffSource: DiffSource.New,
				modSubtype: DiffType.Modified,
			});
		}
	}

	// Join any modifications to consecutive words.
	const joinedOldMods: ModificationData[] = joinConsecutiveModData(oldMods, oldString, DiffSource.Old);
	const joinedNewMods: ModificationData[] = joinConsecutiveModData(newMods, newString, DiffSource.New);

	// Return the modification data.
	return {
		oldModData: joinedOldMods,
		newModData: joinedNewMods,
	};
}

// Combines any modifications on consecutive words within a string.
function joinConsecutiveModData(mods: ModificationData[], s: string, diffSource: DiffSource): ModificationData[] {
	// init
	if (mods.length <= 1) return mods;
	const joinedMods: ModificationData[] = [];
	let consecutiveCount: number = 1;

	// Iterate over the mod data.
	for (let i = 1; i < mods.length; i++) {
		// gap is the string between the inner boundaries of the mod data being compared.
		const gap: string = s.substring(mods[i - 1].endIndex, mods[i].startIndex);
		// If only spaces lie between the boundaries and the mods share the same subtype, the mods are consecutive.
		let isConsecutive: boolean = gap.trim() === '' && mods[i - 1].modSubtype === mods[i].modSubtype;
		if (isConsecutive) {
			// If the right-hand mod is the last mod, join the consecutive mods including the current mod.
			if (i === mods.length - 1) {
				const joinedStart: number = mods[i - consecutiveCount].startIndex;
				const joinedEnd: number = mods[i].endIndex;

				joinedMods.push({
					startIndex: joinedStart,
					endIndex: joinedEnd,
					diffSource,
					modSubtype: mods[i].modSubtype,
				});
			}
			// Increment the consecutive count.
			consecutiveCount++;
		}
		// If a consecutive streak is broken, join any consecutive mods behind the current mod and reset the consecutive count.
		else {
			const joinedStart: number = mods[i - consecutiveCount].startIndex;
			const joinedEnd: number = mods[i - 1].endIndex;

			joinedMods.push({
				startIndex: joinedStart,
				endIndex: joinedEnd,
				diffSource,
				modSubtype: mods[i - 1].modSubtype,
			});
			consecutiveCount = 1;

			// If the right-hand mod is the last mod, add it since there's no way for it to be consecutive.
			if (i === mods.length - 1) joinedMods.push(mods[i]);
		}
	}

	// Return the joined mods.
	return joinedMods;
}

/*
 * Calculates the likelihood of a diff type by returning a numeric score.
 * Also returns the tentative word indices for the next diff comparison based on diff type.
 */
function calculateDiffScores(
	testType: DiffType,
	oldIdx: number,
	newIdx: number,
	oldEntities: DiffEntity[],
	newEntities: DiffEntity[]
): ScoreData {
	// init
	let score: number = 0;
	let nextOldIdx: number;
	let nextNewIdx: number;
	let oIdxCopy: number;
	let nIdxCopy: number;
	let oldMatchIdx: number;
	let newMatchIdx: number;
	let matchFound: boolean = false;

	// Initialize the new and old word indices based on the diff type being tested.
	if (testType === DiffType.Modified) {
		oIdxCopy = oldIdx + 1;
		nIdxCopy = newIdx + 1;
	}
	if (testType === DiffType.Added) {
		oIdxCopy = oldIdx;
		nIdxCopy = newIdx + 1;
	}
	if (testType === DiffType.Removed) {
		oIdxCopy = oldIdx + 1;
		nIdxCopy = newIdx;
	}

	/*
	 * While there are more nodes in the old and new nodes, iterate through the nodes based on the diff type being tested.
	 * A matching comparison means that the diff type is a plausible explanation for the change.
	 * If such a match occurs, continue by incrementing the old word index along side the new word index.
	 * Count the number of matching nodes after the initial match. The higher the number, the higher the likelihood that this diff type took place.
	 */
	while (nIdxCopy < newEntities.length && oIdxCopy < oldEntities.length) {
		const { isMatch } = isEntityMatch(oldEntities[oIdxCopy], newEntities[nIdxCopy]);
		if (isMatch) {
			score++;
			nextOldIdx = oIdxCopy + 1;
			nextNewIdx = nIdxCopy + 1;
			if (!matchFound) {
				matchFound = true;
				oldMatchIdx = oIdxCopy;
				newMatchIdx = nIdxCopy;
			}
		} else {
			// Set the next comparision indices and stop the tally when a streak of matches is broken.
			if (matchFound) {
				nextOldIdx = oIdxCopy;
				nextNewIdx = nIdxCopy;
				break;
			}
		}

		// Increment the new and old word indices based on the diff type being tested.
		if (testType === DiffType.Modified) {
			nIdxCopy++;
			oIdxCopy++;
		}
		if (testType === DiffType.Added) {
			nIdxCopy++;
			if (matchFound) oIdxCopy++;
		}
		if (testType === DiffType.Removed) {
			oIdxCopy++;
			if (matchFound) nIdxCopy++;
		}
	}

	// Construct and return score.
	const scoreData: ScoreData = { score };
	if (nextOldIdx) scoreData.nextOldIdx = nextOldIdx;
	if (nextNewIdx) scoreData.nextNewIdx = nextNewIdx;
	if (oldMatchIdx) scoreData.oldMatchIdx = oldMatchIdx;
	if (newMatchIdx) scoreData.newMatchIdx = newMatchIdx;

	return scoreData;
}

// Returns the diff type along with the next indices for comparison
function getDiffData(oldIdx: number, newIdx: number, oldEntities: DiffEntity[], newEntities: DiffEntity[]): DiffData {
	// initialize
	const isLastOldEntity: boolean = oldIdx === oldEntities.length - 1;
	const isLastNewEntity: boolean = newIdx === newEntities.length - 1;

	// added vars
	let addedScore: number = 0;
	let nextOldIdxAdded: number;
	let nextNewIdxAdded: number;
	let oldMatchIdxAdded: number;
	let newMatchIdxAdded: number;

	// removed vars
	let removedScore: number = 0;
	let nextOldIdxRemoved: number;
	let nextNewIdxRemoved: number;
	let oldMatchIdxRemoved: number;
	let newMatchIdxRemoved: number;

	// modified vars
	let modifiedScore: number = 0;
	let nextOldIdxModified: number;
	let nextNewIdxModified: number;
	let oldMatchIdxModified: number;
	let newMatchIdxModified: number;

	// If the last nodes of the old and new nodes are being compared, this is a modification
	if (isLastOldEntity && isLastNewEntity) {
		return {
			diffType: DiffType.Modified,
			nextOldIdx: oldIdx + 1,
			nextNewIdx: newIdx + 1,
		};
	}

	// Calculate addition score.
	if (!isLastNewEntity) {
		const addedScoreData: ScoreData = calculateDiffScores(DiffType.Added, oldIdx, newIdx, oldEntities, newEntities);
		addedScore = addedScoreData.score;
		if (addedScoreData.nextOldIdx) nextOldIdxAdded = addedScoreData.nextOldIdx;
		if (addedScoreData.nextNewIdx) nextNewIdxAdded = addedScoreData.nextNewIdx;
		if (addedScoreData.oldMatchIdx) oldMatchIdxAdded = addedScoreData.oldMatchIdx;
		if (addedScoreData.newMatchIdx) newMatchIdxAdded = addedScoreData.newMatchIdx;
	}

	// Calculate removal score.
	if (!isLastOldEntity) {
		const removedScoreData: ScoreData = calculateDiffScores(DiffType.Removed, oldIdx, newIdx, oldEntities, newEntities);
		removedScore = removedScoreData.score;
		if (removedScoreData.nextOldIdx) nextOldIdxRemoved = removedScoreData.nextOldIdx;
		if (removedScoreData.nextNewIdx) nextNewIdxRemoved = removedScoreData.nextNewIdx;
		if (removedScoreData.oldMatchIdx) oldMatchIdxRemoved = removedScoreData.oldMatchIdx;
		if (removedScoreData.newMatchIdx) newMatchIdxRemoved = removedScoreData.newMatchIdx;
	}

	// Calculate score for modification.
	if (!isLastOldEntity && !isLastNewEntity) {
		const modifiedScoreData: ScoreData = calculateDiffScores(DiffType.Modified, oldIdx, newIdx, oldEntities, newEntities);
		modifiedScore = modifiedScoreData.score;
		if (modifiedScoreData.nextOldIdx) nextOldIdxModified = modifiedScoreData.nextOldIdx;
		if (modifiedScoreData.nextNewIdx) nextNewIdxModified = modifiedScoreData.nextNewIdx;
		if (modifiedScoreData.oldMatchIdx) oldMatchIdxModified = modifiedScoreData.oldMatchIdx;
		if (modifiedScoreData.newMatchIdx) newMatchIdxModified = modifiedScoreData.newMatchIdx;
	}

	// If all of the scores are 0, the change is a modification
	const isAllZeroScore: boolean = addedScore === 0 && removedScore === 0 && modifiedScore === 0;
	if (isAllZeroScore) {
		return {
			diffType: DiffType.Modified,
			nextOldIdx: oldIdx + 1,
			nextNewIdx: newIdx + 1,
		};
	}

	// Order the scores in descending order.
	const addedScoreMap: DiffTypeScoreMap = { added: addedScore };
	const removedScoreMap: DiffTypeScoreMap = { removed: removedScore };
	const modifiedScoreMap: DiffTypeScoreMap = { modified: modifiedScore };
	const scores: DiffTypeScoreMap[] = [addedScoreMap, removedScoreMap, modifiedScoreMap];
	const descendingScores: DiffTypeScoreMap[] = scores.sort((prev: DiffTypeScoreMap, next: DiffTypeScoreMap) => {
		const prevVal: number = prev[Object.keys(prev)[0]]; // Object.values(prev)[0];
		const nextVal: number = next[Object.keys(next)[0]]; // Object.values(next)[0];

		if (prevVal > nextVal) {
			return -1;
		}
		if (prevVal < nextVal) {
			return 1;
		}
		if (prevVal === nextVal) {
			return 0;
		}
	});

	// Pick the max score.
	const maxScore: DiffTypeScoreMap = descendingScores[0];
	// Collect any scores tied for first place.
	const tiedScores: DiffTypeScoreMap[] = descendingScores.filter(
		(score: DiffTypeScoreMap) => score[Object.keys(score)[0]] === maxScore[Object.keys(maxScore)[0]]
	); // Object.values(score)[0] === Object.values(maxScore)[0]);

	/*
	 * If multiple diff types are equally likely, then any of them will sufficently explain the changes to the document.
	 * The following arbitrary preference scale guarantees that the selection in this case will be made consistently.
	 */
	if (tiedScores.length > 1) {
		let containsModified: boolean = tiedScores.some((score) => {
			return Object.keys(score)?.some((k) => k === 'modified');
		});
		let containsAdded: boolean = tiedScores.some((score) => {
			return Object.keys(score)?.some((k) => k === 'added');
		});

		if (containsModified) {
			return {
				diffType: DiffType.Modified,
				nextOldIdx: nextOldIdxModified,
				nextNewIdx: nextNewIdxModified,
				oldMatchIdx: oldMatchIdxModified,
				newMatchIdx: newMatchIdxModified,
			};
		} else if (containsAdded) {
			return {
				diffType: DiffType.Added,
				nextOldIdx: nextOldIdxAdded,
				nextNewIdx: nextNewIdxAdded,
				oldMatchIdx: oldMatchIdxAdded,
				newMatchIdx: newMatchIdxAdded,
			};
		}
		// Removed type must be present by process of elimination.
		else {
			return {
				diffType: DiffType.Removed,
				nextOldIdx: nextOldIdxRemoved,
				nextNewIdx: nextNewIdxRemoved,
				oldMatchIdx: oldMatchIdxRemoved,
				newMatchIdx: newMatchIdxRemoved,
			};
		}
	}

	// If there is no tie, return the diff data based on the max score.
	const maxScoreKey: string = Object.keys(maxScore)?.[0];
	if (maxScoreKey === DiffType.Modified) {
		return {
			diffType: DiffType.Modified,
			nextOldIdx: nextOldIdxModified,
			nextNewIdx: nextNewIdxModified,
			oldMatchIdx: oldMatchIdxModified,
			newMatchIdx: newMatchIdxModified,
		};
	}
	if (maxScoreKey === DiffType.Added) {
		return {
			diffType: DiffType.Added,
			nextOldIdx: nextOldIdxAdded,
			nextNewIdx: nextNewIdxAdded,
			oldMatchIdx: oldMatchIdxAdded,
			newMatchIdx: newMatchIdxAdded,
		};
	}
	if (maxScoreKey === DiffType.Removed) {
		return {
			diffType: DiffType.Removed,
			nextOldIdx: nextOldIdxRemoved,
			nextNewIdx: nextNewIdxRemoved,
			oldMatchIdx: oldMatchIdxRemoved,
			newMatchIdx: newMatchIdxRemoved,
		};
	}

	// default
	return {
		diffType: DiffType.Modified,
		nextOldIdx: oldIdx + 1,
		nextNewIdx: newIdx + 1,
	};
}

// Compares two child node arrays and returns a diffed node array
function diffInner(oldNodes?: YeastChild[], newNodes?: YeastChild[], oldPath?: number, newPath?: number): YeastChild[] {
	// init
	let diffNodes: YeastChild[] = [];
	const areNodesEmpty: boolean = (!oldNodes || oldNodes.length === 0) && (!newNodes || newNodes.length === 0);
	const areOldNodesEmpty: boolean = (!oldNodes || oldNodes.length === 0) && newNodes && newNodes.length > 0;
	const areNewNodesEmpty: boolean = (!newNodes || newNodes.length === 0) && oldNodes && oldNodes.length > 0;

	// No children, no diff nodes.
	if (areNodesEmpty) {
		return [];
	}

	// If only new nodes exist, they are additions
	if (areOldNodesEmpty) {
		diffNodes = newNodes.map((node: YeastNode, index: number) => {
			let diffChildren: YeastChild[] = [];
			const diffNode: YeastNode = structuredClone(node);
			diffNode.hasDiff = true;
			diffNode.diffType = DiffType.Added;
			diffNode.newNodePath = (newPath || 0) + index;
			if (node.children && node.children.length > 0) {
				diffChildren = diffInner(undefined, node.children, undefined, diffNode.newNodePath);
				diffNode.children = diffChildren;
			}
			return diffNode;
		});

		return diffNodes;
	}

	// If only old nodes exist, they were removed.
	if (areNewNodesEmpty) {
		diffNodes = oldNodes.map((node: YeastNode, index: number) => {
			let diffChildren: YeastChild[] = [];

			const diffNode: YeastNode = structuredClone(node);
			diffNode.hasDiff = true;
			diffNode.diffType = DiffType.Removed;
			diffNode.oldNodePath = (oldPath || 0) + index;
			if (node.children && node.children.length > 0) {
				diffChildren = diffInner(undefined, node.children, diffNode.oldNodePath, undefined);
				diffNode.children = diffChildren;
			}
			return diffNode;
		});

		return diffNodes;
	}

	let oldIdx: number = 0;
	let newIdx: number = 0;

	// Iterate over the old and new child nodes.
	while (oldIdx < oldNodes.length || newIdx < newNodes.length) {
		// init
		let nextOldIdx: number = oldIdx + 1;
		let nextNewIdx: number = newIdx + 1;
		const oldNode: YeastNode = oldNodes[oldIdx] as YeastNode;
		const newNode: YeastNode = newNodes[newIdx] as YeastNode;
		let updatedChildren: YeastChild[];

		// Recursively call the diff function on the child node's children
		let diffChildren: YeastChild[] = [];
		diffChildren = diffInner(oldNode?.children || [], newNode?.children || [], oldPath, newPath);

		const oldNodeExists: boolean = oldIdx < oldNodes.length;
		const newNodeExists: boolean = newIdx < newNodes.length;

		// If the new node index is out of bounds, the old node and all its successors have been removed.
		if (oldNodeExists && !newNodeExists) {
			updatedChildren = correctDiffChildren(oldNode.children as YeastNode[], DiffType.Removed);

			for (let i = oldIdx; i < oldNodes.length; i++) {
				const diffNode: YeastNode = structuredClone(oldNodes[i]) as YeastNode;
				diffNode.hasDiff = true;
				diffNode.diffType = DiffType.Removed;
				diffNode.oldNodePath = (oldPath || 0) + i;
				diffNode.children = correctDiffChildren((oldNodes[i] as YeastNode).children as YeastNode[], DiffType.Removed);
				diffNodes.push(diffNode);
			}

			break;
		}

		// If the old node index is out of bounds, the new node and all its successors have been added.
		if (!oldNodeExists && newNodeExists) {
			updatedChildren = correctDiffChildren(newNode.children as YeastNode[], DiffType.Added);

			for (let i = newIdx; i < newNodes.length; i++) {
				const diffNode: YeastNode = structuredClone(newNodes[i] as YeastNode);
				diffNode.hasDiff = true;
				diffNode.diffType = DiffType.Added;
				diffNode.newNodePath = (newPath || 0) + i;
				diffNode.children = correctDiffChildren((newNodes[i] as YeastNode).children as YeastNode[], DiffType.Added);
				diffNodes.push(diffNode);
			}

			break;
		}

		/*
		 * If the nodes being compared match, push a diff node showing no changes
		 * Otherwise, determine the diff type, process and push the appropriate diff node
		 */
		const { isMatch, isTextModification = false, textProperties } = isEntityMatch(oldNode, newNode, diffChildren);
		if (isMatch) {
			const diffNode: YeastNode = structuredClone(newNode);
			diffNode.hasDiff = false;
			diffNode.oldNodePath = (oldPath || 0) + oldIdx;
			diffNode.newNodePath = (newPath || 0) + newIdx;
			diffNode.children = diffChildren;

			diffNodes.push(diffNode);
		} else {
			const diffData: DiffData = getDiffData(oldIdx, newIdx, oldNodes as DiffEntity[], newNodes as DiffEntity[]);
			nextOldIdx = diffData.nextOldIdx;
			nextNewIdx = diffData.nextNewIdx;

			/*
			 * If the diff type of a node is Added, then all of its children are Added as well.
			 * Override the child nodes to reflect that.
			 * The same goes for nodes with the Removed diff type.
			 */
			if (diffData.diffType === DiffType.Added) {
				updatedChildren = correctDiffChildren(newNode.children as YeastNode[], DiffType.Added);
				const diffNode: YeastNode = structuredClone(newNode);
				diffNode.diffType = DiffType.Added;
				diffNode.hasDiff = true;
				diffNode.newNodePath = (newPath || 0) + newIdx;
				diffNode.children = updatedChildren;

				diffNodes.push(diffNode);

				if (diffData.newMatchIdx) {
					// add the added nodes to the final diff
					for (let i = newIdx + 1; i <= diffData.newMatchIdx; i++) {
						const addedNode: YeastNode = structuredClone(newNodes[i] as YeastNode);
						if (i === diffData.newMatchIdx) {
							addedNode.hasDiff = false;
							addedNode.oldNodePath = (oldPath || 0) + oldIdx;
							addedNode.newNodePath = (newPath || 0) + i;
						} else {
							addedNode.hasDiff = true;
							addedNode.diffType = DiffType.Added;
							addedNode.newNodePath = (newPath || 0) + i;
						}
						diffNodes.push(addedNode);
					}

					/*
					 * Any nodes between the match index and the next index for comparison are matched nodes with no diff.
					 * Simply set "hasDiff" false and add the nodes to the final diff.
					 */
					if (diffData.newMatchIdx + 1 < nextNewIdx) {
						for (let i = diffData.newMatchIdx + 1; i < nextNewIdx; i++) {
							const matchingNode: YeastNode = structuredClone(newNodes[i] as YeastNode);
							matchingNode.hasDiff = false;
							matchingNode.oldNodePath = (oldPath || 0) + oldIdx;
							matchingNode.newNodePath = (newPath || 0) + i;
							diffNodes.push(matchingNode);
						}
					}
				}
			} else if (diffData.diffType === DiffType.Removed) {
				// Update the child diffs, now with the context of the parent diff (hindsight is 20/20)
				updatedChildren = correctDiffChildren(oldNode.children as YeastNode[], DiffType.Removed);
				const diffNode: YeastNode = structuredClone(oldNode);
				diffNode.diffType = DiffType.Removed;
				diffNode.hasDiff = true;
				diffNode.oldNodePath = (oldPath || 0) + oldIdx;
				diffNode.children = updatedChildren;

				diffNodes.push(diffNode);

				if (diffData.oldMatchIdx) {
					// add the removed nodes to the final diff
					for (let i = oldIdx + 1; i <= diffData.oldMatchIdx; i++) {
						let removedNode: YeastNode;
						if (i === diffData.oldMatchIdx) {
							removedNode = structuredClone(oldNodes[i]) as YeastNode;
							removedNode.hasDiff = false;
							removedNode.oldNodePath = (oldPath || 0) + i;
							removedNode.newNodePath = (newPath || 0) + newIdx;
						} else {
							removedNode = structuredClone(oldNodes[i]) as YeastNode;
							removedNode.hasDiff = true;
							removedNode.diffType = DiffType.Removed;
							removedNode.oldNodePath = (oldPath || 0) + i;
						}
						diffNodes.push(removedNode);
					}

					/*
					 * Any nodes between the match index and the next index for parsing are matched nodes with no diff.
					 * Simply set "hasDiff" false and add the nodes to the final diff.
					 */
					if (diffData.oldMatchIdx + 1 < nextOldIdx) {
						for (let i = diffData.oldMatchIdx + 1; i < nextOldIdx; i++) {
							const matchingNode: YeastNode = structuredClone(oldNodes[i] as YeastNode);
							matchingNode.hasDiff = false;
							matchingNode.oldNodePath = (oldPath || 0) + i;
							matchingNode.newNodePath = (newPath || 0) + newIdx;
							diffNodes.push(matchingNode);
						}
					}
				}
			}
			// Otherwise the diff type is Modified.
			else {
				/*
				 * If the diff type is modified, process the nodes between current comparison and the next match index
				 * This is in contrast to the removed/added case where they are added without processing the children.
				 * It means the nextOldIdx and nextNewIdx values returned from getDiffData will not be used.
				 */
				nextOldIdx = oldIdx + 1;
				nextNewIdx = newIdx + 1;

				updatedChildren = diffChildren;
				let modData: ModificationDiffMap = {};
				let diffPivots: DiffPivotMap = {};

				// If there is modified text in the node, append the text mod data to the diff node.
				if (isTextModification && textProperties) {
					const diffNode: YeastNode = structuredClone(newNode);

					/*
					 * For each modified property on the node, append the new string to the old string and assign it to the same property on the diff node.
					 * This allows the diff display to show only the diff of the property instead having the whole node.
					 * E.g. If a CodeFence title has changed but the inner content is the same, instead of rendering two full CodeFences,
					 * one will be rendered and the title change will be shown inline.
					 */
					textProperties.forEach((prop: string) => {
						const modAssignment: ModificationAssignment = getModificationData(oldNode[prop], newNode[prop]);
						modAssignment.newModData = modAssignment.newModData?.map((md: ModificationData) => {
							const updatedModData = structuredClone(md);
							updatedModData.startIndex = oldNode[prop] ? md.startIndex + oldNode[prop].length + 1 : md.startIndex;
							updatedModData.endIndex = oldNode[prop] ? md.endIndex + oldNode[prop].length + 1 : md.endIndex;

							return updatedModData;
						});
						modData[prop] = modAssignment;
						diffPivots[prop] = oldNode[prop]?.length;
						diffNode[prop] = `${oldNode[prop]} ${newNode[prop]}`;
					});

					// Append diff data.
					diffNode.hasDiff = true;
					diffNode.diffType = DiffType.Modified;
					diffNode.isTextModification = true;
					diffNode.oldNodePath = (oldPath || 0) + oldIdx;
					diffNode.newNodePath = (newPath || 0) + newIdx;
					diffNode.children = updatedChildren;
					diffNode.diffMods = modData;
					diffNode.diffPivots = diffPivots;
					diffNode.containsDiff = containsDiff(diffChildren);

					// Add the diff node.
					diffNodes.push(diffNode);
				}
				// If the node is modified but no text within it is modified, no need to get text mod data.
				else {
					/*
					 * If the modified node contains a text modification in the child nodes, then add the new node and localize the displayed diff to the modified text.
					 * If not, add the old and new nodes in order to display them both as before and after.
					 */
					if (containsDiff(diffChildren) && oldNode.type === newNode.type) {
						const diffNode: YeastNode = structuredClone(newNode);
						diffNode.hasDiff = true;
						diffNode.diffType = DiffType.Modified;
						diffNode.oldNodePath = (oldPath || 0) + oldIdx;
						diffNode.newNodePath = (newPath || 0) + newIdx;
						diffNode.children = updatedChildren;
						diffNode.containsDiff = true;

						diffNodes.push(diffNode);
					} else {
						const oldDiffNode: YeastNode = structuredClone(oldNode);
						oldDiffNode.hasDiff = true;
						oldDiffNode.diffType = DiffType.Modified;
						oldDiffNode.diffSource = DiffSource.Old;
						oldDiffNode.oldNodePath = (oldPath || 0) + oldIdx;
						oldDiffNode.containsDiff = false;

						const newDiffNode: YeastNode = structuredClone(newNode);
						newDiffNode.hasDiff = true;
						newDiffNode.diffType = DiffType.Modified;
						newDiffNode.diffSource = DiffSource.New;
						newDiffNode.newNodePath = (newPath || 0) + newIdx;
						newDiffNode.containsDiff = false;

						diffNodes.push(oldDiffNode);
						diffNodes.push(newDiffNode);
					}
				}
			}
		}

		// Set the next indices.
		oldIdx = nextOldIdx;
		newIdx = nextNewIdx;
	}

	// Return diff nodes.
	return diffNodes;
}

// Returns true if the node contains a text modification via its children.
function containsDiff(children: YeastChild[]): boolean {
	if (!children) return false;

	// If there is some child that is a text modification, the node contains a text modification.
	// Recursively search through each child's children.
	for (const child of children) {
		if (child.isTextModification || child.hasDiff) return true;

		if (isYeastNode(child) && child.children && child.children.length > 0) {
			const childrenContainInnerDiff: boolean = containsDiff(child.children);
			if (childrenContainInnerDiff) return true;
		}
	}

	// If no child has its own children, there can be no text modification contained.
	return false;
}

/*
 * Assigns the correct diff data to child nodes when the parent node is found to be added or removed.
 * The deepest child levels are processed first, unaware of the parent structure, so if, for example, a higher-level node
 * is found to be added, that means all children of that node are added as well, so they must be updated to reflect that.
 */
function correctDiffChildren(children: YeastNode[], diffType: DiffType): YeastNode[] {
	if (!children || children.length === 0) return [];
	return children.map((child: YeastNode) => {
		const updatedChild = structuredClone(child);
		// if (!isYeastTextNode(child)) {
		updatedChild.hasDiff = true;
		updatedChild.diffType = diffType;
		// }
		if (child.diffMods) updatedChild.diffMods = {};
		if (child.diffPivots) updatedChild.diffPivots = {};
		if (child.children) updatedChild.children = correctDiffChildren(child.children as YeastNode[], diffType);
		return updatedChild;
	});
}

// Returns data centered around comparison of old and new entites.
function isEntityMatch(oldEntity: DiffEntity, newEntity: DiffEntity, diffChildren?: YeastChild[]): EntityMatchData {
	// init
	const isString: boolean = typeof oldEntity === 'string' && typeof newEntity === 'string';
	const areBothTextNodes: boolean = isYeastTextNode(oldEntity as YeastChild) && isYeastTextNode(newEntity as YeastChild);
	const isOldTextNodeOnly: boolean = !isYeastTextNode(oldEntity as YeastChild) && isYeastTextNode(newEntity as YeastChild);
	const isNewTextNodeOnly: boolean = isYeastTextNode(oldEntity as YeastChild) && !isYeastTextNode(newEntity as YeastChild);

	// If the entities are strings, just compare the strings.
	if (isString) {
		return { isMatch: oldEntity === newEntity };
	}
	// If both entities are text nodes, compare the text properties.
	if (areBothTextNodes) {
		const isMatch: boolean = (oldEntity as YeastText).text === (newEntity as YeastText).text;
		if (!isMatch) {
			return {
				isMatch,
				isTextModification: true,
				textProperties: ['text'],
			};
		}
		return { isMatch: (oldEntity as YeastText).text === (newEntity as YeastText).text };
	}
	// If only one entity is a text node, the entities don't match
	if (isOldTextNodeOnly || isNewTextNodeOnly) {
		return { isMatch: false };
	}
	// Otherwise the entities are of type YeastNode, so compare the nodes.
	const children: YeastChild[] = diffChildren || diffInner((oldEntity as YeastNode).children, (newEntity as YeastNode).children);
	return isNodeMatch(oldEntity as YeastNode, newEntity as YeastNode, children);
}

// Returns data centered around comparison of old and new nodes.
function isNodeMatch(oldNode: YeastNode, newNode: YeastNode, diffChildren: YeastChild[]): EntityMatchData {
	// init
	let isMatch: boolean = true;
	let isTextModification: boolean = false;
	let textProperties: string[] = [];

	const hasTypeChange: boolean = oldNode.type !== newNode.type;
	const hasChildDiff: boolean = diffChildren?.some((child: YeastNode) => child.hasDiff === true);
	const hasDiffNumChildren: boolean = oldNode.children?.length !== newNode.children?.length;

	// If node type or children have changed there is a mismatch.
	if (hasTypeChange || hasChildDiff || hasDiffNumChildren) isMatch = false;

	// Callout nodes have additional properties to check for text changes.
	const areBothDocuments: boolean = oldNode.type === YeastBlockNodeTypes.Document && newNode.type === YeastBlockNodeTypes.Document;
	if (areBothDocuments) {
		const oldDoc: DocumentNode = oldNode as DocumentNode;
		const newDoc: DocumentNode = newNode as DocumentNode;

		const bothTitlesExist: boolean = !!oldDoc.title && !!newDoc.title;
		const oneTitleExists: boolean = (!oldDoc.title && !!newDoc.title) || (!!oldDoc.title && !newDoc.title);
		let doTitlesMatch: boolean = true;
		if (bothTitlesExist && oldDoc.title !== newDoc.title) {
			doTitlesMatch = false;
			isTextModification = true;
			textProperties.push('title');
		}
		if (oneTitleExists) {
			doTitlesMatch = false;
		}

		const bothAuthorsExist: boolean = !!oldDoc.title && !!newDoc.title;
		const oneAuthorExists: boolean = (!oldDoc.title && !!newDoc.title) || (!!oldDoc.title && !newDoc.title);
		let doAuthorsMatch: boolean = true;
		if (bothAuthorsExist && oldDoc.author !== newDoc.author) {
			doAuthorsMatch = false;
			isTextModification = true;
			textProperties.push('author');
		}
		if (oneAuthorExists) {
			doAuthorsMatch = false;
		}

		if (!doTitlesMatch || !doAuthorsMatch) isMatch = false;
	}

	// Image nodes have additional properties to check for text changes.
	const areBothImages: boolean = oldNode.type === YeastInlineNodeTypes.Image && newNode.type === YeastInlineNodeTypes.Image;
	if (areBothImages) {
		const oldImage: ImageNode = oldNode as ImageNode;
		const newImage: ImageNode = newNode as ImageNode;

		const bothTitlesExist: boolean = !!oldImage.title && !!newImage.title;
		const oneTitleExists: boolean = (!oldImage.title && !!newImage.title) || (!!oldImage.title && !newImage.title);
		let doTitlesMatch: boolean = true;
		if (bothTitlesExist && oldImage.title !== newImage.title) {
			doTitlesMatch = false;
			isTextModification = true;
			textProperties.push('title');
		}
		if (oneTitleExists) {
			doTitlesMatch = false;
		}

		const bothAltExist: boolean = !!oldImage.alt && !!newImage.alt;
		const oneAltExists: boolean = (!oldImage.alt && !!newImage.alt) || (!!oldImage.alt && !newImage.alt);
		let doAltMatch: boolean = true;
		if (bothAltExist && oldImage.alt !== newImage.alt) {
			doAltMatch = false;
			isTextModification = true;
			textProperties.push('alt');
		}
		if (oneAltExists) {
			doAltMatch = false;
		}

		const bothSrcExist: boolean = !!oldImage.src && !!newImage.src;
		const oneSrcExists: boolean = (!oldImage.src && !!newImage.src) || (!!oldImage.src && !newImage.src);
		let doSrcMatch: boolean = true;
		if (bothSrcExist && oldImage.src !== newImage.src) {
			doSrcMatch = false;
			isTextModification = true;
			textProperties.push('src');
		}
		if (oneSrcExists) {
			doSrcMatch = false;
		}

		if (!doTitlesMatch || !doAltMatch || !doSrcMatch) isMatch = false;
	}

	// Code blocks have additional properties to check for text changes.
	const areBothCodeBlocks: boolean = oldNode.type === YeastBlockNodeTypes.Code && newNode.type === YeastBlockNodeTypes.Code;
	if (areBothCodeBlocks) {
		const oldCode: BlockCodeNode = oldNode as BlockCodeNode;
		const newCode: BlockCodeNode = newNode as BlockCodeNode;

		const bothTitlesExist: boolean = !!oldCode.title && !!newCode.title;
		const oneTitleExists: boolean = (!oldCode.title && !!newCode.title) || (!!oldCode.title && !newCode.title);
		let doTitlesMatch: boolean = true;
		if (bothTitlesExist && oldCode.title !== newCode.title) {
			doTitlesMatch = false;
			isTextModification = true;
			textProperties.push('title');
		}
		if (oneTitleExists) {
			doTitlesMatch = false;
		}

		if (!doTitlesMatch) isMatch = false;
		if (oldCode.value !== newCode.value) {
			isTextModification = true;
			textProperties.push('value');
			isMatch = false;
		}
	}

	// Callout nodes have additional properties to check for text changes.
	const areBothCalloutNodes: boolean = oldNode.type === YeastBlockNodeTypes.Callout && newNode.type === YeastBlockNodeTypes.Callout;
	if (areBothCalloutNodes) {
		const oldCallout: CalloutNode = oldNode as CalloutNode;
		const newCallout: CalloutNode = newNode as CalloutNode;

		const bothTitlesExist: boolean = !!oldCallout.title && !!newCallout.title;
		const oneTitleExists: boolean = (!oldCallout.title && !!newCallout.title) || (!!oldCallout.title && !newCallout.title);
		let doTitlesMatch: boolean = true;
		if (bothTitlesExist && oldCallout.title !== newCallout.title) {
			doTitlesMatch = false;
			isTextModification = true;
			textProperties.push('title');
		}
		if (oneTitleExists) {
			doTitlesMatch = false;
		}

		if (!doTitlesMatch) isMatch = false;
	}

	// Content group itmes have additional properties to check for text changes.
	const areBothContentGroupItem: boolean =
		oldNode.type === YeastBlockNodeTypes.ContentGroupItem && newNode.type === YeastBlockNodeTypes.ContentGroupItem;
	if (areBothContentGroupItem) {
		const oldContentGroupItem: ContentGroupItemNode = oldNode as ContentGroupItemNode;
		const newContentGroupItem: ContentGroupItemNode = newNode as ContentGroupItemNode;

		const bothTitlesExist: boolean = !!oldContentGroupItem.title && !!newContentGroupItem.title;
		const oneTitleExists: boolean =
			(!oldContentGroupItem.title && !!newContentGroupItem.title) || (!!oldContentGroupItem.title && !newContentGroupItem.title);
		let doTitlesMatch: boolean = true;
		if (bothTitlesExist && oldContentGroupItem.title !== newContentGroupItem.title) {
			doTitlesMatch = false;
			isTextModification = true;
			textProperties.push('title');
		}
		if (oneTitleExists) {
			doTitlesMatch = false;
		}

		if (!doTitlesMatch) isMatch = false;
	}

	// Fill out entity match data.
	const entityMatchData: EntityMatchData = { isMatch, isTextModification };
	if (textProperties.length > 0) entityMatchData.textProperties = textProperties;

	// Return entity match data.
	return entityMatchData;
}

// Entry point upstream of the diff function.  Takes two document nodes for comparison.
export function diff(oldNode: DocumentNode | undefined, newNode: DocumentNode | undefined): DocumentNode | undefined {
	if (oldNode === undefined && newNode === undefined) {
		return undefined;
	}
	if (oldNode === undefined) {
		const diffNode: DocumentNode = structuredClone(newNode);
		diffNode.hasDiff = true;
		diffNode.diffType = DiffType.Added;
		diffNode.newNodePath = 0;
		return diffNode;
	}
	if (newNode === undefined) {
		const diffNode: DocumentNode = structuredClone(oldNode);
		diffNode.hasDiff = true;
		diffNode.diffType = DiffType.Removed;
		diffNode.oldNodePath = 0;
		return diffNode;
	}

	const diffNode: DocumentNode = structuredClone(newNode);

	const { isMatch, isTextModification = false, textProperties }: EntityMatchData = isNodeMatch(oldNode, newNode, []);
	if (!isMatch) {
		diffNode.hasDiff = true;
		diffNode.diffType = DiffType.Modified;
		diffNode.oldNodePath = 0;
		diffNode.newNodePath = 0;

		if (isTextModification && textProperties) {
			const diffMods: ModificationDiffMap = {};
			let diffPivots: DiffPivotMap = {};

			textProperties.forEach((prop: string) => {
				const modAssignment: ModificationAssignment = getModificationData(oldNode[prop], newNode[prop]);
				diffMods[prop] = modAssignment;
			});
			diffNode.diffMods = diffMods;

			textProperties.forEach((prop: string) => {
				const modAssignment: ModificationAssignment = getModificationData(oldNode[prop], newNode[prop]);
				modAssignment.newModData = modAssignment.newModData?.map((md: ModificationData) => {
					const updatedModData = structuredClone(md);
					updatedModData.startIndex = oldNode[prop] ? md.startIndex + oldNode[prop].length + 1 : md.startIndex;
					updatedModData.endIndex = oldNode[prop] ? md.endIndex + oldNode[prop].length + 1 : md.endIndex;

					return updatedModData;
				});
				diffMods[prop] = modAssignment;
				diffPivots[prop] = oldNode[prop]?.length;
				diffNode[prop] = `${oldNode[prop]} ${newNode[prop]}`;
			});

			// Append diff data.
			diffNode.hasDiff = true;
			diffNode.isTextModification = true;
			diffNode.diffType = DiffType.Modified;
			diffNode.diffMods = diffMods;
			diffNode.diffPivots = diffPivots;
		}
	} else {
		// No diff - both paths are the same
		diffNode.oldNodePath = 0;
		diffNode.newNodePath = 0;
	}

	const diffChildren: YeastChild[] = diffInner(oldNode.children, newNode.children, 0, 0);
	diffNode.children = diffChildren as YeastNode[];

	return diffNode;
}
