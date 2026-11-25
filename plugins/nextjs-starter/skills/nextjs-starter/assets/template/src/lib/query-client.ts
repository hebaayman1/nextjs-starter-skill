import { QueryClient, isServer } from "@tanstack/react-query"
import { isApiError } from "@/lib/api/client"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Avoid refetching immediately after hydration.
        staleTime: 60 * 1000,
        // Never retry client errors (4xx); retry network/5xx up to twice.
        retry: (failureCount, error) => {
          if (isApiError(error) && error.status !== undefined && error.status < 500) return false
          return failureCount < 2
        },
        refetchOnWindowFocus: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

/** New client per server request; one shared client in the browser. */
export function getQueryClient() {
  if (isServer) return makeQueryClient()
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
