import {
  Link,
  useLocation,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router"
import {
  HomeIcon,
  LayoutDashboard,
  LogOutIcon,
  Settings2Icon,
} from "lucide-react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/modules/auth/components/user-avatar"

import { authClient } from "../auth-client"

type UserDropdownProps = {
  label?: boolean
  className?: string
}

export function UserDropdown({ label, className }: UserDropdownProps) {
  const { user } = useRouteContext({ from: "__root__" })
  const { pathname } = useLocation()
  const router = useRouter()

  if (!user) return null

  const handleSignOut = async () => {
    await authClient.signOut()

    toast.success("Signed out")

    await router.invalidate()
    void router.navigate({ to: "/" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn("flex items-center gap-x-2", className)}
      >
        <UserAvatar size={25.5} />
        {label && <span className="text-sm">{user.name}</span>}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="mt-1">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">{user.name}</p>
              <p className="text-muted-foreground size-xs truncate leading-none">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {!pathname.startsWith("/dashboard") && (
            <DropdownMenuItem
              render={
                <Link preload="render" to="/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              }
            />
          )}
          {!pathname.startsWith("/settings") && (
            <DropdownMenuItem
              render={
                <Link preload="render" to="/settings">
                  <Settings2Icon />
                  Settings
                </Link>
              }
            />
          )}
          {pathname !== "/" && (
            <DropdownMenuItem
              render={
                <Link to="/">
                  <HomeIcon />
                  Home
                </Link>
              }
            />
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
