import { QueryClient } from "@tanstack/react-query"

export type AppRouterContext = {
  queryClient: QueryClient
}

export function createAppRouterContext(): AppRouterContext {
  return {
    queryClient: new QueryClient(),
  }
}
