"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl"
import type { ReactNode } from "react"
import { getQueryClient } from "@/lib/query-client"

type ProvidersProps = { children: ReactNode; locale: string; messages: AbstractIntlMessages; timeZone: string }

/** All client-side context providers live here, so layouts stay server components. */
export function Providers({ children, locale, messages, timeZone }: ProvidersProps) {
  const queryClient = getQueryClient()
  return (
    // The client provider gets everything as props. The server one would read the request locale from
    // headers(), which cacheComponents rejects during prerendering.
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}
