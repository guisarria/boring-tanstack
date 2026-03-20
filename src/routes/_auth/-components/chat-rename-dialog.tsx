import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState, useTransition, type SubmitEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { chatListQueryOptions, chatQueryKeys, renameChat } from "@/modules/ai"

import type { ChatTarget } from "./types"

interface RenameDialogProps {
  target: ChatTarget | null
  onClose: () => void
  onRenamed: () => void
}

export function RenameDialog({
  target,
  onClose,
  onRenamed,
}: RenameDialogProps) {
  const [title, setTitle] = useState("")
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  const isOpen = Boolean(target)

  useEffect(() => {
    if (target) setTitle(target.title)
  }, [target])

  function submitRename(e: SubmitEvent) {
    e.preventDefault()
    const newTitle = title.trim()
    if (!target || !newTitle) {
      toast.error("Chat name can't be empty")
      return
    }

    startTransition(() => {
      void (async () => {
        try {
          queryClient.setQueryData<{
            chats: Array<{ id: string; title: string }>
          }>(chatListQueryOptions().queryKey, (old) => {
            if (!old) return old
            return {
              ...old,
              chats: old.chats.map((c) =>
                c.id === target.id ? { ...c, title: newTitle } : c,
              ),
            }
          })
          onRenamed()
          await renameChat({ data: { id: target.id, title: newTitle } })
          onClose()
        } catch (err) {
          void queryClient.invalidateQueries({ queryKey: chatQueryKeys.all })
          toast.error(
            err instanceof Error ? err.message : "Something went wrong",
          )
        }
      })()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
          <DialogDescription>
            Choose a new title for this conversation.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-3" onSubmit={submitRename}>
          <Input
            autoFocus
            value={title}
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chat title"
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || title.trim().length === 0}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
