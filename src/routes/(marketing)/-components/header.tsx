import {
  Link,
  useNavigate,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router"
import { HomeIcon, LogOutIcon, ShieldIcon, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { boringtemplateIcon } from "@/components/ui/icons"
import { authClient } from "@/modules/auth/auth-client"
import { ThemeToggle } from "../../../components/theme-toggle"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function UserDropdown({
  user,
  onSignOut,
}: {
  user: { name: string; email: string; image?: string | null }
  onSignOut: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className="rounded-full" size="icon" variant="ghost">
            <Avatar className="size-7">
              <AvatarImage alt={user.name} src={user.image ?? undefined} />
              <AvatarFallback className="border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onSignOut}>
            <LogOutIcon />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Header() {
  const { user } = useRouteContext({ from: "__root__" })
  const router = useRouter()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.invalidate()
    navigate({ to: "/" })
  }

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link className="flex items-center gap-2" to="/">
          {boringtemplateIcon({})}
          <span className="font-semibold">Boring</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <UserDropdown onSignOut={handleSignOut} user={user} />
          ) : (
            <>
              <Button variant="outline">
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
