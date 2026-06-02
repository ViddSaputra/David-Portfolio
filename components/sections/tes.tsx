"use client"

/**
 * components/sections/Certifications.tsx
 *
 * Two parts: the grid of cert cards + the lightbox modal.
 *
 * Grid cards:
 *   - Placeholder thumbnail (styled div until real images are provided)
 *   - Title + issuer below
 *   - Hover: lift + accent border + subtle overlay with "View" label
 *   - Click: opens modal at that cert's index
 *
 * Modal (lightbox):
 *   - Full-screen overlay with blur backdrop
 *   - Large cert image/placeholder centered
 *   - Left / Right arrow navigation between certs
 *   - Keyboard: ArrowLeft, ArrowRight, Escape
 *   - Click outside the card → close
 *   - AnimatePresence handles smooth open/close transition
 *   - Focus trap: close button is auto-focused on open for accessibility
 *
 * Architecture: modal state (open, activeIndex) lives in the parent
 * Certifications component — CertCard and CertModal are purely presentational,
 * receiving callbacks as props. No context, no external state library needed
 * for something this contained.
 */

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence }  from "framer-motion"
import { X, ChevronLeft, ChevronRight, Award } from "lucide-react"
import { SectionWrapper }  from "@/components/ui/SectionWrapper"
import { SectionHeading }  from "@/components/ui/SectionHeading"
import { CERTIFICATIONS }  from "@/lib/data"
import type { Certificate } from "@/lib/data"
import {
  staggerContainerSlow,
  fadeUp,
  fadeIn,
  viewportOnce,
} from "@/lib/animations"
import { cn } from "@/lib/utils"

// ─── Cert Card ────────────────────────────────────────────────────────────────

function CertCard({
  cert,
  index,
  onOpen,
}: {
  cert: Certificate
  index: number
  onOpen: (i: number) => void
}) {
  return (
    <motion.button
      variants={fadeUp}
      onClick={() => onOpen(index)}
      className={cn(
        "group text-left w-full flex flex-col rounded-2xl overflow-hidden",
        "border border-[var(--border-subtle)]",
        "transition-all duration-300",
        "hover:-translate-y-1.5 hover:border-[var(--accent)]",
        "hover:shadow-[var(--shadow-accent)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      )}
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Thumbnail */}
      <div
        className="relative h-40 w-full overflow-hidden flex items-center justify-center"
        style={{ background: "var(--bg-elevated)" }}
      >
        {/* Placeholder pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, var(--accent) 25%, transparent 25%), linear-gradient(-45deg, var(--accent) 25%, transparent 25%)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Cert icon */}
        <div className="relative flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--accent-muted)" }}
          >
            <Award size={22} style={{ color: "var(--accent)" }} />
          </div>
          <span
            className="text-[10px] font-medium tracking-widest uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            {cert.issuer}
          </span>
        </div>

        {/* Hover overlay with "View" CTA */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )}
          style={{ background: "rgba(113, 217, 226, 0.10)" }}
        >
          <span
            className={cn(
              "px-4 py-1.5 rounded-full",
              "text-xs font-medium tracking-wide",
              "border border-[var(--accent)]",
            )}
            style={{
              background: "rgba(113, 217, 226, 0.15)",
              color: "#71D9E2",
            }}
          >
            View Certificate
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3 flex flex-col gap-0.5">
        <p
          className="text-sm font-medium leading-snug truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {cert.title}
        </p>
        <p
          className="text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {cert.issuer}
        </p>
      </div>
    </motion.button>
  )
}

// ─── Lightbox Modal ───────────────────────────────────────────────────────────

function CertModal({
  certs,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: {
  certs: Certificate[]
  activeIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const cert     = certs[activeIndex]
  const hasPrev  = activeIndex > 0
  const hasNext  = activeIndex < certs.length - 1

  // Auto-focus the close button when modal opens
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose()
      if (e.key === "ArrowLeft")  onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, onPrev, onNext])

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="hidden"
      // Click outside → close
      onClick={onClose}
      className={cn(
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        "p-4 md:p-8"
      )}
      style={{ background: "rgba(10, 12, 18, 0.85)", backdropFilter: "blur(12px)" }}
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate: ${cert.title}`}
    >
      {/* Modal card — stop propagation so clicks inside don't close */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.94, y: 16  }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-2xl",
          "rounded-2xl overflow-hidden",
          "border border-[var(--border-subtle)]",
        )}
        style={{
          background: "var(--bg-surface)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close certificate viewer"
          className={cn(
            "absolute top-4 right-4 z-10",
            "w-9 h-9 rounded-xl flex items-center justify-center",
            "border border-[var(--border-subtle)]",
            "transition-all duration-200",
            "hover:border-[var(--accent)] hover:text-[var(--accent)]",
            "hover:bg-[var(--accent-muted)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          )}
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-muted)",
          }}
        >
          <X size={15} />
        </button>

        {/* Certificate image area */}
        <div
          className="w-full h-72 md:h-96 flex items-center justify-center relative overflow-hidden"
          style={{ background: "var(--bg-elevated)" }}
        >
          {/* Placeholder — replace inner div with <Image> when assets are ready */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(45deg, var(--accent) 25%, transparent 25%), linear-gradient(-45deg, var(--accent) 25%, transparent 25%)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative flex flex-col items-center gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "var(--accent-muted)" }}
            >
              <Award size={36} style={{ color: "var(--accent)" }} />
            </div>
            <div className="text-center">
              <p
                className="font-[family-name:var(--font-heading)] text-2xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {cert.title}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Issued by {cert.issuer}
              </p>
            </div>
            <span
              className="text-[10px] tracking-widest uppercase mt-2"
              style={{ color: "var(--text-muted)" }}
            >
              Image placeholder — add real cert to /public/images/certs/
            </span>
          </div>
        </div>

        {/* Footer: counter + navigation */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-subtle)]"
        >
          {/* Counter */}
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {activeIndex + 1} / {certs.length}
          </span>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {certs.map((_, i) => (
              <span
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width:      i === activeIndex ? "20px" : "6px",
                  height:     "6px",
                  background: i === activeIndex ? "var(--accent)" : "var(--border-default)",
                }}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              aria-label="Previous certificate"
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center",
                "border border-[var(--border-subtle)]",
                "transition-all duration-200",
                hasPrev
                  ? "hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-muted)]"
                  : "opacity-30 cursor-not-allowed"
              )}
              style={{
                background: "var(--bg-elevated)",
                color: "var(--text-muted)",
              }}
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              aria-label="Next certificate"
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center",
                "border border-[var(--border-subtle)]",
                "transition-all duration-200",
                hasNext
                  ? "hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-muted)]"
                  : "opacity-30 cursor-not-allowed"
              )}
              style={{
                background: "var(--bg-elevated)",
                color: "var(--text-muted)",
              }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function Certifications() {
  const [modalOpen,    setModalOpen]    = useState(false)
  const [activeIndex,  setActiveIndex]  = useState(0)

  const openModal  = useCallback((i: number) => { setActiveIndex(i); setModalOpen(true)  }, [])
  const closeModal = useCallback(()           => { setModalOpen(false)                   }, [])

  const goPrev = useCallback(() =>
    setActiveIndex(i => Math.max(0, i - 1)),
  [])

  const goNext = useCallback(() =>
    setActiveIndex(i => Math.min(CERTIFICATIONS.length - 1, i + 1)),
  [])

  return (
    <>
      <SectionWrapper
        id="certifications"
        className="relative"
      >
        {/* Subtle stripe — alternates with Projects */}
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--bg-elevated)" }}
        />

        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp}>
            <SectionHeading
              subtitle="Proof of learning — click any certificate to view it full size."
            >
              Certifications
            </SectionHeading>
          </motion.div>

          {/* Cert grid: 2-col mobile, 4-col desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CERTIFICATIONS.map((cert, i) => (
              <CertCard
                key={cert.title}
                cert={cert}
                index={i}
                onOpen={openModal}
              />
            ))}
          </div>

          {/* Replace placeholder note */}
          <motion.p
            variants={fadeUp}
            className="mt-8 text-xs text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Add certificate images to{" "}
            <code
              className="px-1.5 py-0.5 rounded text-[11px]"
              style={{
                background: "var(--accent-muted)",
                color: "var(--accent)",
              }}
            >
              /public/images/certs/
            </code>{" "}
            and update titles in{" "}
            <code
              className="px-1.5 py-0.5 rounded text-[11px]"
              style={{
                background: "var(--accent-muted)",
                color: "var(--accent)",
              }}
            >
              lib/data.ts
            </code>
          </motion.p>
        </motion.div>
      </SectionWrapper>

      {/* Modal — rendered outside SectionWrapper so it overlays everything */}
      <AnimatePresence>
        {modalOpen && (
          <CertModal
            certs={CERTIFICATIONS}
            activeIndex={activeIndex}
            onClose={closeModal}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </>
  )
}
