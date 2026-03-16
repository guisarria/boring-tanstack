import { type ComponentProps, type ReactNode, useTransition } from "react"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"

export type ActionResult = { error: boolean; message?: string }

type ActionButtonProps = ComponentProps<typeof Button> & {
  action: () => Promise<ActionResult>
  requireAreYouSure?: boolean
  areYouSureTitle?: ReactNode
  areYouSureDescription?: ReactNode
  actionTag?: ReactNode
}

export function ActionButton({
  action,
  requireAreYouSure = false,
  areYouSureTitle = "Are you sure?",
  areYouSureDescription = "This action cannot be undone.",
  actionTag = "Yes",
  ...props
}: ActionButtonProps) {
  const [isPending, startTransition] = useTransition()

  function performAction() {
    startTransition(async () => {
      const result = await action()
      if (result.error) {
        toast.error(result.message ?? "Error")
      }
    })
  }

  if (requireAreYouSure) {
    return (
      <AlertDialog open={isPending ? true : undefined}>
        <AlertDialogTrigger
          className="inline-flex items-center gap-x-2"
          render={<Button {...props} />}
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{areYouSureTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {areYouSureDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={performAction}>
              <LoadingSwap isLoading={isPending}>{actionTag}</LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Button
      {...props}
      disabled={props.disabled ?? isPending}
      onClick={(e) => {
        performAction()
        props.onClick?.(e)
      }}
    >
      <LoadingSwap
        className="inline-flex items-center gap-x-2"
        isLoading={isPending}
      >
        {props.children}
      </LoadingSwap>
    </Button>
  )
}
