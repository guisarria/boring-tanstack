import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

const BLUR_LEVELS = [1, 2, 3, 6, 12]

const positions = {
  top: {
    className: "top-0",
    mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 100%)",
  },
  bottom: {
    className: "bottom-0",
    mask: "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)",
  },
} as const

function BlurLayer({ pos, size }: { pos: "top" | "bottom"; size: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pos !== "bottom") {
      return
    }

    function updateOpacity() {
      const el = containerRef.current
      if (!el) {
        return
      }

      const distanceToBottom =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight)
      const transitionZone = 200
      const opacity =
        distanceToBottom <= transitionZone
          ? distanceToBottom / transitionZone
          : 1

      for (const child of el.children) {
        ;(child as HTMLElement).style.opacity = String(opacity)
      }
    }

    updateOpacity()
    window.addEventListener("scroll", updateOpacity, { passive: true })
    return () => window.removeEventListener("scroll", updateOpacity)
  }, [pos])

  return (
    <div
      className={cn("fixed inset-x-0 z-30", positions[pos].className)}
      ref={containerRef}
      style={{ height: `${size}px` }}
    >
      {BLUR_LEVELS.map((blur) => (
        <div
          className="absolute inset-0 bg-background/3"
          key={blur}
          style={{
            WebkitBackdropFilter: `blur(${blur}px)`,
            backdropFilter: `blur(${blur}px)`,
            maskImage: positions[pos].mask,
            WebkitMaskImage: positions[pos].mask,
          }}
        />
      ))}
    </div>
  )
}

export function BlurOverlay({
  position = "top",
  size = 75,
}: {
  position?: "top" | "bottom" | "both"
  size?: number
}) {
  return (
    <div className="pointer-events-none">
      {(position === "top" || position === "both") && (
        <BlurLayer pos="top" size={size} />
      )}
      {(position === "bottom" || position === "both") && (
        <BlurLayer pos="bottom" size={size} />
      )}
    </div>
  )
}
