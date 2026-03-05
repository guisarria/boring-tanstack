import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { getSession } from "@/modules/auth/auth.functions"

export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ location }) => {
    const { user, session } = await getSession()

    if (!user) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
      })
    }

    return { user, session }
  },
  component: () => <Outlet />,
})
