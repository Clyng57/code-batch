
declare module 'code-batch'

declare class CodeBatch {
  constructor (input: string): CodeBatch
  data: Array<number>
  get length (): number
  toFormat: () => string
  /**
   * @returns {string} hex format
   */
  toHex: () => string
  /**
   * @returns {string} codePoints
   */
  toString: () => string
  /**
   * @returns {string} binary format
   */
  toBinary: () => string
  /**
   * @returns {string} decoded format
   */
  decode: () => string
  /**
   * Creates a new CodeBatch wrapped in a promise
   */
  static toCodePoints: (input: string) => Promise<CodeBatch>
  /**
   * Decode either an array or string of binary or codePoints
   */
  static decode: (input: any) => string
  /**
   * Converts binary to codePoints
   */
  static binaryToPoint: (input: any) => string
}

export = CodeBatch