import { createHash } from "crypto"
import { OnedriveItem } from "./onedrive"

export const DEFAULT_ID_LENGTH = 5

export type Hash = {
  md5: string
  sha1: string
  sha256: string
  sha3_256: string
}

export const hashFromBuffer = (data: Buffer): Hash => {
  const md5 = createHash("md5").update(data).digest("hex")
  const sha1 = createHash("sha1").update(data).digest("hex")
  const sha256 = createHash("sha256").update(data).digest("hex")
  const sha3_256 = createHash("sha3-256").update(data).digest("hex")
  return {
    md5,
    sha1,
    sha256,
    sha3_256,
  }
}

export type Item = {
  id: string
  size: number
  filename: string
  ip: string
  onedrive: OnedriveItem
  hash: Hash
  createdAt: number
}
