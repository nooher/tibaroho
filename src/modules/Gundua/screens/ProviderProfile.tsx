import { Link, useParams } from 'react-router-dom'
import { useLang } from '../../../lib/i18n/Provider'
import { JEWEL, NEUTRAL, BRAND, TEXT, RADII, TYPE, hexToRgba } from '../../../lib/glass'
import {
  PROVIDER_KIND_LABEL_SW,
  PROVIDER_KIND_LABEL_EN,
  LANGUAGE_LABEL_SW,
  REVIEWS,
  formatTzs,
  getProvider,
  initialsOf,
} from '../data/providers'
import { findInsurance } from '../data/insurances'

export default function ProviderProfile() {
  const { t } = useLang()
  const { id } = useParams<{ id: string }>()
  const provider = id ? getProvider(id) : undefined

  if (!provider) {
    return (
      <div style={{ padding: 40, color: TEXT.body, fontFamily: TYPE.sans }}>
        <h1 style={{ fontFamily: TYPE.serif, color: TEXT.heading }}>{t('gundua.provider.not_found', 'Mtaalamu hakupatikana.')}</h1>
        <Link to="/gundua" style={{ color: TEXT.link }}>
          {t('gundua.provider.back_to_gundua', '← Rudi Gundua')}
        </Link>
      </div>
    )
  }

  const reviews = REVIEWS[provider.id] ?? []
  const initials = initialsOf(provider.name)

  return (
    <div
      style={{
        maxWidth: 880,
        margin: '0 auto',
        padding: '32px 20px 64px',
        color: TEXT.body,
        fontFamily: TYPE.sans,
      }}
    >
      <Link
        to="/gundua/list"
        style={{ color: TEXT.link, fontSize: 13, textDecoration: 'none' }}
      >
        {t('gundua.provider.back_to_list', '← Rudi kwenye orodha')}
      </Link>

      <header
        style={{
          marginTop: 16,
          padding: 24,
          background: hexToRgba(JEWEL.tealRoho, 0.10),
          border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
          borderRadius: RADII.sheet,
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <div
          aria-hidden
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
            background: JEWEL.tealRoho,
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`,
            display: 'grid',
            placeItems: 'center',
            fontFamily: TYPE.serif,
            fontWeight: 600,
            fontSize: 36,
            color: TEXT.onJewel,
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontFamily: TYPE.serif,
              fontSize: 30,
              letterSpacing: TYPE.tighterTrack,
              margin: 0,
              lineHeight: TYPE.headLeading,
            }}
          >
            {provider.honorific} {provider.name}
          </h1>
          <p style={{ margin: '4px 0 0', color: TEXT.muted, fontSize: 14 }}>
            {PROVIDER_KIND_LABEL_SW[provider.kind]} ·{' '}
            <span style={{ color: TEXT.hint }}>
              {PROVIDER_KIND_LABEL_EN[provider.kind]}
            </span>
          </p>
          <p style={{ margin: '6px 0 0', color: TEXT.muted, fontSize: 13 }}>
            {provider.credentials}
          </p>
          <div
            style={{
              marginTop: 12,
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {provider.verified && (
              <span style={chip(JEWEL.goldHope)}>✓ {t('gundua.card.verified', 'Imethibitishwa')}</span>
            )}
            <span style={chip(JEWEL.tealDeep)}>
              ⭐ {provider.rating.toFixed(1)} ({provider.reviewsCount})
            </span>
            <span style={chip(provider.accepting ? JEWEL.tealRoho : JEWEL.maroonCrisis)}>
              {provider.accepting ? t('gundua.provider.accepting_new', 'Anapokea wagonjwa wapya') : t('gundua.provider.not_accepting_new', 'Hapokei wapya')}
            </span>
            <span style={chip(JEWEL.indigoWisdom)}>
              {provider.yearsExperience} {t('gundua.provider.years_experience', 'miaka ya uzoefu')}
            </span>
          </div>
        </div>
        <Link
          to={`/gundua/book/${provider.id}`}
          aria-disabled={!provider.accepting}
          style={{
            padding: '12px 22px',
            borderRadius: RADII.chip,
            background: BRAND.green,
            border: `1px solid ${BRAND.green}`,
            color: TEXT.onJewel,
            fontWeight: 600,
            fontFamily: TYPE.sans,
            textDecoration: 'none',
            pointerEvents: provider.accepting ? 'auto' : 'none',
            opacity: provider.accepting ? 1 : 0.55,
          }}
        >
          {t('gundua.provider.book_appointment', 'Weka miadi →')}
        </Link>
      </header>

      <Section title={t('gundua.provider.section_about', 'Kuhusu')}>
        <p style={{ fontFamily: TYPE.serif, fontSize: 17, lineHeight: 1.55 }}>
          {provider.bioSw}
        </p>
        <p style={{ fontSize: 14, color: TEXT.muted, lineHeight: 1.55 }}>{provider.bioEn}</p>
      </Section>

      <Section title={t('gundua.provider.section_specialty', 'Utaalamu')}>
        <ChipRow items={provider.specialtiesSw} accent={JEWEL.tealRoho} />
      </Section>

      <Section title={t('gundua.provider.section_language', 'Lugha')}>
        <ChipRow
          items={provider.languages.map((l) => LANGUAGE_LABEL_SW[l])}
          accent={JEWEL.indigoWisdom}
        />
      </Section>

      <Section title={t('gundua.provider.section_mode', 'Aina ya Kipindi')}>
        <ChipRow
          items={[
            provider.mode === 'virtual'
              ? t('gundua.mode.virtual', 'Mtandaoni')
              : provider.mode === 'in_person'
                ? t('gundua.mode.in_person', 'Ana kwa ana')
                : t('gundua.mode.both_full', 'Mtandaoni & ana kwa ana'),
          ]}
          accent={JEWEL.tealDeep}
        />
      </Section>

      <Section title={t('gundua.provider.section_fee', 'Ada & Bima')}>
        <p style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>
          {formatTzs(provider.feeTzs)} <span style={{ color: TEXT.muted, fontSize: 13 }}>· {t('gundua.provider.session_45min', 'kipindi cha dakika 45')}</span>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {provider.insurances.map((iid) => {
            const ins = findInsurance(iid)
            if (!ins) return null
            return (
              <span key={iid} style={chip(ins.accent)} title={ins.noteSw}>
                {ins.name}
              </span>
            )
          })}
        </div>
      </Section>

      <Section title={t('gundua.provider.section_location', 'Mahali')}>
        <p style={{ margin: 0 }}>
          {provider.location.neighborhood}, {provider.location.city},{' '}
          {provider.location.region}
        </p>
      </Section>

      <Section title={t('gundua.provider.section_license', 'Leseni')}>
        <p
          style={{
            margin: 0,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 13,
            color: TEXT.body,
          }}
        >
          {provider.licenseNumber}
        </p>
      </Section>

      {provider.supervisorId && (
        <Section title={t('gundua.provider.section_supervision', 'Usimamizi')}>
          <p style={{ margin: 0, color: TEXT.body }}>
            {t('gundua.provider.supervised_by', 'Anasimamiwa na')}{' '}
            <Link
              to={`/gundua/profile/${provider.supervisorId}`}
              style={{ color: TEXT.link }}
            >
              {t('gundua.provider.peer_supervisor', 'mtaalamu mwenza')}
            </Link>
            .
          </p>
        </Section>
      )}

      <Section title={t('gundua.provider.section_reviews', 'Maoni ya Wateja')}>
        {reviews.length === 0 ? (
          <p style={{ color: TEXT.muted, margin: 0 }}>{t('gundua.reviews.empty', 'Hakuna maoni bado.')}</p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
            {reviews.map((r, i) => (
              <li
                key={i}
                style={{
                  padding: 14,
                  background: 'rgba(250,245,229,0.85)',
                  borderRadius: RADII.card,
                  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
                }}
              >
                <div style={{ fontSize: 12, color: TEXT.muted, marginBottom: 4 }}>
                  {r.by} · siku {r.daysAgo} zilizopita · {'⭐'.repeat(r.ratingStars)}
                </div>
                <div style={{ fontFamily: TYPE.serif, fontSize: 15 }}>{r.textSw}</div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 24 }}>
      <h2
        style={{
          fontFamily: TYPE.serif,
          fontSize: 20,
          letterSpacing: TYPE.tightTrack,
          margin: '0 0 10px',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function ChipRow({ items, accent }: { items: string[]; accent: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {items.map((s) => (
        <span key={s} style={chip(accent)}>
          {s}
        </span>
      ))}
    </div>
  )
}

function chip(jewel: string) {
  return {
    padding: '5px 12px',
    borderRadius: RADII.chip,
    background: hexToRgba(jewel, 0.14),
    border: `1px solid ${hexToRgba(jewel, 0.45)}`,
    color: TEXT.body,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0.2,
    display: 'inline-block',
  } as const
}
