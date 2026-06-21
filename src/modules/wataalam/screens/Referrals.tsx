import { useState } from 'react'
import { JEWEL, RADII, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { Card, H1, buttonStyle, FieldLabel, fieldStyle } from '../components/Card'
import { loadReferrals, saveReferrals, type Referral } from '../lib/storage'
import { PROVIDERS } from '../../Gundua/data/providers'
import { useLang } from '../../../lib/i18n/Provider'

export default function Referrals() {
  const { t } = useLang()
  const [refs, setRefs] = useState<Referral[]>(() => loadReferrals())
  const [tab, setTab] = useState<'sent' | 'received'>('received')
  const [draft, setDraft] = useState({
    patientPseudonym: '',
    counterpartyName: PROVIDERS[0]!.name,
    reasonSw: '',
  })

  const persist = (n: Referral[]) => {
    setRefs(n)
    saveReferrals(n)
  }

  function send() {
    if (!draft.patientPseudonym.trim() || !draft.reasonSw.trim()) return
    const r: Referral = {
      id: 'r-' + Date.now(),
      direction: 'sent',
      patientPseudonym: draft.patientPseudonym,
      counterpartyName: draft.counterpartyName,
      reasonSw: draft.reasonSw,
      status: 'pending',
      dateISO: new Date().toISOString(),
    }
    persist([r, ...refs])
    setDraft({ ...draft, patientPseudonym: '', reasonSw: '' })
  }

  function setStatus(id: string, status: Referral['status']) {
    persist(refs.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const list = refs.filter((r) => r.direction === tab)

  return (
    <div>
      <H1 english="Referrals">{t('wataalam.referrals.title', 'Rufaa')}</H1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        <Card title={t('wataalam.referrals.network', 'Mtandao wa rufaa')}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {(['received', 'sent'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                style={buttonStyle(tab === k ? JEWEL.goldHope : JEWEL.tealDeep, tab === k)}
                aria-pressed={tab === k}
              >
                {k === 'received' ? `${t('wataalam.referrals.received', 'Zilizopokelewa')} (${refs.filter(r=>r.direction==='received').length})` : `${t('wataalam.referrals.sent', 'Zilizotumwa')} (${refs.filter(r=>r.direction==='sent').length})`}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <p style={{ color: TEXT.muted, margin: 0 }}>{t('wataalam.referrals.none', 'Hakuna rufaa.')}</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
              {list.map((r) => (
                <li
                  key={r.id}
                  style={{
                    padding: 14,
                    background: 'rgba(250,245,229,0.85)',
                    borderRadius: RADII.card,
                    border: '1px solid rgba(11,9,8,0.10)',
                    color: TEXT.body,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: TYPE.serif, fontSize: 15 }}>
                        {r.patientPseudonym} → {r.counterpartyName}
                      </div>
                      <div style={{ fontSize: 12, color: TEXT.muted, marginTop: 2 }}>
                        {new Date(r.dateISO).toLocaleDateString('sw-TZ')}
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <p style={{ fontFamily: TYPE.serif, margin: '8px 0 0', fontSize: 14 }}>
                    {r.reasonSw}
                  </p>
                  {tab === 'received' && r.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button
                        onClick={() => setStatus(r.id, 'accepted')}
                        style={buttonStyle(JEWEL.goldHope, true)}
                      >
                        {t('wataalam.referrals.accept', 'Kubali')}
                      </button>
                      <button
                        onClick={() => setStatus(r.id, 'declined')}
                        style={buttonStyle(JEWEL.maroonCrisis)}
                      >
                        {t('wataalam.referrals.decline', 'Kataa')}
                      </button>
                    </div>
                  )}
                  {r.status === 'accepted' && (
                    <button
                      onClick={() => setStatus(r.id, 'completed')}
                      style={{ ...buttonStyle(JEWEL.tealRoho, true), marginTop: 10 }}
                    >
                      {t('wataalam.referrals.complete', 'Maliza')}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title={t('wataalam.referrals.send_card', 'Tuma rufaa')}>
          <FieldLabel>{t('wataalam.referrals.patient_code', 'Mteja (kificho)')}</FieldLabel>
          <input
            style={fieldStyle()}
            value={draft.patientPseudonym}
            onChange={(e) => setDraft({ ...draft, patientPseudonym: e.target.value })}
            placeholder="Mteja Z"
          />
          <FieldLabel>{t('wataalam.referrals.provider', 'Mtaalamu')}</FieldLabel>
          <select
            style={fieldStyle()}
            value={draft.counterpartyName}
            onChange={(e) => setDraft({ ...draft, counterpartyName: e.target.value })}
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.name}>
                {p.honorific} {p.name} — {p.location.city}
              </option>
            ))}
          </select>
          <FieldLabel>{t('wataalam.referrals.reason', 'Sababu')}</FieldLabel>
          <textarea
            rows={4}
            style={{
              ...fieldStyle(),
              fontFamily: TYPE.serif,
              fontSize: 14,
              resize: 'vertical',
            }}
            value={draft.reasonSw}
            onChange={(e) => setDraft({ ...draft, reasonSw: e.target.value })}
            placeholder={t('wataalam.referrals.reason_ph', 'Eleza sababu na malengo ya rufaa…')}
          />
          <button
            onClick={send}
            style={{ ...buttonStyle(JEWEL.goldHope, true), marginTop: 14, width: '100%' }}
          >
            {t('wataalam.referrals.send_btn', 'Tuma rufaa')}
          </button>
        </Card>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Referral['status'] }) {
  const map: Record<Referral['status'], { sw: string; jewel: string }> = {
    pending: { sw: 'Inangoja', jewel: JEWEL.goldHope },
    accepted: { sw: 'Imekubaliwa', jewel: JEWEL.tealRoho },
    declined: { sw: 'Imekataliwa', jewel: JEWEL.maroonCrisis },
    completed: { sw: 'Imekamilika', jewel: JEWEL.tealDeep },
  }
  const m = map[status]
  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: 999,
        background: hexToRgba(m.jewel, 0.3),
        border: `1px solid ${hexToRgba(m.jewel, 0.55)}`,
        fontSize: 11,
        color: TEXT.body,
      }}
    >
      {m.sw}
    </span>
  )
}
