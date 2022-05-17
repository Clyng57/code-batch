
# CodeBatch

Module for converting characters to code points, binary, hex.
It fixes the javascript charCodeAt to use in loops. Can convert emojis.

<br />

# Table of Contents
1. [ Install ](#install) <br />
2. [ Usage ](#examples) <br />

<br />

<a name="install"></a>
## Install

```console
npm i code-batch 
```

<br />

<a name="examples"></a>
## Usage


### Default:

```js
// CJS require
const CodeBatch = require('code-batch')
// ESM import
import CodeBatch from 'code-batch'

const codeBatch = new CodeBatch('🔥 Hello World 💻')

/**
 *
 * @returns
 * <CodeBatch 128293 32 72 101 108 108 111 32 87 111 114 108 100 32 128187 >
 */
`${codeBatch}`

/**
 *
 * @returns
 * <CodeBatch 128293 32 72 101 108 108 111 32 87 111 114 108 100 32 128187 >
 */
codeBatch.toFormat()

/**
 *
 * @returns
 * \uD83D\uDD25 \u20 \u48 \u65 \u6C \u6C \u6F \u20 
 * \u57 \u6F \u72 \u6C \u64 \u20 \uD83D\uDCBB
 */
codeBatch.toHex()

/**
 *
 * @returns
 * 11111010100100101 100000 1001000 1100101 1101100 
 * 1101100 1101111 100000 1010111 1101111 1110010 
 * 1101100 1100100 100000 11111010010111011
 */
codeBatch.toBinary()

/**
 *
 * @returns
 * 128293 32 72 101 108 108 111 32 87 111 114 108 100 32 128187
 */
codeBatch.toString()

/**
 *
 * @returns
 * 🔥 Hello World 💻
 */
codeBatch.decode()
```


### Static:

```js
// CJS require
const CodeBatch = require('code-batch')
// ESM import
import CodeBatch from 'code-batch'

/**
 *
 * @returns
 * 🔥 Hello World 💻
 */
CodeBatch.decode('128293 32 72 101 108 108 111 32 87 111 114 108 100 32 128187')

/**
 *
 * @returns
 * 🔥 Hello World 💻
 */
CodeBatch.decode(
  '11111010100100101 100000 1001000 1100101 1101100 ' +
  '1101100 1101111 100000 1010111 1101111 1110010 ' +
  '1101100 1100100 100000 11111010010111011'
)

/**
 *
 * @returns {Promise<CodeBatch>}
 */
const codeBatch = await CodeBatch.toCodePoints('🔥 Hello World 💻')
```
