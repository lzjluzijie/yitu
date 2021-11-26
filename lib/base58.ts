import crypto from "crypto"

class Base {
  alphabet: string
  size: number
  decodeMap: {
    [key: string]: number
  }

  constructor(alphabet: string) {
    this.alphabet = alphabet
    this.size = alphabet.length
    this.decodeMap = {}
    for (let i = 0; i < this.size; i++) {
      this.decodeMap[alphabet.charAt(i)] = i
    }
  }

  encodeInt(n: number): string {
    let str = ""
    while (n !== 0) {
      const r = n % this.size
      n = Math.trunc(n / this.size)
      str = this.alphabet.charAt(r) + str
    }
    return str
  }

  // return NaN if string is invalid
  decodeInt(data: string): number {
    let n = 0
    for (let i = 0; i < data.length; i++) {
      n = n * this.size + this.decodeMap[data.charAt(i)]
    }
    return n
  }

  random(length: number): string {
    const n = crypto.randomInt(this.size ** (length - 1), this.size ** length)
    return this.encodeInt(n)
  }
}

const BASE58 = new Base(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
)
export default BASE58
