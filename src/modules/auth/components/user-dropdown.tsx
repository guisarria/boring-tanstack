import {
  Link,
  useLocation,
  useNavigate,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router"
import { HomeIcon, LogOutIcon, ShieldIcon, UserIcon } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { authClient } from "../auth-client"

type UserDropdownProps = {
  label?: boolean
  className?: string
}

export function UserDropdown({ label, className }: UserDropdownProps) {
  const { user } = useRouteContext({ from: "__root__" })

  const location = useLocation()
  const router = useRouter()
  const navigate = useNavigate()

  const currentPathname = location.pathname

  const handleSignOut = async () => {
    await authClient.signOut()
    router.invalidate()
    navigate({ to: "/" })
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn("flex items-center gap-x-2", className)}
      >
        <Avatar className={cn("flex size-7 after:border-transparent")}>
          <AvatarImage
            alt={user?.name}
            className={cn("rounded-md")}
            src={user?.image ?? ""}
          />
          <AvatarFallback className={cn("rounded-md")}>
            {getInitials(user?.name ?? "")}
          </AvatarFallback>
        </Avatar>
        {label && <span className="text-sm">{user?.name}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm leading-none">{user?.name}</p>
              <p className="text-muted-foreground leading-none">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link to="/dashboard">
                <HomeIcon />
                Dashboard
              </Link>
            }
          />
          <DropdownMenuItem
            render={
              <Link to="/dashboard">
                <UserIcon />
                Account
              </Link>
            }
          />
          <DropdownMenuItem
            render={
              <Link to="/dashboard">
                <ShieldIcon />
                Security
              </Link>
            }
          />
          {currentPathname !== "/" && (
            <DropdownMenuItem
              render={
                <Link to="/">
                  <ShieldIcon />
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
