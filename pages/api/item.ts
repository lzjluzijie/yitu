import type { NextApiRequest, NextApiResponse } from "next"
import redis from "../lib/redis"
import { upload } from "../lib/onedrive"
import getRawBody from "raw-body"

type Data = {
  name: string
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req
  if (method !== "POST") {
    res.status(200).json({ name: "John Doe" })
    return
  }

  console.log(typeof req.body)
  upload(getRawBody(req))
}
