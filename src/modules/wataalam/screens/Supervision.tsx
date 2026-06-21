import { useState } from 'react'
import { JEWEL, RADII, TYPE, TEXT, CREAM, hexToRgba } from '../../../lib/glass'
import { Card, H1, buttonStyle } from '../components/Card'
import {
  loadSupervision,
  saveSupervision,
  type SupervisionCase,
} from '../lib/storage'

export default function Supervision() {
  const [cases, setCases] = useState<SupervisionCase[]>(() => loadSupervision())
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  function update(next: SupervisionCase[]) {
    setCases(next)
    saveSupervision(next)
  }

  function review(id: string) {
    update(
      cases.map((c) =>
        c.id === id ? { ...c, status: 'reviewed', feedbackSw: feedback[id] ?? '' } : c,
      ),
    )
  }
  function signOff(id: string) {
    update(cases.map((c) => (c.id === id ? { ...c, status: 'signed_off' } : c)))
  }

  const groups: Record<SupervisionCase['status'], SupervisionCase[]> = {
    pending: cases.filter((c) => c.status === 'pending'),
    reviewed: cases.filter((c) => c.status === 'reviewed'),
    signed_off: cases.filter((c) => c.status === 'signed_off'),
  }

  return (
    <div>
      <H1 english="Supervision">Usimamizi wa washauri wa kijamii</H1>

      {(['pending', 'reviewed', 'signed_off'] as const).map((g) => (
        <Card
          key={g}
          title={
            g === 'pending'
              ? `Zinazongoja (${groups[g].length})`
              : g === 'reviewed'
                ? `Zilizopitiwa (${groups[g].length})`
                : `Zilizosainiwa (${groups[g].length})`
          }
          accent={
            g === 'pending' ? JEWEL.maroonCrisis : g === 'reviewed' ? JEWEL.indigoWisdom : JEWEL.tealRoho
          }
          style={{ marginBottom: 12 }}
        >
          {groups[g].length === 0 ? (
            <p style={{ color: TEXT.muted, margin: 0 }}>Hakuna kesi.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
              {groups[g].map((c) => (
                <li
                  key={c.id}
                  style={{
                    padding: 14,
                    background: 'rgba(250,245,229,0.85)',
                    borderRadius: RADII.card,
                    border: '1px solid rgba(11,9,8,0.10)',
                    color: TEXT.body,
                  }}
                >
                  <div style={{ fontFamily: TYPE.serif, fontSize: 15, fontWeight: 600 }}>
                    {c.supervisee}
                  </div>
                  <div style={{ fontSize: 12, color: TEXT.muted, marginBottom: 6 }}>
                    {c.patientPseudonym} ·{' '}
                    {new Date(c.submittedISO).toLocaleDateString('sw-TZ')}
                  </div>
                  <p style={{ fontFamily: TYPE.serif, margin: '6px 0', lineHeight: 1.5 }}>
                    {c.summarySw}
                  </p>

                  {c.status === 'pending' && (
                    <>
                      <textarea
                        rows={3}
                        placeholder="Toa maoni / mwongozo…"
                        value={feedback[c.id] ?? ''}
                        onChange={(e) => setFeedback({ ...feedback, [c.id]: e.target.value })}
                        style={{
                          width: '100%',
                          background: CREAM.milk,
                          color: TEXT.body,
                          border: '1px solid rgba(11,9,8,0.22)',
                          borderRadius: RADII.card,
                          padding: 10,
                          fontFamily: TYPE.serif,
                          fontSize: 13,
                          marginTop: 8,
                          outline: 'none',
                          resize: 'vertical',
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <button onClick={() => review(c.id)} style={buttonStyle(JEWEL.indigoWisdom, true)}>
                          Pitisha
                        </button>
                      </div>
                    </>
                  )}

                  {c.status === 'reviewed' && (
                    <>
                      <p style={{ color: TEXT.body, fontSize: 13 }}>
                        Maoni: {c.feedbackSw}
                      </p>
                      <button onClick={() => signOff(c.id)} style={buttonStyle(JEWEL.goldHope, true)}>
                        ✓ Saini
                      </button>
                    </>
                  )}

                  {c.status === 'signed_off' && (
                    <p style={{ color: TEXT.link, fontWeight: 600, fontSize: 13 }}>
                      ✓ Imesainiwa — kesi imekamilika.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      ))}
    </div>
  )
}
