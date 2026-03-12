import { createFileRoute, Outlet } from "@tanstack/react-router"
import { UserIcon, UserKeyIcon } from "lucide-react"
import type { NavGroup } from "@/routes/_auth/-components/app-sidebar"
import { AppHeader } from "@/routes/_auth/-components/app-sidebar-header"
import { AppSidebarLayout } from "../-components/app-sidebar-layout"

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
    <AppSidebarLayout navGroups={navGroups}>
      <AppHeader basePath="/settings" rootLabel="Settings" />
      <Outlet />
    </AppSidebarLayout>
  )
}
