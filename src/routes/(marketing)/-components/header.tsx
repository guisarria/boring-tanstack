import { Link } from "@tanstack/react-router"
import { EncoderDisc } from "@/components/encoder-disc"
import { Button } from "@/components/ui/button"
import { UserDropdown } from "@/modules/auth/components/user-dropdown"
import { ThemeToggle } from "../../../components/theme-toggle"
import { Route } from "../route"

export function Header() {
  const { user } = Route.useRouteContext()

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link className="flex items-center gap-2" to="/">
          <EncoderDisc className="size-8" />
          <span className="font-semibold">Boring</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <UserDropdown className="hover:bg-transparent aria-expanded:bg-transparent dark:hover:bg-transparent" />
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
