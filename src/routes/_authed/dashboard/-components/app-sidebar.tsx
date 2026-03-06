import { Link, useRouteContext } from "@tanstack/react-router"
import {
  Bot,
  Command,
  Frame,
  InboxIcon,
  type LucideIcon,
  MapIcon,
  PieChart,
  Settings2,
} from "lucide-react"
import type * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { FileRoutesByTo } from "@/routeTree.gen"
import { NavMain } from "./sidebar-nav-main"
import { NavProjects } from "./sidebar-nav-projects"

type AppRoutePaths = keyof FileRoutesByTo

const data: {
  navMain: {
    title: string
    url: AppRoutePaths
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: AppRoutePaths
    }[]
  }[]
  projects: {
    name: string
    url: AppRoutePaths
    icon: LucideIcon
  }[]
} = {
  navMain: [
    {
      title: "Inbox",
      url: "/dashboard/inbox",
      icon: InboxIcon,
    },
    {
      title: "Models",
      url: "/dashboard/models",
      icon: Bot,
    },
    {
      title: "Settings",
      url: "/",
      icon: Settings2,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/",
      icon: MapIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useRouteContext({ from: "__root__" })
  return (
    <Sidebar className="bg-background" variant="inset" {...props}>
      <SidebarHeader className="bg-background">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link to="/" />} size="lg">
              <div className="flex aspect-square size-6 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
    </Sidebar>
  )
}
