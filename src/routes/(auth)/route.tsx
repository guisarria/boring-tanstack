import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/(auth)")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen w-full flex-col items-center">
      <Outlet />
    </div>
  )
}
