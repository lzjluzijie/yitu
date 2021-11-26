import type { NextApiRequest, NextApiResponse } from "next"
import getRawBody from "raw-body"
import redis from "../../lib/redis"
import { upload } from "../../lib/onedrive"
import BASE58 from "../../lib/base58"
import { DEFAULT_ID_LENGTH, Item } from "../../lib/item"

export const config = {
  api: {
    bodyParser: false,
  },
}

export type SuccessResponse = {
  status: "success"
  data: {
    id: string
  }
}
export type ErrorResponse = {
  status: "error"
  error: string
}

type Response = SuccessResponse | ErrorResponse

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { method } = req
  if (method !== "POST") {
    res.status(405).json({ status: "error", error: "method not allowed" })
    return
  }

  const ip =
    req.socket.remoteAddress !== undefined ? req.socket.remoteAddress : ""

  const id = BASE58.random(DEFAULT_ID_LENGTH)
  const filename =
    typeof req.headers["x-yitu-filename"] === "string"
      ? req.headers["x-yitu-filename"]
      : "file"
  const body = await getRawBody(req)
  const onedrive = await upload(id, filename, body)
  const item: Item = {
    id,
    size: body.length,
    filename,
    ip,
    onedrive,
    createdAt: Date.now(),
  }
  redis.set(id, JSON.stringify(item))
  res.status(200).json({ status: "success", data: { id } })
}

export default handler
