import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router"

import { DefaultNotFound } from "@/components/default-not-found"
import {
  type AppRouterContext,
  TanStackQueryProvider,
} from "@/components/providers/root-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { getSession } from "@/modules/auth/auth.functions"

import appCss from "../styles.css?url"

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    meta: [
      { title: "Boring TanStack" },
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
      <body className="selection:text-background dark:selection:text-foreground selection:bg-cyan-700">
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
