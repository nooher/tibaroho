import type { CSSProperties } from 'react'

/**
 * Tumaini / TBHOS design tokens — Tanzania-flag-first palette.
 *
 * The platform is creamy/milky surfaces with FLAG-coded accents. The four
 * flag colors (green / yellow / blue / black) lead all UI; mature deepened
 * siblings (forest green, ochre, deep blue, pure ink) carry primary brand
 * and text. No red, no maroon, no italics, no gradients (the flag bar at
 * top/bottom of every screen is the SANCTIONED gradient exception).
 */

export const CREAM = {
  cream:  '#F4EAC9',
  milk:   '#FAF5E5',
  ivory:  '#F8F2D8',
  paper:  '#EFE4C6',
} as const

/** Tanzania flag — bright source colors. Use for chips, dots, accents, pulses. */
export const TZ_FLAG = {
  green:  '#1EB53A',
  yellow: '#FCD116',
  black:  '#000000',
  blue:   '#00A3DD',
} as const

/**
 * Mature deepened flag siblings — for primary brand surfaces, text, and large
 * fills where the bright flag colors would over-saturate. They still READ
 * as green / yellow / blue / black at a glance.
 */
export const BRAND = {
  green:       '#0F4D1F',   // forest green — primary brand
  greenBright: '#1EB53A',
  yellow:      '#C99700',   // ochre — accent / hope / CTA
  yellowBright:'#FCD116',
  blue:        '#1E5B8A',   // deep blue — calm / info
  blueBright:  '#00A3DD',
  ink:         '#0A0808',   // pure black — text, gravity
  inkSoft:     '#1A1410',
  // Creamy orange — RESERVED for the Tumaini + TBHOS wordmarks ONLY.
  // Sun-warm hope tone; reads alongside cream surfaces + flag colors.
  creamOrange: '#E89557',
  creamOrangeSoft: '#F0B47C',
} as const

/** Convenience: wordmark style for Tumaini / TBHOS. */
export const WORDMARK_COLOR = BRAND.creamOrange

/**
 * Semantic text tokens — solid hex colors, NO opacity multiplication.
 * Founder bar 2026-06-21: "mambo yanaonekana kabisa" — default state must
 * be fully legible, period. Opacity-tinted ink is RETIRED.
 *
 * Use:
 *   color: TEXT.heading
 *   color: TEXT.body
 *   color: TEXT.muted
 *   color: TEXT.hint
 *   color: TEXT.onJewel  (over deep BRAND solids)
 *   color: TEXT.link
 */
export const TEXT = {
  heading: '#0A0808',  // ink — h1/h2/h3
  body:    '#0A0808',  // ink — paragraphs at full strength
  muted:   '#3B3B3B',  // solid gray — captions, timestamps, table notes
  hint:    '#5C5C5C',  // solid gray — placeholders
  disabled:'#8A8A8A',
  onJewel: '#F4EAC9',  // cream — over deep BRAND solids
  link:    '#0F4D1F',  // forest green — links + actionable
} as const

/** Back-compat helper (returns the solid hex). */
export function textColor(token: keyof typeof TEXT): string {
  return TEXT[token]
}

/**
 * Aliases. Existing screens keep importing `JEWEL.tealMwenza` etc. and now
 * receive flag-coded values automatically — no per-screen refactor needed.
 *   tealMwenza/tealRoho   → forest green     (primary brand)
 *   goldHope/goldSoft     → ochre            (accent)
 *   indigoWisdom/navyDeep → deep flag blue   (calm/info)
 *   maroonCrisis          → pure ink         (gravity — crises read as black)
 */
export const JEWEL = {
  tealMwenza:   BRAND.green,
  tealDeep:     BRAND.green,
  goldHope:     BRAND.yellow,
  goldSoft:     BRAND.yellow,
  maroonCrisis: BRAND.ink,
  indigoWisdom: BRAND.blue,
  navyDeep:     BRAND.blue,
  cream:        CREAM.cream,
  tealRoho:     BRAND.green,
} as const

export const NEUTRAL = {
  ink:    '#0B0908',
  shadow: '#1A1410',
  paper:  '#F4EAC9',
  mist:   'rgba(11,9,8,0.55)',
} as const

export const RADII = {
  chip:  999,
  card:  16,
  sheet: 24,
  modal: 28,
} as const

export const MOTION = {
  fast: '160ms cubic-bezier(.25,.46,.45,.94)',
  med:  '280ms cubic-bezier(.25,.46,.45,.94)',
  slow: '480ms cubic-bezier(.25,.46,.45,.94)',
} as const

export const TYPE = {
  tightTrack:   '-0.4px',
  tighterTrack: '-0.6px',
  bodyLeading:  1.5,
  headLeading:  1.1,
  serif:
    "'Georgia', 'Iowan Old Style', 'Palatino Linotype', 'Source Serif Pro', serif",
  sans:
    "'Inter', 'Calibri', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
} as const

/** Convert a hex color (3/6 digit) to an rgba() string. */
export function hexToRgba(hex: string, alpha = 1): string {
  if (!hex) return `rgba(0,0,0,${alpha})`
  let h = hex.trim().replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6) return hex
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  if ([r, g, b].some((n) => Number.isNaN(n))) return hex
  return `rgba(${r},${g},${b},${alpha})`
}

/**
 * Cream surface — solid milky fill, hairline ink border, crisp inset highlight.
 * Replaces the dark glass-on-water surface. Pass a jewel accent for tinting.
 */
export function glass(jewel: string, alpha = 0.06): CSSProperties {
  return {
    background: alpha > 0
      ? `color-mix(in srgb, ${jewel} ${Math.round(alpha * 100)}%, ${CREAM.milk})`
      : CREAM.milk,
    border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 0 rgba(11,9,8,0.04), 0 14px 32px rgba(11,9,8,0.08)',
    borderRadius: RADII.card,
  }
}

/** Focus ring keyed to a jewel hex — AAA keyboard nav. */
export function focusRing(jewel: string): CSSProperties {
  return {
    outline: `2px solid ${jewel}`,
    outlineOffset: 4,
  }
}
