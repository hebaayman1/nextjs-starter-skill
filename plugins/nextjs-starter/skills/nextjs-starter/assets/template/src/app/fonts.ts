import { Inter } from "next/font/google"

// Add a second family here for other scripts (e.g. Noto Sans Arabic) and expose it as another CSS variable.
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
