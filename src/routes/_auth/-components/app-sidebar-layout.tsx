import { Section } from "@/components/ui/design-system"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar, type NavGroup } from "./app-sidebar"

export function AppSidebarLayout({
  children,
  navGroups,
}: {
  children: React.ReactNode
  navGroups?: NavGroup[]
}) {
  return (
    <SidebarProvider className="h-screen overflow-hidden md:p-2">
      <AppSidebar navGroups={navGroups} />

      <SidebarInset className="rounded-none md:peer-data-[variant=inset]:mt-0 md:peer-data-[variant=inset]:rounded-md">
        <Section className="flex h-full flex-col items-stretch border border-border bg-muted/30 md:rounded-md">
          {children}
        </Section>
      </SidebarInset>
    </SidebarProvider>
  )
}
