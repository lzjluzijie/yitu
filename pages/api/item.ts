import type { NextApiRequest, NextApiResponse } from "next"
import getRawBody from "raw-body"
import redis from "../../lib/redis"
import { upload } from "../../lib/onedrive"
import BASE58 from "../../lib/base58"

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  if (method !== "POST") {
    res.status(405).json({ error: "method not allowed" })
    return
  }

  const id = BASE58.random(5)
  const filename =
    typeof req.headers["x-yitu-filename"] === "string"
      ? req.headers["x-yitu-filename"]
      : "file"
  const body = getRawBody(req)
  console.log(await upload(id, filename, body))
}

export default handler
