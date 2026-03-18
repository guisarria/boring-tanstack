import { SendIcon } from "lucide-react"
import { useCallback, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled: boolean
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }, [])

  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  return (
    <div className="py-2">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="mx-auto flex max-w-2xl items-center gap-x-2"
      >
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            adjustHeight()
          }}
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSubmit()
            }
          }}
          disabled={disabled}
          className="max-h-32 min-h-9 resize-none overflow-hidden rounded-sm"
        />
        <Button
          type="submit"
          size="icon-lg"
          className="bg-foreground text-background rounded-sm p-4.5"
          disabled={disabled || !value.trim()}
        >
          <SendIcon />
        </Button>
      </form>
    </div>
  )
}
