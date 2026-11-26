import { %%FONT_IMPORTS%% } from "next/font/google"

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
// @arabic-start
// Covers Arabic, Persian and Urdu. theme.css lists it after Inter, so the browser picks it per glyph.
export const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic", display: "swap" })
// @arabic-end

export const fontVariables = [
  inter.variable,
  // @arabic-start
  arabic.variable,
  // @arabic-end
].join(" ")
