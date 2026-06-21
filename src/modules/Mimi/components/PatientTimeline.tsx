import type React from 'react'
import { useMemo, useState } from 'react'
import { BRAND, CREAM, JEWEL, RADII, TEXT, TYPE, hexToRgba } from '../../../lib/glass'
import {
  listResults, listMoods, listJournal, listEvents, listDocs,
} from '../data/store'

/**
 * Single-pane patient timeline (Mimi Home).
 *
 * Pulls from every Mimi localStorage tracker (assessments, moods, journal
 * entries, lab docs, appointments) and renders one vertical scroll with
 * flag-coded dots, expand-for-detail, and a crisis flag if any PHQ-9 ≥ 20
 * or assessment with `redFlag: true` appears in the window.
 */

type TimelineKind =
  | 'assessment' | 'mood' | 'journal' | 'lab' | 'appointment' | 'crisis'

interface TimelineEntry {
  id: string
  kind: TimelineKind
  takenAt: string
  title: string
  detail?: string
  toneJewel: string
}

const KIND_GLYPH: Record<TimelineKind, string> = {
  assessment: '✓',
  mood:       '◐',
  journal:    '✎',
  lab:        '☷',
  appointment:'⌖',
  crisis:     '!',
}

const KIND_LABEL_SW: Record<TimelineKind, string> = {
  assessment: 'Kipimo',
  mood:       'Hisia',
  journal:    'Shajara',
  lab:        'Maabara',
  appointment:'Miadi',
  crisis:     'Onyo',
}

function formatRelative(iso: string): string {
  const now = Date.now()
  const t = new Date(iso).getTime()
  const diff = Math.max(0, now - t)
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'sasa hivi'
  if (min < 60) return `dakika ${min} zilizopita`
  const h = Math.floor(min / 60)
  if (h < 24) return `saa ${h} zilizopita`
  const d = Math.floor(h / 24)
  if (d < 7) return `siku ${d} zilizopita`
  return new Date(iso).toLocaleDateString('sw-TZ', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function gather(): TimelineEntry[] {
  const out: TimelineEntry[] = []

  for (const r of listResults().slice(0, 30)) {
    const sev = r.severity
    let tone: string = JEWEL.tealRoho
    if (sev?.toLowerCase().includes('high') || sev?.toLowerCase().includes('severe')) tone = BRAND.yellow
    if (r.redFlag) tone = BRAND.ink
    out.push({
      id: `r-${r.id}`,
      kind: 'assessment',
      takenAt: r.takenAt,
      title: `${r.instrumentId.toUpperCase()} · ${r.score}`,
      detail: r.label_sw,
      toneJewel: tone,
    })
    if (r.redFlag) {
      out.push({
        id: `crisis-${r.id}`,
        kind: 'crisis',
        takenAt: r.takenAt,
        title: 'Onyo la usalama — fikia mtaalam haraka',
        detail: `${r.instrumentId.toUpperCase()} = ${r.score}`,
        toneJewel: BRAND.ink,
      })
    }
  }

  for (const m of listMoods().slice(0, 30)) {
    let tone: string = JEWEL.tealRoho
    if (m.score <= 3) tone = BRAND.ink
    else if (m.score <= 5) tone = BRAND.yellow
    out.push({
      id: `m-${m.id}`,
      kind: 'mood',
      takenAt: m.takenAt,
      title: `Hisia ${m.score}/10`,
      detail: m.emotions?.join(' · ') || m.note,
      toneJewel: tone,
    })
  }

  for (const j of listJournal().slice(0, 20)) {
    const preview = j.text?.slice(0, 120) || j.voiceTranscript?.slice(0, 120)
    out.push({
      id: `j-${j.id}`,
      kind: 'journal',
      takenAt: j.takenAt,
      title: j.topics?.join(' · ') || 'Shajara',
      detail: preview,
      toneJewel: BRAND.blue,
    })
  }

  for (const d of listDocs().slice(0, 20)) {
    if (d.kind !== 'lab') continue
    out.push({
      id: `d-${d.id}`,
      kind: 'lab',
      takenAt: d.uploadedAt,
      title: d.title || 'Ripoti ya maabara',
      detail: d.kind,
      toneJewel: BRAND.blue,
    })
  }

  for (const ev of listEvents().slice(0, 30)) {
    out.push({
      id: `e-${ev.id}`,
      kind: 'appointment',
      takenAt: ev.startsAt,
      title: ev.title_sw,
      detail: ev.notes,
      toneJewel: JEWEL.tealRoho,
    })
  }

  out.sort((a, b) => b.takenAt.localeCompare(a.takenAt))
  return out.slice(0, 40)
}

export function PatientTimeline(): React.JSX.Element {
  const entries = useMemo(() => gather(), [])
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section
      aria-label="Mstari wa muda wa mgonjwa"
      style={{
        background: CREAM.milk,
        border: `1px solid ${hexToRgba(BRAND.ink, 0.1)}`,
        borderRadius: RADII.sheet,
        padding: '22px 24px 18px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 14px 32px rgba(11,9,8,0.08)',
        color: BRAND.ink,
      }}
    >
      <header style={{ marginBottom: 14 }}>
        <div
          style={{
            fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: TEXT.hint, fontWeight: 700,
          }}
        >
          Yote mahali pamoja · Single-pane
        </div>
        <h2
          style={{
            margin: '4px 0 0',
            fontFamily: TYPE.serif,
            fontSize: 24,
            letterSpacing: TYPE.tighterTrack,
            color: BRAND.ink,
          }}
        >
          Mstari wa muda
        </h2>
      </header>

      {entries.length === 0 ? (
        <p style={{ margin: 0, color: TEXT.muted, fontSize: 14 }}>
          Bado hakuna shughuli. Anza kwa kuandika hisia au kuchukua kipimo.
        </p>
      ) : (
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative' }}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 11,
              top: 4,
              bottom: 4,
              width: 1,
              background: hexToRgba(BRAND.ink, 0.12),
            }}
          />
          {entries.map((e) => {
            const isOpen = expanded === e.id
            return (
              <li key={e.id} style={{ position: 'relative', paddingLeft: 36, paddingBottom: 14 }}>
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: 4,
                    top: 4,
                    width: 16, height: 16,
                    borderRadius: 999,
                    background: e.toneJewel,
                    color: '#fff',
                    fontSize: 10,
                    display: 'grid', placeItems: 'center',
                    boxShadow: `0 0 0 3px ${CREAM.milk}`,
                  }}
                >
                  {KIND_GLYPH[e.kind]}
                </span>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : e.id)}
                  aria-expanded={isOpen}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    color: BRAND.ink,
                    textAlign: 'left',
                    cursor: e.detail ? 'pointer' : 'default',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                    <strong style={{ fontWeight: 600, fontSize: 14 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: 10,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: TEXT.muted,
                          marginRight: 8,
                        }}
                      >
                        {KIND_LABEL_SW[e.kind]}
                      </span>
                      {e.title}
                    </strong>
                    <span style={{ fontSize: 11, color: TEXT.muted, whiteSpace: 'nowrap' }}>
                      {formatRelative(e.takenAt)}
                    </span>
                  </div>
                  {isOpen && e.detail && (
                    <div style={{ marginTop: 6, fontSize: 13, color: TEXT.body, lineHeight: 1.5 }}>
                      {e.detail}
                    </div>
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

export default PatientTimeline
