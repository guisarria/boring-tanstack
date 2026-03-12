import { CopyButton } from "@/components/ui/copy-button"
import { Container, GlowText, Section } from "@/components/ui/design-system"
import { Item, ItemActions, ItemContent } from "@/components/ui/item"

export function CloneRepository() {
  return (
    <Section className="flex w-full flex-col items-center pt-28 pb-48">
      <Container className="flex flex-col items-center gap-y-4 text-center">
        <GlowText className="text-4xl md:text-5xl">Ready to build?</GlowText>
        <p className="text-lg text-muted-foreground">
          Clone the repository and start shipping in minutes.
        </p>
        <Item className="max-w-lg p-4" size="default" variant="outline">
          <ItemContent>
            <code className="w-full select-all text-left font-mono text-foreground text-xs sm:text-sm">
              git clone github.com/guisarria/boring-tanstack
            </code>
          </ItemContent>
          <ItemActions>
            <CopyButton textToCopy="git clone github.com/guisarria/boring-tanstack" />
          </ItemActions>
        </Item>
      </Container>
    </Section>
  )
}
