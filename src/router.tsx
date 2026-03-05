import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { createAppRouterContext } from "@/components/providers/root-provider"
import { DefaultCatchBoundary } from "./components/default-catch-boundary"
import { DefaultNotFound } from "./components/default-not-found"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const rqContext = createAppRouterContext()

  const router = createTanStackRouter({
    context: rqContext,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    routeTree,
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: DefaultNotFound,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  })

  return router
}
