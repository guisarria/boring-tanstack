import { QueryClientProvider } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router"

import { DefaultNotFound } from "@/components/default-not-found"
import { type AppRouterContext } from "@/components/providers/root-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { seo } from "@/config/seo"
import { getSession } from "@/modules/auth/functions"

import appCss from "../styles.css?url"

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      ...seo({ title: "Boring TanStack", url: "/" }).meta,
    ],
    links: [{ href: appCss, rel: "stylesheet" }],
    scripts: [
      {
        src: "//unpkg.com/react-scan/dist/auto.global.js",
        crossOrigin: "anonymous",
        async: true,
        defer: true,
      },
    ],
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
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="dark"
            disableTransitionOnChange
            enableSystem
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
