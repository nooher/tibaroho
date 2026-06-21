import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../lib/i18n/Provider'
import { JEWEL, NEUTRAL, RADII, TEXT, glass, hexToRgba, TYPE } from '../../../lib/glass'
import {
  type Provider,
  PROVIDER_KIND_LABEL_SW,
  formatTzs,
  initialsOf,
} from '../data/providers'

interface Props {
  provider: Provider
  /** Compact variant — used inside map mini-popovers. */
  compact?: boolean
}

/**
 * Reusable provider card — glass surface, initials avatar, jewel-tinted
 * specialty chips, rating + accepting badge. AAA-safe contrast.
 */
export function ProviderCard({ provider, compact = false }: Props) {
  const { t } = useLang()
  const initials = initialsOf(provider.name)
  const avatarStyle: CSSProperties = {
    width: compact ? 48 : 64,
    height: compact ? 48 : 64,
    borderRadius: 999,
    background: JEWEL.tealRoho,
    border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`,
    color: TEXT.onJewel,
    display: 'grid',
    placeItems: 'center',
    fontFamily: TYPE.serif,
    fontWeight: 600,
    fontSize: compact ? 18 : 24,
    letterSpacing: TYPE.tightTrack,
    flexShrink: 0,
  }

  const cardStyle: CSSProperties = {
    ...glass(JEWEL.tealRoho, 0.08),
    padding: compact ? 12 : 18,
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
    textDecoration: 'none',
    color: TEXT.body,
    transition: 'transform 160ms ease, box-shadow 280ms ease',
  }

  const chipStyle = (bg: string): CSSProperties => ({
    background: hexToRgba(bg, 0.14),
    border: `1px solid ${hexToRgba(bg, 0.5)}`,
    color: TEXT.body,
    padding: '3px 9px',
    borderRadius: RADII.chip,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 0.2,
  })

  return (
    <Link
      to={`/gundua/profile/${provider.id}`}
      style={cardStyle}
      aria-label={`Tazama wasifu wa ${provider.honorific} ${provider.name}`}
    >
      <div style={avatarStyle} aria-hidden>
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: TYPE.serif,
              fontSize: compact ? 15 : 18,
              fontWeight: 600,
              letterSpacing: TYPE.tightTrack,
            }}
          >
            {provider.honorific} {provider.name}
          </span>
          {provider.verified && (
            <span
              title={t('gundua.card.verified', 'Imethibitishwa')}
              aria-label={t('gundua.card.verified', 'Imethibitishwa')}
              style={{
                ...chipStyle(JEWEL.goldHope),
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 16 16" aria-hidden>
                <path
                  d="M2 8.5l3.5 3.5L14 4"
                  stroke={JEWEL.goldSoft}
                  strokeWidth="2.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t('gundua.card.verified', 'Imethibitishwa')}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 12,
            color: TEXT.muted,
            marginTop: 2,
            letterSpacing: 0.2,
          }}
        >
          {PROVIDER_KIND_LABEL_SW[provider.kind]} · {provider.location.city}
          {provider.location.neighborhood ? `, ${provider.location.neighborhood}` : ''}
        </div>
        {!compact && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {provider.specialtiesSw.slice(0, 3).map((s) => (
              <span key={s} style={chipStyle(JEWEL.tealDeep)}>
                {s}
              </span>
            ))}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: compact ? 6 : 12,
            fontSize: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden>
              <path
                d="M8 1l2.18 4.42 4.88.71-3.53 3.44.83 4.86L8 12.13l-4.36 2.3.83-4.86L.94 6.13l4.88-.71L8 1z"
                fill={JEWEL.goldSoft}
              />
            </svg>
            {provider.rating.toFixed(1)} <span style={{ color: TEXT.muted }}>({provider.reviewsCount})</span>
          </span>
          <span style={{ color: TEXT.body }}>{formatTzs(provider.feeTzs)}</span>
          <span
            style={{
              ...chipStyle(provider.accepting ? JEWEL.tealRoho : JEWEL.maroonCrisis),
              fontSize: 10,
            }}
          >
            {provider.accepting ? t('gundua.card.accepting', 'Anapokea') : t('gundua.card.not_accepting', 'Hapokei')}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProviderCard
