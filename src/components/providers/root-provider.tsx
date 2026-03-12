import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

export type AppRouterContext = {
  queryClient: QueryClient
}

export function createAppRouterContext(): AppRouterContext {
  return {
    queryClient: new QueryClient(),
  }
}

type TanStackQueryProviderProps = {
  children: ReactNode
  queryClient: QueryClient
}

export function TanStackQueryProvider({
  children,
  queryClient,
}: TanStackQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
