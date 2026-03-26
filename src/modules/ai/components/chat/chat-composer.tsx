import { SendIcon, SquareIcon } from "lucide-react"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { useChatController } from "./chat-provider"

function resizeTextarea(el: HTMLTextAreaElement | null) {
  if (!el) return
  el.style.height = "0px"
  el.style.height = `${el.scrollHeight + 2}px`
}

export function ChatComposer() {
  const { isLoading, sendText, stop } = useChatController()
  const [draft, setDraft] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  function setTextareaRef(node: HTMLTextAreaElement | null) {
    textareaRef.current = node
    resizeTextarea(node)
  }

  function submit() {
    const text = draft.trim()
    if (!text || isLoading) return
    setDraft("")
    requestAnimationFrame(() => resizeTextarea(textareaRef.current))
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
          ref={setTextareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onInput={(e) => resizeTextarea(e.currentTarget)}
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
