import type { CSSProperties, ElementType } from "react"
import { memo, useMemo } from "react"

import { cn } from "@/lib/utils"

export interface TextShimmerProps {
  children: string
  as?: ElementType
  className?: string
  duration?: number
  spread?: number
}

const ShimmerComponent = ({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) => {
  const dynamicSpread = useMemo(
    () => (children?.length ?? 0) * spread,
    [children, spread],
  )

  return (
    <Component
      className={cn(
        "relative inline-block bg-size-[250%_100%,auto] bg-clip-text text-transparent",
        "[background-repeat:no-repeat,padding-box] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))]",
        className,
      )}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage:
            "var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))",
          animationName: "text-shimmer",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        } as CSSProperties
      }
    >
      {children}
    </Component>
  )
}

export const Shimmer = memo(ShimmerComponent)
