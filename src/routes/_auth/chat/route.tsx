import { createFileRoute, Outlet } from "@tanstack/react-router"

import { chatListQueryOptions } from "@/modules/ai/query-options"
import { AppHeader } from "@/routes/_auth/-components/app-sidebar-header"

import { AppSidebarLayout } from "../-components/app-sidebar-layout"

export const Route = createFileRoute("/_auth/chat")({
  beforeLoad: async ({ context }) => {
    await context.queryClient.fetchQuery(chatListQueryOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AppSidebarLayout navGroups={[]}>
      <AppHeader basePath="/dashboard" rootLabel="Dashboard" />
      <Outlet />
    </AppSidebarLayout>
  )
}
