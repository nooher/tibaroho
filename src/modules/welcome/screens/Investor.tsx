import { Link } from 'react-router-dom'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, TYPE, hexToRgba, glass } from '../../../lib/glass'
import { useLang } from '../../../lib/i18n/Provider'

export default function Investor() {
  const { t } = useLang()
  return (
    <main
      className="fade-in"
      style={{ background: CREAM.milk, minHeight: '100vh', paddingTop: 48, paddingBottom: 80 }}
    >
      <section className="container" style={{ maxWidth: 760 }}>
        <Link
          to="/welcome"
          style={{ color: BRAND.green, fontSize: 13, textDecoration: 'none' }}
        >
          &larr; {t('investor.back', 'Rudi kwa Welcome')}
        </Link>
        <h1
          style={{
            fontFamily: TYPE.serif,
            fontSize: 'clamp(40px, 6vw, 64px)',
            color: BRAND.creamOrange,
            margin: '12px 0 8px',
            letterSpacing: TYPE.tighterTrack,
          }}
        >
          Investor brief
        </h1>
        <p style={{ fontSize: 16, lineHeight: TYPE.bodyLeading, color: TEXT.body }}>
          {t('investor.intro', 'TABHOS ni bidhaa namba 23 ya Laetoli (T) Ltd — mfumo wa kitaifa wa afya ya akili kwa Tanzania. Pakua deck na barua ya mwanzilishi kupata maelezo kamili.')}
        </p>

        <div style={{ display: 'grid', gap: 14, marginTop: 28 }}>
          <a
            href="/investor/tumaini-deck.pdf"
            download
            style={{
              ...glass(BRAND.green, 0.06),
              padding: '18px 22px',
              borderRadius: RADII.card,
              textDecoration: 'none',
              color: NEUTRAL.ink,
            }}
          >
            <strong style={{ fontFamily: TYPE.serif, fontSize: 18 }}>
              {t('investor.deck-title', 'Pakua Deck ya Wawekezaji (PDF)')}
            </strong>
            <div style={{ fontSize: 13, color: TEXT.muted }}>
              {t('investor.deck-sub', 'kurasa 22 · soko, bidhaa, timu, mipango')}
            </div>
          </a>
          <a
            href="/investor/founder-letter.pdf"
            download
            style={{
              ...glass(BRAND.blue, 0.06),
              padding: '18px 22px',
              borderRadius: RADII.card,
              textDecoration: 'none',
              color: NEUTRAL.ink,
            }}
          >
            <strong style={{ fontFamily: TYPE.serif, fontSize: 18 }}>
              {t('investor.letter-title', 'Barua ya Mwanzilishi (PDF)')}
            </strong>
            <div style={{ fontSize: 13, color: TEXT.muted }}>
              Dr. Ally A. Nooher &middot; {t('investor.letter-pages', 'ukurasa 4')}
            </div>
          </a>
        </div>
      </section>
    </main>
  )
}
