import { Link } from "@tanstack/react-router"
import { Container } from "@/components/ui/design-system"
import { Icons } from "@/components/ui/icons"

export function Footer() {
  return (
  <footer className="w-full pb-4 text-muted-foreground text-sm">
    <Container className="flex justify-between">
      <p>© Boring TanStack</p>
      <nav className="flex gap-x-12">
        <section className="flex flex-col gap-y-2">
          <h2 className="text-foreground">Legal</h2>
          <ul className="flex flex-col gap-y-2">
            <li>
              <Link to="/">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/">Terms of Service</Link>
            </li>
          </ul>
        </section>
        <section className="flex flex-col gap-y-2">
          <h2 className="text-foreground">Links</h2>
          <ul className="flex flex-col gap-y-2">
            <li>
              <a
                className="flex items-center gap-x-2"
                href="https://github.com/guisarria/boring-tanstack"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icons.gitHub aria-hidden="true" />
                GitHub
              </a>
            </li>
          </ul>
        </section>
      </nav>
    </Container>
  </footer>
  )
}
