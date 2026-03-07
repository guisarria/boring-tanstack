import { createFileRoute, Outlet } from "@tanstack/react-router"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/routes/_auth/dashboard/-components/app-sidebar"

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider className="h-screen overflow-hidden p-1 pt-2 has-data-[variant=inset]:bg-background">
      <AppSidebar />
      <SidebarInset className="bg-background md:peer-data-[variant=inset]:mt-0 md:peer-data-[variant=inset]:rounded-none">
        <div className="flex h-full flex-col place-items-center rounded-md border border-border/90 bg-card/65">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
