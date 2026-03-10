import { useRouteContext } from "@tanstack/react-router"
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

export type NavGroup = {
  label: string
  items: NavItem[]
}

export function AppSidebar({
  navGroups,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navGroups: NavGroup[]
}) {
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
        {navGroups.map((group) => (
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
