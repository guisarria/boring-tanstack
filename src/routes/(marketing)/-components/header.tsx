import { Link } from "@tanstack/react-router"

import { ThemeToggle } from "@/components/theme-toggle"
import { ButtonLink } from "@/components/ui/button-link"
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
            <GlowText className="font-pixel text-xl lg:text-xl">
              Boring Tanstack
            </GlowText>
          </Link>
          <div className="flex items-center gap-x-2">
            <ThemeToggle variant="outline" />
            {user ? (
              <UserDropdown />
            ) : (
              <ul className="flex items-center gap-x-2">
                <li>
                  <ButtonLink variant="outline" to="/sign-in">
                    Sign in
                  </ButtonLink>
                </li>
                <li>
                  <ButtonLink variant="default" to="/sign-up">
                    Sign Up
                  </ButtonLink>
                </li>
              </ul>
            )}
          </div>
        </Container>
      </Nav>
    </header>
  )
}
