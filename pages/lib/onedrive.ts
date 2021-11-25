import crypto from "crypto"

let refreshToken =
  process.env.REFRESH_TOKEN === undefined
    ? "define your refresh token in env"
    : process.env.REFRESH_TOKEN
let accessToken = ""

const maxTime = 3000 * 1000
let lastUpdated = 0

const update = async () => {
  if (
    process.env.CLIENT_ID === undefined ||
    process.env.CLIENT_SECRET === undefined ||
    process.env.REDIRECT_URI === undefined
  ) {
    console.error("onedrive config env not defined")
    return
  }

  const params = new URLSearchParams()
  params.append("client_id", process.env.CLIENT_ID)
  params.append("client_secret", process.env.CLIENT_SECRET)
  params.append("redirect_uri", process.env.REDIRECT_URI)
  params.append("grant_type", "refresh_token")
  params.append("refresh_token", refreshToken)

  const res = await fetch(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    }
  )

  if (!res.ok) {
    console.error(res)
    return
  }

  const data = await res.json()
  if (!data.access_token) {
    console.error(data)
    return
  }

  accessToken = data.access_token
  refreshToken = data.refresh_token
  lastUpdated = Date.now()
  console.log(data)
}

const getAccess = async () => {
  if (Date.now() - lastUpdated < maxTime) {
    return accessToken
  }

  await update()
  return accessToken
}

type createResponse = {
  uploadUrl: string
}

export const upload = async (data: Promise<Buffer>) => {
  const accessToken = await getAccess()
  const id = crypto.randomInt(58 ** 5).toString()
  const path = `/yitu/${id}/file`

  const createRes = await fetch(
    `https://graph.microsoft.com/v1.0/me/drive/root:${path}:/createUploadSession`,
    {
      method: "POST",
      headers: {
        Authorization: `bearer ${accessToken}`,
        "User-Agent": "yitu",
        "Content-Type": "application/json",
      },
      body: '{"item": {"@microsoft.graph.conflictBehavior": "rename"}}',
    }
  )

  const createData: createResponse = await createRes.json()
  const { uploadUrl } = createData

  const bytes = await data
  const length = bytes.length

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `bearer ${accessToken}`,
      "User-Agent": "yitu",
      "Content-Length": length.toString(),
      "Content-Range": `bytes 0-${(
        length - 1
      ).toString()}/${length.toString()}`,
    },
    body: bytes,
  })

  console.log(await uploadRes.text())
}
