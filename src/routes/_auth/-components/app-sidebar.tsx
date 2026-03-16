import { useRouteContext } from "@tanstack/react-router"

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
  const { user } = useRouteContext({ from: "/_auth" })

  return (
    <Sidebar className="px-0 pt-0" variant="inset" {...props}>
      <SidebarHeader className="pt-1 pb-0">
        <SidebarMenuButton
          render={user ? <UserDropdown label /> : undefined}
          size={"lg"}
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
