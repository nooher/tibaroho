import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { JEWEL, CREAM, NEUTRAL, BRAND, TEXT, hexToRgba } from '../lib/glass'
import { MODULES } from '../lib/modules'
import { useLang } from '../lib/i18n/Provider'
import { hasBackend } from '../lib/supabase'
import { LanguageSwitch } from './LanguageSwitch'
import { QuickActionsMenu } from './QuickActionsMenu'

export function TopNav() {
  const [open, setOpen] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const [isSmall, setIsSmall] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 379px)')
    const onChange = () => setIsSmall(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 960px)')
    const onChange = () => setIsNarrow(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: '8px 12px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.01em',
    color: isActive ? JEWEL.tealDeep : TEXT.muted,
    background: isActive ? CREAM.ivory : 'transparent',
    border: isActive
      ? `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`
      : '1px solid transparent',
    transition: 'all 160ms cubic-bezier(.25,.46,.45,.94)',
    textDecoration: 'none',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <header
      style={{
        position: 'sticky',
        top: 6,
        zIndex: 800,
        marginTop: 8,
        padding: '14px 0',
        background: hexToRgba(NEUTRAL.paper, 0.92),
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        borderBottom: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'nowrap',
          maxWidth: 1280,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {/* Wordmark */}
        <Link
          to="/"
          aria-label={`${t('brand.tbhos.short', 'TABHOS')} — ${t('ui.nyumbani', 'Nyumbani')}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px',
            background: JEWEL.tealMwenza,
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
            borderRadius: 999,
            textDecoration: 'none',
          }}
        >
          {!isSmall && (
            <span
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 20,
                fontWeight: 700,
                color: BRAND.creamOrange,
                letterSpacing: '-0.3px',
                fontStyle: 'normal',
              }}
            >
              TABHOS
            </span>
          )}
          {isSmall && (
            <span
              aria-label={t('brand.tumaini', 'TABHOS')}
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: BRAND.creamOrange,
                display: 'inline-block',
              }}
            />
          )}
        </Link>

        {/* Desktop nav */}
        {!isNarrow && (
          <nav
            aria-label={t('ui.moduli', 'Moduli')}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              flex: 1,
            }}
          >
            {MODULES.map((m) => (
              <NavLink key={m.slug} to={`/${m.slug}`} style={navLinkStyle}>
                {m.name}
              </NavLink>
            ))}
          </nav>
        )}

        {isNarrow && <div style={{ flex: 1 }} />}

        {/* Cmd-K hint — opens command palette */}
        {!isNarrow && (
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }),
              )
            }}
            aria-label="Fungua amri za haraka — Cmd+K"
            title="Cmd+K"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 8,
              background: CREAM.ivory,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
              color: TEXT.muted,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.04em',
              cursor: 'pointer',
            }}
          >
            <span aria-hidden>&#8984;K</span>
          </button>
        )}

        {/* Quick-actions "+" — 2-click max from anywhere */}
        <QuickActionsMenu />

        {/* Lang switcher — chip group SW · EN · AR · KI · LN */}
        <LanguageSwitch />

        {/* Auth */}
        <button
          style={{
            background: 'transparent',
            color: JEWEL.tealMwenza,
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.25)}`,
            borderRadius: 999,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
          }}
          disabled={!hasBackend}
          title={hasBackend ? t('ui.ingia', 'Ingia') : t('ui.backend_haijasanidiwa', 'Backend bado haijasanidiwa')}
        >
          {t('ui.ingia', 'Ingia')}
        </button>

        {isNarrow && (
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={t('ui.menu', 'Menyu')}
            aria-expanded={open}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: CREAM.ivory,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
              color: JEWEL.tealMwenza,
              display: 'grid',
              placeItems: 'center',
              fontSize: 18,
            }}
          >
            ☰
          </button>
        )}
      </div>

      {/* Mobile drawer */}
      {isNarrow && open && (
        <nav
          aria-label={`${t('ui.moduli', 'Moduli')} — mobile`}
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
            paddingTop: 14,
            paddingBottom: 6,
          }}
        >
          {MODULES.map((m) => (
            <NavLink
              key={m.slug}
              to={`/${m.slug}`}
              onClick={() => setOpen(false)}
              style={navLinkStyle}
            >
              {m.name}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

export default TopNav
