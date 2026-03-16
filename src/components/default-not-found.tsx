import { Container } from "@react-email/components"
import { Link } from "@tanstack/react-router"

import { Button } from "./ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Main } from "./ui/design-system"

export function DefaultNotFound() {
  return (
    <Main className="flex h-screen w-full flex-col items-center justify-center">
      <Container className="flex items-center justify-center">
        <Card className="min-w-md">
          <CardHeader>
            <CardTitle className="text-destructive font-mono text-xl">
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
              <Button
                size="lg"
                nativeButton={false}
                render={<Link to="/" />}
                variant="secondary"
              >
                Home
              </Button>
            </CardAction>
          </CardContent>
        </Card>
      </Container>
    </Main>
  )
}
