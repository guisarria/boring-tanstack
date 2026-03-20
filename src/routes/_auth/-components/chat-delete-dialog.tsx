import { useQueryClient } from "@tanstack/react-query"
import { useTransition } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { chatListQueryOptions, chatQueryKeys, deleteChat } from "@/modules/ai"

import type { ChatTarget } from "./types"

interface DeleteDialogProps {
  target: ChatTarget | null
  onClose: () => void
  onDeleted: (deletedId: string) => void
}

export function DeleteDialog({
  target,
  onClose,
  onDeleted,
}: DeleteDialogProps) {
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()
  const isOpen = Boolean(target)

  function confirmDelete() {
    if (!target) return

    startTransition(() => {
      void (async () => {
        try {
          queryClient.setQueryData<{ chats: Array<{ id: string }> }>(
            chatListQueryOptions().queryKey,
            (old) => {
              if (!old) return old
              return {
                ...old,
                chats: old.chats.filter((c) => c.id !== target.id),
              }
            },
          )
          const deletedId = target.id
          onClose()
          onDeleted(deletedId)
          await deleteChat({ data: { id: target.id } })
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
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {target?.title ?? "this chat"}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            variant="destructive"
            onClick={confirmDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
