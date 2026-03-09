import { CopyButton } from "@/components/ui/copy-button"
import { Container, Section } from "@/components/ui/design-system"

export function CloneRepository() {
  return (
    <Section className="container flex w-full flex-col items-center pt-28 pb-48">
      <Container className="flex flex-col items-center gap-y-4 text-center">
        <span className="relative flex items-center gap-0.5 text-left">
          <h2 className="section-title z-10 font-pixel md:text-5xl">
            Ready to build?
          </h2>
          <span
            aria-hidden="true"
            className="selection-none absolute inset-0 flex animate-pulse items-center gap-0.5 blur-xs"
          >
            <span className="section-title font-pixel md:text-5xl">
              Ready to build?
            </span>
          </span>
        </span>
        <p className="text-lg text-muted-foreground">
          Clone the repository and start shipping in minutes.
        </p>
        <div className="flex w-full items-center gap-x-2 rounded-md border border-border p-4 font-mono text-sm lg:max-w-lg">
          <span aria-hidden className="select-none text-cyan-300">
            $
          </span>
          <code className="flex-1 select-all text-left text-foreground text-sm">
            git clone github.com/guisarria/boring-tanstack
          </code>
          <CopyButton textToCopy="git clone github.com/guisarria/boring-tanstack" />
        </div>
      </Container>
    </Section>
  )
}
