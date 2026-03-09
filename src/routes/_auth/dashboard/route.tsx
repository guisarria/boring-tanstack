import { createFileRoute, Outlet } from "@tanstack/react-router"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/routes/_auth/dashboard/-components/app-sidebar"
import { AppHeader } from "@/routes/_auth/dashboard/-components/app-sidebar-header"

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider className="sm:pt-2">
      <AppSidebar />
      <SidebarInset className="rounded-none md:peer-data-[variant=inset]:mt-0 md:peer-data-[variant=inset]:rounded-md">
        <div className="flex w-full flex-1 flex-col border border-border bg-muted/30 pt-0 sm:rounded-md">
          <AppHeader />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
