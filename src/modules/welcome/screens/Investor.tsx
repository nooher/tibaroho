import { Link } from 'react-router-dom'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, TYPE, hexToRgba, glass } from '../../../lib/glass'

export default function Investor() {
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
          &larr; Rudi kwa Welcome
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
          Tumaini ni bidhaa namba 23 ya Laetoli (T) Ltd &mdash; mfumo wa
          kitaifa wa afya ya akili kwa Tanzania. Pakua deck na barua ya
          mwanzilishi kupata maelezo kamili.
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
              Pakua Deck ya Wawekezaji (PDF)
            </strong>
            <div style={{ fontSize: 13, color: TEXT.muted }}>
              kurasa 22 &middot; soko, bidhaa, timu, mipango
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
              Barua ya Mwanzilishi (PDF)
            </strong>
            <div style={{ fontSize: 13, color: TEXT.muted }}>
              Dr. Ally A. Nooher &middot; ukurasa 4
            </div>
          </a>
        </div>
      </section>
    </main>
  )
}
