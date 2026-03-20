import { Link, useLocation, useRouteContext } from "@tanstack/react-router"
import { CornerUpLeftIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { UserDropdown } from "@/modules/auth/components/user-dropdown"

import { SidebarChatList } from "./sidebar-chat-list"
import { SidebarNavGroup } from "./sidebar-nav-group"
import type { NavGroup } from "./types"

export type { NavGroup }

export function AppSidebar({
  navGroups,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navGroups?: NavGroup[]
}) {
  const { user } = useRouteContext({ from: "/_auth" })
  const location = useLocation()
  const isChatRoute = location.pathname.startsWith("/chat")

  return (
    <Sidebar className="px-0 pt-0" variant="inset" {...props}>
      <SidebarHeader className="pt-1 pb-0">
        <SidebarMenuButton
          render={user ? <UserDropdown label /> : undefined}
          size={"lg"}
        />
      </SidebarHeader>

      <SidebarContent>
        {!location.pathname.startsWith("/dashboard") && (
          <div className="px-2 pt-2 text-xs text-muted-foreground">
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="/dashboard" />}>
                <CornerUpLeftIcon
                  className="text-muted-foreground"
                  strokeWidth={1.5}
                />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        )}

        {isChatRoute && <SidebarChatList />}

        {!isChatRoute &&
          navGroups?.map((group) => (
            <SidebarNavGroup
              items={group.items}
              key={group.label}
              label={group.label}
            />
          ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
