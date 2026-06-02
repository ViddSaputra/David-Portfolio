"use client"

/**
 * components/sections/About.tsx
 *
 * Alignment fix: SectionHeading moved ABOVE the grid.
 * The grid now contains only: paragraphs (left) | divider | cards (right).
 * Both columns start at the exact same top edge — no offset hacks needed.
 *
 * Previous approach (heading inside left column + pt offset on right) was
 * fragile — the offset was a magic number that didn't account for font
 * rendering differences across screens. This structure is correct by design.
 */

import { motion }                    from "framer-motion"
import { MapPin, Compass, BookOpen } from "lucide-react"
import { SectionWrapper }            from "@/components/ui/SectionWrapper"
import { SectionHeading }            from "@/components/ui/SectionHeading"
import { ABOUT }                     from "@/lib/data"
import {
  staggerContainer,
  staggerContainerSlow,
  fadeUp,
  fadeRight,
  viewportOnce,
} from "@/lib/animations"
import { cn } from "@/lib/utils"

const DETAILS = [
  { icon: MapPin,   label: "Based in", value: "Indonesia"         },
  { icon: Compass,  label: "Focus",    value: "Machine Learning"  },
  { icon: BookOpen, label: "Vocational Major",   value: "Computer and Network Engineering" },
] as const

export function About() {
  return (
    <SectionWrapper id="about">

      {/* Heading sits above the grid — not part of any column */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
      >
        <SectionHeading>About me</SectionHeading>
      </motion.div>

      {/* Grid: paragraphs left, divider, cards right — both start at same top */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_380px] gap-12 lg:gap-0 items-start">

        {/* ── Left: Paragraphs ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col gap-5"
        >
          {ABOUT.paragraphs.map((para, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              className={cn(
                "text-base md:text-[17px]",
                "leading-[1.85]",
                "text-[var(--text-secondary)]",
                "max-w-lg"
              )}
            >
              {para}
            </motion.p>
          ))}
        </motion.div>

        {/* ── Vertical divider (desktop only) ── */}
        <div className="hidden lg:flex justify-center px-10">
          <div
            className="w-px h-44 rounded-full"
            style={{ background: "var(--border-subtle)" }}
          />
        </div>

        {/* ── Right: Three detail cards ── */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col gap-3"
        >
          {DETAILS.map(({ icon: Icon, label, value }) => (
            <motion.div
              key={label}
              variants={fadeRight}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl",
                "border border-[var(--border-default)]",
                "transition-all duration-300",
                "hover:border-[var(--accent)] hover:bg-[var(--accent-muted)]"
              )}
              style={{ background: "var(--bg-surface)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--accent-muted)" }}
              >
                <Icon size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[10px] font-medium tracking-[0.12em] uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  {label}
                </span>
                <span
                  className="text-sm font-medium mt-0.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {value}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </SectionWrapper>
  )
}