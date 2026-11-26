import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { surface } from "@/lib/variants"

export default function HomePage() {
  return (
    <section className="flex max-w-3xl flex-col gap-l">
      <div className="flex flex-col gap-xs">
        <h1 className="text-display font-semibold text-content-primary">%%APP_NAME%%</h1>
        <p className="text-body text-content-secondary">
          Next.js App Router · Tailwind v4 tokens · Axios · TanStack Query · Zod · Vitest
        </p>
      </div>
      <div className={`${surface} flex flex-col gap-s p-l`}>
        <p className="text-title font-medium">Start here</p>
        <ul className="list-disc ps-l text-body text-content-secondary">
          <li>Read CLAUDE.md for the architecture rules.</li>
          <li>Replace src/styles/tokens.css with your design tokens.</li>
          <li>Add features under src/features/&lt;name&gt;.</li>
        </ul>
        <div className="flex flex-wrap gap-xs">
          {/* @example-start */}
          <Link href="/posts" className={buttonVariants()}>
            See the example feature
          </Link>
          {/* @example-end */}
          <Link href="/design-system" className={buttonVariants({ variant: "secondary" })}>
            Component gallery
          </Link>
        </div>
      </div>
    </section>
  )
}
