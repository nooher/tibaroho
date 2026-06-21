import { useState } from 'react'
import { JEWEL, TYPE, TEXT } from '../../../lib/glass'
import { Card, H1, buttonStyle } from '../components/Card'

interface Template {
  id: string
  name: string
  source: string
  description: string
  sessions: number
  outline: string[]
}

const TEMPLATES: Template[] = [
  {
    id: 'pmplus',
    name: 'PM+',
    source: 'WHO — Problem Management Plus',
    description:
      'Mpango wa vipindi 5 kwa watu wazima walio na shida ya kawaida ya akili. Unaongozwa na washauri wa kijamii.',
    sessions: 5,
    outline: [
      'Kipindi 1: Kupunguza msongo (kupumua)',
      'Kipindi 2: Kutatua tatizo',
      'Kipindi 3: Kufanya — kuwezesha tabia',
      'Kipindi 4: Kuimarisha msaada wa kijamii',
      'Kipindi 5: Kudumisha mafanikio',
    ],
  },
  {
    id: 'ceta',
    name: 'CETA',
    source: 'Common Elements Treatment Approach',
    description:
      'Mfumo wa moduli kwa sonona, wasiwasi, na kiwewe — kwa vipindi 8–12.',
    sessions: 10,
    outline: [
      'Mwingiliano wa kujenga uhusiano',
      'Saikolojia ya elimu',
      'CBT — mawazo na hisia',
      'Maonyesho ya kuonyeshwa kwa kiwewe',
      'Marudio ya mafanikio',
    ],
  },
  {
    id: 'ipt',
    name: 'IPT',
    source: 'Interpersonal Therapy',
    description:
      'Tiba inayolenga mahusiano kwa sonona — vipindi 12–16.',
    sessions: 14,
    outline: [
      'Awamu ya awali: tathmini ya mahusiano',
      'Awamu ya katikati: kushughulikia eneo moja',
      'Huzuni, mizozo, mabadiliko, upweke',
      'Awamu ya mwisho: kuunganisha',
    ],
  },
  {
    id: 'mi',
    name: 'MI',
    source: 'Motivational Interviewing',
    description:
      'Mbinu ya mazungumzo ya kuongeza motisha ya mabadiliko, hasa kwa madawa.',
    sessions: 4,
    outline: [
      'Kueleza huruma',
      'Kuendeleza utofauti',
      'Kucheka pingamizi',
      'Kusaidia ujasiri wa mteja',
    ],
  },
  {
    id: 'cbt',
    name: 'CBT',
    source: 'Cognitive Behavioral Therapy',
    description: 'CBT ya kawaida kwa sonona / wasiwasi — vipindi 12.',
    sessions: 12,
    outline: [
      'Saikoelimu',
      'Kuwezesha tabia',
      'Kutambua mawazo ya kiotomatiki',
      'Kupinga mawazo',
      'Kuonyesha (exposure) kwa wasiwasi',
      'Kuzuia kurudia',
    ],
  },
  {
    id: 'mbsr',
    name: 'MBSR-lite',
    source: 'Mindfulness-Based Stress Reduction',
    description: 'Toleo fupi la wiki 4 kwa mafadhaiko ya jumla.',
    sessions: 4,
    outline: [
      'Wiki 1: kuwa hapa sasa',
      'Wiki 2: kupumua kwa uangalifu',
      'Wiki 3: kutembea kwa uangalifu',
      'Wiki 4: huruma ya kibinafsi',
    ],
  },
]

export default function CarePlanTemplates() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [applied, setApplied] = useState<Set<string>>(new Set())

  return (
    <div>
      <H1 english="Care plan templates">Maktaba ya mipango ya tiba</H1>

      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        }}
      >
        {TEMPLATES.map((t) => {
          const isOpen = openId === t.id
          const isApplied = applied.has(t.id)
          return (
            <Card
              key={t.id}
              accent={isApplied ? JEWEL.goldHope : JEWEL.tealRoho}
              title={t.name}
              english={`${t.sessions} vipindi`}
            >
              <p style={{ fontSize: 12, color: TEXT.muted, margin: '0 0 4px' }}>{t.source}</p>
              <p style={{ fontFamily: TYPE.serif, fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                {t.description}
              </p>
              {isOpen && (
                <ul
                  style={{
                    margin: '12px 0 0',
                    paddingLeft: 18,
                    display: 'grid',
                    gap: 4,
                    fontSize: 13,
                  }}
                >
                  {t.outline.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button
                  onClick={() => setOpenId(isOpen ? null : t.id)}
                  style={buttonStyle(JEWEL.tealDeep)}
                >
                  {isOpen ? 'Funga' : 'Tazama muhtasari'}
                </button>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => setApplied((s) => new Set(s).add(t.id))}
                  disabled={isApplied}
                  style={{
                    ...buttonStyle(JEWEL.goldHope, true),
                    opacity: isApplied ? 0.6 : 1,
                  }}
                >
                  {isApplied ? '✓ Umewekwa' : '+ Weka kwa mteja'}
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      <p
        style={{
          marginTop: 20,
          fontSize: 12,
          color: TEXT.muted,
          textAlign: 'center',
        }}
      >
        Templates zinaweza kuhaririwa kwa kila mteja kwenye Kumbukumbu.
      </p>
    </div>
  )
}
