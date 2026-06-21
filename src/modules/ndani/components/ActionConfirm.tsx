import type React from 'react'
import { useState } from 'react'
import { JEWEL, hexToRgba, RADII, TYPE, TEXT, CREAM, BRAND } from '../../../lib/glass'
import { logAction } from '../audit'

export interface ActionConfirmProps {
  open: boolean
  title: string
  description?: string
  action: string
  entity: string
  entity_id?: string
  prior?: unknown
  destructive?: boolean
  confirmLabel?: string
  onConfirm: (reason: string) => Promise<void> | void
  onClose: () => void
}

/**
 * Modal confirm for destructive actions. The reason is required and is
 * persisted to the append-only audit chain with a prior-state snapshot.
 */
export default function ActionConfirm(props: ActionConfirmProps): React.JSX.Element | null {
  const { open, title, description, action, entity, entity_id, prior, destructive, confirmLabel, onConfirm, onClose } = props
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  if (!open) return null

  const confirm = async (): Promise<void> => {
    if (!reason.trim()) return
    setBusy(true)
    try {
      await logAction({ action, entity, entity_id, reason: reason.trim(), prior })
      await onConfirm(reason.trim())
      setReason('')
      onClose()
    } finally { setBusy(false) }
  }

  const accent = destructive ? JEWEL.maroonCrisis : JEWEL.tealMwenza

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: hexToRgba(BRAND.ink, 0.55),
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(520px, 100%)',
          background: CREAM.milk,
          borderRadius: RADII.modal,
          border: `1px solid rgba(11,9,8,0.12)`,
          boxShadow: '0 30px 80px rgba(11,9,8,0.25)',
          padding: 28,
        }}
      >
        <h3 className="serif" style={{ margin: 0, fontSize: 22, color: accent, letterSpacing: TYPE.tightTrack }}>
          {title}
        </h3>
        {description ? (
          <p style={{ marginTop: 8, fontSize: 14, color: TEXT.body, lineHeight: 1.55 }}>
            {description}
          </p>
        ) : null}
        <div style={{ marginTop: 12, fontSize: 11, color: TEXT.muted, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700 }}>
          Hatua: {action} · {entity}{entity_id ? ` #${entity_id.slice(0, 6)}` : ''}
        </div>
        <label style={{ display: 'block', marginTop: 16, fontSize: 12, color: TEXT.heading, fontWeight: 600 }}>
          Sababu (itahifadhiwa kwenye audit log) *
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Eleza kwa nini hatua hii inachukuliwa…"
          rows={3}
          style={{
            width: '100%', marginTop: 6, padding: 10,
            background: CREAM.milk,
            border: `1px solid rgba(11,9,8,0.22)`,
            borderRadius: 10, fontSize: 14, color: TEXT.body, outline: 'none',
            resize: 'vertical', fontFamily: 'inherit',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
          <button onClick={onClose} style={{
            padding: '10px 16px', borderRadius: RADII.chip,
            background: 'transparent', border: `1px solid rgba(11,9,8,0.18)`,
            color: TEXT.body, cursor: 'pointer', fontSize: 13,
          }}>Ghairi</button>
          <button
            disabled={!reason.trim() || busy}
            onClick={() => { void confirm() }}
            style={{
              padding: '10px 18px', borderRadius: RADII.chip,
              background: accent, color: TEXT.onJewel, border: 'none',
              cursor: !reason.trim() || busy ? 'not-allowed' : 'pointer',
              opacity: !reason.trim() || busy ? 0.55 : 1,
              fontSize: 13, fontWeight: 700, letterSpacing: 0.4,
            }}
          >{busy ? 'Inafanya…' : (confirmLabel ?? 'Thibitisha')}</button>
        </div>
      </div>
    </div>
  )
}
