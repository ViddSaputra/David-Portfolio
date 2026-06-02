/**
 * app/layout.tsx — Root layout
 *
 * Responsibilities (and only these):
 *   1. Import self-hosted fonts via @fontsource (works offline/CI)
 *   2. Set metadata
 *   3. Mount ThemeProvider so all children have theme context
 *   4. Render Navbar once, above all page content
 *
 * Font strategy: @fontsource packages bundle font files locally.
 * No Google Fonts CDN dependency — faster, privacy-friendly, works offline.
 * CSS variables (--font-heading, --font-body) bridge fonts → Tailwind.
 */

import type { Metadata } from "next"
import "./globals.css"
// Self-hosted fonts — no external CDN dependency
import "@fontsource/cormorant-garamond/300.css"
import "@fontsource/cormorant-garamond/400.css"
import "@fontsource/cormorant-garamond/500.css"
import "@fontsource/cormorant-garamond/600.css"
import "@fontsource/cormorant-garamond/700.css"
import "@fontsource/cormorant-garamond/400-italic.css"
import "@fontsource/cormorant-garamond/600-italic.css"
import "@fontsource/inter/300.css"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Navbar }        from "@/components/layout/Navbar"

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:       "David Portfolio",
  description: "Personal portfolio of David Saputra, a Machine Learning enthusiast and developer.",
  keywords:    ["machine learning", "developer", "portfolio", "Next.js"],
  authors:     [{ name: "David Saputra" }],
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
