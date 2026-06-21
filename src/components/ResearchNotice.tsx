import type React from 'react'
import { BRAND, CREAM, TEXT } from '../lib/glass'

/**
 * Public research notice — short, dignified, no founder name.
 * Tells the user: free national platform, de-identified data may inform
 * national research, IRB-gated, never sold. That's it.
 *
 *   variant="welcome"  → Welcome page card
 *   variant="karibu"   → Karibu consent step
 *   variant="footer"   → Single line at page bottom
 */
export interface ResearchNoticeProps {
  variant?: 'welcome' | 'karibu' | 'footer'
}

const TITLE = 'Tumaini · faragha na utafiti'
const BODY =
  'Tumaini ni jukwaa la kitaifa la afya ya tabia — bure milele. ' +
  'Data isiyojulikana inaweza kuchangia utafiti wa kitaifa chini ya idhini ya bodi za maadili (IRB). ' +
  'Data yako haitauzwi kamwe, na hutaweza kutambuliwa.'
const BULLETS = [
  'Bure milele — kwa wote.',
  'De-identified — siri yako inalindwa.',
  'IRB-gated — utafiti wowote unahitaji idhini.',
  'Hauziwi kamwe.',
]

export default function ResearchNotice({ variant = 'welcome' }: ResearchNoticeProps): React.JSX.Element {
  if (variant === 'footer') {
    return (
      <p
        style={{
          margin: 0,
          color: TEXT.muted,
          fontSize: 12,
          lineHeight: 1.5,
          textAlign: 'center',
        }}
      >
        Bure milele. Data isiyojulikana inaweza kuchangia utafiti wa kitaifa chini ya IRB. Hauziwi.
      </p>
    )
  }

  if (variant === 'karibu') {
    return (
      <section
        aria-labelledby="ridhaa-utafiti-title"
        style={{
          background: CREAM.milk,
          border: `1.5px solid ${BRAND.green}`,
          borderRadius: 14,
          padding: '16px 18px',
          marginTop: 16,
        }}
      >
        <h3
          id="ridhaa-utafiti-title"
          style={{
            margin: 0,
            color: TEXT.heading,
            fontFamily: "'Georgia', serif",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: '-0.2px',
          }}
        >
          {TITLE}
        </h3>
        <p style={{ marginTop: 8, marginBottom: 10, color: TEXT.body, fontSize: 13.5, lineHeight: 1.55 }}>
          {BODY}
        </p>
        <ul style={{ paddingLeft: 18, margin: 0, color: TEXT.body, fontSize: 13, lineHeight: 1.7 }}>
          {BULLETS.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section
      aria-labelledby="research-notice-title"
      style={{
        background: CREAM.milk,
        border: `1px solid ${BRAND.green}`,
        borderRadius: 18,
        padding: '20px 22px',
        margin: '24px auto 0',
        maxWidth: 720,
      }}
    >
      <h2
        id="research-notice-title"
        style={{
          margin: 0,
          color: TEXT.heading,
          fontFamily: "'Georgia', serif",
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: '-0.3px',
          lineHeight: 1.2,
        }}
      >
        {TITLE}
      </h2>
      <p style={{ marginTop: 8, color: TEXT.body, fontSize: 14, lineHeight: 1.6 }}>
        {BODY}
      </p>
      <ul style={{ paddingLeft: 18, marginTop: 10, marginBottom: 0, color: TEXT.body, fontSize: 13.5, lineHeight: 1.7 }}>
        {BULLETS.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </section>
  )
}
