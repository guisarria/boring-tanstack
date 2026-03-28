import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState, useTransition, type SubmitEvent } from "react"
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

import { deleteAllChats, deleteChat, renameChat } from "../../functions"
import { chatListQueryOptions, chatQueryKeys } from "../../query-options"

export type ChatTarget = { id: string; title: string }

type ChatListData = {
  chats: Array<{ id: string; title: string }>
}

// --- Delete All ---

interface DeleteAllDialogProps {
  open: boolean
  onClose: () => void
  onDeletedAll: () => void
}

export function DeleteAllDialog({
  open,
  onClose,
  onDeletedAll,
}: DeleteAllDialogProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteAllChats,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: chatQueryKeys.all })

      const queryKey = chatListQueryOptions().queryKey

      const previous = queryClient.getQueryData<ChatListData>(queryKey)

      queryClient.setQueryData<ChatListData>(queryKey, (old) => {
        if (!old) return old
        return { ...old, chats: [] }
      })

      onClose()

      return { previous, queryKey }
    },

    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous)
      }

      toast.error(err instanceof Error ? err.message : "Failed to delete chats")
    },

    onSuccess: () => {
      toast.success("All chats deleted")
      onDeletedAll()
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.all })
    },
  })

  function confirmDeleteAll(e: React.MouseEvent) {
    e.preventDefault()
    deleteMutation.mutate(undefined)
  }

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete all chats?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all your chats and their messages. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={deleteMutation.isPending}
            variant="destructive"
            onClick={confirmDeleteAll}
          >
            Delete all
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// --- Delete Single ---

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
          queryClient.setQueryData<ChatListData>(
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

// --- Rename ---

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
          queryClient.setQueryData<ChatListData>(
            chatListQueryOptions().queryKey,
            (old) => {
              if (!old) return old
              return {
                ...old,
                chats: old.chats.map((c) =>
                  c.id === target.id ? { ...c, title: newTitle } : c,
                ),
              }
            },
          )
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
