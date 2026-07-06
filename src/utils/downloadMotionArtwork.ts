import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

import { resolveMediaPlaylist } from './hlsPlaylist'

const FFMPEG_CORE_BASE_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

let ffmpegInstance: FFmpeg | null = null

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance

  const ffmpeg = new FFmpeg()
  await ffmpeg.load({
    coreURL: await toBlobURL(
      `${FFMPEG_CORE_BASE_URL}/ffmpeg-core.js`,
      'text/javascript'
    ),
    wasmURL: await toBlobURL(
      `${FFMPEG_CORE_BASE_URL}/ffmpeg-core.wasm`,
      'application/wasm'
    ),
  })

  ffmpegInstance = ffmpeg
  return ffmpeg
}

async function fetchAsUint8Array(url: string): Promise<Uint8Array> {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  return new Uint8Array(buffer)
}

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function downloadMotionArtwork(
  playlistUrl: string,
  fileName: string
): Promise<void> {
  const { initSegmentUrl, segmentUrls } = await resolveMediaPlaylist(
    playlistUrl
  )
  const ffmpeg = await getFFmpeg()

  if (initSegmentUrl) {
    const initBytes = await fetchAsUint8Array(initSegmentUrl)
    const segmentBytesList = await Promise.all(
      segmentUrls.map(fetchAsUint8Array)
    )
    const totalLength =
      initBytes.length +
      segmentBytesList.reduce((sum, bytes) => sum + bytes.length, 0)

    const combined = new Uint8Array(totalLength)
    combined.set(initBytes, 0)
    let offset = initBytes.length
    for (const bytes of segmentBytesList) {
      combined.set(bytes, offset)
      offset += bytes.length
    }

    await ffmpeg.writeFile('input.mp4', combined)
    await ffmpeg.exec(['-i', 'input.mp4', '-c', 'copy', 'output.mp4'])
  } else {
    const listLines: string[] = []
    for (let index = 0; index < segmentUrls.length; index += 1) {
      const segmentFileName = `seg${index}.ts`
      const segmentBytes = await fetchAsUint8Array(segmentUrls[index])
      await ffmpeg.writeFile(segmentFileName, segmentBytes)
      listLines.push(`file '${segmentFileName}'`)
    }
    await ffmpeg.writeFile('list.txt', listLines.join('\n'))
    await ffmpeg.exec([
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      'list.txt',
      '-c',
      'copy',
      'output.mp4',
    ])
  }

  const outputData = await ffmpeg.readFile('output.mp4')
  const blob = new Blob([outputData as BlobPart], { type: 'video/mp4' })
  triggerBrowserDownload(blob, fileName)
}
