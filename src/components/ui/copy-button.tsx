import { Check, Copy } from "lucide-react"
import { useRef, useState } from "react"
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
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      toast.success("Copied to clipboard!")
      onCopySuccess?.()

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy to clipboard.")
      onCopyError?.(err)
    }
  }

  return (
    <TooltipProvider closeDelay={20}>
      <Tooltip open={isCopied ? false : undefined}>
        <TooltipTrigger
          render={
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
            </Button>
          }
        />
        <TooltipContent>Copy to clipboard</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { CopyButton }
