import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import {
  chatListQueryOptions,
  chatQueryKeys,
  deleteAllChats,
} from "@/modules/ai"

interface DeleteAllDialogProps {
  open: boolean
  onClose: () => void
  onDeletedAll: () => void
}

type ChatListData = {
  chats: Array<{ id: string }>
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
    deleteMutation.mutate({ data: {} })
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
