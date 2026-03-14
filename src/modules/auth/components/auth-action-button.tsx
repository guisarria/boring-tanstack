import type { ComponentProps } from "react"

import { ActionButton, type ActionResult } from "@/components/ui/action-button"

export function AuthActionButton({
  action,
  successMessage,
  ...props
}: Omit<ComponentProps<typeof ActionButton>, "action"> & {
  action: () => Promise<{ error: null | { message?: string } }>
  successMessage?: string
}) {
  async function adaptedAction(): Promise<ActionResult> {
    const res = await action()

    if (res.error) {
      return { error: true, message: res.error.message || "Action failed" }
    }
    return { error: false, message: successMessage }
  }

  return <ActionButton {...props} action={adaptedAction} />
}
