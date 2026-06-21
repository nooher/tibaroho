import type React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, TYPE, hexToRgba } from '../lib/glass'
import { listQuickActions } from '../lib/quickActions'
import { useLang } from '../lib/i18n'

const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * "+" pill in the top nav. Click → slim slide-down sheet with the
 * 2-click-max quick actions (Cmd-K is the keyboard equivalent).
 */
export function QuickActionsMenu(): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const [lang] = useLang()
  const actions = listQuickActions()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Group by group_sw
  const groups: Record<string, typeof actions> = {}
  for (const a of actions) {
    if (!groups[a.group_sw]) groups[a.group_sw] = []
    groups[a.group_sw]!.push(a)
  }

  const tip = lang === 'en' ? 'Quick actions' : 'Hatua za haraka'

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={tip}
        title={tip}
        aria-expanded={open}
        style={{
          width: 36, height: 36,
          borderRadius: 999,
          background: CREAM.ivory,
          border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
          color: BRAND.green,
          display: 'grid', placeItems: 'center',
          fontSize: 20, fontWeight: 600,
          cursor: 'pointer',
          fontFamily: TYPE.sans,
        }}
      >
        +
      </button>

      {open && (
        <>
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 700 }}
          />
          <div
            role="menu"
            aria-label={tip}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              zIndex: 750,
              minWidth: 280,
              maxWidth: 320,
              background: CREAM.milk,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.14)}`,
              borderRadius: RADII.sheet,
              boxShadow: '0 24px 64px rgba(11,9,8,0.18)',
              padding: '12px 8px',
              animation: PREFERS_REDUCED_MOTION
                ? undefined
                : 'qa-drop 200ms cubic-bezier(.25,.46,.45,.94)',
            }}
          >
            {Object.entries(groups).map(([group, items]) => (
              <div key={group} style={{ padding: '4px 6px 8px' }}>
                <div
                  style={{
                    fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: TEXT.hint, fontWeight: 700,
                    padding: '6px 8px 4px',
                  }}
                >
                  {group}
                </div>
                {items.map((a) => (
                  <Link
                    key={a.id}
                    to={a.to}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '9px 10px',
                      borderRadius: 10,
                      color: BRAND.ink,
                      textDecoration: 'none',
                      fontSize: 14,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 22, height: 22,
                        borderRadius: 999,
                        display: 'grid', placeItems: 'center',
                        background: hexToRgba(BRAND.green, 0.12),
                        color: BRAND.green,
                        fontSize: 12, fontWeight: 700,
                      }}
                    >
                      {a.glyph}
                    </span>
                    {lang === 'en' ? a.label_en : a.label_sw}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes qa-drop { from { transform: translateY(-6px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes qa-drop { from { opacity: 1 } to { opacity: 1 } }
        }
      `}</style>
    </div>
  )
}

export default QuickActionsMenu
