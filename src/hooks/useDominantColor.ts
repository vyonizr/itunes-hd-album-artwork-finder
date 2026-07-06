import { useEffect, useState } from 'react'

function useDominantColor(imageSrc: string | undefined) {
  const [color, setColor] = useState<string | null>(null)

  useEffect(() => {
    setColor(null)
    if (!imageSrc) return

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const size = 32
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0, size, size)
        const { data } = ctx.getImageData(0, 0, size, size)

        // Most-saturated pixel rather than a flat average, since album art
        // averages tend to muddy into grey/brown.
        let best = { r: 0, g: 0, b: 0, saturation: -1 }
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const saturation = max === 0 ? 0 : (max - min) / max
          if (saturation > best.saturation) {
            best = { r, g, b, saturation }
          }
        }
        setColor(`rgb(${best.r}, ${best.g}, ${best.b})`)
      } catch {
        // Tainted canvas (CORS hiccup) or decode failure - just skip the tint.
        setColor(null)
      }
    }
    img.onerror = () => setColor(null)
    img.src = imageSrc
  }, [imageSrc])

  return color
}

export default useDominantColor
