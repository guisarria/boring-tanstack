import { Link } from "@tanstack/react-router"
import { BlurOverlay } from "@/components/blur-overlay"
import { Button } from "@/components/ui/button"
import { Container, Nav } from "@/components/ui/design-system"
import { UserDropdown } from "@/modules/auth/components/user-dropdown"
import { ThemeToggle } from "../../../components/theme-toggle"
import { Route } from "../route"

export function Header() {
  const { user } = Route.useRouteContext()

  return (
    <header className="fixed inset-x-0 z-40 flex justify-center">
      <Nav className="z-90 sm:px-0">
        <Container className="relative flex justify-between">
          <span className="relative flex items-center gap-0.5">
            <span className="font-pixel text-xl">Boring Tanstack</span>
            <span
              aria-hidden="true"
              className="absolute inset-0 flex animate-pulse items-center gap-0.5 blur-xs"
            >
              <span className="font-pixel text-xl">Boring Tanstack</span>
            </span>
          </span>

          <div className="flex items-center gap-x-2">
            <ThemeToggle
              className="bg-background dark:bg-[#1E1E1E]"
              variant="outline"
            />
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
        </Container>
      </Nav>
      <BlurOverlay position="both" size={85} />
    </header>
  )
}
