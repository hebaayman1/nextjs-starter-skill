import { registry, sections } from "./_lib/registry"

export default function DesignSystemPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-xl">
      <header className="flex flex-col gap-2xs">
        <h1 className="text-heading font-semibold">Design system</h1>
        <p className="text-body text-content-secondary">Every shared component, rendered in all its states.</p>
      </header>
      {sections.map((section) => {
        const entries = registry.filter((entry) => entry.section === section)
        if (entries.length === 0) return null
        return (
          <section key={section} className="flex flex-col gap-m">
            <h2 className="text-caption font-medium tracking-wide text-content-tertiary uppercase">{section}</h2>
            {entries.map(({ slug, title, Demo }) => (
              <article id={slug} key={slug} className="flex flex-col gap-s rounded-lg bg-bg-primary p-l shadow-s">
                <h3 className="text-title font-medium">{title}</h3>
                <Demo />
              </article>
            ))}
          </section>
        )
      })}
    </div>
  )
}
