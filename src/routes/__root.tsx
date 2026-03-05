import { TanStackDevtools } from "@tanstack/react-devtools"
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { DefaultNotFound } from "@/components/default-not-found"
import { Header } from "@/components/header"
import TanStackQueryProvider, {
  type AppRouterContext,
} from "@/components/providers/root-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { getSession } from "@/modules/auth/auth.functions"
import TanStackQueryDevtools from "../components/providers/devtools"
import appCss from "../styles.css?url"

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    links: [
      {
        href: appCss,
        rel: "stylesheet",
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
  }),
  shellComponent: RootDocument,
  beforeLoad: async () => {
    const session = await getSession()
    return { user: session?.user ?? null }
  },
  notFoundComponent: DefaultNotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex h-screen w-full flex-col items-center font-sans antialiased">
        <TanStackQueryProvider queryClient={queryClient}>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <Header />
            {children}
            <Toaster richColors />
          </ThemeProvider>

          <TanStackDevtools
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
          />
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
