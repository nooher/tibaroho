import type React from 'react'
import { BRAND, CREAM, TEXT } from '../lib/glass'
import { useLang } from '../lib/i18n/Provider'

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

export default function ResearchNotice({ variant = 'welcome' }: ResearchNoticeProps): React.JSX.Element {
  const { t } = useLang()
  const TITLE = t('research.title', 'TABHOS · faragha na utafiti')
  const BODY = t('research.body', 'TABHOS ni jukwaa la kitaifa la afya ya tabia — bure milele. Data isiyojulikana inaweza kuchangia utafiti wa kitaifa chini ya idhini ya bodi za maadili (IRB). Data yako haitauzwi kamwe, na hutaweza kutambuliwa.')
  const BULLETS = [
    t('research.bullet1', 'Bure milele — kwa wote.'),
    t('research.bullet2', 'De-identified — siri yako inalindwa.'),
    t('research.bullet3', 'IRB-gated — utafiti wowote unahitaji idhini.'),
    t('research.bullet4', 'Hauziwi kamwe.'),
  ]
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
        {t('research.footer', 'Bure milele. Data isiyojulikana inaweza kuchangia utafiti wa kitaifa chini ya IRB. Hauziwi.')}
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
