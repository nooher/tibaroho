import type React from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import { Card, ModuleShell } from '../_shared/Layout'
import { JEWEL, TEXT, glass, hexToRgba, RADII, TYPE } from '../../lib/glass'
import { PROGRAMS, programBySlug } from './data/programs'
import { useLang } from '../../lib/i18n/Provider'

function Catalogue(): React.JSX.Element {
  const { t } = useLang()
  return (
    <>
      <Card title={t('miradi.catalogue.title', 'Mwongozo wa Miradi')}>
        {t('miradi.catalogue.body', 'Hapa ndipo unapata mipango yote ya tiba ya kisaikolojia inayopatikana TABHOS — bure, kwa Kiswahili, na kufuata ushahidi wa kisayansi wa kimataifa. Chagua mpango ulingo na hali yako, au mwombe Mhudumu akushauri.')}
      </Card>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {PROGRAMS.map((p) => (
          <Link key={p.id} to={`./${p.slug}`} style={{ ...glass(JEWEL.indigoWisdom, 0.12), padding: 20, color: TEXT.body, textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span className="serif" style={{ fontSize: 22, letterSpacing: TYPE.tightTrack, color: TEXT.heading }}>{p.name_sw}</span>
              {p.provider_only ? (
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: RADII.chip, background: JEWEL.maroonCrisis, color: TEXT.onJewel, letterSpacing: 1.4 }}>WATAALAM</span>
              ) : null}
            </div>
            <div style={{ fontSize: 12, color: TEXT.muted, marginBottom: 8, letterSpacing: 0.4 }}>
              {p.name_en} · {t('miradi.catalogue.sessions', 'vikao')} {p.sessions.length}
            </div>
            <div style={{ fontSize: 13, color: TEXT.body, lineHeight: TYPE.bodyLeading }}>
              {p.audience}
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

function Detail(): React.JSX.Element {
  const { t } = useLang()
  const { slug } = useParams<{ slug: string }>()
  const p = slug ? programBySlug(slug) : undefined
  if (!p) {
    return (
      <Card title={t('miradi.detail.not_found', 'Mpango haupatikani')}>
        <Link to=".." style={{ color: TEXT.link }}>{t('miradi.detail.back_to_list_full', '← Rudi kwenye orodha ya miradi')}</Link>
      </Card>
    )
  }
  return (
    <>
      <Link to=".." style={{ color: TEXT.link, fontSize: 13 }}>{t('miradi.detail.back_to_list', '← Rudi kwenye orodha')}</Link>
      <div style={{ height: 16 }} />
      <Card title={p.name_sw}>
        <div style={{ fontSize: 13, color: TEXT.muted, marginBottom: 6 }}>{p.name_en}</div>
        <p>{p.audience}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {p.target.map((t) => (
            <span key={t} style={{ fontSize: 11, padding: '4px 10px', borderRadius: RADII.chip, background: hexToRgba(JEWEL.goldHope, 0.18), color: TEXT.heading, letterSpacing: 0.6 }}>{t}</span>
          ))}
        </div>
        {p.notes_sw ? <p style={{ marginTop: 12, color: TEXT.body }}>{p.notes_sw}</p> : null}
      </Card>

      <Card title={t('miradi.detail.sessions_title', 'Vikao')}>
        <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
          {p.sessions.map((sess) => (
            <li key={sess.index} style={{ borderTop: `1px solid rgba(11,9,8,0.10)`, padding: '16px 0' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span className="serif" style={{ fontSize: 28, color: TEXT.heading, minWidth: 40 }}>{sess.index}</span>
                <div style={{ flex: 1 }}>
                  <div className="serif" style={{ fontSize: 18, marginBottom: 4, color: TEXT.heading }}>{sess.name_sw}</div>
                  <div style={{ fontSize: 11, color: TEXT.muted, marginBottom: 8 }}>{sess.name_en}</div>
                  <p style={{ margin: '0 0 10px', fontSize: 14, color: TEXT.body }}>{sess.summary_sw}</p>
                  <ul style={{ margin: '0 0 8px 18px', padding: 0, fontSize: 13, color: TEXT.body }}>
                    {sess.activities.map((a) => <li key={a}>{a}</li>)}
                  </ul>
                  {sess.homework ? <div style={{ fontSize: 12, color: TEXT.muted }}>{t('miradi.detail.homework', 'Kazi ya nyumbani')}: {sess.homework}</div> : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card title={t('miradi.detail.evidence_title', 'Ushahidi + Marejeo')}>
        <p style={{ margin: 0 }}><strong>{t('miradi.detail.evidence', 'Ushahidi')}:</strong> {p.evidence_citation}</p>
        <p style={{ marginTop: 8 }}><strong>{t('miradi.detail.citation', 'Citation')}:</strong> {p.citation}</p>
        <p style={{ marginTop: 8, color: TEXT.muted, fontSize: 12 }}>
          {t('miradi.detail.modality', 'Modaliti')}: {p.modality} · {t('miradi.detail.cost', 'Gharama')}: {t('miradi.detail.free', 'BURE (TZS 0)')}
        </p>
      </Card>
    </>
  )
}

export default function Miradi(): React.JSX.Element {
  return (
    <ModuleShell slug="miradi">
      <Routes>
        <Route path="/" element={<Catalogue />} />
        <Route path=":slug" element={<Detail />} />
      </Routes>
    </ModuleShell>
  )
}
