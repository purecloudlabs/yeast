export const TABLE_AST = {
	type: 'document',
	title: 'Default Page Title',
	children: [
		{
			type: 'table',
			children: [
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Syntax',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Description',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
					header: true,
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Header',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Title',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Paragraph',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'bold',
									children: [
										{
											type: 'paragraph',
											children: [
												{
													text: 'bold text',
												},
											],
											indentation: 0,
										},
									],
								},
							],
							align: 'left',
						},
					],
				},
			],
			indentation: 0,
			align: 'L|L',
		},
		{
			type: 'table',
			children: [
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Left Aligned',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Centered',
										},
									],
									indentation: 0,
								},
							],
							align: 'center',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Right Aligned',
										},
									],
									indentation: 0,
								},
							],
							align: 'right',
						},
					],
					header: true,
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Left 1',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Center 1',
										},
									],
									indentation: 0,
								},
							],
							align: 'center',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Right 1',
										},
									],
									indentation: 0,
								},
							],
							align: 'right',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Left 2 looooong text',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Center 2 looooong text',
										},
									],
									indentation: 0,
								},
							],
							align: 'center',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Right 2 looooong text',
										},
									],
									indentation: 0,
								},
							],
							align: 'right',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Left 3',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Center 3',
										},
									],
									indentation: 0,
								},
							],
							align: 'center',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Right 3',
										},
									],
									indentation: 0,
								},
							],
							align: 'right',
						},
					],
				},
			],
			indentation: 0,
			align: 'L|C|R',
			sortable: true,
		},
		{
			type: 'table',
			children: [
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Foo',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Bar',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
					header: true,
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'aaaaaa',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'aaaaa',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'bbbbbb',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'bold',
											children: [
												{
													text: 'bbbbb',
												},
											],
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
			],
			indentation: 0,
			align: 'L|L',
			filterable: true,
			sortable: true,
		},
		{
			type: 'table',
			children: [
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'center 1',
										},
									],
									indentation: 0,
								},
							],
							align: 'center',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'right 2',
										},
									],
									indentation: 0,
								},
							],
							align: 'right',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'center 3',
										},
									],
									indentation: 0,
								},
							],
							align: 'center',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'right 4',
										},
									],
									indentation: 0,
								},
							],
							align: 'right',
						},
					],
				},
			],
			indentation: 0,
			align: 'C|R',
		},
		{
			type: 'table',
			children: [
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'stuff 1',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'stuff 2',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'stuff 3',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'stuff 4',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
			],
			indentation: 0,
		},
		{
			type: 'table',
			children: [
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Feature',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Syntax',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
					header: true,
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Inline code',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'inlinecode',
											children: [
												{
													text: 'var x = 2',
												},
											],
										},
										{
											text: ' or ',
										},
										{
											type: 'inlinecode',
											children: [
												{
													text: 'func helloWorld(`Hi`)',
												},
											],
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Link',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'link',
											children: [
												{
													text: 'Genesys',
												},
											],
											href: 'https://genesys.com',
											title: 'Link',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Strikethrough',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'strikethrough',
											children: [
												{
													text: '~Some Text',
												},
											],
										},
										{
											text: '~',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Italic',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'italic',
											children: [
												{
													text: 'Do you know who I am?',
												},
											],
										},
										{
											text: ' or ',
										},
										{
											type: 'italic',
											children: [
												{
													text: 'DO YOU KNOW WHO I AM?',
												},
											],
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Bold',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'bold',
											children: [
												{
													text: 'I AM THE JUGGERNAUT!',
												},
											],
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Image',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'image',
											src: 'https://cats.com',
											alt: 'Cuteness overload',
											title: 'Cat pic',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'Escaped Pipes',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'The pipe character: | -- like a|b|c',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'escaped other things',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'bold',
											children: [
												{
													text: 'some_function_name',
												},
											],
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
				{
					type: 'tablerow',
					children: [
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: 'failed attempt at table nesting injection',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
						{
							type: 'tablecell',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											text: '| table? | what |',
										},
									],
									indentation: 0,
								},
							],
							align: 'left',
						},
					],
				},
			],
			indentation: 0,
			align: 'L|L',
		},
	],
};
