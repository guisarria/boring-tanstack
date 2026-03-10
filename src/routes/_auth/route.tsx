import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
      })
    }
  },
  component: () => <Outlet />,
})
