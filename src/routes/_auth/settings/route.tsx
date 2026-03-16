import { createFileRoute, Outlet } from "@tanstack/react-router"
import { ShieldIcon, UserIcon } from "lucide-react"

import { Main } from "@/components/ui/design-system"
import type { NavGroup } from "@/routes/_auth/-components/app-sidebar"
import { AppHeader } from "@/routes/_auth/-components/app-sidebar-header"

import { AppSidebarLayout } from "../-components/app-sidebar-layout"

const navGroups: NavGroup[] = [
  {
    label: "Settings",
    items: [
      { title: "Profile", url: "/settings", icon: UserIcon },
      {
        title: "Security",
        url: "/settings/security",
        icon: ShieldIcon,
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
      <Main className="py-4">
        <Outlet />
      </Main>
    </AppSidebarLayout>
  )
}
