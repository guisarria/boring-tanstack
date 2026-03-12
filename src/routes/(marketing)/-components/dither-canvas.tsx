import { useCallback, useEffect, useRef } from "react"
import { useTheme } from "@/components/providers/theme-provider"
import { cn } from "@/lib/utils"

const GRID_SIZE = 4
const FG = "oklch(75.7% 0 0)"
const FREQUENCY = 0.05
const SPEED = 0.023

const BAYER_4X4 = [
  0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5,
] as const

function getThreshold(x: number, y: number) {
  return BAYER_4X4[(y & 3) * 4 + (x & 3)] / 16 - 0.5
}

function createStableNoise(cols: number, rows: number) {
  const noise = new Float32Array(cols * rows)

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x
      const hash = ((x * 73_856_093) ^ (y * 19_349_663)) >>> 0
      noise[i] = ((hash % 1000) / 1000 - 0.5) * 0.08
    }
  }

  return noise
}

export function DitherCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const frameRef = useRef<number | null>(null)
  const timeRef = useRef(0)
  const noiseRef = useRef<Float32Array>(new Float32Array(0))
  const { theme } = useTheme()

  const BG = theme === "dark" ? "oklch(21% 0 0)" : "oklch(1 0 0)"

  const sizeRef = useRef({
    width: 0,
    height: 0,
    cols: 0,
    rows: 0,
    dpr: 1,
  })

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!(canvas && ctx)) {
      return
    }

    const rect = canvas.getBoundingClientRect()
    const width = Math.round(rect.width)
    const height = Math.round(rect.height)
    if (!(width && height)) {
      return
    }

    const dpr = 1
    const prev = sizeRef.current

    if (prev.width === width && prev.height === height && prev.dpr === dpr) {
      return
    }

    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cols = Math.ceil(width / GRID_SIZE)
    const rows = Math.ceil(height / GRID_SIZE)

    sizeRef.current = { width, height, cols, rows, dpr }
    noiseRef.current = createStableNoise(cols, rows)
  }, [])

  const drawFrame = useCallback(() => {
    const ctx = ctxRef.current
    const { width, height, cols, rows } = sizeRef.current
    if (!(ctx && width && height)) {
      return
    }

    const t = timeRef.current
    const waveCenterY = rows / 2
    const waveAmplitude = rows / 4
    const waveYByCol = new Float32Array(cols)

    for (let x = 0; x < cols; x++) {
      const wave1 = Math.sin(x * FREQUENCY + t) * waveAmplitude
      const wave2 = Math.cos(x * FREQUENCY * 0.5 - t) * (waveAmplitude * 0.5)
      waveYByCol[x] = waveCenterY + wave1 + wave2
    }

    ctx.fillStyle = BG
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = FG
    for (let y = 0; y < rows; y++) {
      const rowOffset = y * cols

      for (let x = 0; x < cols; x++) {
        const horizontalFade = (x / cols) ** 0.8

        const distFromWave = Math.abs(y - waveYByCol[x])
        const baseIntensity = Math.max(0, 1 - distFromWave / 26)
        let intensity = baseIntensity ** 0.5
        intensity =
          (intensity + noiseRef.current[rowOffset + x]) * horizontalFade

        if (intensity + getThreshold(x, y) > 0.5) {
          ctx.fillRect(
            x * GRID_SIZE,
            y * GRID_SIZE,
            GRID_SIZE - 1,
            GRID_SIZE - 1
          )
        }
      }
    }
    timeRef.current = t + SPEED
    frameRef.current = requestAnimationFrame(drawFrame)
  }, [BG])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    ctxRef.current = canvas.getContext("2d", { alpha: false })
    if (!ctxRef.current) {
      return
    }

    resizeCanvas()

    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(canvas)

    const start = () => {
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(drawFrame)
      }
    }

    const stop = () => {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        stop()
      } else {
        start()
      }
    }

    start()
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      stop()
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [drawFrame, resizeCanvas])

  return (
    <canvas
      className={cn(
        "absolute top-0 right-0 -z-10 h-full w-full opacity-40 backdrop-blur",
        "mask-[linear-gradient(to_right,transparent,black)]",
        "[-webkit-mask-image:linear-gradient(to_right,transparent,black)]",
        className
      )}
      ref={canvasRef}
    />
  )
}
