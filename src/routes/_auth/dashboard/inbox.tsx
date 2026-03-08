import { createFileRoute } from "@tanstack/react-router"
import { CheckIcon, InboxIcon } from "lucide-react"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Empty, EmptyTitle } from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export const Route = createFileRoute("/_auth/dashboard/inbox")({
  component: RouteComponent,
})

const email = [
  {
    title: "Midnight City Lights",
    description: "Neon Dreams",
  },
  {
    title: "Coffee Shop Conversations",
    description: "The Morning Brew",
  },
  {
    title: "Digital Rain",
    description: "Cyber Symphony",
  },
]

function RouteComponent() {
  return (
    <ResizablePanelGroup>
      <ResizablePanel className="min-w-20" minSize="18rem">
        <ItemGroup className="p-2">
          {email.map((mail) => (
            <Item
              className={"transition-colors hover:bg-muted"}
              key={mail.title}
            >
              <ItemMedia variant="default">
                <Avatar>
                  <AvatarImage
                    className="grayscale-50"
                    src={`https://avatar.vercel.sh/${mail.title}`}
                  />
                  <AvatarFallback>G</AvatarFallback>
                  <AvatarBadge>
                    <CheckIcon />
                  </AvatarBadge>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">{mail.title}</ItemTitle>
                <ItemDescription className="line-clamp-1">
                  {mail.description}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button>Action</Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel minSize="50%">
        <Empty className="flex h-full flex-col items-center justify-center">
          <InboxIcon
            absoluteStrokeWidth
            className="size-40 text-muted-foreground"
            strokeWidth={1.5}
          />
          <EmptyTitle>No notifications</EmptyTitle>
        </Empty>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
