import { Link } from "@tanstack/react-router"
import { EncoderDisc } from "@/components/encoder-disc"
import { Button } from "@/components/ui/button"
import { UserDropdown } from "@/modules/auth/components/user-dropdown"
import { ThemeToggle } from "../../../components/theme-toggle"
import { Route } from "../route"

export function Header() {
  const { user } = Route.useRouteContext()

  return (
    <header className="flex w-full flex-col items-center justify-center border-border border-x border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex items-center justify-between py-4">
        <Link className="flex items-center gap-x-2" to="/">
          <EncoderDisc className="size-8" />
          <span className="font-semibold text-lg">Boring Tanstack</span>
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
