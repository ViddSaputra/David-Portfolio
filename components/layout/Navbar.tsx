"use client"

/**
 * components/layout/Navbar.tsx — Polish pass
 *
 * STRUCTURAL CHANGE: full-width header strip → floating capsule
 *
 * Architecture:
 * - <header> is now a transparent fixed shell, full-width, no background.
 *   Its only job is positioning and z-index.
 * - <nav> inside is the visual object — a centered, max-width constrained
 *   capsule with glass effect, rounded-2xl, border, and shadow.
 *   This is what the user sees floating above the page.
 *
 * Why this works better:
 * - The old header stretched edge-to-edge, making the glass feel like
 *   a heavy bar sitting on top of the page.
 * - The capsule floats — it has clear space on all sides, giving it
 *   presence without weight.
 * - The glass effect is applied to the capsule, not the strip, so
 *   blur and translucency feel contained and intentional.
 *
 * Brand mark:
 * - "David." wordmark → "DS" monogram in Cormorant Garamond
 * - Smaller visual weight than nav links by design
 * - Thin vertical separator between DS and nav links — creates hierarchy
 *   without adding complexity
 * - Hover transitions to accent subtly
 *
 * Glass treatment:
 * - backdrop-filter: blur(20px) saturate(160%) — present but not dramatic
 * - border: 1px solid with low opacity — visible but not glowing
 * - shadow: soft neutral shadow, not accent-tinted — depth, not decoration
 * - Two scroll states: at rest (slightly more transparent), scrolled
 *   (marginally stronger) — barely perceptible transition, just enough
 *
 * Mobile:
 * - Capsule shrinks gracefully on smaller screens
 * - Mobile menu drops below capsule as a separate glass panel
 * - Capsule top offset increases on mobile (mt-3 vs mt-4) to give
 *   breathing room from the screen edge
 */

import { useState, useEffect }        from "react"
import { useTheme }                   from "next-themes"
import { Moon, Sun, Menu, X }         from "lucide-react"
import { motion, AnimatePresence }    from "framer-motion"
import { cn }                         from "@/lib/utils"
import { NAV_LINKS }                  from "@/lib/data"
import { useActiveSection }           from "@/hooks/useActiveSection"

const SECTION_IDS = NAV_LINKS.map(l => l.href.replace("#", ""))

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted,    setMounted]    = useState(false)
  const { theme, setTheme }         = useTheme()
  const activeSection               = useActiveSection(SECTION_IDS)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    setTimeout(() => {
      document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" })
    }, mobileOpen ? 300 : 0)
  }

  return (
    <>
      {/* ── Positioning shell — transparent, full-width ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 md:pt-5 pointer-events-none">

        {/* ── Floating capsule — the actual visual navbar ── */}
        <nav
          className={cn(
            // Layout
            "w-full max-w-3xl",
            "flex items-center justify-between",
            "px-5 py-3",
            "rounded-2xl",
            // Glass effect — consistent, not scroll-dependent
            "backdrop-blur-[24px]",
            // Transitions
            "transition-all duration-300",
            "pointer-events-auto",
          )}
          style={{
            background: "var(--bg-glass)",
            // Top highlight: inset 0 1px 0 creates a subtle inner edge at top
            // Bottom shadow: depth separation from page
            // Combined: macOS-style liquid glass capsule
            border: "1px solid var(--border-subtle)",
            boxShadow: scrolled
              ? [
                  "inset 0 1px 0 rgba(255,255,255,0.08)",   /* top highlight */
                  "0 4px 24px rgba(0,0,0,0.12)",            /* depth */
                  "0 1px 4px rgba(0,0,0,0.06)",             /* base shadow */
                ].join(", ")
              : [
                  "inset 0 1px 0 rgba(255,255,255,0.06)",
                  "0 2px 12px rgba(0,0,0,0.08)",
                  "0 1px 3px rgba(0,0,0,0.04)",
                ].join(", "),
          }}
        >

          {/* ── Brand mark: DS monogram ── */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="flex items-center gap-3 flex-shrink-0"
          >
            {/* DS signature */}
            <span
              className={cn(
                "font-[family-name:var(--font-heading)]",
                "text-lg font-semibold tracking-tight leading-none",
                "transition-colors duration-200",
                "hover:text-[var(--accent)]"
              )}
              style={{ color: "var(--text-primary)" }}
            >
              DS
            </span>

            {/* Thin separator — visual hierarchy between brand and links */}
            <span
              className="hidden md:block w-px h-4 rounded-full flex-shrink-0"
              style={{ background: "var(--border-default)" }}
            />
          </button>

          {/* ── Desktop nav links ── */}
          <ul className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activeSection === href.replace("#", "")
              return (
                <li key={href}>
                  <button
                    onClick={() => handleNavClick(href)}
                    className={cn(
                      "relative text-[13px] font-medium tracking-wide",
                      "transition-colors duration-200",
                      isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {label}
                    {/* Active underline — single source of truth, no hybrid styles.
                        inset-x-0 + mx-auto + w-4 centers the bar under any text length.
                        layoutId triggers Framer layout animation between nav items. */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 inset-x-0 mx-auto h-px w-4 rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  "transition-all duration-200",
                  "text-[var(--text-muted)]",
                  "hover:text-[var(--accent)] hover:bg-[var(--accent-muted)]"
                )}
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
              className={cn(
                "md:hidden w-8 h-8 rounded-lg flex items-center justify-center",
                "transition-all duration-200",
                "text-[var(--text-muted)]",
                "hover:text-[var(--accent)] hover:bg-[var(--accent-muted)]"
              )}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

        </nav>
      </header>

      {/* ── Mobile menu — drops below the capsule ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.98  }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
            // Sits just below the capsule (~72px from top)
            style={{ top: "72px" }}
          >
            <div
              className={cn(
                "w-full max-w-3xl rounded-2xl overflow-hidden",
                "pointer-events-auto",
                "backdrop-blur-[24px]"
              )}
              style={{
                background:  "var(--bg-glass)",
                border:      "1px solid var(--border-default)",
                boxShadow:   ["inset 0 1px 0 rgba(255,255,255,0.06)", "0 4px 24px rgba(0,0,0,0.12)"].join(", "),
              }}
            >
              <ul className="flex flex-col p-2">
                {NAV_LINKS.map(({ label, href }) => {
                  const isActive = activeSection === href.replace("#", "")
                  return (
                    <li key={href}>
                      <button
                        onClick={() => handleNavClick(href)}
                        className={cn(
                          "w-full text-left px-4 py-2.5 rounded-xl",
                          "text-sm font-medium transition-all duration-150",
                          isActive
                            ? "text-[var(--accent)] bg-[var(--accent-muted)]"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-muted)]"
                        )}
                      >
                        {label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}