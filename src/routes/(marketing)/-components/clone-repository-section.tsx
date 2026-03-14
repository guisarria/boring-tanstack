import { CopyButton } from "@/components/ui/copy-button"
import { Container, GlowText, Section } from "@/components/ui/design-system"
import { Item, ItemActions } from "@/components/ui/item"

export function CloneRepository() {
  return (
    <Section className="pt-28 pb-48">
      <Container className="flex flex-col items-center gap-y-4 text-center">
        <GlowText className="text-4xl md:text-5xl">Ready to build?</GlowText>
        <p className="text-muted-foreground text-lg">
          Clone the repository and start shipping in minutes.
        </p>
        <Item
          className="flex max-w-lg items-center justify-between p-4"
          size="default"
          variant="outline"
        >
          <pre>
            <code className="text-foreground w-full text-left font-mono text-xs select-all sm:text-sm">
              git clone github.com/guisarria/boring-tanstack
            </code>
          </pre>
          <ItemActions>
            <CopyButton textToCopy="git clone github.com/guisarria/boring-tanstack" />
          </ItemActions>
        </Item>
      </Container>
    </Section>
  )
}
