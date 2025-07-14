import { DocumentNode, YeastNode } from 'yeast-core';

export default {
	type: 'document',
	title: "A page's title",
	className: 'main--container',
	children: [
        {
            type: "image",
            src: "./images/toaster-home-screen-launcher-on.png 28e265b5-0373-4587-91ed-d2091b3c37ee",
            alt: "Toaster in Home screen with Launcher, Conversation and Knowledge plugins enabled",
            title: "Toaster in Home screen with Launcher, Conversation and Knowledge plugins enabled",
            children: [
                {
                    text: "",
                    hasDiff: false,
                    children: []
                }
            ],
            hasDiff: true,
            diffType: "modified",
            isTextModification: true,
            diffMods: {
                src: {
                    oldModData: [
                        {
                            startIndex: 0,
                            endIndex: 44,
                            diffSource: "old",
                            modSubtype: "modified"
                        }
                    ],
                    newModData: [
                        {
                            startIndex: 45,
                            endIndex: 81,
                            diffSource: "new",
                            modSubtype: "modified"
                        }
                    ]
                }
            },
            diffPivots: {
                src: 44
            },
            containsDiff: false
        } as YeastNode
	],
	author: 'yuri.yeti',
	customDataOne: 'The first value',
} as DocumentNode;
