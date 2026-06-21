import { useMemo, useState } from 'react'
import { JEWEL, RADII, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { Card, H1, buttonStyle, fieldStyle } from '../components/Card'
import { useLang } from '../../../lib/i18n/Provider'

interface ICDCode {
  code: string
  sw: string
  en: string
  chapter: string
}

/**
 * Curated ICD-11 mental-health codes (subset). Bilingual lookup.
 */
const CODES: ICDCode[] = [
  { code: '6A70', sw: 'Sonona moja (kipindi cha kwanza)', en: 'Single episode depressive disorder', chapter: 'Mood' },
  { code: '6A71', sw: 'Sonona ya marudio', en: 'Recurrent depressive disorder', chapter: 'Mood' },
  { code: '6A60', sw: 'Bipolar aina I', en: 'Bipolar type I', chapter: 'Mood' },
  { code: '6A61', sw: 'Bipolar aina II', en: 'Bipolar type II', chapter: 'Mood' },
  { code: '6B00', sw: 'Wasiwasi wa jumla (GAD)', en: 'Generalized anxiety disorder', chapter: 'Anxiety' },
  { code: '6B01', sw: 'Hofu (Panic disorder)', en: 'Panic disorder', chapter: 'Anxiety' },
  { code: '6B04', sw: 'Wasiwasi wa kijamii', en: 'Social anxiety disorder', chapter: 'Anxiety' },
  { code: '6B20', sw: 'Tatizo la fikra-shurutu (OCD)', en: 'Obsessive-compulsive disorder', chapter: 'OCRD' },
  { code: '6B40', sw: 'PTSD', en: 'Post-traumatic stress disorder', chapter: 'Stress' },
  { code: '6B41', sw: 'C-PTSD', en: 'Complex PTSD', chapter: 'Stress' },
  { code: '6A20', sw: 'Skizofrenia', en: 'Schizophrenia', chapter: 'Psychotic' },
  { code: '6C40', sw: 'Tatizo la matumizi ya pombe', en: 'Alcohol use disorder', chapter: 'Substance' },
  { code: '6C43', sw: 'Tatizo la matumizi ya bangi', en: 'Cannabis use disorder', chapter: 'Substance' },
  { code: '6C45', sw: 'Tatizo la matumizi ya opioidi', en: 'Opioid use disorder', chapter: 'Substance' },
  { code: '6B80', sw: 'Anorexia', en: 'Anorexia nervosa', chapter: 'Eating' },
  { code: '6B81', sw: 'Bulimia', en: 'Bulimia nervosa', chapter: 'Eating' },
  { code: 'QE84', sw: 'Tatizo la kuumiza mwili (NSSI)', en: 'Non-suicidal self-injury', chapter: 'Other' },
  { code: '6E20', sw: 'Tatizo la kuhusiana (Adjustment)', en: 'Adjustment disorder', chapter: 'Stress' },
]

export default function Coding() {
  const { t } = useLang()
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<string[]>([])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return CODES
    return CODES.filter(
      (c) =>
        c.code.toLowerCase().includes(term) ||
        c.sw.toLowerCase().includes(term) ||
        c.en.toLowerCase().includes(term) ||
        c.chapter.toLowerCase().includes(term),
    )
  }, [q])

  return (
    <div>
      <H1 english="ICD-11 coding">{t('wataalam.coding.title', 'Msaidizi wa kanuni za ICD-11')}</H1>

      <Card title={t('wataalam.coding.search_card', 'Tafuta kwa Kiswahili au Kiingereza')}>
        <input
          style={fieldStyle()}
          placeholder={t('wataalam.coding.search_ph', "kwa mfano: 'sonona', 'anxiety', '6A70'")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={t('wataalam.coding.search_aria', 'Tafuta kanuni')}
        />
        <p style={{ color: TEXT.muted, fontSize: 12, margin: '8px 0 0' }}>
          {results.length} {t('wataalam.coding.results', 'matokeo')}
        </p>
      </Card>

      <Card title={`${t('wataalam.coding.picked', 'Kanuni zilizochaguliwa')} (${picked.length})`} style={{ marginTop: 14 }}>
        {picked.length === 0 ? (
          <p style={{ color: TEXT.muted, margin: 0 }}>{t('wataalam.coding.none_picked', 'Bado hujachagua.')}</p>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {picked.map((code) => {
              const c = CODES.find((x) => x.code === code)
              if (!c) return null
              return (
                <span
                  key={code}
                  style={{
                    padding: '6px 12px',
                    background: hexToRgba(JEWEL.goldHope, 0.35),
                    border: `1px solid ${hexToRgba(JEWEL.goldSoft, 0.6)}`,
                    borderRadius: 999,
                    fontSize: 13,
                    color: TEXT.body,
                  }}
                >
                  {c.code} — {c.sw}
                  <button
                    onClick={() => setPicked((p) => p.filter((x) => x !== code))}
                    aria-label={t('wataalam.coding.remove', 'Toa')}
                    style={{
                      marginLeft: 6,
                      background: 'transparent',
                      border: 'none',
                      color: TEXT.body,
                      cursor: 'pointer',
                    }}
                  >
                    ×
                  </button>
                </span>
              )
            })}
          </div>
        )}
        <button
          disabled={picked.length === 0}
          style={{
            ...buttonStyle(JEWEL.goldHope, true),
            marginTop: 14,
            opacity: picked.length === 0 ? 0.5 : 1,
          }}
        >
          {t('wataalam.coding.add_to_session', 'Ongeza kwenye kipindi hiki')}
        </button>
      </Card>

      <Card title={t('wataalam.coding.results_card', 'Matokeo')} style={{ marginTop: 14 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
          {results.map((c) => {
            const sel = picked.includes(c.code)
            return (
              <li
                key={c.code}
                style={{
                  padding: 12,
                  borderRadius: RADII.card,
                  background: sel ? hexToRgba(JEWEL.goldHope, 0.3) : 'rgba(250,245,229,0.85)',
                  border: '1px solid rgba(11,9,8,0.10)',
                  color: TEXT.body,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontFamily: TYPE.serif, fontSize: 15 }}>
                    <strong>{c.code}</strong> — {c.sw}
                  </div>
                  <div style={{ fontSize: 11, color: TEXT.muted }}>
                    {c.en} · {c.chapter}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPicked((p) => (sel ? p.filter((x) => x !== c.code) : [...p, c.code]))
                  }
                  style={buttonStyle(sel ? JEWEL.maroonCrisis : JEWEL.tealRoho, true)}
                >
                  {sel ? '−' : '+'}
                </button>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}
