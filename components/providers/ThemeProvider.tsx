"use client"

/**
 * components/providers/ThemeProvider.tsx
 *
 * Thin wrapper around next-themes.
 * Why a wrapper?
 * - Keeps layout.tsx clean — one import, not three
 * - If we ever swap next-themes for something else, only this file changes
 * - "use client" directive is isolated here, not polluting layout.tsx
 *
 * Config decisions:
 * - attribute="data-theme": pairs with [data-theme="dark"] CSS selectors
 * - defaultTheme="light": PRD specifies light as intentional default
 * - enableSystem=false: we want to control the default, not inherit OS preference
 * - disableTransitionOnChange=false: smooth 0.3s transition defined in globals.css
 */

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
