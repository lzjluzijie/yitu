import { OnedriveItem } from "./onedrive"

export const DEFAULT_ID_LENGTH = 5

export type Item = {
  id: string
  size: number
  filename: string
  ip: string
  onedrive: OnedriveItem

  createdAt: number
}
