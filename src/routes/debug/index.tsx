import { render } from "@react-email/render"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import VerificationEmail from "@/modules/auth/emails/verification-email"

const getEmailPreview = createServerFn({ method: "GET" }).handler(async () => {
  return await render(
    VerificationEmail({ name: "John Doe", url: "http://localhost:300" })
  )
})

export const Route = createFileRoute("/debug/")({
  beforeLoad: ({ context }) => {
    if (!import.meta.env.DEV) {
      throw redirect({ to: "/" })
    }
    if (context.user?.role !== "admin") {
      throw redirect({
        to: "/",
      })
    }
  },
  loader: () => getEmailPreview(),
  component: RouteComponent,
})

export function RouteComponent() {
  const html = Route.useLoaderData()

  return (
    <div className="relative flex h-screen w-screen flex-col items-start justify-start">
      <iframe
        className="h-full w-full flex-1 border-0"
        srcDoc={html}
        title="Email Preview"
      />
    </div>
  )
}
