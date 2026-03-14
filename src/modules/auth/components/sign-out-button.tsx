import { useRouter } from "@tanstack/react-router"
import { LogOutIcon } from "lucide-react"
import { startTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { authClient } from "../auth-client"

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: async () => {
            toast.success("Signed out")
            await router.invalidate()
          },
        },
      })
    })
  }

  return (
    <Button
      className={cn("gap-2", className)}
      onClick={handleSignOut}
      size="sm"
      variant={"outline"}
    >
      <LogOutIcon />
      Sign out
    </Button>
  )
}
