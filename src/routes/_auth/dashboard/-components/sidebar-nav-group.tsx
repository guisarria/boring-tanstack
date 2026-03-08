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

export type NavItem = {
  icon: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: AppRoutePaths
  }[]
  title: string
  url: AppRoutePaths
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
  const location = useLocation()
  const currentPathname = location.pathname
  return (
    <Collapsible
      className="group/collapsible"
      defaultOpen
      render={<SidebarGroup className={className} />}
    >
      <SidebarGroupLabel
        className="group/label"
        render={<CollapsibleTrigger className={"flex items-center gap-x-2"} />}
      >
        {label}
        <ChevronRight className="transition-transform duration-200 group-data-panel-open/label:rotate-90" />
      </SidebarGroupLabel>
      <CollapsibleContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <Collapsible
                defaultOpen={item.isActive}
                key={item.title}
                render={<SidebarMenuItem />}
              >
                <SidebarMenuButton
                  isActive={currentPathname === item.url}
                  render={<Link to={item.url} />}
                  tooltip={item.title}
                >
                  <item.icon className="text-muted-foreground" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuAction className="data-[state=open]:rotate-90" />
                      }
                    >
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              render={<Link to={subItem.url} />}
                            >
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </CollapsibleContent>
    </Collapsible>
  )
}
