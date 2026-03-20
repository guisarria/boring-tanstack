import { Check, Copy } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  textToCopy: string
  className?: string
}

function CopyButton({ textToCopy, className }: CopyButtonProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <TooltipProvider closeDelay={20}>
      <Tooltip open={tooltipOpen && !isCopied} onOpenChange={setTooltipOpen}>
        <TooltipTrigger
          render={
            <Button
              aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
              className={cn("text-cyan-300", className)}
              onClick={() => copyToClipboard(textToCopy)}
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
