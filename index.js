
import is from '@neumatter/is'

const MISSING_PAIR = 'codePointAt: high surrogate not followed by low surrogate.'
const MAX_CHARS = 2000
const BINARY_PATTERN = /^[01]+$/

const codeFromPair = (high, low) => {
  high = (high - 0xD800) * 0x400
  low = (low - 0xDC00)
  return (high + low) + 0x10000
}

const isHigh = code => {
  return code >= 0xD800 && code <= 0xDBFF
}
const isLow = code => {
  return code >= 0xDC00 && code <= 0xDFFF
}

function codePointAt (str, index) {
  index = index || 0
  const point = str.charCodeAt(index)
  if (isLow(point)) return null
  if (isHigh(point)) {
    const nextPoint = str.charCodeAt(index + 1)
    if (is.NaN(nextPoint)) throw new Error(MISSING_PAIR)
    return codeFromPair(point, nextPoint)
  }
  return point
}

function toHex (codePoint) {
  const TEN_BITS = parseInt('1111111111', 2)
  const toUnit = codeUnit => `\\u${codeUnit.toString(16).toUpperCase()}`
  if (codePoint <= 0xFFFF) {
    return toUnit(codePoint)
  }
  codePoint -= 0x10000
  const leadSurrogate = 0xD800 + (codePoint >> 10)
  const tailSurrogate = 0xDC00 + (codePoint & TEN_BITS)
  return toUnit(leadSurrogate) + toUnit(tailSurrogate)
}

export default class CodeBatch {
  data = []
  /**
   *
   * @param {string} input
   */
  constructor (input) {
    if (input) {
      const { length } = input
      let index = -1
      while (++index < length) {
        const code = codePointAt(input, index)
        if (code === null) continue
        this.data.push(code)
        if (index >= MAX_CHARS) break
      }
    }
  }

  get length () {
    return this.data.length
  }

  [Symbol.toPrimitive] (hint) {
    return this.toFormat()
  }

  get [Symbol.toStringTag] () {
    const format = data => `<CodeBatch ${data} >`
    const output = []
    let index = -1
    while (++index < this.length) {
      output[index] = this.data[index]
      if (index >= 5) {
        const left = this.length - index
        output.push(` ...${left}`)
        return format(output.join(' '))
      }
    }
    return format(output.join(' '))
  }

  toFormat () {
    const format = data => `<CodeBatch ${data} >`
    const output = []
    let index = -1
    while (++index < this.length) {
      output[index] = this.data[index]
      if (index >= 20) {
        const left = this.length - index
        output.push(` ...${left}`)
        return format(output.join(' '))
      }
    }
    return format(output.join(' '))
  }

  toHex () {
    const output = []
    let index = -1
    while (++index < this.length) {
      output[index] = toHex(this.data[index])
    }
    return output.join(' ')
  }

  toString () {
    return this.data.join(' ')
  }

  toBinary () {
    const output = []
    let index = -1
    while (++index < this.length) {
      let num = this.data[index]
      let binary = (num % 2).toString()
      while (num > 1) {
        num = parseInt(num / 2)
        binary = (num % 2) + (binary)
      }
      output[index] = binary
    }
    return output.join(' ')
  }

  decode () {
    const output = []
    let index = -1
    while (++index < this.length) {
      output[index] = String.fromCodePoint(this.data[index]).toString(16)
    }
    return output.join('')
  }

  static async toCodePoints (input) {
    const toCode = input => {
      const { length } = input
      const codePoints = []
      if (!length) return Promise.all(codePoints)
      let index = -1

      while (++index < length) {
        const codeAt = (input) => {
          return new Promise((resolve, reject) => {
            index = index || 0
            const point = input.charCodeAt(index)
            if (isHigh(point)) {
              const nextPoint = input.charCodeAt(index + 1)
              if (isNaN(nextPoint)) reject(MISSING_PAIR)
              ++index
              resolve(codeFromPair(point, nextPoint))
            }
            resolve(point)
          })
        }

        const code = codeAt(input, index)
        codePoints.push(code)
      }
      return Promise.all(codePoints)
    }

    const codeBatch = new CodeBatch()
    codeBatch.data = await toCode(input)
    return codeBatch
  }

  static fromCode (input) {
    const array = is.string(input) ? input.split(' ') : input
    const { length } = array
    const output = []
    let index = -1
    while (++index < length) {
      output[index] = String.fromCodePoint(array[index]).toString(16)
    }
    return output.join('')
  }

  static fromBinary (input) {
    const array = is.string(input) ? input.split(' ') : input
    const { length } = array
    const output = []
    let index = -1
    while (++index < length) {
      output[index] = String.fromCodePoint(CodeBatch.binaryToPoint(`${array[index]}`)).toString(16)
    }
    return output.join('')
  }

  static decode (input) {
    const testStr = is.array(input) ? input.join('').replace(/ /g, '') : input.replace(/ /g, '')
    const decodeType = BINARY_PATTERN.test(testStr) ? 'binary' : 'code'
    return (decodeType === 'binary' ? CodeBatch.fromBinary : CodeBatch.fromCode)(input)
  }

  static binaryToPoint (binary) {
    if (!is.string(binary)) {
      binary = binary.toString()
    }
    let decimal = 0
    const { length } = binary
    let i = -1
    let expo = length - 1
    while (++i < length) {
      decimal += (binary[i] * 2 ** expo)
      expo--
    }
    return decimal
  }
}
