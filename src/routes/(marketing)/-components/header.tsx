import { Link, useNavigate, useRouter } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { boringtemplateIcon } from "@/components/ui/icons"
import { authClient } from "@/modules/auth/auth-client"
import { UserDropdown } from "@/modules/auth/components/user-dropdown"
import type { User } from "@/modules/auth/schema"
import { ThemeToggle } from "../../../components/theme-toggle"
import { Route } from "../route"

export function Header() {
  const { user } = Route.useRouteContext()
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
            <UserDropdown
              className="hover:bg-transparent aria-expanded:bg-transparent dark:hover:bg-transparent"
              onSignOut={handleSignOut}
              user={user as Pick<User, "name" | "email" | "image">}
            />
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
