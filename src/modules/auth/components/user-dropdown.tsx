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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

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
        onSuccess: () => {
          toast.success("Signed out")
          router.invalidate()
        },
      },
    })
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
