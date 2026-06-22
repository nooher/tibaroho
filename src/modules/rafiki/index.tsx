import type React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { JEWEL, BRAND, CREAM, TZ_FLAG, NEUTRAL, TEXT, hexToRgba, RADII } from '../../lib/glass'
import Chat from './Chat'
import { useLang } from '../../lib/i18n/Provider'

/**
 * Rafiki module — Tumaini's sovereign AI companion.
 * AI's name is Rafiki ("friend" in Swahili). 6 internal modes:
 * Mwenza · Mfunzi · Mlinzi · Mwandishi · Mhakiki · Mkumbusha.
 * No external LLM. Federated over TibaAI/TibaFigo/TibaAfya/TibaMama KBs.
 */

const MODES = [
  { name: 'Mwenza',    en: 'Companion',  blurb: 'Sikiliza kwa joto; 3-part responses (acknowledge → respond → next step).' },
  { name: 'Mfunzi',    en: 'Coach',      blurb: 'CBT, MI, PST, mafunzo ya kupumua na ya kustarehe — yote yamethibitishwa.' },
  { name: 'Mlinzi',    en: 'Guardian',   blurb: 'C-SSRS branching, Stanley-Brown safety plan, ushirikiano wa familia ya kuamini.' },
  { name: 'Mwandishi', en: 'Scribe',     blurb: 'Andika shajara, barua kwa mhudumu/mwajiri/shule, safety plan, ombi la rufaa.' },
  { name: 'Mhakiki',   en: 'Reviewer',   blurb: 'Tafsiri matokeo ya maabara, dawa, vipimo vya PHQ-9/GAD-7 kwa lugha ya nyumbani.' },
  { name: 'Mkumbusha', en: 'Reminder',   blurb: 'Dawa, miadi, vipindi vya kupumua, ufuatiliaji wa hisia — bila kelele.' },
]

const SOURCES = [
  { name: 'TibaAI',    role: 'Afya ya kawaida — magonjwa 32, dawa 18, vipimo 13' },
  { name: 'TibaFigo',  role: 'Figo na lab interpretation' },
  { name: 'TibaAfya',  role: 'Magonjwa sugu na ushauri wa kila siku' },
  { name: 'TibaMama',  role: 'Mama mjamzito na mtoto mchanga' },
  { name: 'WHO mhGAP', role: 'Kanuni ya msingi ya afya ya akili kwa mazingira yenye rasilimali chache' },
]

function RafikiHome(): React.JSX.Element {
  const { t } = useLang()
  return (
    <main className="fade-in" style={{ paddingTop: 40, paddingBottom: 120 }}>
      <section className="container" style={{ padding: '32px 24px 24px' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13,
          color: TEXT.muted, textDecoration: 'none', marginBottom: 24,
        }}>
          <span aria-hidden>←</span> {t('rafiki.home.back', 'Rudi nyumbani')}
        </Link>

        <div style={{
          display: 'inline-block', padding: '6px 14px', borderRadius: 999,
          background: hexToRgba(TZ_FLAG.green, 0.18), color: BRAND.green,
          fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase',
          fontWeight: 700, border: `1px solid ${hexToRgba(TZ_FLAG.green, 0.4)}`, marginBottom: 18,
        }}>
          AI Companion · Sovereign
        </div>

        <h1 style={{
          margin: 0, fontFamily: "'Georgia', serif",
          fontSize: 'clamp(40px, 6vw, 68px)', letterSpacing: '-0.6px',
          color: JEWEL.tealDeep, lineHeight: 1.04,
        }}>
          Rafiki
        </h1>
        <p style={{
          marginTop: 12, fontFamily: "'Georgia', serif",
          fontSize: 'clamp(18px, 2vw, 22px)', color: JEWEL.tealMwenza,
        }}>
          {t('rafiki.home.tagline', 'Rafiki wako wa polepole — bila LLM ya nje.')}
        </p>
        <p style={{
          marginTop: 16, maxWidth: 680, fontSize: 'clamp(15px, 1.4vw, 17px)',
          lineHeight: 1.6, color: TEXT.muted,
        }}>
          {t('rafiki.home.intro', 'Rafiki ni AI ya TABHOS — yenyewe, ya nyumbani, inayozungumza Kiswahili kabla ya kila lugha nyingine. Inakaa pamoja nawe kwenye kila ukurasa, inakumbuka unayoyataka kukumbukwa, na haisemi neno la kitaalam bila chanzo. Hairuhusiwi kutoa utambuzi wala dawa — hiyo ni kazi ya mhudumu wako.')}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
          <Link to="chat" aria-label={t('rafiki.home.chat-aria', 'Anza mazungumzo na Rafiki')} style={{
            padding: '12px 20px', borderRadius: RADII.chip,
            background: BRAND.green, color: CREAM.cream,
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}>
            {t('rafiki.home.chat-cta', 'Anza mazungumzo')}
          </Link>
          <Link to="/pumzi" aria-label={t('rafiki.home.pumzi-aria', 'Pumzi — mafunzo ya kupumua')} style={{
            padding: '12px 20px', borderRadius: RADII.chip,
            background: CREAM.ivory, color: JEWEL.tealMwenza,
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}>
            {t('rafiki.home.pumzi-cta', 'Pumzi (kupumua)')}
          </Link>
        </div>
      </section>

      <section className="container" style={{ marginTop: 24 }}>
        <h2 style={{
          margin: '0 0 14px', fontFamily: "'Georgia', serif",
          fontSize: 22, letterSpacing: '-0.3px', color: JEWEL.tealDeep,
        }}>
          {t('rafiki.home.modes-title', 'Hali sita za Rafiki')}
        </h2>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {MODES.map((m) => (
            <article key={m.name} style={{
              padding: '18px 18px 16px', borderRadius: RADII.card,
              background: CREAM.milk,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
              boxShadow: '0 1px 0 rgba(11,9,8,0.04), 0 8px 22px rgba(11,9,8,0.06)',
            }}>
              <div style={{
                fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: BRAND.green, fontWeight: 700, marginBottom: 6,
              }}>{m.en}</div>
              <div style={{
                fontFamily: "'Georgia', serif", fontSize: 20,
                color: JEWEL.tealDeep, letterSpacing: '-0.3px', marginBottom: 6,
              }}>{m.name}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: TEXT.muted }}>
                {m.blurb}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container" style={{ marginTop: 36 }}>
        <h2 style={{
          margin: '0 0 14px', fontFamily: "'Georgia', serif",
          fontSize: 22, letterSpacing: '-0.3px', color: JEWEL.tealDeep,
        }}>
          {t('rafiki.home.sources-title', 'Chanzo cha maarifa')}
        </h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {SOURCES.map((s) => (
            <div key={s.name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
              padding: '12px 14px', borderRadius: RADII.card,
              background: CREAM.milk,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
            }}>
              <strong style={{ color: JEWEL.tealDeep, fontSize: 14 }}>{s.name}</strong>
              <span style={{ fontSize: 13, color: TEXT.muted, textAlign: 'right' }}>{s.role}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 14, fontSize: 12, color: TEXT.hint }}>
          {t('rafiki.home.disclaimer', 'Maelezo ya kitabibu yanafuata mwongozo wa DSM-5-TR, ICD-11, WHO mhGAP 2.0, na NICE.')}
        </p>
      </section>
    </main>
  )
}

export default function Rafiki(): React.JSX.Element {
  return (
    <Routes>
      <Route index element={<RafikiHome />} />
      <Route path="chat" element={<Chat />} />
    </Routes>
  )
}
