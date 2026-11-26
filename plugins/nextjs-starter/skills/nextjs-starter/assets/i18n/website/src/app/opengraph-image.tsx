import { ImageResponse } from "next/og"
import { site } from "@/config/site"

export const alt = site.name
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Social preview generated at build time, shared by every language. ImageResponse cannot lay out
// right-to-left text or read CSS variables, so it shows the brand name in colors mirroring globals.css.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: 80,
          background: "#f5f5f4",
          color: "#171717",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 600 }}>{site.name}</div>
      </div>
    ),
    size,
  )
}
