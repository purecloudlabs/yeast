Lorem ipsum dolor sit amet, consectetur adipiscing elit. ~Nulla viverra~ tortor non diam , non `func()` fringilla nunc vestibulum. _Donec faucibus_, odio a congue mollis, arcu nunc viverra leo, vitae viverra * turpis erat at quam. Pellentesque *foobar* hendrerit ligula neque, et tempus leo bibendum a.pulvinar, nunc a malesuada dignissim, nisi **vestibulum sapien a rutrum** diam maximus est,``function() ` `` a pharetra lorem tortor ac odio. Phasellus consectetur vestibulum sapien a rutrum. ![Alt Text](path/to/image.png 'Single quote text') Mauris vel ![Alt Text](path/to/image.png "Double quote text")pharetra libero, sollicitudin volutpat erat. ![](path/to/image.png "image without alt text")Nulla pulvinar libero sed vehicula sagittis. Mauris at quam fringilla, feugiat ante eget, dictu`m nibh. Vivamus aliquet, [/Genesys/developercenter](https://developer.genesys.cloud/ 'single quote text') tellus et pretium tempus, odio enim dictum sem, ut ultricies [Api Central](https://apicentral.dev-genesys.cloud/index/ "double quote text") nibh leo a dolor. [](https://apicentral.genesys.cloud/index/ "link without alt text") Phasellus suscipit libero rhoncus, euismod nulla ac, venenatis eros*. https://developer.genesys.cloud/

This paragraph tests _non_standard touching use cases. Sin_gle_ cha*racters* _i_n *wo*rds are f_o_r i*talic*s. Characters * surrounded * by _ whitespace _ are ignored. Es\_ca\_ped ch\*ar\*acters a\_\_re\_\_ n\*\*ot\*\* \*\*parsed out\*\* \_but\_ \*are\* \_\_rendered without\_\_ escape characters. Dou__ble__ cha**racters** __i__n **wo**rds are f__o__r b**ol**d.

Check **that \_escaped text\_ inside bold text** is reassembed into one text node.

Dangling escaped markers, like \* or \_ or \|, should get unescaped.

__bold underscore__ escape use cases 1) __bold text__ 2) __bold\_\_text__ 3) __bold\_text__ 4) \_\_notbold__isbold__ 5) __isbold__notbold\_\_ 6) __b__ __bb__ __bbb__ 7) __\___ 

**bold asterisk** escape use cases 1) **bold text** 2) **bold\*\*text** 3) **bold\*text** 4) \*\*notbold**isbold** 5) **isbold**notbold\*\* 6) **b** **bb** **bbb** 7) **\*** 

_italic underscore_ escape use cases 1) _italic text_ 2) _italic\_\_text_ 3) _italic\_text_ 4) \_notitalic_isitalic_ 5) _isitalic_notitalic\_ 6) _b_ _bb_ _bbb_ 7) _\__ 8) _ notitalic_ and _notitalic _ and _  _

*italic asterisk* escape use cases 1) *italic text* 2) *italic\*\*text* 3) *italic\*text* 4) \*notitalic*isitalic* 5) *isitalic*notitalic\* 6) *b* *bb* *bbb* 7) *\** 8) * notitalic* and *notitalic * and *  *
