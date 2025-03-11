export const LIST_MARKDOWN = `* asterisk list 1
* more asterisk 2
  * two spaces in - 2.1
	* one tab in - 2.2
    - mixing in a hyphen 2.2.1
* Root level back to asterisk 3

* Skipped a single line 4
    * skipped an indentation level 4.1.1


    * Indented two levels and skipped two lines - this is a new list with indentation
* Drop back to root level, same list


90. Ordered list
91. Second item
93. Third item


1. this
1. is
1. what
	1. nested
	1. lists
		1. look
		1. like


- Next list with hyphens 1
  - hyphen 1.1
- hyphen 2


1. Now let's do a numbered list 1
  1. Indented one level 1.1
    1. 1.1.1 (3)
      1. 1.1.1.1 (4)
        1. 1.1.1.1.1 (5)
          1. 1.1.1.1.1.1 (6)
            1. 1.1.1.1.1.1.1 (7)
              1. 1.1.1.1.1.1.1.1 (8)
                1. 1.1.1.1.1.1.1.1.1 (9)
                  1. 1.1.1.1.1.1.1.1.1.1 (10)
2. drop back to root 2
  2. indented with a 7 - 2.1


3. Another UL, but start at 6
4. asdf 7


      1. Indented 3 levels and starting at 3
        1. 3.1

*THIS* is italic text


**THIS** is bold text

Your scientists were so preoccupied with whether or not you could...

- <dxui:OpenAPIExplorer verb="GET" path="/api/v2/telephony/providers/edges/phonebasesettings/availablemetabases" />
- <dxui:OpenAPIExplorer verb="GET" path="/api/v2/telephony/providers/edges/phonebasesettings" />
- <dxui:OpenAPIExplorer verb="GET" path="/api/v2/telephony/providers/edges/phonebasesettings/{phoneBaseId}" />

...they didn't stop to think if they should.
`;

export const LIST_AST = {
	type: 'document',
	title: 'Default Page Title',
	children: [
		{
			type: 'list',
			children: [
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'asterisk list 1',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'more asterisk 2',
						},
					],
				},
				{
					type: 'list',
					children: [
						{
							type: 'listitem',
							level: 1,
							children: [
								{
									text: 'two spaces in - 2.1',
								},
							],
						},
						{
							type: 'listitem',
							level: 1,
							children: [
								{
									text: 'one tab in - 2.2',
								},
							],
						},
						{
							type: 'list',
							children: [
								{
									type: 'listitem',
									level: 2,
									children: [
										{
											text: 'mixing in a hyphen 2.2.1',
										},
									],
								},
							],
							ordered: false,
							level: 2,
						},
					],
					ordered: false,
					level: 1,
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Root level back to asterisk 3',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Skipped a single line 4',
						},
					],
				},
				{
					type: 'list',
					children: [
						{
							type: 'list',
							children: [
								{
									type: 'listitem',
									level: 2,
									children: [
										{
											text: 'skipped an indentation level 4.1.1',
										},
									],
								},
							],
							ordered: false,
							level: 2,
						},
					],
					ordered: false,
					level: 1,
				},
			],
			ordered: false,
			level: 0,
		},
		{
			type: 'list',
			children: [
				{
					type: 'list',
					children: [
						{
							type: 'list',
							children: [
								{
									type: 'listitem',
									level: 2,
									children: [
										{
											text: 'Indented two levels and skipped two lines - this is a new list with indentation',
										},
									],
								},
							],
							ordered: false,
							level: 2,
						},
					],
					ordered: false,
					level: 1,
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Drop back to root level, same list',
						},
					],
				},
			],
			ordered: false,
			level: 0,
		},
		{
			type: 'list',
			children: [
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Ordered list',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Second item',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Third item',
						},
					],
				},
			],
			ordered: true,
			level: 0,
			start: 90,
		},
		{
			type: 'list',
			children: [
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'this',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'is',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'what',
						},
					],
				},
				{
					type: 'list',
					children: [
						{
							type: 'listitem',
							level: 1,
							children: [
								{
									text: 'nested',
								},
							],
						},
						{
							type: 'listitem',
							level: 1,
							children: [
								{
									text: 'lists',
								},
							],
						},
						{
							type: 'list',
							children: [
								{
									type: 'listitem',
									level: 2,
									children: [
										{
											text: 'look',
										},
									],
								},
								{
									type: 'listitem',
									level: 2,
									children: [
										{
											text: 'like',
										},
									],
								},
							],
							ordered: true,
							level: 2,
						},
					],
					ordered: true,
					level: 1,
				},
			],
			ordered: true,
			level: 0,
			start: 1,
		},
		{
			type: 'list',
			children: [
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Next list with hyphens 1',
						},
					],
				},
				{
					type: 'list',
					children: [
						{
							type: 'listitem',
							level: 1,
							children: [
								{
									text: 'hyphen 1.1',
								},
							],
						},
					],
					ordered: false,
					level: 1,
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'hyphen 2',
						},
					],
				},
			],
			ordered: false,
			level: 0,
		},
		{
			type: 'list',
			children: [
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: "Now let's do a numbered list 1",
						},
					],
				},
				{
					type: 'list',
					children: [
						{
							type: 'listitem',
							level: 1,
							children: [
								{
									text: 'Indented one level 1.1',
								},
							],
						},
						{
							type: 'list',
							children: [
								{
									type: 'listitem',
									level: 2,
									children: [
										{
											text: '1.1.1 (3)',
										},
									],
								},
								{
									type: 'list',
									children: [
										{
											type: 'listitem',
											level: 3,
											children: [
												{
													text: '1.1.1.1 (4)',
												},
											],
										},
										{
											type: 'list',
											children: [
												{
													type: 'listitem',
													level: 4,
													children: [
														{
															text: '1.1.1.1.1 (5)',
														},
													],
												},
												{
													type: 'list',
													children: [
														{
															type: 'listitem',
															level: 5,
															children: [
																{
																	text: '1.1.1.1.1.1 (6)',
																},
															],
														},
														{
															type: 'list',
															children: [
																{
																	type: 'listitem',
																	level: 6,
																	children: [
																		{
																			text: '1.1.1.1.1.1.1 (7)',
																		},
																	],
																},
																{
																	type: 'list',
																	children: [
																		{
																			type: 'listitem',
																			level: 7,
																			children: [
																				{
																					text: '1.1.1.1.1.1.1.1 (8)',
																				},
																			],
																		},
																		{
																			type: 'list',
																			children: [
																				{
																					type: 'listitem',
																					level: 8,
																					children: [
																						{
																							text: '1.1.1.1.1.1.1.1.1 (9)',
																						},
																					],
																				},
																				{
																					type: 'list',
																					children: [
																						{
																							type: 'listitem',
																							level: 9,
																							children: [
																								{
																									text: '1.1.1.1.1.1.1.1.1.1 (10)',
																								},
																							],
																						},
																					],
																					ordered: true,
																					level: 9,
																				},
																			],
																			ordered: true,
																			level: 8,
																		},
																	],
																	ordered: true,
																	level: 7,
																},
															],
															ordered: true,
															level: 6,
														},
													],
													ordered: true,
													level: 5,
												},
											],
											ordered: true,
											level: 4,
										},
									],
									ordered: true,
									level: 3,
								},
							],
							ordered: true,
							level: 2,
						},
					],
					ordered: true,
					level: 1,
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'drop back to root 2',
						},
					],
				},
				{
					type: 'list',
					children: [
						{
							type: 'listitem',
							level: 1,
							children: [
								{
									text: 'indented with a 7 - 2.1',
								},
							],
						},
					],
					ordered: true,
					level: 1,
				},
			],
			ordered: true,
			level: 0,
			start: 1,
		},
		{
			type: 'list',
			children: [
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'Another UL, but start at 6',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							text: 'asdf 7',
						},
					],
				},
			],
			ordered: true,
			level: 0,
			start: 3,
		},
		{
			type: 'list',
			children: [
				{
					type: 'list',
					children: [
						{
							type: 'list',
							children: [
								{
									type: 'list',
									children: [
										{
											type: 'listitem',
											level: 3,
											children: [
												{
													text: 'Indented 3 levels and starting at 3',
												},
											],
										},
										{
											type: 'list',
											children: [
												{
													type: 'listitem',
													level: 4,
													children: [
														{
															text: '3.1',
														},
													],
												},
											],
											ordered: true,
											level: 4,
										},
									],
									ordered: true,
									level: 3,
								},
							],
							ordered: true,
							level: 2,
						},
					],
					ordered: true,
					level: 1,
				},
			],
			ordered: true,
			level: 0,
			start: 1,
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'italic',
					children: [
						{
							text: 'THIS',
						},
					],
				},
				{
					text: ' is italic text',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'bold',
					children: [
						{
							text: 'THIS',
						},
					],
				},
				{
					text: ' is bold text',
				},
			],
			indentation: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					text: 'Your scientists were so preoccupied with whether or not you could...',
				},
			],
			indentation: 0,
		},
		{
			type: 'list',
			children: [
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							verb: 'GET',
							path: '/api/v2/telephony/providers/edges/phonebasesettings/availablemetabases',
							type: 'OpenAPIExplorer',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							verb: 'GET',
							path: '/api/v2/telephony/providers/edges/phonebasesettings',
							type: 'OpenAPIExplorer',
						},
					],
				},
				{
					type: 'listitem',
					level: 0,
					children: [
						{
							verb: 'GET',
							path: '/api/v2/telephony/providers/edges/phonebasesettings/{phoneBaseId}',
							type: 'OpenAPIExplorer',
						},
					],
				},
			],
			ordered: false,
			level: 0,
		},
		{
			type: 'paragraph',
			children: [
				{
					text: "...they didn't stop to think if they should.",
				},
			],
			indentation: 0,
		},
	],
};
