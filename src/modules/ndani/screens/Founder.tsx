import type React from 'react'
import { useEffect, useState } from 'react'
import { Card } from '../../_shared/Layout'
import { JEWEL, CREAM, NEUTRAL, hexToRgba, TEXT } from '../../../lib/glass'
import { list } from '../../../lib/db'
import { logPrincipalView, auditEvent, readSelfAuditAsync, type AuditEntry } from '../audit'
import { useLang } from '../../../lib/i18n/Provider'

const QUICK_LINKS = [
  { label: 'laetoli.tz hub', href: 'https://laetoli.tz' },
  { label: 'Vercel Dashboard', href: 'https://vercel.com/dashboard' },
  { label: 'Supabase', href: 'https://supabase.com/dashboard' },
  { label: 'GitHub — Laetoli', href: 'https://github.com/nooher' },
  { label: 'Tumaini live', href: 'https://tibaroho.vercel.app' },
]

const PHD_MILESTONES = [
  { label: 'UAMS stipend confirmation', due: '2026-07-31', status: 'pending' },
  { label: 'Dr. Baloh first meeting', due: '2026-08-15', status: 'pending' },
  { label: 'MUHAS co-investigator identified', due: '2026-09-30', status: 'pending' },
  { label: 'Dual IRB submission (UAMS + NIMR)', due: '2026-11-30', status: 'pending' },
  { label: 'Wellcome MH Discovery LOI', due: '2026-10-15', status: 'pending' },
]

const FUNDING_PIPELINE = [
  { name: 'Wellcome Mental Health Discovery', range: '£1–3M', stage: 'LOI prep' },
  { name: 'Grand Challenges Canada Saving Brains', range: '$250–1M', stage: 'Eligibility check' },
  { name: 'MQ Mental Health Research', range: '£200–500K', stage: 'Backlog' },
  { name: 'NIH Fogarty D43', range: '$1.5M', stage: 'Year-1 plan' },
]

export default function FounderConsole(): React.JSX.Element {
  const { t } = useLang()
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState<{ ts: string; body: string }[]>(() => {
    try {
      const raw = localStorage.getItem('tumaini.founder.notes.v1')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [counts, setCounts] = useState({ users: 0, providers: 0, openCrisis: 0 })
  const [selfAudit, setSelfAudit] = useState<AuditEntry[]>([])

  useEffect(() => {
    let mounted = true
    void Promise.all([list('tr_users'), list('tr_providers'), list('tr_appointments')])
      .then(([u, p, a]) => {
        if (!mounted) return
        const openCrisis = a.filter((x) => x.status === 'requested').length
        setCounts({ users: u.length, providers: p.length, openCrisis })
      }).catch(() => undefined)
    void readSelfAuditAsync().then((rows) => { if (mounted) setSelfAudit(rows.slice(0, 10)) })
    return () => { mounted = false }
  }, [])

  const addNote = (): void => {
    if (!note.trim()) return
    const next = [{ ts: new Date().toISOString().replace('T', ' ').slice(0, 16), body: note.trim() }, ...notes]
    setNotes(next)
    setNote('')
    try { localStorage.setItem('tumaini.founder.notes.v1', JSON.stringify(next)) } catch { /* ignore */ }
    void auditEvent('founder.note.create', 'tumaini.founder.notes', undefined, { length: note.trim().length })
  }

  const principalView = (): void => {
    void logPrincipalView('platform.all', 'Founder principal-view invoked from /ndani/founder').then(() => {
      void readSelfAuditAsync().then((rows) => setSelfAudit(rows.slice(0, 10)))
    })
    alert(
      'Bismillah · Alhamdulillah · Ya Fattah · Ya Mughni\n\n' +
      'PRINCIPAL VIEW imewashwa. Kila ufikiaji wa data ya watumiaji utaandikwa kwenye self-audit feed.',
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title={t('ndani.founder.welcome_title', 'Karibu, Dr. Nooher')}>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          {t('ndani.founder.welcome_body', 'Hii ni dawati lako binafsi. Hakuna mtu mwingine anayeona ukurasa huu. Linganisha kazi ya leo, hifadhi maelezo ya hizo nia, na fungua zana unazohitaji haraka.')}
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12, marginTop: 14,
        }}>
          <div><div style={{ fontSize: 11, color: TEXT.muted, letterSpacing: 0.6, textTransform: 'uppercase' }}>{t('ndani.founder.users', 'Watumiaji')}</div><div style={{ fontSize: 22, color: TEXT.heading, fontWeight: 700 }}>{counts.users}</div></div>
          <div><div style={{ fontSize: 11, color: TEXT.muted, letterSpacing: 0.6, textTransform: 'uppercase' }}>{t('ndani.founder.providers', 'Wahudumu')}</div><div style={{ fontSize: 22, color: TEXT.heading, fontWeight: 700 }}>{counts.providers}</div></div>
          <div><div style={{ fontSize: 11, color: TEXT.muted, letterSpacing: 0.6, textTransform: 'uppercase' }}>{t('ndani.founder.appts_pending', 'Miadi inasubiri')}</div><div style={{ fontSize: 22, color: TEXT.heading, fontWeight: 700 }}>{counts.openCrisis}</div></div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        <Card title={t('ndani.founder.phd_title', 'Hatua za PhD')}>
          <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
            {PHD_MILESTONES.map(m => (
              <li key={m.label}>
                <strong>{m.label}</strong>
                <div style={{ fontSize: 12, color: TEXT.muted }}>{t('ndani.founder.phd_due', 'Due')} {m.due} · {m.status}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={t('ndani.founder.funding_title', 'Mtandao wa fedha')}>
          <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
            {FUNDING_PIPELINE.map(f => (
              <li key={f.name}>
                <strong>{f.name}</strong>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{f.range} · {f.stage}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title={t('ndani.founder.notes_title', 'Maelezo ya haraka')}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={t('ndani.founder.notes_placeholder', 'Andika neno la haraka…')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 10,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
              background: CREAM.milk,
              color: NEUTRAL.ink,
              fontFamily: 'inherit',
              fontSize: 14,
            }}
          />
          <button
            onClick={addNote}
            style={{
              background: JEWEL.tealMwenza,
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '10px 18px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >{t('ndani.founder.save', 'Hifadhi')}</button>
        </div>
        {notes.length === 0 && <p style={{ color: TEXT.muted, margin: 0 }}>{t('ndani.founder.no_notes', 'Hakuna maelezo bado.')}</p>}
        <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.7 }}>
          {notes.slice(0, 10).map((n, i) => (
            <li key={i}>
              <div style={{ fontSize: 12, color: TEXT.muted }}>{n.ts}</div>
              <div>{n.body}</div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={t('ndani.founder.links_title', 'Viungo vya haraka')}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {QUICK_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: hexToRgba(JEWEL.tealMwenza, 0.10),
                color: JEWEL.tealMwenza,
                padding: '8px 14px',
                borderRadius: 999,
                fontSize: 13,
                textDecoration: 'none',
                fontWeight: 600,
                border: `1px solid ${hexToRgba(JEWEL.tealMwenza, 0.25)}`,
              }}
            >{l.label} ↗</a>
          ))}
        </div>
      </Card>

      <Card title={t('ndani.founder.principal_title', 'Tazama Yote (PRINCIPAL VIEW)')}>
        <p style={{ marginTop: 0, color: TEXT.muted }}>
          {t('ndani.founder.principal_body', 'Bonyeza tu wakati una sababu halali — kila ufikiaji unaandikwa kwenye self-audit feed inayoonekana hapa peke yake.')}
        </p>
        <button
          onClick={principalView}
          style={{
            background: JEWEL.maroonCrisis,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 18px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >{t('ndani.founder.principal_button', 'Washa PRINCIPAL VIEW')}</button>
        {selfAudit.length > 0 ? (
          <ul style={{ paddingLeft: 18, margin: '12px 0 0', lineHeight: 1.6, fontSize: 12 }}>
            {selfAudit.map((e) => (
              <li key={e.hash}>
                <span style={{ color: TEXT.muted }}>{e.ts.slice(0, 16).replace('T', ' ')}</span>
                {' · '}{e.action} → {e.entity}
                {e.reason ? <span style={{ color: TEXT.muted }}> · {e.reason}</span> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </Card>

      {/* Hidden header — never visible. Code-side signature. */}
      <div aria-hidden style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
        Bismillah · Alhamdulillah · Ya Fattah · Ya Fattah · Ya Fattah · Ya Mughni · Ya Mughni · Ya Mughni · ibn 3rd of 3rd
      </div>
    </div>
  )
}
