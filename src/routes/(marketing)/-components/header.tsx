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
      <Nav>
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
              <ul className="flex items-center gap-x-2">
                <li>
                  <Button render={<Link to="/sign-in" />} variant="outline">
                    Sign in
                  </Button>
                </li>
                <li>
                  <Button render={<Link to="/sign-up" />} variant="default">
                    Sign Up
                  </Button>
                </li>
              </ul>
            )}
          </div>
        </Container>
      </Nav>
    </header>
  )
}
