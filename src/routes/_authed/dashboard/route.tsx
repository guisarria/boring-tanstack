import { createFileRoute, Outlet } from "@tanstack/react-router"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/routes/_authed/dashboard/-components/app-sidebar"

export const Route = createFileRoute("/_authed/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider className="has-data-[variant=inset]:bg-background">
      <AppSidebar className="bg-background p-0" />
      <SidebarInset className="bg-background md:peer-data-[variant=inset]:mt-0 md:peer-data-[variant=inset]:rounded-none">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
