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

import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"
import { cn } from "@/lib/utils"

import { authClient } from "../auth-client"

type UserDropdownProps = {
  label?: boolean
  className?: string
}

export function UserDropdown({ label, className }: UserDropdownProps) {
  const { user } = useRouteContext({ from: "__root__" })

  const { pathname } = useLocation()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          toast.success("Signed out")
          await router.invalidate()
        },
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn("flex items-center gap-x-2", className)}
      >
        <UserAvatar size={25.5} />
        {label && <span className="text-sm">{user?.name}</span>}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="mt-4">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">{user?.name}</p>
              <p className="text-muted-foreground size-xs truncate leading-none">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {!pathname.startsWith("/dashboard") && (
            <DropdownMenuItem
              render={
                <Link to="/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              }
            />
          )}
          {!pathname.startsWith("/settings") && (
            <DropdownMenuItem
              render={
                <Link to="/settings">
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
          <DropdownMenuItem
            render={
              <ThemeToggle
                className="flex w-full items-start justify-start px-0"
                label
                variant="ghost"
              />
            }
          />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
