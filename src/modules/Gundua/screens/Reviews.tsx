import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { JEWEL, TEXT, TYPE, hexToRgba } from '../../../lib/glass'
import { PROVIDERS } from '../data/providers'
import { addReview, listReviews, listReviewsAsync, aggregate, type Review } from '../data/ratings'

export default function Reviews() {
  const { providerId } = useParams<{ providerId: string }>()
  const provider = PROVIDERS.find((p) => p.id === providerId)
  const [stars, setStars] = useState(5)
  const [text, setText] = useState('')
  const [visitDone, setVisitDone] = useState(false)
  const [improved, setImproved] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    if (!providerId) return
    setReviews(listReviews(providerId))
    let mounted = true
    void listReviewsAsync(providerId).then((rs) => { if (mounted) setReviews(rs) })
    return () => { mounted = false }
  }, [providerId])

  async function submit(): Promise<void> {
    if (!providerId || !text.trim()) return
    await addReview({
      providerId,
      by: 'me',
      ratingStars: stars,
      textSw: text.trim(),
      visitCompleted: visitDone,
      outcomeImproved: improved,
    })
    setReviews(await listReviewsAsync(providerId))
    setText('')
  }

  if (!provider) {
    return <main style={{ padding: 24 }}>Mtaalamu hayupo. <Link to="/gundua">Rudi</Link></main>
  }

  const avg = aggregate(reviews)

  return (
    <main style={{ minHeight: '100vh', background: '#FAF5E5', padding: '24px 22px 80px', fontFamily: TYPE.sans }}>
      <Link to={`/gundua/profile/${provider.id}`} style={{ color: JEWEL.tealMwenza, textDecoration: 'none', fontSize: 14 }}>← Wasifu wa mtaalamu</Link>
      <h1 style={{ fontFamily: TYPE.serif, fontWeight: 800, color: JEWEL.tealDeep, fontSize: 30 }}>Maoni — {provider.honorific} {provider.name}</h1>
      <p style={{ color: TEXT.muted }}>Wastani wa uzito: <strong>{avg.toFixed(2)}</strong> ⭐ ({reviews.length} maoni)</p>

      <section style={{ background: '#FAF5E5', border: `1px solid ${hexToRgba('#000', 0.08)}`, borderRadius: 18, padding: 16, marginTop: 16 }}>
        <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Toa maoni</h3>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setStars(s)} aria-label={`Nyota ${s}`} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 28, color: s <= stars ? JEWEL.goldHope : '#ccc' }}>★</button>
          ))}
        </div>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Andika uzoefu wako…"
          aria-label="Maoni"
          style={{ width: '100%', padding: 10, borderRadius: 12, border: `1px solid ${hexToRgba('#000', 0.12)}`, fontFamily: TYPE.sans, background: '#FAF5E5' }}
        />
        <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', gap: 6 }}><input type="checkbox" checked={visitDone} onChange={(e) => setVisitDone(e.target.checked)} /> Nimekamilisha kikao</label>
          <label style={{ display: 'flex', gap: 6 }}><input type="checkbox" checked={improved} onChange={(e) => setImproved(e.target.checked)} /> Hali yangu imeimarika</label>
        </div>
        <button onClick={() => { void submit() }} style={{ marginTop: 12, padding: '10px 22px', borderRadius: 999, background: JEWEL.tealMwenza, color: '#FAF5E5', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Tuma maoni</button>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3 style={{ fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Maoni ya hivi karibuni</h3>
        {reviews.length === 0 ? <p style={{ color: TEXT.muted }}>Hakuna maoni bado.</p> : (
          <div style={{ display: 'grid', gap: 10 }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ padding: 12, borderRadius: 12, background: '#F8F2D8', border: `1px solid ${hexToRgba('#000', 0.06)}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{r.by}</strong>
                  <span style={{ color: JEWEL.goldHope }}>{'★'.repeat(r.ratingStars)}</span>
                </div>
                <p style={{ marginTop: 6 }}>{r.textSw}</p>
                <div style={{ fontSize: 11, color: TEXT.muted }}>{new Date(r.ts).toLocaleDateString('sw-TZ')}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
