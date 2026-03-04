

import { Check, Copy } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  textToCopy: string
  className?: string
  onCopySuccess?: () => void
  onCopyError?: (error: unknown) => void
}

function CopyButton({
  textToCopy,
  className,
  onCopySuccess,
  onCopyError,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (isCopied) {
      toast.success("Copied to clipboard!")
      timer = setTimeout(() => setIsCopied(false), 2000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isCopied])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      onCopySuccess?.()
    } catch (err) {
      toast.error("Failed to copy to clipboard.")
      onCopyError?.(err)
    }
  }, [textToCopy, onCopySuccess, onCopyError])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={
          <Button
            aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
            className={cn("size-8", className)}
            onClick={handleCopy}
            size="icon"
            variant="link"
          >
            {isCopied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>}
        />
        {isCopied ? null : <TooltipContent>Copy to clipboard</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )
}

export { CopyButton }
