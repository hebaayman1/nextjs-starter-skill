import { ImageResponse } from "next/og"
import { site } from "@/config/site"

export const alt = site.name
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Social preview generated at build time. ImageResponse cannot read CSS variables,
// so these colors mirror the light tokens in globals.css.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: 80,
          background: "#f5f5f4",
          color: "#171717",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 600 }}>{site.name}</div>
        <div style={{ marginTop: 24, fontSize: 36, color: "#52525b" }}>{site.description}</div>
      </div>
    ),
    size,
  )
}
