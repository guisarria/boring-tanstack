import { Link } from "@tanstack/react-router"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Container, Nav } from "@/components/ui/design-system"
import { UserDropdown } from "@/modules/auth/components/user-dropdown"
import { Route } from "../route"

export function Header() {
  const { user } = Route.useRouteContext()

  return (
    <header className="fixed inset-x-0 z-90 flex justify-center">
      <Nav className="sm:px-0">
        <Container className="flex justify-between">
          <Link to="/">
            <span className="relative flex items-center gap-0.5">
              <span className="font-pixel text-xl">Boring Tanstack</span>
              <span
                aria-hidden="true"
                className="absolute inset-0 flex animate-pulse items-center gap-0.5 blur-xs"
              >
                <span className="font-pixel text-xl">Boring Tanstack</span>
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-x-2">
            <ThemeToggle variant="outline" />
            {user ? (
              <UserDropdown />
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
        </Container>
      </Nav>
    </header>
  )
}
