import {
  Link,
  useLocation,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { HomeIcon, LogOutIcon, ShieldIcon, UserIcon } from "lucide-react"
import { Activity } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
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
import type { User } from "../schema"

type UserDropdownProps = {
  label?: boolean
  user: Pick<User, "name" | "email" | "image">
  className?: string
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function UserDropdown({ user, label, className }: UserDropdownProps) {
  const location = useLocation()
  const router = useRouter()
  const navigate = useNavigate()

  const currentPathname = location.pathname
  const handleSignOut = async () => {
    await authClient.signOut()
    router.invalidate()
    navigate({ to: "/" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center justify-start gap-x-4 py-6",
          className
        )}
        render={
          <Button
            className="flex items-center justify-center"
            size="default"
            variant="ghost"
          >
            <Avatar className="flex items-center after:border-transparent">
              <AvatarImage
                alt={user.name}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "icon",
                  })
                )}
                height={404}
                layout="constrained"
                src={user.image ?? ""}
                width={404}
              />
              <Activity mode={user.image ? "hidden" : "visible"}>
                <AvatarFallback
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                  })}
                >
                  {getInitials(user.name)}
                </AvatarFallback>
              </Activity>
            </Avatar>
            <Activity mode={label ? "visible" : "hidden"}>
              <span className="font-semibold text-lg">{user.name}</span>
            </Activity>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm leading-none">{user.name}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
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
          <Activity mode={currentPathname === "/" ? "hidden" : "visible"}>
            <DropdownMenuItem
              render={
                <Link to="/">
                  <ShieldIcon />
                  Home
                </Link>
              }
            />
          </Activity>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <ThemeToggle
                className="flex w-full items-start justify-start px-0 text-inherit"
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
