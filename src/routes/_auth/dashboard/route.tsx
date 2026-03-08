import { createFileRoute, Outlet } from "@tanstack/react-router"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/routes/_auth/dashboard/-components/app-sidebar"

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider className="pt-2">
      <AppSidebar />
      <SidebarInset className="md:peer-data-[variant=inset]:mt-0 md:peer-data-[variant=inset]:rounded-md">
        <div className="flex h-full flex-col place-items-center rounded-md border border-border bg-muted/30">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
