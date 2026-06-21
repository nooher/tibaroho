import { JEWEL, CREAM, NEUTRAL, BRAND, TEXT, hexToRgba } from '../lib/glass'
import { MODULES } from '../lib/modules'
import { ModuleCard } from '../components/ModuleCard'
import TumainiCompass from '../components/TumainiCompass'
import ResearchNotice from '../components/ResearchNotice'
import { useLang } from '../lib/i18n/Provider'
import { TZ_MENTAL_HEALTH, TZ_CONTEXT_NOTES } from '../lib/epi/tanzania'

export default function Landing() {
  const { t } = useLang()
  return (
    <main className="fade-in" style={{ paddingTop: 40, paddingBottom: 120 }}>
      <section className="container" style={{ textAlign: 'center', padding: '48px 24px 56px' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: 999,
            background: CREAM.ivory,
            color: JEWEL.tealMwenza,
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 700,
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`,
            marginBottom: 24,
          }}
        >
          {t('brand.product_no', 'Laetoli (T) Ltd · Product 23')}
        </div>

        {/* Signature hero — Tumaini at the centre of the country, four
            flag-coloured discs drifting around her on coprime orbits. */}
        <div style={{ margin: '8px auto 28px', maxWidth: 480 }}>
          <TumainiCompass size={480} />
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: "'Georgia', serif",
            fontSize: 'clamp(40px, 7vw, 76px)',
            lineHeight: 1.04,
            letterSpacing: '-0.6px',
            fontStyle: 'normal',
            color: BRAND.creamOrange,
            // Engraved/intaglio effect — Tumaini appears carved into the cream.
            textShadow:
              '0 1px 0 rgba(255,255,255,0.96), 0 -1px 1px rgba(11,9,8,0.22), 0 0 1px rgba(11,9,8,0.08)',
          }}
        >
          {t('brand.tumaini', 'Tumaini')}
        </h1>
        <p
          style={{
            marginTop: 14,
            fontFamily: "'Georgia', serif",
            fontSize: 'clamp(18px, 2.2vw, 24px)',
            fontStyle: 'normal',
            color: JEWEL.tealMwenza,
            letterSpacing: '-0.2px',
          }}
        >
          {t('brand.tbhos.long', 'Tanzania Behavioral Health Operating System')}
        </p>
        <p
          style={{
            marginTop: 22,
            maxWidth: 680,
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            lineHeight: 1.6,
            color: TEXT.muted,
          }}
        >
          {t('brand.subtitle', 'Bure kabisa, kwa kila mtu, kwa Kiswahili. Mfumo wa kitaifa wa msaada wa afya ya akili — wewe, familia yako, jamii yako, na watoa huduma — wote katika sehemu moja yenye uhuru.')}
        </p>
      </section>

      {/* Stats strip */}
      <section
        className="container"
        aria-label={t('landing.stats_heading', 'Vipimo vya msingi')}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 56,
        }}
      >
        {([
          {
            v: '1 kati ya 4',
            l: TZ_CONTEXT_NOTES.one_in_four_global.label_sw,
            citation: TZ_CONTEXT_NOTES.one_in_four_global.citation,
            asOf: TZ_CONTEXT_NOTES.one_in_four_global.asOf,
          },
          {
            v: String(TZ_MENTAL_HEALTH.psychiatrists_per_100k.value),
            l: TZ_MENTAL_HEALTH.psychiatrists_per_100k.label_sw + ' (kwa 100,000)',
            citation: TZ_MENTAL_HEALTH.psychiatrists_per_100k.citation,
            asOf: TZ_MENTAL_HEALTH.psychiatrists_per_100k.asOf,
          },
          {
            v: String(TZ_MENTAL_HEALTH.modules_count.value),
            l: TZ_MENTAL_HEALTH.modules_count.label_sw,
            citation: TZ_MENTAL_HEALTH.modules_count.citation,
            asOf: TZ_MENTAL_HEALTH.modules_count.asOf,
          },
          {
            v: String(TZ_MENTAL_HEALTH.cost_to_user.value),
            l: TZ_MENTAL_HEALTH.cost_to_user.label_sw + ' — milele',
            citation: TZ_MENTAL_HEALTH.cost_to_user.citation,
            asOf: TZ_MENTAL_HEALTH.cost_to_user.asOf,
          },
        ] as Array<{ v: string; l: string; citation: string; asOf: string }>).map((s, i) => (
          <div
            key={i}
            title={`${s.citation} (${s.asOf})`}
            style={{
              padding: '20px 18px',
              borderRadius: 18,
              background: CREAM.milk,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
              boxShadow: '0 1px 0 rgba(11,9,8,0.04), 0 8px 22px rgba(11,9,8,0.06)',
              cursor: 'help',
            }}
          >
            <div
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 28,
                fontWeight: 700,
                color: JEWEL.tealMwenza,
                letterSpacing: '-0.4px',
                lineHeight: 1.1,
                fontStyle: 'normal',
              }}
            >
              {s.v}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                lineHeight: 1.45,
                color: TEXT.muted,
              }}
            >
              {s.l}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 10,
                letterSpacing: '0.06em',
                color: TEXT.hint,
                fontStyle: 'italic',
              }}
            >
              {s.citation.split('—')[0].trim()} · {s.asOf}
            </div>
          </div>
        ))}
      </section>

      {/* Module grid */}
      <section className="container" aria-label={t('landing.modules_heading', 'Moduli kumi na mbili')}>
        <h2
          style={{
            margin: '0 0 22px',
            fontFamily: "'Georgia', serif",
            fontSize: 32,
            letterSpacing: '-0.4px',
            color: JEWEL.tealDeep,
            fontStyle: 'normal',
            fontWeight: 700,
          }}
        >
          {t('landing.modules_heading', 'Moduli kumi na mbili')}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 18,
          }}
        >
          {MODULES.map((m) => (
            <ModuleCard key={m.slug} module={m} />
          ))}
        </div>
      </section>

      {/* Research notice */}
      <section className="container" style={{ maxWidth: 720, margin: '32px auto 16px' }}>
        <ResearchNotice variant="footer" />
      </section>

      {/* Byline — minimal */}
      <footer
        className="container"
        style={{
          marginTop: 80,
          textAlign: 'center',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: TEXT.muted,
          fontWeight: 600,
        }}
      >
        {t('brand.byline', 'Laetoli (T) Ltd · TBHOS')}
      </footer>
    </main>
  )
}
