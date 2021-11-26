import type { NextApiRequest, NextApiResponse } from "next"
import redis from "../../lib/redis"
import crypto from "crypto"
import { upload } from "../../lib/onedrive"
import getRawBody from "raw-body"

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { method } = req
  if (method !== "POST") {
    res.status(405).json({ error: "method not allowed" })
    return
  }

  const id = crypto.randomInt(58 ** 5).toString()
  const body = getRawBody(req)
  console.log(await upload(id, body))
}

export default handler
