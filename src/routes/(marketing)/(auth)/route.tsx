import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/(marketing)/(auth)")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Outlet />
    </div>
  )
}
