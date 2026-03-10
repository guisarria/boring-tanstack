import { createFileRoute } from "@tanstack/react-router"
import { CircleDashed } from "lucide-react"
import { Empty, EmptyTitle } from "@/components/ui/empty"

export const Route = createFileRoute("/_auth/dashboard/my-issues")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Empty className="flex h-full flex-1 flex-col items-center justify-center">
      <CircleDashed
        absoluteStrokeWidth
        className="size-20 text-destructive"
        strokeWidth={1}
      />
      <EmptyTitle>No issues</EmptyTitle>
    </Empty>
  )
}
