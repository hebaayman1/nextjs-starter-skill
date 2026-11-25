/** Shared class recipes reused across components so states look identical everywhere. */

export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"

export const disabledState =
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50"

export const popupMotion =
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 transition-[opacity,scale] duration-150 motion-reduce:transition-none"

export const surface = "rounded-lg border border-border-default bg-bg-primary shadow-s"
