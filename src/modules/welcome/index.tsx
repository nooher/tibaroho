import { Link } from 'react-router-dom'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, TYPE, hexToRgba, glass } from '../../lib/glass'
import { MODULES } from '../../lib/modules'
import TumainiCompass from '../../components/TumainiCompass'
import ResearchNotice from '../../components/ResearchNotice'

interface Quote {
  name: string
  role: string
  quote: string
}

const QUOTES_PATIENTS: Quote[] = [
  {
    name: 'Maria, 28 · Dar es Salaam',
    role: 'Mgonjwa',
    quote:
      'Mood tracker ya Tumaini imenisaidia kuona wakati wa giza unakuja kabla halijanizidi.',
  },
  {
    name: 'Juma, 34 · Mwanza',
    role: 'Mgonjwa',
    quote:
      'Niliongea na Rafiki saa nne usiku — alinipatia mazoezi ya kupumua nikalala.',
  },
  {
    name: 'Neema, 22 · Arusha',
    role: 'Mwanafunzi',
    quote:
      'PHQ-9 kwa Kiswahili kilinifanya nielewe ninachohisi bila aibu.',
  },
  {
    name: 'Bahati, 41 · Dodoma',
    role: 'Mama wa watoto watatu',
    quote: 'Diary ya hisia ni faragha tupu. Ninaiamini Tumaini.',
  },
]

const QUOTES_PROVIDERS: Quote[] = [
  {
    name: 'Dr. Asha Mwema',
    role: 'Psychiatrist · Muhimbili',
    quote:
      'Mara ya kwanza ninapata workspace ya afya ya akili iliyojengwa kwa Kiswahili kwanza.',
  },
  {
    name: 'Bibi Salima Issa',
    role: 'Friendship Bench counsellor',
    quote:
      'Usimamizi wa Tumaini umenipa nguvu mpya — siko peke yangu kwenye kazi.',
  },
  {
    name: 'Dr. Mtumbe',
    role: 'Mtafiti · MUHAS',
    quote:
      'CFIR + RE-AIM tools zinanifanya niandike karatasi haraka mara tatu.',
  },
  {
    name: 'Mwl. Komba',
    role: 'Mshauri wa shule · Bagamoyo',
    quote: 'Tathmini ya SDQ inayoeleweka — wanafunzi wananiamini zaidi.',
  },
]

const QUOTES_INSTITUTIONS: Quote[] = [
  {
    name: 'Wizara ya Afya',
    role: 'Sera dashboard · Mikoa 26',
    quote:
      'Tunaona mlinganisho wa PHQ-9 kati ya mikoa kwa wakati halisi. Hii ni sera ya ushahidi.',
  },
  {
    name: 'Kampuni ya Madini · Geita',
    role: 'EAP · Wafanyakazi 240',
    quote:
      'Matumizi ya 22% katika miezi mitatu &mdash; haya ni matokeo halisi.',
  },
  {
    name: 'Shule ya Sekondari · Bagamoyo',
    role: 'Shule+ · Wanafunzi 86',
    quote: 'Walimu wanapata mafunzo, wazazi wanapata habari kwa siri.',
  },
  {
    name: 'NGO ya afya ya akili · Mbeya',
    role: 'Friendship Bench partner',
    quote: 'Usimamizi wa wahudumu wa imani ni daraja halisi kwa jamii.',
  },
]

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '6px 14px',
        borderRadius: 999,
        background: CREAM.ivory,
        color: BRAND.green,
        fontSize: 12,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontWeight: 700,
        border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`,
      }}
    >
      {children}
    </div>
  )
}

function QuoteRail({
  title,
  english,
  quotes,
  accent,
}: {
  title: string
  english: string
  quotes: Quote[]
  accent: string
}) {
  return (
    <section style={{ marginBottom: 56 }}>
      <header style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
        <h2
          style={{
            fontFamily: TYPE.serif,
            fontSize: 28,
            fontWeight: 800,
            color: NEUTRAL.ink,
            margin: 0,
            letterSpacing: TYPE.tightTrack,
          }}
        >
          {title}
        </h2>
        <span style={{ fontSize: 12, color: TEXT.muted }}>{english}</span>
      </header>
      <div
        style={{
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        }}
      >
        {quotes.map((q) => (
          <blockquote
            key={q.name}
            style={{
              ...glass(accent, 0.08),
              margin: 0,
              padding: '18px 18px 16px',
              borderRadius: RADII.card,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: TYPE.serif,
                fontSize: 15,
                lineHeight: 1.5,
                color: NEUTRAL.ink,
              }}
            >
              &ldquo;{q.quote}&rdquo;
            </p>
            <footer style={{ fontSize: 12, color: TEXT.body }}>
              <strong style={{ color: accent, display: 'block' }}>{q.name}</strong>
              <span>{q.role}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

export default function Welcome() {
  return (
    <main
      className="fade-in"
      style={{
        background: CREAM.milk,
        paddingTop: 32,
        paddingBottom: 80,
      }}
    >
      {/* Hero */}
      <section
        className="container"
        style={{ textAlign: 'center', padding: '32px 24px 64px' }}
      >
        <div style={{ marginBottom: 18 }}>
          <Pill>Tumaini &middot; TBHOS</Pill>
        </div>
        <div style={{ margin: '8px auto 12px', maxWidth: 420 }}>
          <TumainiCompass size={420} />
        </div>
        <h1
          style={{
            fontFamily: TYPE.serif,
            fontSize: 'clamp(56px, 10vw, 96px)',
            fontWeight: 700,
            color: BRAND.creamOrange,
            letterSpacing: TYPE.tighterTrack,
            margin: '12px 0 8px',
            lineHeight: TYPE.headLeading,
            // Engraved/intaglio — Tumaini carved into the cream surface.
            textShadow:
              '0 1px 0 rgba(255,255,255,0.97), 0 -1px 1px rgba(11,9,8,0.24), 0 0 1px rgba(11,9,8,0.10)',
          }}
        >
          Tumaini
        </h1>
        <p
          style={{
            fontFamily: TYPE.sans,
            fontSize: 16,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: TEXT.muted,
            margin: 0,
          }}
        >
          TBHOS &middot; Tanzania Behavioral Health Operating System
        </p>
        <p
          style={{
            maxWidth: 580,
            margin: '20px auto 32px',
            fontSize: 17,
            lineHeight: TYPE.bodyLeading,
            color: TEXT.body,
          }}
        >
          Mfumo wa kwanza wa afya ya akili wa Kiswahili kwanza &mdash;
          uliojengwa kwa wagonjwa, wataalam, na taasisi za Tanzania.
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/chagua-akaunti"
            style={{
              background: BRAND.green,
              color: CREAM.milk,
              padding: '14px 28px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
            }}
          >
            Karibu Demo
          </Link>
          <Link
            to="/karibu"
            style={{
              background: 'transparent',
              color: BRAND.green,
              padding: '14px 28px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.25)}`,
            }}
          >
            Karibu Wizard
          </Link>
        </div>
      </section>

      {/* Social proof */}
      <div className="container" style={{ maxWidth: 1080 }}>
        <QuoteRail
          title="Wagonjwa"
          english="Patients"
          accent={BRAND.green}
          quotes={QUOTES_PATIENTS}
        />
        <QuoteRail
          title="Wataalam"
          english="Providers"
          accent={BRAND.blue}
          quotes={QUOTES_PROVIDERS}
        />
        <QuoteRail
          title="Taasisi"
          english="Institutions"
          accent={BRAND.yellow}
          quotes={QUOTES_INSTITUTIONS}
        />
      </div>

      {/* Module grid */}
      <section className="container" style={{ maxWidth: 1080, marginTop: 24 }}>
        <header style={{ textAlign: 'center', marginBottom: 24 }}>
          <Pill>Moduli 12</Pill>
          <h2
            style={{
              fontFamily: TYPE.serif,
              fontSize: 36,
              fontWeight: 800,
              color: NEUTRAL.ink,
              margin: '14px 0 6px',
              letterSpacing: TYPE.tightTrack,
            }}
          >
            Mfumo mzima, sehemu moja
          </h2>
          <p
            style={{
              fontSize: 15,
              color: TEXT.body,
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            Kutoka kwa mgonjwa mmoja hadi wizara &mdash; Tumaini inazungumza
            Kiswahili katika kila hatua.
          </p>
        </header>
        <div
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          }}
        >
          {MODULES.slice(0, 12).map((m) => (
            <Link
              key={m.slug}
              to={`/${m.slug}`}
              style={{
                ...glass(m.accent, 0.1),
                padding: 16,
                borderRadius: RADII.card,
                textDecoration: 'none',
                color: NEUTRAL.ink,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                minHeight: 110,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: m.accent,
                }}
              >
                {m.glyph}
              </span>
              <strong
                style={{
                  fontFamily: TYPE.serif,
                  fontSize: 18,
                  letterSpacing: TYPE.tightTrack,
                }}
              >
                {m.name}
              </strong>
              <span style={{ fontSize: 12, color: TEXT.body }}>
                {m.tagline}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Press / Investor */}
      <section
        className="container"
        style={{
          maxWidth: 1080,
          marginTop: 56,
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link
          to="/press"
          style={{
            ...glass(BRAND.blue, 0.06),
            padding: '18px 24px',
            borderRadius: RADII.card,
            textDecoration: 'none',
            color: NEUTRAL.ink,
            minWidth: 240,
          }}
        >
          <strong style={{ display: 'block', fontFamily: TYPE.serif, fontSize: 17 }}>
            Press kit
          </strong>
          <span style={{ fontSize: 13, color: TEXT.body }}>
            Logos, screenshots, founder bio
          </span>
        </Link>
        <Link
          to="/investor"
          style={{
            ...glass(BRAND.green, 0.06),
            padding: '18px 24px',
            borderRadius: RADII.card,
            textDecoration: 'none',
            color: NEUTRAL.ink,
            minWidth: 240,
          }}
        >
          <strong style={{ display: 'block', fontFamily: TYPE.serif, fontSize: 17 }}>
            Investor brief
          </strong>
          <span style={{ fontSize: 13, color: TEXT.body }}>
            Pakua deck na barua ya mwanzilishi
          </span>
        </Link>
      </section>

      {/* Research + privacy notice */}
      <section className="container" style={{ maxWidth: 1080, marginTop: 12 }}>
        <ResearchNotice variant="welcome" />
      </section>

      {/* Footer */}
      <footer
        className="container"
        style={{
          maxWidth: 1080,
          marginTop: 64,
          padding: '32px 0 0',
          borderTop: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
          fontSize: 13,
          color: TEXT.muted,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 18,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <strong style={{ color: BRAND.green }}>Laetoli (T) Ltd</strong> &middot; Dar es Salaam
        </div>
        <nav
          aria-label="Laetoli ecosystem"
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
        >
          <a
            href="https://laetoli.tz"
            style={{ color: NEUTRAL.ink, textDecoration: 'none' }}
          >
            laetoli.tz
          </a>
          <a
            href="https://kasuku-laetoli.vercel.app"
            style={{ color: NEUTRAL.ink, textDecoration: 'none' }}
          >
            Kasuku
          </a>
          <a
            href="https://irmp.laetoli.tz"
            style={{ color: NEUTRAL.ink, textDecoration: 'none' }}
          >
            IRMP
          </a>
          <a
            href="https://thos.laetoli.tz"
            style={{ color: NEUTRAL.ink, textDecoration: 'none' }}
          >
            THOS
          </a>
        </nav>
      </footer>
    </main>
  )
}
