import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { getContext } from "./components/providers/root-provider"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const router = createTanStackRouter({
    context: getContext(),
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    routeTree,

    scrollRestoration: true,
  })

  return router
}
