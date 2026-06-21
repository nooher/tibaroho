/**
 * ToastHost — global in-app notification surface for Tumaini.
 *
 * Listens on the toast bus (src/lib/notify.ts), stacks visible toasts in
 * the bottom-right (top-right on mobile), auto-dismisses after the per-toast
 * TTL. Variants map to flag-coloured accent stripes.
 */
import { useEffect, useState } from 'react'
import { BRAND, CREAM, NEUTRAL, TEXT, hexToRgba } from '../lib/glass'
import { onToast, type ToastEvent } from '../lib/notify'

type LiveToast = ToastEvent & { bornAt: number }

const variantAccent: Record<ToastEvent['variant'], string> = {
  info:    BRAND.blue,
  success: BRAND.green,
  warning: BRAND.yellow,
  error:   '#8C2222',
}

export default function ToastHost() {
  const [toasts, setToasts] = useState<LiveToast[]>([])

  useEffect(() => {
    const stop = onToast((e) => {
      const t: LiveToast = { ...e, bornAt: Date.now() }
      setToasts((cur) => [...cur, t])
      window.setTimeout(() => {
        setToasts((cur) => cur.filter((x) => x.id !== t.id))
      }, e.ttlMs)
    })
    return stop
  }, [])

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      role="status"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 9000,
        maxWidth: 340,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: CREAM.ivory,
            color: TEXT.body,
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
            borderLeft: `4px solid ${variantAccent[t.variant]}`,
            borderRadius: 12,
            padding: '12px 14px',
            fontSize: 13.5,
            lineHeight: 1.45,
            fontWeight: 600,
            boxShadow: '0 1px 0 rgba(11,9,8,0.04), 0 12px 32px rgba(11,9,8,0.10)',
            pointerEvents: 'auto',
            animation: 'tum-toast-rise 220ms cubic-bezier(.16,1,.3,1) both',
          }}
        >
          {t.message}
        </div>
      ))}
      <style>{`
        @keyframes tum-toast-rise {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
