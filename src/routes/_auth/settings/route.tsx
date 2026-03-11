import { createFileRoute, Outlet } from "@tanstack/react-router"
import { UserIcon, UserKeyIcon } from "lucide-react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  AppSidebar,
  type NavGroup,
} from "@/routes/_auth/-components/app-sidebar"
import { AppHeader } from "@/routes/_auth/-components/app-sidebar-header"

const navGroups: NavGroup[] = [
  {
    label: "Settings",
    items: [
      { title: "Profile", url: "/settings", icon: UserIcon },
      {
        title: "Security & access",
        url: "/settings/security",
        icon: UserKeyIcon,
      },
    ],
  },
]

export const Route = createFileRoute("/_auth/settings")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider className="sm:pt-2">
      <AppSidebar navGroups={navGroups} />
      <SidebarInset className="rounded-none md:peer-data-[variant=inset]:mt-0 md:peer-data-[variant=inset]:rounded-md">
        <div className="flex flex-1 flex-col border border-border bg-muted/30 sm:rounded-md">
          <AppHeader basePath="/settings" rootLabel="Settings" />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
