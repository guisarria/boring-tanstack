import { createFileRoute, Outlet } from "@tanstack/react-router"
import {
  BotIcon,
  Frame,
  InboxIcon,
  MapIcon,
  PieChart,
  ScanIcon,
  Settings2,
} from "lucide-react"

import type { NavGroup } from "@/routes/_auth/-components/app-sidebar"
import { AppHeader } from "@/routes/_auth/-components/app-sidebar-header"

import { AppSidebarLayout } from "../-components/app-sidebar-layout"

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { title: "Inbox", url: "/dashboard/inbox", icon: InboxIcon },
      { title: "My Issues", url: "/dashboard/my-issues", icon: ScanIcon },
      { title: "Chat", url: "/dashboard/chat", icon: BotIcon },
      { title: "Account", url: "/settings", icon: Settings2 },
    ],
  },
  {
    label: "Projects",
    items: [
      { title: "Design Engineering", url: "/settings", icon: Frame },
      { title: "Sales & Marketing", url: "/settings", icon: PieChart },
      { title: "Travel", url: "/settings", icon: MapIcon },
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
