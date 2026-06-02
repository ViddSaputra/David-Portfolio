# Portfolio Foundation — Architecture Notes

Quick reference for every structural decision made in the foundation.

## Folder Map

```
app/
  layout.tsx          Root layout: fonts, metadata, ThemeProvider, Navbar
  page.tsx            Page shell: renders sections in order (nothing else)
  globals.css         Design tokens, resets, global utilities

components/
  layout/
    Navbar.tsx        Floating glass navbar with scroll tracking
  sections/           One file per section — built incrementally
  ui/
    SectionWrapper    Spacing + scroll anchor + entrance animation
    SectionHeading    Consistent h2 style across all sections
  providers/
    ThemeProvider     Wraps next-themes (keeps layout.tsx clean)

lib/
  data.ts             ALL content as typed objects — single source of truth
  utils.ts            cn() — safe Tailwind class merging
  animations.ts       Shared Framer Motion variants

hooks/
  useActiveSection    IntersectionObserver → active nav link
```

## Key Decisions

**Tailwind v4** — config is in globals.css via `@theme inline {}`, not
tailwind.config.ts. v4 reads tokens directly from CSS variables.

**@fontsource** — self-hosted fonts, no Google CDN. Faster, private,
works in CI/offline. Loaded in layout.tsx imports.

**CSS variables as the source of truth** — all colors live as var() tokens.
Tailwind utilities (`bg-[var(--accent)]`) reference them. Dark mode is just
swapping variables on `[data-theme="dark"]` — zero component changes needed.

**lib/data.ts** — content is separate from presentation. Fill in real
content here; components update automatically.

**SectionWrapper** — every section uses it. Consistent vertical padding
(py-24 md:py-32), max-width container, scroll anchor id, and entrance
animation all live in one place.

**ThemeProvider** — thin wrapper isolates "use client" from layout.tsx.
attribute="data-theme" pairs with CSS [data-theme="dark"] selectors.

## Design Tokens

| Token              | Light           | Dark       |
|--------------------|-----------------|------------|
| --accent           | #71D9E2         | same       |
| --bg-base          | #F7F8FA         | #0D0F14    |
| --bg-surface       | #FFFFFF         | #13161E    |
| --text-primary     | #141420         | #E8EBF2    |
| --text-secondary   | #4B5266         | #9DA8C0    |
| --text-muted       | #8E96AA         | #5C657A    |

## Animation Standard

All sections: `fadeUp` variant, `viewport={{ once: true, margin: "-80px" }}`
Lists/cards: `staggerContainer` parent + `fadeUp` children
Hover effects: Tailwind only (`transition-all duration-300`) — no Framer for hover

## Build Order

1. ✅ Foundation (this)
2. ⬜ Hero section
3. ⬜ About section
4. ⬜ Skills section
5. ⬜ Projects section
6. ⬜ Certifications section
7. ⬜ Contact section
8. ⬜ Polish pass
