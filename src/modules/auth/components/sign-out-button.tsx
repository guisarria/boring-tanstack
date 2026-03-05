import { LogOutIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { authClient } from "../auth-client"

export function SignOutButton({ className }: { className?: string }) {
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out")
        },
      },
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
