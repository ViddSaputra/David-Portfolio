"use client"

/**
 * hooks/useActiveSection.ts
 *
 * Tracks which section is currently in the viewport using IntersectionObserver.
 * Returns the id of the active section — Navbar uses this to highlight the
 * current nav link as the user scrolls.
 *
 * Architecture: extracted into a hook so Navbar stays clean and this logic
 * is independently testable and reusable.
 */

import { useEffect, useState } from "react"

export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] ?? "")

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          // Mark as active when more than 40% of the section is visible
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { threshold: 0.4 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [sectionIds])

  return activeSection
}
