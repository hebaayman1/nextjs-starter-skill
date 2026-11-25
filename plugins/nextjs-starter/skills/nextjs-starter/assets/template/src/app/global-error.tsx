"use client"

import "./globals.css"

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-s p-l text-center">
        <p className="text-heading font-semibold text-content-primary">Something went wrong</p>
        <button
          type="button"
          className="rounded-md bg-bg-brand px-m py-xs text-content-on-brand"
          onClick={() => reset()}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
