import { Link, type LinkComponentProps } from "@tanstack/react-router"
import type { VariantProps } from "class-variance-authority"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: VariantProps<typeof buttonVariants> & LinkComponentProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
