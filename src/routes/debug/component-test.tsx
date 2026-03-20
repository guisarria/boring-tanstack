import { createFileRoute } from "@tanstack/react-router"
import { BadgeCheckIcon, InfoIcon } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Container, Main, Section } from "@/components/ui/design-system"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export const Route = createFileRoute("/debug/component-test")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Main className="flex h-screen w-full flex-col items-center justify-center">
      <Section className="flex h-full w-full flex-col items-center justify-center">
        <ThemeToggle />
        <Container className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center">
          <Checkbox />
          <Item variant="info">
            <ItemMedia>
              <BadgeCheckIcon className="size-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Basic Item</ItemTitle>
              <ItemDescription>
                A simple item with title and description.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Action
              </Button>
            </ItemActions>
          </Item>
          <Alert variant="info">
            <InfoIcon />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Describe what can be done about it here.
            </AlertDescription>
          </Alert>
          <Button variant="destructive">Destructive</Button>
          <Button variant="destructive-outline">Destructive Outline</Button>
          <Badge variant="success">Success</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Show Dialog
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Container>
      </Section>
    </Main>
  )
}
