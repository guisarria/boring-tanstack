import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar, type NavGroup } from "./app-sidebar"

export function AppSidebarLayout({
  children,
  navGroups,
}: {
  children: React.ReactNode
  navGroups: NavGroup[]
}) {
  return (
    <SidebarProvider className="md:pt-2">
      <AppSidebar navGroups={navGroups} />
      <SidebarInset className="rounded-none md:peer-data-[variant=inset]:mt-0 md:peer-data-[variant=inset]:rounded-md">
        <div className="border-border bg-muted/30 flex flex-1 flex-col border md:rounded-md">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
