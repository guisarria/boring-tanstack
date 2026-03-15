import { Link, useLocation } from "@tanstack/react-router"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import type { FileRoutesByTo } from "@/routeTree.gen"

type AppRoutePaths = keyof FileRoutesByTo

type NavSubItem = {
  title: string
  url: AppRoutePaths
}

export type NavItem = {
  icon: LucideIcon
  isActive?: boolean
  items?: NavSubItem[]
  title: string
  url: AppRoutePaths
}

function NavItemSubMenu({ items }: { items: NavSubItem[] }) {
  return (
    <>
      <CollapsibleTrigger
        render={<SidebarMenuAction className="data-[state=open]:rotate-90" />}
      >
        <ChevronRight />
        <span className="sr-only">Toggle</span>
      </CollapsibleTrigger>
      <CollapsibleContent render={<SidebarMenuSub />}>
        {items.map((subItem) => (
          <SidebarMenuSubItem key={subItem.title}>
            <SidebarMenuSubButton render={<Link to={subItem.url} />}>
              <span>{subItem.title}</span>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </CollapsibleContent>
    </>
  )
}

function NavMenuEntry({
  item,
  isActive,
}: {
  item: NavItem
  isActive: boolean
}) {
  const Icon = item.icon

  return (
    <Collapsible defaultOpen={item.isActive} render={<SidebarMenuItem />}>
      <SidebarMenuButton
        isActive={isActive}
        render={<Link to={item.url} />}
        tooltip={item.title}
      >
        <Icon className="text-muted-foreground" strokeWidth={1.5} />
        <span className="text-foreground/90 text-sm">{item.title}</span>
      </SidebarMenuButton>

      {item.items?.length ? <NavItemSubMenu items={item.items} /> : null}
    </Collapsible>
  )
}

export function SidebarNavGroup({
  label,
  items,
  className,
}: {
  label: string
  items: NavItem[]
  className?: string
}) {
  const { pathname } = useLocation()

  return (
    <Collapsible
      className="group/collapsible"
      defaultOpen
      render={<SidebarGroup className={className} />}
    >
      <SidebarGroupLabel
        className="group/label"
        render={<CollapsibleTrigger className="flex items-center gap-x-2" />}
      >
        {label}
        <ChevronRight className="transition-transform duration-200 group-data-panel-open/label:rotate-90" />
      </SidebarGroupLabel>

      <CollapsibleContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <NavMenuEntry
                key={item.title}
                item={item}
                isActive={pathname === item.url}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </CollapsibleContent>
    </Collapsible>
  )
}
