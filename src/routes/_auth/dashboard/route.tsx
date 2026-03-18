import { createFileRoute, Outlet } from "@tanstack/react-router"
import { BotIcon, InboxIcon, Settings2 } from "lucide-react"

import type { NavGroup } from "@/routes/_auth/-components/app-sidebar"
import { AppHeader } from "@/routes/_auth/-components/app-sidebar-header"

import { AppSidebarLayout } from "../-components/app-sidebar-layout"

export const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { title: "Note", url: "/dashboard", icon: InboxIcon },
      // { title: "My Issues", url: "/dashboard/my-issues", icon: ScanIcon },
      { title: "Chat", url: "/chat", icon: BotIcon },
      { title: "Account", url: "/settings", icon: Settings2 },
    ],
  },
]

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AppSidebarLayout navGroups={navGroups}>
      <AppHeader basePath="/dashboard" rootLabel="Dashboard" />
      <Outlet />
    </AppSidebarLayout>
  )
}
