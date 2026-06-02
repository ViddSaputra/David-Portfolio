"use client"

/**
 * components/sections/Contact.tsx — Polish pass
 *
 * Changes from base:
 *
 * ICONS
 * - WhatsApp: inline SVG of the official WhatsApp logo path.
 *   MessageCircle was semantically close but visually generic.
 * - GitHub: inline SVG of the official GitHub mark (Invertocat).
 *   GitBranch was a code metaphor, not the brand. Visitors recognise
 *   the GitHub mark instantly — that recognition is the point.
 * - Mail: unchanged (Lucide Mail is correct and universally understood).
 * - Both SVGs are sized to match the Lucide icons (18×18) and inherit
 *   the accent color via `fill="currentColor"`.
 * - No external dependency added — SVG paths are inlined directly.
 *
 * FOOTER
 * - mt-16 pt-8 → mt-10 pt-6: footer sits closer to the contact rows,
 *   feels proportional rather than floating at the bottom of a tall section.
 * - Section bottom padding unchanged — the section already has SectionWrapper
 *   py-24 md:py-32, the tightening is purely the internal footer gap.
 */

import { motion }         from "framer-motion"
import { Mail, ArrowRight, ArrowUp } from "lucide-react"
import { SectionWrapper } from "@/components/ui/SectionWrapper"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { CONTACT }        from "@/lib/data"
import type { ContactLink } from "@/lib/data"
import {
  staggerContainerSlow,
  staggerContainer,
  fadeUp,
  viewportOnce,
} from "@/lib/animations"
import { cn } from "@/lib/utils"

// ─── Brand SVG icons ──────────────────────────────────────────────────────────

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function GitHubIcon({ size = 18 }: { size?: number }) {
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

// ─── Icon map ─────────────────────────────────────────────────────────────────

function ContactIcon({ type }: { type: ContactLink["icon"] }) {
  if (type === "mail")   return <Mail         size={18} />
  if (type === "phone")  return <WhatsAppIcon size={18} />
  if (type === "github") return <GitHubIcon   size={18} />
  return null
}

// ─── Contact Row ──────────────────────────────────────────────────────────────

function ContactRow({ link }: { link: ContactLink }) {
  return (
    <motion.a
      variants={fadeUp}
      href={link.href}
      target={link.icon === "github" ? "_blank" : undefined}
      rel={link.icon === "github" ? "noopener noreferrer" : undefined}
      className={cn(
        "group flex items-center gap-4 p-5 rounded-2xl",
        "border border-[var(--border-subtle)]",
        "transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-[var(--accent)]",
        "hover:shadow-[var(--shadow-accent)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      )}
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Icon box */}
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          "transition-all duration-300 group-hover:scale-110"
        )}
        style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
      >
        <ContactIcon type={link.icon} />
      </div>

      {/* Label + value */}
      <div className="flex flex-col flex-1 min-w-0">
        <span
          className="text-[10px] font-medium tracking-[0.12em] uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          {link.label}
        </span>
        <span
          className={cn(
            "text-sm font-medium mt-0.5 truncate",
            "transition-colors duration-200",
            "group-hover:text-[var(--accent)]"
          )}
          style={{ color: "var(--text-primary)" }}
        >
          {link.value}
        </span>
      </div>

      {/* Arrow — slides in on hover */}
      <ArrowRight
        size={16}
        className="flex-shrink-0 transition-all duration-300 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        style={{ color: "var(--accent)" }}
      />
    </motion.a>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function Contact() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <SectionWrapper id="contact">
      <motion.div
        variants={staggerContainerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="flex flex-col items-center"
      >
        {/* Heading */}
        <motion.div variants={fadeUp} className="w-full text-center">
          <SectionHeading align="center">Get in touch</SectionHeading>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="text-base md:text-lg text-center max-w-md mb-12"
          style={{ color: "var(--text-secondary)" }}
        >
         Interested in machine learning, backend systems, and building useful products.
        </motion.p>

        {/* Contact rows */}
        <motion.div
          variants={staggerContainer}
          className="w-full max-w-lg flex flex-col gap-3"
        >
          {CONTACT.map((link) => (
            <ContactRow key={link.label} link={link} />
          ))}
        </motion.div>

        {/* Footer — tighter: mt-10 pt-6 instead of mt-16 pt-8 */}
        <motion.div
          variants={fadeUp}
          className="w-full max-w-lg mt-10 pt-6 flex flex-col-reverse items-center gap-4 md:flex-row md:items-center md:justify-between md:gap-0"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} David Saputra All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className={cn(
              "group inline-flex items-center gap-2 text-xs",
              "transition-colors duration-200 hover:text-[var(--accent)]"
            )}
            style={{ color: "var(--text-muted)" }}
          >
            Back to top
            <span
              className={cn(
                "w-7 h-7 rounded-xl flex items-center justify-center",
                "border border-[var(--border-subtle)]",
                "transition-all duration-200",
                "group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-muted)]",
                "group-hover:-translate-y-0.5"
              )}
            >
              <ArrowUp size={13} style={{ color: "inherit" }} />
            </span>
          </button>
        </motion.div>

      </motion.div>
    </SectionWrapper>
  )
}