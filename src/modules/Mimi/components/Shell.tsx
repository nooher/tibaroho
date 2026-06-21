import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CREAM, JEWEL, NEUTRAL, RADII, TEXT, TYPE, TZ_FLAG, glass, hexToRgba } from '../../../lib/glass'

export function PageShell({
  title,
  subtitle,
  back,
  flagBar = true,
  children,
}: {
  title: string
  subtitle?: string
  back?: { to: string; label?: string }
  flagBar?: boolean
  children: ReactNode
}) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: CREAM.milk,
        color: TEXT.body,
        fontFamily: TYPE.sans,
        paddingBottom: 80,
      }}
    >
      {flagBar && <FlagBar />}
      <header style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px 14px' }}>
        {back && (
          <Link
            to={back.to}
            aria-label="Rudi"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: TEXT.muted,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            ← {back.label || 'Rudi'}
          </Link>
        )}
        <h1
          style={{
            fontFamily: TYPE.serif,
            fontSize: 40,
            letterSpacing: TYPE.tighterTrack,
            lineHeight: TYPE.headLeading,
            margin: '12px 0 6px',
            color: TEXT.heading,
            fontWeight: 800,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: 0, color: TEXT.muted, fontSize: 15 }}>{subtitle}</p>
        )}
      </header>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '8px 24px' }}>{children}</div>
    </main>
  )
}

export function FlagBar() {
  return (
    <div aria-hidden style={{ display: 'flex', height: 3 }}>
      <div style={{ flex: 1, background: TZ_FLAG.green }} />
      <div style={{ flex: 1, background: TZ_FLAG.yellow }} />
      <div style={{ flex: 1, background: TZ_FLAG.black }} />
      <div style={{ flex: 1, background: TZ_FLAG.yellow }} />
      <div style={{ flex: 1, background: TZ_FLAG.blue }} />
    </div>
  )
}

export function Card({
  jewel = JEWEL.tealRoho,
  alpha,
  style,
  children,
}: {
  jewel?: string
  alpha?: number
  style?: CSSProperties
  children: ReactNode
}) {
  void alpha
  return (
    <div
      style={{
        background: CREAM.ivory,
        border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
        borderTop: `3px solid ${jewel}`,
        boxShadow: '0 1px 0 rgba(11,9,8,0.04), 0 8px 22px rgba(11,9,8,0.05)',
        padding: 22,
        borderRadius: RADII.sheet,
        color: TEXT.body,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

void glass
