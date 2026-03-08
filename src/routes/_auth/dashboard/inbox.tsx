import { createFileRoute } from "@tanstack/react-router"
import { InboxIcon } from "lucide-react"
import { Empty, EmptyTitle } from "@/components/ui/empty"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export const Route = createFileRoute("/_auth/dashboard/inbox")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ResizablePanelGroup>
      <ResizablePanel className="min-w-20" minSize="20%">
        <h1>Hiii</h1>
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
