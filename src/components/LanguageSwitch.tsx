// LanguageSwitch — chip group for Tumaini.
// Active lanes: SW · EN · AR · RU · ZH
// "Soon" (greyed, disabled): KI (Kirundi) · LN (Lingala) — kept as a marker
// for the refugee-population roadmap; will be enabled when funded translation
// work lands.

import { BRAND, CREAM, NEUTRAL, TEXT, hexToRgba } from '../lib/glass'
import { useLang, type Lang } from '../lib/i18n/Provider'

interface Chip {
  code: Lang | 'ki' | 'ln'
  label: string
  aria: string
  active?: boolean
  soon?: boolean
}

const CHIPS: Chip[] = [
  { code: 'sw', label: 'SW', aria: 'Kiswahili', active: true },
  { code: 'en', label: 'EN', aria: 'English', active: true },
  { code: 'ar', label: 'AR', aria: 'العربية — Arabic', active: true },
  { code: 'ru', label: 'RU', aria: 'Русский — Russian', active: true },
  { code: 'zh', label: 'ZH', aria: '中文 — Chinese', active: true },
  { code: 'ki', label: 'KI', aria: 'Kirundi — coming soon', soon: true },
  { code: 'ln', label: 'LN', aria: 'Lingala — coming soon', soon: true },
]

export function LanguageSwitch() {
  const { lang, setLang, t } = useLang()

  return (
    <div
      role="group"
      aria-label={t('ui.chagua_lugha', 'Chagua lugha')}
      style={{
        display: 'inline-flex',
        border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
        borderRadius: 999,
        overflow: 'hidden',
        background: CREAM.ivory,
      }}
    >
      {CHIPS.map((c) => {
        const isActive = c.active && lang === c.code
        const disabled = !!c.soon
        return (
          <button
            key={c.code}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled && c.active) setLang(c.code as Lang)
            }}
            aria-pressed={isActive}
            aria-disabled={disabled}
            aria-label={c.aria}
            title={c.soon ? `${c.aria}` : c.aria}
            style={{
              background: isActive ? BRAND.green : 'transparent',
              color: isActive
                ? CREAM.cream
                : disabled
                  ? TEXT.disabled
                  : TEXT.muted,
              border: 'none',
              padding: '6px 10px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontStyle: 'normal',
              opacity: disabled ? 0.55 : 1,
              position: 'relative',
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `2px solid ${BRAND.creamOrange ?? BRAND.green}`
              e.currentTarget.style.outlineOffset = '2px'
            }}
            onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
          >
            {c.label}
            {c.soon && (
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: hexToRgba(NEUTRAL.ink, 0.4),
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitch
