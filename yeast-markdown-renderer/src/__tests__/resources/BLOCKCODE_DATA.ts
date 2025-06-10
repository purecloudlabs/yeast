export const BLOCKCODE_DATA = {
	type: 'document',
	title: 'Testing indentation in block code node',
	author: 'yuri.yetina',
	children: [
        {
            type: "code",
            children: [],
            value: "val chatController = ChatController.Builder(context)\n                                                    .build(messengerAccount, ChatLoadedListener)",
            language: "",
            indentation: 0
        }
    ],
};