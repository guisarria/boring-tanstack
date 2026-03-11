import Avatar from "boring-avatars"
import type { SVGProps } from "react"
import { cn } from "@/lib/utils"

type AvatarProps = {
  name: string
  colors?: string[]
  title?: boolean
  square?: boolean
  size?: number | string
  className?: string
} & SVGProps<SVGSVGElement>

const DEFAULT_COLORS = [
  "light-dark(oklch(0.99 0.016 95.219), oklch(0.273 0.002 67.727))",
  "light-dark(oklch(0.554 0.086 186.744), oklch(0.67 0.1 186.578))",
  "light-dark(oklch(0.454 0.145 294.828), oklch(0.635 0.11 290.996))",
  "light-dark(oklch(0.567 0.152 45.02), oklch(0.658 0.154 49.3))",
  "light-dark(oklch(0.504 0.165 27.839), oklch(0.597 0.169 28.379))",
]

export const BoringAvatar = ({
  name,
  colors = DEFAULT_COLORS,
  title = false,
  square,
  className,
  size = 80,
}: AvatarProps) => {
  return (
    <Avatar
      className={cn("", className)}
      colors={colors}
      name={name}
      size={size}
      square={square}
      title={title}
      variant="bauhaus"
    />
  )
}
