import { Check, Copy } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const COPY_RESET_DELAY = 2000

function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      toast.error("Clipboard is unavailable in this browser.")
      return false
    }

    try {
      await navigator.clipboard.writeText(text)

      setIsCopied(true)
      toast.success("Copied to clipboard!")

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        setIsCopied(false)
      }, COPY_RESET_DELAY)

      return true
    } catch {
      toast.error("Unable to copy—try selecting the text manually.")
      return false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return { isCopied, copy } as const
}

type CopyButtonProps = {
  textToCopy: string
  className?: string
}

function CopyButton({ textToCopy, className }: CopyButtonProps) {
  const { isCopied, copy } = useCopyToClipboard()
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <TooltipProvider closeDelay={20}>
      <Tooltip open={tooltipOpen && !isCopied} onOpenChange={setTooltipOpen}>
        <TooltipTrigger
          render={
            <Button
              aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
              className={cn("text-cyan-300", className)}
              onClick={() => copy(textToCopy)}
              size="icon"
              variant="ghost"
            />
          }
        >
          {isCopied ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          {isCopied ? "Copied!" : "Copy to clipboard"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { CopyButton, useCopyToClipboard }
