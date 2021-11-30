import type { NextPage } from "next"
import Head from "next/head"
import { useMemo, useState } from "react"
import { useDropzone } from "react-dropzone"
import type { SuccessResponse } from "./api/item"

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
}

const activeStyle = {
  borderColor: "#2196f3",
}

const acceptStyle = {
  borderColor: "#00e676",
}

const rejectStyle = {
  borderColor: "#ff1744",
}

const StyledDropzone = () => {
  const [finished, setFinished] = useState<
    {
      filename: string
      size: number
      id: string
    }[]
  >([])
  const upload = (file: File) => {
    fetch("/api/item", {
      method: "POST",
      headers: {
        "x-yitu-filename": file.name,
      },
      body: file,
    })
      .then((res) => res.json())
      .then((res: SuccessResponse) => {
        const id = res.data.id
        console.log(id)

        setFinished([
          ...finished,
          {
            filename: file.name,
            size: file.size,
            id,
          },
        ])
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: (files) => {
      files.forEach((file) => {
        console.log(file)
        upload(file)
      })
    },
  })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  )

  return (
    <div className="container">
      <div className="mt-2 mb-2" {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or click to select files</p>
      </div>
      <ul>
        {finished.map(({ filename, size, id }) => (
          <li key={id}>
            {filename}: {size} bytes{" "}
            <a href={`/${id}`} target="_blank" rel="noreferrer">
              {id}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>yitu</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto mt-1">
        <h1 className="text-2xl">yitu</h1>

        <StyledDropzone />
      </main>
    </>
  )
}

export default Home
