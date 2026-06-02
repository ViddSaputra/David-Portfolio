"use client"

/**
 * components/sections/Certifications.tsx
 *
 * Fix: cert.image is now actually used in both the card thumbnail
 * and the modal view. Each uses next/image with an onError fallback
 * — if the file is missing, it gracefully shows the placeholder icon
 * instead of a broken image. This means partially-filled cert lists
 * (some real images, some still placeholder) work without breaking.
 */

import { useState, useEffect, useCallback, useRef } from "react"
import Image                                        from "next/image"
import { motion, AnimatePresence }                  from "framer-motion"
import { X, ChevronLeft, ChevronRight, Award }      from "lucide-react"
import { SectionWrapper }   from "@/components/ui/SectionWrapper"
import { SectionHeading }   from "@/components/ui/SectionHeading"
import { CERTIFICATIONS }   from "@/lib/data"
import type { Certificate } from "@/lib/data"
import {
  staggerContainerSlow,
  staggerContainer,
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
  cert:   Certificate
  index:  number
  onOpen: (i: number) => void
}) {
  const [imgError, setImgError] = useState(false)
  const hasImage = !!cert.image && !imgError

  return (
    <motion.button
      variants={fadeUp}
      onClick={() => onOpen(index)}
      className={cn(
        "group text-left w-full flex flex-col rounded-2xl overflow-hidden",
        // Border: one step above border-default for more card definition
        "border border-[var(--border-default)]",
        "transition-all duration-300",
        // Hover: 4px lift + layered shadow — premium feel, not flashy
        "hover:-translate-y-[4px]",
        "hover:shadow-[0_8px_24px_rgba(0,0,0,0.10),_0_2px_6px_rgba(0,0,0,0.06)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      )}
      style={{ background: "var(--bg-surface)" }}
    >
      {/* ── Thumbnail ── */}
      <div
        className="relative h-40 w-full overflow-hidden flex items-center justify-center"
        style={{ background: "var(--bg-elevated)" }}
      >
        {hasImage ? (
          /* Real certificate image */
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          /* Fallback placeholder */
          <>
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, var(--accent) 25%, transparent 25%), linear-gradient(-45deg, var(--accent) 25%, transparent 25%)",
                backgroundSize: "20px 20px",
              }}
            />
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
          </>
        )}

        {/* Hover overlay */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )}
          style={{ background: "rgba(10, 12, 18, 0.45)" }}
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

      {/* ── Info ── */}
      <div className="px-4 py-3 flex flex-col gap-0.5">
        <p
          className="text-sm font-medium leading-snug truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {cert.title}
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
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
  certs:       Certificate[]
  activeIndex: number
  onClose:     () => void
  onPrev:      () => void
  onNext:      () => void
}) {
  const closeRef              = useRef<HTMLButtonElement>(null)
  const [imgError, setImgError] = useState(false)
  const cert     = certs[activeIndex]
  const hasPrev  = activeIndex > 0
  const hasNext  = activeIndex < certs.length - 1
  const hasImage = !!cert.image && !imgError

  // Reset image error when navigating to a different cert
  useEffect(() => { setImgError(false) }, [activeIndex])

  // Auto-focus close button on open
  useEffect(() => { closeRef.current?.focus() }, [])

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

  // Lock body scroll
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
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(10, 12, 18, 0.85)", backdropFilter: "blur(12px)" }}
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate: ${cert.title}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.94, y: 16  }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-2xl rounded-2xl overflow-hidden",
          "border border-[var(--border-subtle)]",
        )}
        style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-lg)" }}
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
          style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
        >
          <X size={15} />
        </button>

        {/* ── Certificate image ── */}
        <div
          className="relative w-full overflow-hidden flex items-center justify-center"
          style={{ background: "var(--bg-elevated)", minHeight: "320px" }}
        >
          {hasImage ? (
            /* Real certificate — natural aspect ratio, full width */
            <div className="relative w-full" style={{ minHeight: "320px" }}>
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                className="object-contain"
                onError={() => setImgError(true)}
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          ) : (
            /* Fallback */
            <>
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, var(--accent) 25%, transparent 25%), linear-gradient(-45deg, var(--accent) 25%, transparent 25%)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative flex flex-col items-center gap-4 py-16">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "var(--accent-muted)" }}
                >
                  <Award size={36} style={{ color: "var(--accent)" }} />
                </div>
                <div className="text-center px-6">
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
                  Add image to /public/images/certs/
                </span>
              </div>
            </>
          )}
        </div>

        {/* ── Footer: title + navigation ── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-subtle)]"
        >
          {/* Title + issuer */}
          <div className="flex flex-col min-w-0 mr-4">
            <span
              className="text-sm font-medium truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {cert.title}
            </span>
            <span className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {cert.issuer}
            </span>
          </div>

          {/* Nav: dots + arrows */}
          <div className="flex items-center gap-3 flex-shrink-0">
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

            {/* Arrows */}
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
                style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
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
                style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function Certifications() {
  const [modalOpen,   setModalOpen]   = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const openModal  = useCallback((i: number) => { setActiveIndex(i); setModalOpen(true)  }, [])
  const closeModal = useCallback(()           => { setModalOpen(false)                   }, [])
  const goPrev     = useCallback(() => setActiveIndex(i => Math.max(0, i - 1)),                       [])
  const goNext     = useCallback(() => setActiveIndex(i => Math.min(CERTIFICATIONS.length - 1, i + 1)), [])

  return (
    <>
      <SectionWrapper id="certifications" className="relative">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--bg-elevated)" }} />

        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp}>
            <SectionHeading subtitle="Several course certificates
                                      — click to view full size.">
              Certifications
            </SectionHeading>
          </motion.div>

          {/* ── Mobile: horizontal snap carousel ── */}
          <div className="md:hidden -mx-6">
            <div className={[
              "flex overflow-x-auto gap-3 snap-x snap-mandatory pb-4 scroll-smooth",
              "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            ].join(" ")}>
              <div className="pl-6 flex-shrink-0" />
              {CERTIFICATIONS.map((cert, i) => (
                <div key={cert.title} className="snap-center flex-shrink-0 w-[68vw]">
                  <CertCard cert={cert} index={i} onOpen={openModal} />
                </div>
              ))}
              <div className="pr-6 flex-shrink-0" />
            </div>
          </div>

          {/* ── Desktop: original grid — unchanged ── */}
          <motion.div variants={staggerContainer} className="hidden md:grid md:grid-cols-4 gap-4">
            {CERTIFICATIONS.map((cert, i) => (
              <CertCard key={cert.title} cert={cert} index={i} onOpen={openModal} />
            ))}
          </motion.div>
        </motion.div>
      </SectionWrapper>

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