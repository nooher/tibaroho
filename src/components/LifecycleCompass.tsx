import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LIFECYCLE_STAGES, type LifecycleStageId } from '../lib/lifecycle'
import { CREAM, NEUTRAL, TEXT, hexToRgba } from '../lib/glass'
import { useLang } from '../lib/i18n/Provider'

/**
 * Lifecycle compass — horizontal strip of 9 dots, one per stage.
 * Highlights the active stage(s) for the current screen. Each dot links
 * to the stage's destination route. Renders below TopNav globally.
 */
export interface LifecycleCompassProps {
  /** Stage(s) the current screen primarily represents. */
  active?: readonly LifecycleStageId[] | LifecycleStageId | 'all'
  /** Caller-supplied label shown to the left of the strip. */
  caption?: string
}

export function LifecycleCompass({ active, caption }: LifecycleCompassProps) {
  const [hover, setHover] = useState<LifecycleStageId | null>(null)
  const { t } = useLang()
  const activeSet =
    active === 'all'
      ? new Set<LifecycleStageId>(LIFECYCLE_STAGES.map((s) => s.id))
      : Array.isArray(active)
        ? new Set<LifecycleStageId>(active)
        : active
          ? new Set<LifecycleStageId>([active as LifecycleStageId])
          : new Set<LifecycleStageId>()

  return (
    <div
      role="navigation"
      aria-label={t('ui.dira_maisha', 'Dira ya maisha')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 14px',
        marginTop: 4,
        background: CREAM.ivory,
        border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
        borderRadius: 999,
        width: 'fit-content',
        marginLeft: 'auto',
        marginRight: 'auto',
        minHeight: 28,
      }}
    >
      <span
        style={{
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: TEXT.hint,
        }}
      >
        {caption ?? t('ui.dira', 'Dira')}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {LIFECYCLE_STAGES.map((s) => {
          const on = activeSet.has(s.id)
          const isHover = hover === s.id
          const size = on ? 14 : 9
          return (
            <Link
              key={s.id}
              to={s.href}
              aria-label={`${s.sw} — ${s.en}`}
              onMouseEnter={() => setHover(s.id)}
              onMouseLeave={() => setHover(null)}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 18,
                height: 18,
                textDecoration: 'none',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: size,
                  height: size,
                  borderRadius: 999,
                  background: s.color,
                  opacity: on ? 1 : 0.42,
                  border: on ? `1.5px solid ${CREAM.milk}` : 'none',
                  boxShadow: on ? `0 0 0 1px ${hexToRgba(s.color, 0.45)}` : 'none',
                  transition: 'all 160ms cubic-bezier(.25,.46,.45,.94)',
                }}
              />
              {isHover && (
                <span
                  role="tooltip"
                  style={{
                    position: 'absolute',
                    top: 22,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: NEUTRAL.ink,
                    color: CREAM.cream,
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    whiteSpace: 'nowrap',
                    zIndex: 900,
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                  }}
                >
                  {t(`stage.${s.id}`, s.sw)}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default LifecycleCompass
