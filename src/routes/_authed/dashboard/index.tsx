import { createFileRoute } from "@tanstack/react-router"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/routes/_authed/dashboard/-components/app-sidebar"

export const Route = createFileRoute("/_authed/dashboard/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider className="has-data-[variant=inset]:bg-background">
      <AppSidebar className="bg-background p-0" />
      <SidebarInset className="bg-background md:peer-data-[variant=inset]:mt-0 md:peer-data-[variant=inset]:rounded-none">
        <div className="flex flex-1 flex-col p-1 pt-2 pr-0">
          <div className="grid min-h-screen flex-1 place-items-center rounded-md border border-border/90 bg-card/65 md:min-h-min">
            <span className="text-muted-foreground text-sm">
              Content goes here
            </span>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
