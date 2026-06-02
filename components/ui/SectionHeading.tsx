/**
 * components/ui/SectionHeading.tsx
 *
 * Consistent section heading used across every section (About, Skills,
 * Projects, etc.). Encodes the visual standard:
 *   - Cormorant Garamond, large size
 *   - Aquamarine accent underline (via .accent-line CSS utility)
 *   - Optional subtitle in muted text below
 *
 * This is the second-highest leverage consistency component after SectionWrapper.
 * One component → every section heading looks like it belongs together.
 */

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type SectionHeadingProps = {
  children:    ReactNode
  subtitle?:   string
  className?:  string
  /** Align: default left, "center" for centered sections */
  align?:      "left" | "center"
}

export function SectionHeading({
  children,
  subtitle,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      <h2
        className={cn(
          // Typography: Cormorant Garamond, editorial scale
          "font-[family-name:var(--font-heading)]",
          "text-4xl md:text-5xl lg:text-6xl",
          "font-semibold leading-tight tracking-tight",
          "text-[var(--text-primary)]",
          // Accent underline utility from globals.css
          "accent-line",
          align === "center" && "inline-block"
        )}
      >
        {children}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "mt-6 text-base md:text-lg",
            "text-[var(--text-muted)] leading-relaxed",
            "max-w-xl",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
