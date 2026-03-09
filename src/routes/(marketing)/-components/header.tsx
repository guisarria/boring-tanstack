import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { UserDropdown } from "@/modules/auth/components/user-dropdown"
import { ThemeToggle } from "../../../components/theme-toggle"
import { Route } from "../route"

export function Header() {
  const { user } = Route.useRouteContext()

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex w-full flex-col items-center justify-center border-transparent bg-transparent backdrop-blur-none">
      <div className="container flex items-center justify-between py-4">
        <span className="relative flex items-center gap-0.5">
          <span className="font-normal font-pixel text-xl">
            Boring Tanstack
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 flex animate-pulse items-center gap-0.5 blur-xs"
          >
            <span className="font-normal font-pixel text-xl">
              Boring Tanstack
            </span>
          </span>
        </span>

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
