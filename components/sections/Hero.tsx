"use client"

/**
 * components/sections/Hero.tsx
 *
 * Mobile polish: reordered mobile hierarchy using CSS `order` utilities.
 *
 * Mobile order:  Name + Subtitle → Photo → Tagline + Divider + CTAs
 * Desktop order: [Text left | Photo right] — completely unchanged
 *
 * Strategy: the text block is split into two parts:
 *   - "top text" (eyebrow, name, subtitle) → order-1 on mobile
 *   - image                                → order-2 on mobile
 *   - "bottom text" (tagline, divider, CTAs) → order-3 on mobile
 *
 * On desktop (lg:), all order classes are reset so the original
 * two-column grid layout is fully preserved.
 *
 * Photo on mobile: smaller (w-48 h-48), still centered, still rotated.
 * SectionWrapper pt reduced: pt-28 on mobile (was pt-32), md:pt-40 unchanged.
 */

import { useState }          from "react"
import Image                 from "next/image"
import { motion }            from "framer-motion"
import type { Variants }     from "framer-motion"
import { ArrowRight, Mail }  from "lucide-react"
import { SectionWrapper }    from "@/components/ui/SectionWrapper"
import { HERO }              from "@/lib/data"
import { cn }                from "@/lib/utils"

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

const containerVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

const imageVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease, delay: 0.3 } },
}

export function Hero() {
  const [imgError, setImgError] = useState(false)
  const hasPhoto = !!HERO.image && !imgError

  const handleScroll = (href: string) => {
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <SectionWrapper
      id="hero"
      noAnimate
      className="pt-28 md:pt-40 pb-16 md:pb-32 min-h-[90vh] flex items-center"
    >
      {/*
        Mobile:  single column, flex-col, items ordered via order-N
        Desktop: two-column grid (lg:grid-cols-2), order classes ignored
      */}
      <div className={cn(
        // Mobile: flex column so we can control order independently
        "w-full flex flex-col gap-6",
        // Desktop: revert to original two-column grid
        "lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center"
      )}>

        {/* ══════════════════════════════════════
            TOP TEXT — eyebrow, name, subtitle
            Mobile: order-1 (first)
            Desktop: left column, rows flow naturally
        ══════════════════════════════════════ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "flex flex-col items-start",
            // Mobile order
            "order-1",
            // Desktop: span full left column, reset order
            "lg:order-none lg:row-span-2"
          )}
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants}>
            <span className={cn(
              "inline-flex items-center gap-2 mb-5 md:mb-6",
              "text-xs font-medium tracking-[0.15em] uppercase",
              "text-[var(--text-muted)]"
            )}>
              <span className="inline-block w-5 h-px" style={{ background: "var(--accent)" }} />
              Portfolio
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className={cn(
              "font-[family-name:var(--font-heading)]",
              "text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl",
              "font-semibold leading-[1.08] tracking-tight",
              "text-[var(--text-primary)]",
              "mb-2 md:mb-3"
            )}
          >
            {HERO.name}
          </motion.h1>

          {/* Subtitle */}
          <motion.div variants={itemVariants} className="mb-0 lg:mb-6">
            <p className={cn(
              "font-[family-name:var(--font-heading)]",
              "text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl",
              "font-light italic",
              "text-[var(--accent)]"
            )}>
              {HERO.subtitle}
            </p>
          </motion.div>

          {/* Tagline + Divider + CTAs — DESKTOP only in this block */}
          <div className="hidden lg:contents">
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-md mb-10"
            >
              {HERO.tagline}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="w-12 h-px mb-10"
              style={{ background: "var(--border-default)" }}
            />

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <button
                onClick={() => handleScroll(HERO.cta.primary.href)}
                className={cn(
                  "group inline-flex items-center gap-2 px-6 py-3 rounded-xl",
                  "text-sm font-medium transition-all duration-300",
                  "hover:shadow-[var(--shadow-accent)] hover:-translate-y-0.5"
                )}
                style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
              >
                {HERO.cta.primary.label}
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => handleScroll(HERO.cta.secondary.href)}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-xl",
                  "text-sm font-medium border border-[var(--border-default)]",
                  "text-[var(--text-secondary)] transition-all duration-300",
                  "hover:border-[var(--accent)] hover:text-[var(--accent)]",
                  "hover:bg-[var(--accent-muted)] hover:-translate-y-0.5"
                )}
              >
                <Mail size={15} />
                {HERO.cta.secondary.label}
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════
            IMAGE
            Mobile: order-2 (after name/subtitle), centered, smaller
            Desktop: right column, full size
        ══════════════════════════════════════ */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "order-2 lg:order-none",
            "flex justify-center lg:justify-end",
            // Desktop: nudge image down 32px — aligns with heading/subtitle, not navbar
            "lg:mt-8"
          )}
        >
          <div className="relative">
            {/* Ambient glow */}
            <div
              className="absolute inset-0 rounded-full scale-[1.12] -z-10"
              style={{ background: "var(--accent-muted)", filter: "blur(48px)", opacity: 0.9 }}
            />

            {/* Frame — smaller on mobile */}
            <div
              className={cn(
                "relative overflow-hidden",
                // Mobile: compact square
                "w-44 h-44 sm:w-56 sm:h-56",
                // Desktop: original sizes
                "md:w-80 md:h-80 lg:w-72 lg:h-72 xl:w-80 xl:h-80",
                "rounded-[2rem] md:rounded-[2.5rem]",
              )}
              style={{
                transform: "rotate(1.5deg)",
                boxShadow: "var(--shadow-lg)",
                border:    "2px solid var(--border-frame)",
              }}
            >
              {hasPhoto ? (
                <Image
                  src={HERO.image}
                  alt={HERO.name}
                  fill
                  priority
                  className="object-cover object-center"
                  onError={() => setImgError(true)}
                  sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, (max-width: 1024px) 320px, 320px"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-3"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                    style={{ background: "var(--accent-muted)" }}
                  >
                    <span
                      className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold"
                      style={{ color: "var(--accent)" }}
                    >
                      DS
                    </span>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                    Photo coming soon
                  </span>
                </div>
              )}
            </div>

            {/* Corner accents */}
            <div className="absolute -bottom-3 -right-3 w-10 h-10 md:w-12 md:h-12 rounded-xl -z-10"
              style={{ background: "var(--accent-muted)" }} />
            <div className="absolute -top-3 -left-3 w-5 h-5 md:w-6 md:h-6 rounded-lg -z-10"
              style={{ background: "var(--accent-muted)" }} />
          </div>
        </motion.div>

        {/* ══════════════════════════════════════
            BOTTOM TEXT — tagline, divider, CTAs
            Mobile: order-3 (after photo)
            Desktop: hidden (rendered inside top text block above)
        ══════════════════════════════════════ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="order-3 lg:hidden flex flex-col items-start"
        >
          <motion.p
            variants={itemVariants}
            className="text-base text-[var(--text-secondary)] leading-relaxed mb-7"
          >
            {HERO.tagline}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="w-10 h-px mb-7"
            style={{ background: "var(--border-default)" }}
          />

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <button
              onClick={() => handleScroll(HERO.cta.primary.href)}
              className={cn(
                "group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl",
                "text-sm font-medium transition-all duration-300",
                "active:scale-95"
              )}
              style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
            >
              {HERO.cta.primary.label}
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => handleScroll(HERO.cta.secondary.href)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl",
                "text-sm font-medium border border-[var(--border-default)]",
                "text-[var(--text-secondary)] transition-all duration-300",
                "active:scale-95"
              )}
            >
              <Mail size={14} />
              {HERO.cta.secondary.label}
            </button>
          </motion.div>
        </motion.div>

      </div>

      {/* Scroll indicator — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, var(--accent), transparent)" }}
        />
      </motion.div>
    </SectionWrapper>
  )
}