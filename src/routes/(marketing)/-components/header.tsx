import { Link } from "@tanstack/react-router"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Container, GlowText, Nav } from "@/components/ui/design-system"
import { UserDropdown } from "@/modules/auth/components/user-dropdown"
import { Route } from "../route"

export function Header() {
  const { user } = Route.useRouteContext()

  return (
    <header className="fixed inset-x-0 z-90 flex justify-center">
      <Nav>
        <Container className="flex items-center justify-between">
          <Link to="/">
            <GlowText as="p" className="text-xl lg:text-xl">
              Boring Tanstack
            </GlowText>
          </Link>
          <div className="flex items-center gap-x-2">
            <ThemeToggle variant="outline" />
            {user ? (
              <UserDropdown />
            ) : (
              <nav>
                <ul className="flex items-center gap-x-2">
                  <li>
                    <Button
                      nativeButton={false}
                      render={<Link to="/sign-in" />}
                      variant="outline"
                    >
                      Sign in
                    </Button>
                  </li>
                  <li>
                    <Button
                      nativeButton={false}
                      render={<Link to="/sign-up" />}
                      variant="default"
                    >
                      Sign Up
                    </Button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </Container>
      </Nav>
    </header>
  )
}
