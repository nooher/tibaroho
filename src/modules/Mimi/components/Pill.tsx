import type { CSSProperties, ReactNode } from 'react'
import { JEWEL, NEUTRAL, RADII, TEXT, hexToRgba } from '../../../lib/glass'

type Tone = 'teal' | 'gold' | 'maroon' | 'indigo' | 'neutral'

const TONES: Record<Tone, { fill: string; ink: string }> = {
  teal:    { fill: JEWEL.tealRoho,     ink: TEXT.onJewel },
  gold:    { fill: JEWEL.goldHope,     ink: NEUTRAL.ink },
  maroon:  { fill: JEWEL.maroonCrisis, ink: TEXT.onJewel },
  indigo:  { fill: JEWEL.indigoWisdom, ink: TEXT.onJewel },
  neutral: { fill: hexToRgba(NEUTRAL.ink, 0.06), ink: TEXT.body },
}

export function Pill({
  children,
  tone = 'neutral',
  style,
  ariaLabel,
}: {
  children: ReactNode
  tone?: Tone
  style?: CSSProperties
  ariaLabel?: string
}) {
  const t = TONES[tone]
  return (
    <span
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: RADII.chip,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '-0.2px',
        background: t.fill,
        color: t.ink,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
