import { Button } from "./ui/button"
import { ButtonLink } from "./ui/button-link"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Main, Container } from "./ui/design-system"

export function DefaultNotFound() {
  return (
    <Main className="flex h-screen w-full flex-col items-center justify-center">
      <Container className="flex items-center justify-center">
        <Card className="min-w-md">
          <CardHeader>
            <CardTitle className="font-mono text-xl text-destructive">
              404 - Page Not Found
            </CardTitle>
            <CardDescription className="text-base">
              This page doesn&apos;t exist. Try heading back or returning home.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <CardAction className="flex gap-x-2">
              <Button
                size="lg"
                onClick={() => window.history.back()}
                type="button"
              >
                Go Back
              </Button>
              <ButtonLink size="lg" variant="secondary" to="/">
                Home
              </ButtonLink>
            </CardAction>
          </CardContent>
        </Card>
      </Container>
    </Main>
  )
}
