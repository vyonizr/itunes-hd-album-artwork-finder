import { useEffect, useState } from 'react'

import { MotionArtworkResponse } from 'src/types'

function useMotionArtwork(
  collectionId: number,
  shouldFetch: boolean
): string | null {
  const [motionUrl, setMotionUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!shouldFetch) return

    let isCancelled = false

    const fetchMotionArtwork = async () => {
      try {
        const response = await fetch(
          `/api/motion-artwork?collectionId=${collectionId}`
        )
        const json: MotionArtworkResponse = await response.json()
        if (!isCancelled) {
          setMotionUrl(json.motionUrl)
        }
      } catch (error) {
        if (!isCancelled) {
          setMotionUrl(null)
        }
      }
    }

    fetchMotionArtwork()

    return () => {
      isCancelled = true
    }
  }, [collectionId, shouldFetch])

  return motionUrl
}

export default useMotionArtwork
