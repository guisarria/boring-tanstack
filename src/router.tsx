import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { createAppRouterContext } from "@/components/providers/root-provider"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  return createTanStackRouter({
    context: createAppRouterContext(),
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    routeTree,
    scrollRestoration: true,
  })
}
