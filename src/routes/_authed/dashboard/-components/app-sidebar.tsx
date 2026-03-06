import { useNavigate, useRouteContext, useRouter } from "@tanstack/react-router"
import {
  Bot,
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
import { authClient } from "@/modules/auth/auth-client"
import { UserDropdown } from "@/modules/auth/components/user-dropdown"
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
  const router = useRouter()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.invalidate()
    navigate({ to: "/" })
  }
  const { user } = useRouteContext({ from: "__root__" })
  return (
    <Sidebar className="bg-background" variant="inset" {...props}>
      <SidebarHeader className="bg-background">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                user ? (
                  <UserDropdown label onSignOut={handleSignOut} user={user} />
                ) : undefined
              }
            />
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
