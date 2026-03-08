import { useRouteContext } from "@tanstack/react-router"
import {
  Frame,
  InboxIcon,
  MapIcon,
  PieChart,
  ScanIcon,
  Settings2,
} from "lucide-react"
import type * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { UserDropdown } from "@/modules/auth/components/user-dropdown"
import { type NavItem, SidebarNavGroup } from "./sidebar-nav-group"

const data: {
  navMain: NavItem[]
  projects: NavItem[]
} = {
  navMain: [
    {
      title: "Inbox",
      url: "/dashboard/inbox",
      icon: InboxIcon,
    },
    {
      title: "My Issues",
      url: "/dashboard/my-issues",
      icon: ScanIcon,
    },
    {
      title: "Settings",
      url: "/",
      icon: Settings2,
    },
  ],
  projects: [
    {
      title: "Design Engineering",
      url: "/",
      icon: Frame,
    },
    {
      title: "Sales & Marketing",
      url: "/",
      icon: PieChart,
    },
    {
      title: "Travel",
      url: "/",
      icon: MapIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useRouteContext({ from: "__root__" })
  return (
    <Sidebar className="px-0" variant="inset" {...props}>
      <SidebarHeader className="pb-0">
        <SidebarMenuButton
          className=""
          render={user ? <UserDropdown label /> : undefined}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavGroup items={data.navMain} label="Main" />
        <SidebarNavGroup items={data.projects} label="Projects" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
