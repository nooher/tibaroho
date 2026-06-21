import type { CSSProperties } from 'react'
import { useLang } from '../../../lib/i18n/Provider'
import { JEWEL, NEUTRAL, CREAM, TEXT, RADII, hexToRgba, TYPE } from '../../../lib/glass'
import {
  PROVIDER_KIND_LABEL_SW,
  type ProviderKind,
  type Mode,
  type LanguageCode,
  LANGUAGE_LABEL_SW,
  TZ_REGIONS,
} from '../data/providers'
import { INSURANCES, type InsuranceId } from '../data/insurances'

export interface FilterState {
  q: string
  kind: ProviderKind | 'all'
  language: LanguageCode | 'all'
  mode: Mode | 'all'
  maxFee: number | null
  insurance: InsuranceId | 'all'
  region: string | 'all'
  acceptingOnly: boolean
  minRating: number
}

export const DEFAULT_FILTERS: FilterState = {
  q: '',
  kind: 'all',
  language: 'all',
  mode: 'all',
  maxFee: null,
  insurance: 'all',
  region: 'all',
  acceptingOnly: true,
  minRating: 0,
}

interface Props {
  value: FilterState
  onChange: (v: FilterState) => void
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 11,
  letterSpacing: 0.6,
  textTransform: 'uppercase',
  marginBottom: 4,
  color: TEXT.muted,
}

const fieldStyle: CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: RADII.chip,
  background: CREAM.milk,
  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.22)}`,
  color: TEXT.body,
  fontFamily: TYPE.sans,
  fontSize: 13,
  outline: 'none',
}

/**
 * Composable filter bar. Used by Home, List, and Map. Compact horizontal
 * layout on wide screens, stacked on mobile via CSS grid auto-fit.
 */
export function Filters({ value, onChange }: Props) {
  const { t } = useLang()
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) =>
    onChange({ ...value, [k]: v })

  return (
    <div
      role="search"
      aria-label={t('gundua.filters.aria', 'Vichujio vya kutafuta mtaalamu')}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 10,
        padding: 16,
        borderRadius: RADII.sheet,
        background: hexToRgba(JEWEL.tealRoho, 0.08),
        border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
      }}
    >
      <div style={{ gridColumn: '1 / -1' }}>
        <label htmlFor="flt-q" style={labelStyle}>
          {t('gundua.filters.search_label', 'Tafuta')}
        </label>
        <input
          id="flt-q"
          style={fieldStyle}
          placeholder={t('gundua.filters.search_placeholder', 'Jina, utaalamu, mji…')}
          value={value.q}
          onChange={(e) => set('q', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="flt-kind" style={labelStyle}>
          {t('gundua.filters.kind_label', 'Aina ya Mtaalamu')}
        </label>
        <select
          id="flt-kind"
          style={fieldStyle}
          value={value.kind}
          onChange={(e) => set('kind', e.target.value as FilterState['kind'])}
        >
          <option value="all">{t('gundua.filters.all_f', 'Zote')}</option>
          {(Object.keys(PROVIDER_KIND_LABEL_SW) as ProviderKind[]).map((k) => (
            <option key={k} value={k}>
              {PROVIDER_KIND_LABEL_SW[k]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="flt-lang" style={labelStyle}>
          {t('gundua.filters.language_label', 'Lugha')}
        </label>
        <select
          id="flt-lang"
          style={fieldStyle}
          value={value.language}
          onChange={(e) => set('language', e.target.value as FilterState['language'])}
        >
          <option value="all">{t('gundua.filters.all_f', 'Zote')}</option>
          {(Object.keys(LANGUAGE_LABEL_SW) as LanguageCode[]).map((l) => (
            <option key={l} value={l}>
              {LANGUAGE_LABEL_SW[l]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="flt-mode" style={labelStyle}>
          {t('gundua.filters.mode_label', 'Aina ya Kipindi')}
        </label>
        <select
          id="flt-mode"
          style={fieldStyle}
          value={value.mode}
          onChange={(e) => set('mode', e.target.value as FilterState['mode'])}
        >
          <option value="all">{t('gundua.filters.all_f', 'Zote')}</option>
          <option value="virtual">{t('gundua.mode.virtual', 'Mtandaoni')}</option>
          <option value="in_person">{t('gundua.mode.in_person', 'Ana kwa ana')}</option>
          <option value="both">{t('gundua.mode.both', 'Zote mbili')}</option>
        </select>
      </div>
      <div>
        <label htmlFor="flt-region" style={labelStyle}>
          {t('gundua.filters.region_label', 'Mkoa')}
        </label>
        <select
          id="flt-region"
          style={fieldStyle}
          value={value.region}
          onChange={(e) => set('region', e.target.value)}
        >
          <option value="all">{t('gundua.filters.all_n', 'Yote')}</option>
          {TZ_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="flt-ins" style={labelStyle}>
          {t('gundua.filters.insurance_label', 'Bima')}
        </label>
        <select
          id="flt-ins"
          style={fieldStyle}
          value={value.insurance}
          onChange={(e) => set('insurance', e.target.value as FilterState['insurance'])}
        >
          <option value="all">{t('gundua.filters.all_f', 'Zote')}</option>
          {INSURANCES.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="flt-fee" style={labelStyle}>
          {t('gundua.filters.max_fee_label', 'Ada ya Juu (TSh)')}
        </label>
        <input
          id="flt-fee"
          type="number"
          step={5_000}
          min={0}
          placeholder="—"
          style={fieldStyle}
          value={value.maxFee ?? ''}
          onChange={(e) =>
            set('maxFee', e.target.value ? Number(e.target.value) : null)
          }
        />
      </div>
      <div>
        <label htmlFor="flt-rating" style={labelStyle}>
          {t('gundua.filters.min_rating_label', 'Kiwango cha chini (⭐)')}
        </label>
        <select
          id="flt-rating"
          style={fieldStyle}
          value={value.minRating}
          onChange={(e) => set('minRating', Number(e.target.value))}
        >
          <option value={0}>{t('gundua.filters.no_limit', 'Bila kikomo')}</option>
          <option value={4}>4.0+</option>
          <option value={4.5}>4.5+</option>
          <option value={4.8}>4.8+</option>
        </select>
      </div>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          color: TEXT.body,
          alignSelf: 'end',
          padding: '9px 0',
        }}
      >
        <input
          type="checkbox"
          checked={value.acceptingOnly}
          onChange={(e) => set('acceptingOnly', e.target.checked)}
          style={{ accentColor: JEWEL.goldSoft, width: 16, height: 16 }}
        />
        {t('gundua.filters.accepting_only', 'Wanaopokea tu')}
      </label>
    </div>
  )
}

export default Filters
