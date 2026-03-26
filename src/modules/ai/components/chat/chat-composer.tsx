import { SendIcon, SquareIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { useChatController } from "./chat-provider"

export function ChatComposer() {
  const { isLoading, sendText, stop } = useChatController()
  const [draft, setDraft] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function adjustHeight() {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [draft])

  function submit() {
    const text = draft.trim()
    if (!text || isLoading) return
    setDraft("")
    void sendText(text)
  }

  return (
    <div className="py-2">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="mx-auto flex max-w-2xl items-center gap-x-2"
      >
        <Textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            adjustHeight()
          }}
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          disabled={isLoading}
          className="max-h-32 min-h-9 resize-none overflow-hidden rounded-sm"
        />
        {isLoading ? (
          <Button
            type="button"
            size="icon-lg"
            className="rounded-sm bg-destructive p-4.5 text-destructive-foreground"
            onClick={stop}
          >
            <SquareIcon className="size-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon-lg"
            className="rounded-sm bg-foreground p-4.5 text-background"
            disabled={!draft.trim()}
          >
            <SendIcon />
          </Button>
        )}
      </form>
    </div>
  )
}
