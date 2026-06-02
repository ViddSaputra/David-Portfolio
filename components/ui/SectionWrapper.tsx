"use client"

/**
 * components/ui/SectionWrapper.tsx
 *
 * Mobile polish: py-24 → py-16 md:py-32
 * Mobile section spacing reduced ~33% (96px → 64px).
 * Desktop spacing unchanged (md:py-32 = 128px).
 */

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { fadeUp, viewportOnce } from "@/lib/animations"
import type { ReactNode } from "react"

type SectionWrapperProps = {
  id:         string
  children:   ReactNode
  className?: string
  noAnimate?: boolean
}

export function SectionWrapper({
  id,
  children,
  className,
  noAnimate = false,
}: SectionWrapperProps) {
  const Wrapper = noAnimate ? "section" : motion.section

  const motionProps = noAnimate
    ? {}
    : {
        variants:    fadeUp,
        initial:     "hidden" as const,
        whileInView: "visible" as const,
        viewport:    viewportOnce,
      }

  return (
    <Wrapper
      id={id}
      className={cn(
        // Mobile:  py-16 (64px)
        // Desktop: py-24 (96px) — reduced from py-32 (128px), ~25% tighter
        "py-16 md:py-24",
        className
      )}
      {...motionProps}
    >
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10 lg:px-12">
        {children}
      </div>
    </Wrapper>
  )
}