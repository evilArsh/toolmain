import { LoadProgressData } from "./types"
import Dexie, { type EntityTable } from "dexie"

const name = "three-models-db"
export const db = new Dexie(name) as Dexie & {
  model: EntityTable<{ id: string; url: string; data: Blob }, "id">
  config: EntityTable<{ id: string; url: string; data: Record<string, unknown> }, "id">
}

db.version(1).stores({
  model: "id,url",
})
db.version(2).stores({
  model: "id,url",
  config: "id,url",
})

export async function fetchRemote(
  url: string,
  onProgress?: (progress: LoadProgressData) => void
): Promise<{ code: number; msg: string; data?: Blob }> {
  console.log(`[fetchRemote] ${url}`)
  const res = await fetch(url)
  if (res.status !== 200) {
    return { code: res.status, msg: `${res.statusText}:${res.status}` }
  }
  const contentLength = res.headers.get("Content-Length") ?? "0"
  const totalBytes = parseInt(contentLength, 10)
  let downloadedBytes = 0
  const readableStream = res.body
  if (!readableStream) {
    return { code: 500, msg: `empty body` }
  }
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const reader = readableStream.getReader()
  const pump = async () => {
    const { done, value } = await reader.read()
    if (done) {
      writer.close()
      return
    }
    writer.write(value)
    downloadedBytes += value.length
    if (onProgress) {
      onProgress({ loaded: downloadedBytes, total: totalBytes, url, describe: "loading" })
    }
    return pump()
  }
  await pump()
  const blob = await new Response(readable).blob()
  if (!url.startsWith("blob")) {
    db.model.put({ id: url, url, data: blob })
  }
  return { code: 200, msg: "success", data: blob }
}

export async function getModel(
  url: string,
  onProgress?: (progress: LoadProgressData) => void
): Promise<{ code: number; msg: string; data?: Blob }> {
  try {
    const res = await db.model.where("url").equals(url).first()
    if (!res) {
      return fetchRemote(url, onProgress)
    }
    if (onProgress) {
      onProgress({ loaded: 100, total: 100, url, describe: "loaded from indexedDB" })
    }
    return { code: 200, msg: "ok", data: res.data }
  } catch (error) {
    return { code: 500, msg: (error as Error).message }
  }
}
