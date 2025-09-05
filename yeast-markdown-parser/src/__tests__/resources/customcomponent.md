<yeast:link href="/path/to/page" title="Opens the Display Text page" forceNewTab="false"> <yeast:strikethrough>link</yeast:strikethrough> </yeast:link>

<yeast:table align="L|C|R" sortable="true" filterable="true">
<yeast:tablerow header="true">
<yeast:tablecell>1</yeast:tablecell>  
 <yeast:tablecell>true</yeast:tablecell>
<yeast:tablecell>3.0</yeast:tablecell>
</yeast:tablerow>
<yeast:tablerow>
<yeast:tablecell>4</yeast:tablecell>  
 <yeast:tablecell>5</yeast:tablecell>
<yeast:tablecell ><yeast:bold>6</yeast:bold></yeast:tablecell>
</yeast:tablerow>
<yeast:tablerow>
<yeast:tablecell>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eu eros viverra, vulputate lorem vitae, rutrum turpis. Sed pulvinar tortor lectus. Mauris viverra enim ac feugiat scelerisque. Vivamus quis est in tortor tempus molestie vitae nec velit. Morbi eget lobortis velit. Maecenas sollicitudin dictum imperdiet.
</yeast:tablecell>
<yeast:tablecell>Quisque elementum neque id quam sodale faucibus.</yeast:tablecell>  
 <yeast:tablecell>Morbi id laoreet tellus, sit amet condimentum ante. Sed et venenatis sapien.</yeast:tablecell>
 <yeast:tablecell>
       <yeast:paragraph indentation="0">
        birb 
        <yeast:inlinecode>is the</yeast:inlinecode>
         word
      </yeast:paragraph>
 </yeast:tablecell>
</yeast:tablerow>
</yeast:table>

Nam vitae mollis lorem. Vivamus nec arcu in nunc rutrum malesuada aliquet quis purus. Phasellus porttitor sapien nec enim gravida porta. Quisque ullamcorper orci et ultrices laoreet. Fusce vitae maximus lectus, eu convallis ante. Pellentesque vel velit nunc. Quisque sit amet magna at leo sagittis ultrices id ac eros. Ut auctor sem quam, in facilisis erat fringilla id. Fusce faucibus at nibh ut ornare. Quisque elementum neque id quam sodales faucibus. Sed molestie id nulla ac porta. Vestibulum sit amet augue eu tellus finibus ornare. Morbi id laoreet tellus, sit amet condimentum ante. Sed et venenatis sapien.

<yeast:horizontalRule />

<yeast:bold>bold text</yeast:bold>

<yeast:image src="/path/to/source" title="Cool image" alt="image"></yeast:image>

<dxui:OpenAPIExplorer verb="post" path="/api/v2/analytics/conversations/aggregates/query" />

<dxui:QuickHit id="quick-hit-use" title="Use a Quick Hit in a page" />

<yeast:code value="{
  &quot;botId&quot;: &quot;11095674-46cc-4a87-b0bb-385b317ad000&quot;,
  &quot;botVersion&quot;: &quot;Delta&quot;,
  &quot;botSessionId&quot;: &quot;462064bd-820f-4806-a04b-8bdc915dba3e&quot;,
  &quot;botState&quot;: &quot;Complete&quot;,
  &quot;languageCode&quot;: &quot;en-us&quot;,
  &quot;intent&quot; : &quot;orderCookie&quot;,
  &quot;confidence&quot; : 0.5,
  &quot;replyMessages&quot;:
  [
    {
      &quot;type&quot;:&quot;Text&quot;,
      &quot;text&quot;:&quot;your cookie is ordered&quot;
    },
    {
      &quot;type&quot;:&quot;Structured&quot;,
      &quot;text&quot;: &quot;What would you like to do?&quot;,
      &quot;content&quot; : [
        {
          &quot;contentType&quot;: &quot;QuickReply&quot;,
          &quot;quickReply&quot;: {
            &quot;text&quot;:&quot;I want a cookie&quot;,
            &quot;payload&quot;: &quot;cookie&quot;
          }
        }
      ]
    }
  ],

  
  &quot;entities&quot;: [
    {
      &quot;name&quot;: &quot;ProductName&quot;,
      &quot;type&quot;: &quot;String&quot;,
      &quot;value&quot;: &quot;Chocolate Chip Cookie&quot;
    },
    {
      &quot;name&quot;: &quot;Size&quot;,
      &quot;type&quot;: &quot;Integer&quot;,
      &quot;value&quot;: &quot;12&quot;
    },
    {
      &quot;name&quot;: &quot;Weight&quot;,
      &quot;type&quot;: &quot;Decimal&quot;,
      &quot;value&quot;: &quot;85.6&quot;
    },
    {
      &quot;name&quot;: &quot;ConsumeBefore&quot;,
      &quot;type&quot;: &quot;Duration&quot;,
      &quot;value&quot;: &quot;P30D&quot;
    },
    {
      &quot;name&quot;: &quot;Diet&quot;,
      &quot;type&quot;: &quot;Boolean&quot;,
      &quot;value&quot;: &quot;false&quot;
    },
    {
      &quot;name&quot;: &quot;CurrentPrice&quot;,
      &quot;type&quot;: &quot;Currency&quot;,
      &quot;value&quot;: &quot;{\&quot;amount\&quot;: 3.49, \&quot;code\&quot;: \&quot;USD\&quot;}&quot;
    },
    {
      &quot;name&quot;: &quot;ExpiryDate&quot;,
      &quot;type&quot;: &quot;Datetime&quot;,
      &quot;value&quot;: &quot;2024-03-15T23:59:59.000Z&quot;
    },
    {
      &quot;name&quot;: &quot;Ingredients&quot;,
      &quot;type&quot;: &quot;StringCollection&quot;,
      &quot;values&quot;: [&quot;flour&quot;, &quot;sugar&quot;, &quot;butter&quot;, &quot;chocolate chips&quot;, &quot;eggs&quot;]
    },
    {
      &quot;name&quot;: &quot;Presentations&quot;,
      &quot;type&quot;: &quot;IntegerCollection&quot;,
      &quot;values&quot;: [&quot;6&quot;, &quot;12&quot;, &quot;24&quot;]
    },
    {
      &quot;name&quot;: &quot;AvailableWeights&quot;,
      &quot;type&quot;: &quot;DecimalCollection&quot;,
      &quot;values&quot;: [&quot;50.0&quot;, &quot;85.5&quot;, &quot;100.0&quot;]
    },
    {
      &quot;name&quot;: &quot;ShelLifeOptions&quot;,
      &quot;type&quot;: &quot;DurationCollection&quot;,
      &quot;values&quot;: [&quot;P15D&quot;, &quot;P30D&quot;, &quot;P45D&quot;]
    },
    {
      &quot;name&quot;: &quot;ProductAttributes&quot;,
      &quot;type&quot;: &quot;BooleanCollection&quot;,
      &quot;values&quot;: [&quot;true&quot;, &quot;false&quot;, &quot;true&quot;]
    },
    {
      &quot;name&quot;: &quot;previousPrices&quot;,
      &quot;type&quot;: &quot;CurrencyCollection&quot;,
      &quot;values&quot;: [
        &quot;{\&quot;amount\&quot;: 3.49, \&quot;code\&quot;: \&quot;USD\&quot;}&quot;,
        &quot;{\&quot;amount\&quot;: 3.29, \&quot;code\&quot;: \&quot;USD\&quot;}&quot;,
        &quot;{\&quot;amount\&quot;: 2.99, \&quot;code\&quot;: \&quot;USD\&quot;}&quot;
      ]
    },
    {
      &quot;name&quot;: &quot;batchProductionDates&quot;,
      &quot;type&quot;: &quot;DatetimeCollection&quot;,
      &quot;values&quot;: [
        &quot;2024-02-01T10:00:00.000Z&quot;,
        &quot;2024-02-02T10:00:00.000Z&quot;,
        &quot;2024-02-03T10:00:00.000Z&quot;
      ]
    }
  ],
  &quot;parameters&quot;:
  {
    &quot;output_parameter1&quot; : &quot;output_value1&quot;,
    &quot;output_parameter2&quot; : &quot;output_value2&quot;
  }
}
">
  <yeast:paragraph/>
</yeast:code>