import { createFileRoute, Outlet } from "@tanstack/react-router"

import { Header } from "@/routes/(marketing)/-components/header"

export const Route = createFileRoute("/(marketing)")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
