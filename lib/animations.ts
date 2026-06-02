/**
 * lib/animations.ts — Shared Framer Motion variants.
 *
 * Architecture decision: define animation variants once, import everywhere.
 * This guarantees every section animates with exactly the same timing and
 * easing — visual consistency you can't achieve if variants are defined
 * inline per component.
 */

import type { Variants } from "framer-motion"

// ─── Base Easing ──────────────────────────────────────────────────────────────
// One easing curve for the whole site. Feels smooth, not mechanical.
const ease = [0.25, 0.1, 0.25, 1] as const

// ─── Entrance Variants ────────────────────────────────────────────────────────

/** Standard section entrance: fades up from 24px below */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
}

/** Slight fade only — for elements that shouldn't move */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease } },
}

/** Fade in from left — for image or side elements */
export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
}

/** Fade in from right */
export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
}

// ─── Container (stagger parent) ───────────────────────────────────────────────

/**
 * Wrap a list of children in this to get staggered reveals.
 * Each child should use fadeUp (or any variant) independently.
 *
 * Usage:
 *   <motion.ul variants={staggerContainer} initial="hidden" whileInView="visible">
 *     {items.map(i => <motion.li variants={fadeUp}>...</motion.li>)}
 *   </motion.ul>
 */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

/** Slower stagger for larger cards (projects, certs) */
export const staggerContainerSlow: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

// ─── Shared viewport config ───────────────────────────────────────────────────

/**
 * Standard viewport options for whileInView.
 * once: true  → animation fires once only (no re-trigger on scroll up)
 * margin       → starts triggering 80px before element enters viewport
 */
export const viewportOnce = {
  once:   true,
  margin: "-80px",
} as const
