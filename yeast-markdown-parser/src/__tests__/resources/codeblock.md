```json
{
	"results": [
		{
			"group": {
				"userId": "87654321-1111-2222-3333-444444444444"
			},
			"data": [
				{
					"interval": "2021-01-03T10:00:00.000Z/2021-01-03T11:00:00.000Z",
					"metrics": [
						{
							"metric": "nNextContactAvoided",
							"stats": {
								"count": 4
							}
						}
					]
				}
			]
		},
		{
			"group": {
				"userId": "00112233-1111-2222-3333-444444444444"
			},
			"data": [
				{
					"interval": "2021-01-03T12:00:00.000Z/2021-01-03T13:00:00.000Z",
					"metrics": [
						{
							"metric": "nNextContactAvoided",
							"stats": {
								"count": 14
							}
						}
					]
				}
			]
		}
	]
}
```

```{"title":"Response","language":"json"}
{
  "state": "FULFILLED",
  "expirationDate": "2019-08-01T00:00:00.000Z",
  "submissionDate": "2019-07-01T15:25:33.344Z",
  "completionDate": "2019-07-01T15:26:08.209Z"
}
```

````{"language":""}
// literal code block example by adding an extra backtick to the surrounding top and bottom code block
```
// Code goes here
String str = "my string";
```
````

```{"language":""}
// next block after the literal example still gets parsed correctly
String str = "my string";
```

```{"language":""}
\```java
// literal code block example can also be done by escaping the literal backticks with a backslash
String str = "my string";
\```
```

```{"language":"java"}
// next block after the literal example still gets parsed correctly
String str = "my string";
```

````{"language":""}
```{ "title": "JavaScript", "language": "javascript"}
````

```{"language":"nohighlight","noCollapse":true}
let thisCode = "not highlighted";

## Markdown just displays unrendered

* No
* Lists

or `inline` code
```
