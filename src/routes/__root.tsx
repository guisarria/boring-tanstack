import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router"
import { DefaultNotFound } from "@/components/default-not-found"
import TanStackQueryProvider, {
  type AppRouterContext,
} from "@/components/providers/root-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { getSession } from "@/modules/auth/auth.functions"
import appCss from "../styles.css?url"

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    meta: [
      { title: "TanStack Start Starter" },
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [{ href: appCss, rel: "stylesheet" }],
  }),

  shellComponent: RootDocument,
  notFoundComponent: DefaultNotFound,
  beforeLoad: async () => {
    const { user } = await getSession()
    return { user }
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col items-center selection:bg-cyan-700 selection:text-background dark:selection:text-foreground">
        <TanStackQueryProvider queryClient={queryClient}>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="dark"
            disableTransitionOnChange
            enableSystem
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>

          {/* <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          /> */}
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
