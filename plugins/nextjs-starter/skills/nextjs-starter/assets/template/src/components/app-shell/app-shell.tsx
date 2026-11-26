"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { focusRing } from "@/lib/variants"
import { navigation } from "./navigation"
// @themes-start
import { ThemeToggle } from "./theme-toggle"
// @themes-end

const APP_NAME = "%%APP_NAME%%"

type NavListProps = { pathname: string | null; onNavigate?: () => void }

function NavList({ pathname, onNavigate }: NavListProps) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-m">
      {navigation.map((group, index) => (
        <div key={group.label ?? index} className="flex flex-col gap-3xs">
          {group.label ? (
            <p className="px-s pb-2xs text-caption font-medium text-content-tertiary uppercase">{group.label}</p>
          ) : null}
          {group.items.map((item) => {
            const active = pathname !== null && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-s py-xs text-body text-content-secondary transition-colors hover:bg-bg-tertiary",
                  active && "bg-bg-brand-subtle font-medium text-content-brand hover:bg-bg-brand-subtle",
                  focusRing,
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

function ActiveNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return <NavList pathname={pathname} onNavigate={onNavigate} />
}

/**
 * usePathname() is request-time data. With cacheComponents it must sit under <Suspense>,
 * so the shell prerenders with plain links and the active state streams in.
 */
function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Suspense fallback={<NavList pathname={null} onNavigate={onNavigate} />}>
      <ActiveNavList onNavigate={onNavigate} />
    </Suspense>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-dvh bg-bg-secondary">
      {/* Desktop rail */}
      <aside className="hidden w-60 shrink-0 flex-col gap-l border-e border-border-default bg-bg-primary p-m lg:flex">
        <Link href="/" className={cn("px-s text-title font-semibold text-content-primary", focusRing)}>
          {APP_NAME}
        </Link>
        <NavLinks />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-s border-b border-border-default bg-bg-primary px-m">
          <button
            type="button"
            className={cn("rounded-md p-xs text-content-primary hover:bg-bg-tertiary lg:hidden", focusRing)}
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-title font-semibold text-content-primary lg:hidden">{APP_NAME}</span>
          {/* @themes-start */}
          <div className="ms-auto">
            <ThemeToggle />
          </div>
          {/* @themes-end */}
        </header>

        <main className="flex-1 p-m lg:p-l">{children}</main>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col gap-l bg-bg-primary p-m shadow-m">
            <span className="px-s text-title font-semibold text-content-primary">{APP_NAME}</span>
            <NavLinks onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </div>
  )
}
