"use client"

/**
 * components/sections/Projects.tsx
 *
 * Mobile polish:
 * - Mobile: horizontal snap carousel — one card visible, swipeable
 * - Desktop: original md:grid-cols-2 grid — completely unchanged
 *
 * Carousel implementation:
 * - overflow-x-auto + flex on mobile via conditional wrapper approach
 * - snap-x snap-mandatory on container, snap-center on each card
 * - Each card: w-[82vw] flex-shrink-0 on mobile — card bleeds slightly
 *   to right, hinting at next card
 * - -mx-6 px-6 to break out of SectionWrapper padding for full-bleed scroll
 * - Dot indicators below carousel on mobile
 *
 * Card changes on mobile:
 * - Thumbnail: h-36 md:h-48 (shorter)
 * - Description: line-clamp-2 on mobile (tighter)
 * - Card padding: p-4 md:p-6 (tighter on mobile)
 */

import { motion }         from "framer-motion"
import Image              from "next/image"
import { useState }       from "react"
import { ExternalLink }            from "lucide-react"
import { SectionWrapper } from "@/components/ui/SectionWrapper"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { PROJECTS }       from "@/lib/data"
import type { Project }   from "@/lib/data"
import {
  staggerContainerSlow,
  fadeUp,
  viewportOnce,
} from "@/lib/animations"
import { cn } from "@/lib/utils"

const THUMBNAIL_STYLES: Record<string, string> = {
  "Web Application": "from-[#0D1F2D] to-[#1A3A4A]",
  "Machine Learning": "from-[#0F1D2A] to-[#1A2D3A]",
}

function TechBadge({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full",
        "text-[11px] font-medium",
        "border border-[var(--border-default)]",
        "transition-all duration-200",
        "hover:border-[var(--accent)] hover:text-[var(--accent)]"
      )}
      style={{ background: "var(--bg-base)", color: "var(--text-muted)" }}
    >
      {label}
    </span>
  )
}

// Inline GitHub mark — matches Contact section icon exactly
function GitHubIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const { title, type, description, tech, github, demo, thumbnail } = project
  const thumbnailGradient = THUMBNAIL_STYLES[type] ?? "from-[#0D1F2D] to-[#1A2D3A]"
  const [imgError, setImgError] = useState(false)
  const hasThumb = !!thumbnail && !imgError
  const githubHref  = github ?? "#"
  const demoHref    = demo   ?? "#"
  const githubLabel = github ? "GitHub"     : "Coming Soon"
  const demoLabel   = demo   ? "Live Demo"  : "Coming Soon"

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "group flex flex-col rounded-2xl overflow-hidden",
        "border border-[var(--border-default)]",
        "transition-all duration-300",
        "hover:-translate-y-1.5 hover:border-[var(--accent)]",
        "hover:shadow-[var(--shadow-accent)]",
        // Mobile carousel: fixed width, no shrink
        "flex-shrink-0 w-[82vw] md:w-auto"
      )}
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Thumbnail — shorter on mobile */}
      <div className={cn(
        "relative overflow-hidden",
        "h-36 md:h-48",                     // mobile shorter
        !hasThumb && "bg-gradient-to-br",
        !hasThumb && thumbnailGradient
      )}>
        {hasThumb ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 82vw, 50vw"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        )}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "rgba(113, 217, 226, 0.06)" }}
        />
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-[0.1em] uppercase border border-[var(--accent)]"
          style={{ background: "rgba(113, 217, 226, 0.12)", color: "#71D9E2" }}
        >
          {type}
        </span>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: "var(--accent)" }} />
      </div>

      {/* Body — tighter padding on mobile */}
      <div className="flex flex-col flex-1 p-4 md:p-6 gap-3 md:gap-4">
        <div className="flex flex-col gap-1.5 md:gap-2">
          <h3
            className={cn(
              "font-[family-name:var(--font-heading)]",
              "text-xl md:text-2xl font-semibold leading-tight",
              "transition-colors duration-200 group-hover:text-[var(--accent)]"
            )}
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h3>
          {/* Description — 2 lines max on mobile */}
          <p
            className="text-sm leading-relaxed line-clamp-2 md:line-clamp-none"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-auto pt-1 md:pt-2">
          {tech.map((t) => <TechBadge key={t} label={t} />)}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-[var(--border-subtle)]">
        <a
          href={githubHref}
          target={github ? "_blank" : undefined}
          rel={github ? "noopener noreferrer" : undefined}
          onClick={!github ? (e) => e.preventDefault() : undefined}
          className={cn(
            "inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl",
            "text-xs font-medium border border-[var(--border-default)]",
            "text-[var(--text-secondary)] transition-all duration-200",
            "hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-muted)]"
          )}
        >
          <GitHubIcon size={12} />
          {githubLabel}
        </a>
        <a
          href={demoHref}
          target={demo ? "_blank" : undefined}
          rel={demo ? "noopener noreferrer" : undefined}
          onClick={!demo ? (e) => e.preventDefault() : undefined}
          className={cn(
            "inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl",
            "text-xs font-medium transition-all duration-200",
            "hover:-translate-y-0.5 hover:shadow-[var(--shadow-accent)]"
          )}
          style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
        >
          <ExternalLink size={12} />
          {demoLabel}
        </a>
      </div>
    </motion.article>
  )
}

export function Projects() {
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <SectionWrapper id="projects">
      <motion.div
        variants={staggerContainerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div variants={fadeUp}>
          <SectionHeading subtitle="Real projects built to practice machine learning, APIs, databases, and full-stack development.">
            Projects
          </SectionHeading>
        </motion.div>

        {/* ── Mobile: horizontal snap carousel ── */}
        <div className="md:hidden">
          <div
            className={cn(
              // Break out of SectionWrapper's px-6 for full-bleed scroll
              "-mx-6",
              "flex overflow-x-auto gap-4",
              "snap-x snap-mandatory",
              "pb-4",                           // space for scroll shadow
              "scroll-smooth",
              // Hide scrollbar — rely on snap + dot indicators
              "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            )}
            onScroll={(e) => {
              const el    = e.currentTarget
              const idx   = Math.round(el.scrollLeft / (el.scrollWidth / PROJECTS.length))
              setActiveIdx(idx)
            }}
          >
            {/* Leading padding to align first card with page content */}
            <div className="pl-6 flex-shrink-0" />

            {PROJECTS.map((project) => (
              <div key={project.title} className="snap-center flex-shrink-0">
                <ProjectCard project={project} />
              </div>
            ))}

            {/* Trailing padding */}
            <div className="pr-6 flex-shrink-0" />
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-4">
            {PROJECTS.map((_, i) => (
              <span
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width:      i === activeIdx ? "20px" : "6px",
                  height:     "6px",
                  background: i === activeIdx ? "var(--accent)" : "var(--border-default)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Desktop: original grid — unchanged ── */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        <motion.p
          variants={fadeUp}
          className="mt-8 md:mt-10 text-sm text-center"
          style={{ color: "var(--text-muted)" }}
        >         
        </motion.p>
      </motion.div>
    </SectionWrapper>
  )
}