"use client"

/**
 * components/sections/Skills.tsx
 *
 * Polish: proficiency label upgraded from plain muted text to a pill badge.
 * Badge: rounded-full, aquamarine border (opacity 40%), very light aquamarine
 * fill, slightly stronger font weight — readable at a glance, still restrained.
 * On hover the badge border and text step up to full accent — feels responsive.
 * Everything else (card structure, spacing, stripe bg, stagger) unchanged.
 */

import { motion }         from "framer-motion"
import { SectionWrapper } from "@/components/ui/SectionWrapper"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { SKILLS }         from "@/lib/data"
import {
  staggerContainer,
  staggerContainerSlow,
  fadeUp,
  viewportOnce,
} from "@/lib/animations"
import { cn } from "@/lib/utils"

// ─── Proficiency Badge ────────────────────────────────────────────────────────

function ProficiencyBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full",
        "text-[11px] font-medium tracking-wide",
        "border transition-colors duration-200",
        className
      )}
      style={{
        borderColor: "var(--badge-border)",
        background:  "var(--badge-bg)",
        color:       "var(--text-secondary)",  /* text-secondary not muted — more legible */
      }}
    >
      {label}
    </span>
  )
}

// ─── Skill Chip ───────────────────────────────────────────────────────────────

function SkillChip({ label, proficiency }: { label: string; proficiency: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "relative flex items-center justify-between gap-3",
        "px-4 py-2.5 rounded-xl",
        "border border-[var(--border-default)]",
        "transition-all duration-300 cursor-default",
        "hover:border-[var(--accent)] hover:bg-[var(--accent-muted)]",
        "group"
      )}
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Left accent bar on hover */}
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 rounded-full transition-all duration-300 group-hover:h-5"
        style={{ background: "var(--accent)" }}
      />

      {/* Skill name */}
      <span
        className="text-sm font-medium transition-colors duration-200 group-hover:text-[var(--text-primary)]"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </span>

      {/* Proficiency pill — steps up on parent hover */}
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full flex-shrink-0",
          "text-[11px] font-medium tracking-wide",
          "border transition-all duration-200",
          "group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]",
        )}
        style={{
          borderColor: "var(--badge-border)",
          background:  "var(--badge-bg)",
          color:       "var(--text-secondary)",  /* text-secondary not muted — legible in dark */
        }}
      >
        {proficiency}
      </span>
    </motion.div>
  )
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({
  category,
  skills,
}: {
  category: string
  skills:   readonly { label: string; proficiency: string }[]
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "flex flex-col gap-3 p-5 rounded-2xl",
        "border border-[var(--border-default)]",
        "transition-all duration-300",
        "hover:border-[var(--accent)]"
      )}
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Category label */}
      <div className="flex items-center gap-2.5 mb-1">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: "var(--accent)" }}
        />
        <span
          className="text-xs font-medium tracking-[0.12em] uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          {category}
        </span>
      </div>

      {/* Chips */}
      <motion.div variants={staggerContainer} className="flex flex-col gap-2">
        {skills.map(({ label, proficiency }) => (
          <SkillChip key={label} label={label} proficiency={proficiency} />
        ))}
      </motion.div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function Skills() {
  return (
    <SectionWrapper id="skills" className="relative">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--bg-elevated)" }} />

      <motion.div
        variants={staggerContainerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div variants={fadeUp}>
          <SectionHeading subtitle="Technologies I use in my projects and learning journey.">
            Skills
          </SectionHeading>
        </motion.div>

        {/* ── Mobile: horizontal snap carousel ── */}
        <div className="md:hidden -mx-6">
          <div className={[
            "flex overflow-x-auto gap-3 snap-x snap-mandatory pb-4 scroll-smooth",
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          ].join(" ")}>
            <div className="pl-6 flex-shrink-0" />
            {SKILLS.map(({ category, skills }) => (
              <div key={category} className="snap-center flex-shrink-0 w-[72vw]">
                <CategoryCard category={category} skills={skills} />
              </div>
            ))}
            <div className="pr-6 flex-shrink-0" />
          </div>
        </div>

        {/* ── Desktop: original 3-column grid — unchanged ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {SKILLS.map(({ category, skills }) => (
            <CategoryCard key={category} category={category} skills={skills} />
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  )
}