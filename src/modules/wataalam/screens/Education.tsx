import { useMemo, useState } from 'react'
import { JEWEL, RADII, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { Card, H1, buttonStyle } from '../components/Card'
import { loadCEU, saveCEU, type CEUEntry } from '../lib/storage'

interface Course {
  id: string
  titleSw: string
  titleEn: string
  hours: number
  source: string
  descSw: string
}

const COURSES: Course[] = [
  {
    id: 'cbt-1',
    titleSw: 'CBT kwa Kiswahili — Moduli 1',
    titleEn: 'CBT in Swahili — Module 1',
    hours: 6,
    source: 'Laetoli + MUHAS',
    descSw: 'Misingi ya CBT iliyobadilishwa kwa muktadha wa Kitanzania.',
  },
  {
    id: 'mi-1',
    titleSw: 'Motivational Interviewing kwa kazi ya kliniki',
    titleEn: 'MI for clinical work',
    hours: 4,
    source: 'WHO',
    descSw: 'Mbinu za kuongeza motisha ya mteja kwa mabadiliko.',
  },
  {
    id: 'pmplus-cert',
    titleSw: 'PM+ Cheti cha Mwalimu wa Kijamii',
    titleEn: 'PM+ Lay Counsellor Certification',
    hours: 20,
    source: 'WHO',
    descSw: 'Cheti rasmi cha kutoa PM+ chini ya usimamizi.',
  },
  {
    id: 'crisis-1',
    titleSw: 'Kushughulika na mteja anayetaka kujiua',
    titleEn: 'Managing the suicidal patient',
    hours: 3,
    source: 'Lifeline 0800 110014',
    descSw: 'C-SSRS, safety planning, na uhamishaji wa haraka.',
  },
  {
    id: 'ethics-1',
    titleSw: 'Maadili ya kazi ya afya ya akili',
    titleEn: 'Ethics in mental health',
    hours: 2,
    source: 'TPB',
    descSw: 'Faragha, kibali, mipaka, na maslahi yanayopingana.',
  },
  {
    id: 'culture-1',
    titleSw: 'Utamaduni na afya ya akili Tanzania',
    titleEn: 'Culture and mental health',
    hours: 4,
    source: 'UDSM',
    descSw: 'Imani za jadi, dini, na athari kwenye huduma.',
  },
]

export default function Education() {
  const [earned, setEarned] = useState<CEUEntry[]>(() => loadCEU())

  const total = useMemo(() => earned.reduce((s, e) => s + e.hours, 0), [earned])
  const goal = 30

  function enroll(c: Course) {
    const e: CEUEntry = {
      id: 'c-' + Date.now(),
      titleSw: c.titleSw,
      hours: c.hours,
      completedISO: new Date().toISOString(),
    }
    const next = [e, ...earned]
    setEarned(next)
    saveCEU(next)
  }

  return (
    <div>
      <H1 english="CEU library">Maktaba ya elimu endelevu</H1>

      <Card title="Maendeleo yako" accent={JEWEL.goldHope}>
        <p style={{ margin: '0 0 8px', fontFamily: TYPE.serif, fontSize: 18 }}>
          <strong>{total}</strong> ya saa <strong>{goal}</strong> kwa mwaka huu
        </p>
        <div
          aria-label="Maendeleo"
          style={{
            height: 12,
            borderRadius: 999,
            background: hexToRgba(JEWEL.tealDeep, 0.5),
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(100, (total / goal) * 100)}%`,
              height: '100%',
              background: hexToRgba(JEWEL.goldSoft, 0.85),
              transition: 'width 280ms ease',
            }}
          />
        </div>
      </Card>

      <h2 style={{ fontFamily: TYPE.serif, fontSize: 20, margin: '22px 0 10px' }}>
        Kozi zinazopatikana
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {COURSES.map((c) => {
          const done = earned.find((e) => e.titleSw === c.titleSw)
          return (
            <Card key={c.id} title={c.titleSw} english={`${c.hours} saa`}>
              <p style={{ fontSize: 12, color: TEXT.muted, margin: '0 0 6px' }}>{c.source}</p>
              <p style={{ fontFamily: TYPE.serif, margin: 0, lineHeight: 1.5, fontSize: 14 }}>
                {c.descSw}
              </p>
              <button
                onClick={() => enroll(c)}
                disabled={!!done}
                style={{
                  ...buttonStyle(done ? JEWEL.tealRoho : JEWEL.goldHope, true),
                  marginTop: 12,
                  opacity: done ? 0.6 : 1,
                }}
              >
                {done ? '✓ Imekamilika' : 'Anza →'}
              </button>
            </Card>
          )
        })}
      </div>

      <h2 style={{ fontFamily: TYPE.serif, fontSize: 20, margin: '22px 0 10px' }}>
        Kozi ulizomaliza ({earned.length})
      </h2>
      <Card>
        {earned.length === 0 ? (
          <p style={{ color: TEXT.muted, margin: 0 }}>Hakuna kozi bado.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
            {earned.map((e) => (
              <li
                key={e.id}
                style={{
                  padding: 10,
                  background: 'rgba(250,245,229,0.85)',
                  border: '1px solid rgba(11,9,8,0.10)',
                  color: TEXT.body,
                  borderRadius: RADII.card,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                }}
              >
                <span>{e.titleSw}</span>
                <span style={{ color: TEXT.muted }}>
                  {e.hours} saa · {new Date(e.completedISO).toLocaleDateString('sw-TZ')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
