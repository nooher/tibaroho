import type React from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { JEWEL, hexToRgba, RADII, TYPE, CREAM, TEXT } from '../../../lib/glass'
import { getRole, isFounder, type NdaniRole } from '../role'
import { useLang } from '../../../lib/i18n/Provider'

export interface AdminNavItem { to: string; label: string; en?: string; founderOnly?: boolean }

export const ADMIN_NAV: AdminNavItem[] = [
  { to: '.',           label: 'Dashibodi',      en: 'Dashboard' },
  { to: 'watumiaji',   label: 'Watumiaji',      en: 'Users' },
  { to: 'wahudumu',    label: 'Wahudumu',       en: 'Providers' },
  { to: 'bima',        label: 'Bima',           en: 'Insurers' },
  { to: 'soko',        label: 'Soko',           en: 'Marketplace' },
  { to: 'utafiti',     label: 'Utafiti',        en: 'Research' },
  { to: 'fedha',       label: 'Fedha',          en: 'Finance' },
  { to: 'dharura',     label: 'Dharura',        en: 'Crisis' },
  { to: 'audit',       label: 'Audit',          en: 'Audit log' },
  { to: 'matokeo',     label: 'Matokeo',        en: 'Outcomes' },
  { to: 'mipangilio',  label: 'Mipangilio',     en: 'Config' },
  { to: 'mwanzilishi', label: 'Mwanzilishi',    en: 'Founder', founderOnly: true },
]

export function RoleGate({ role, children }: { role: NdaniRole; children: ReactNode }): React.JSX.Element {
  const { t } = useLang()
  if (role === 'admin' || role === 'founder') return <>{children}</>
  return (
    <main style={{ padding: 80, textAlign: 'center', color: CREAM.cream, background: JEWEL.tealDeep, minHeight: '60vh' }}>
      <h1 className="serif" style={{ fontSize: 36, letterSpacing: TYPE.tighterTrack, margin: 0 }}>
        {t('ndani.shell.gate_title', 'Mfumo wa msimamizi — Hitaji idhini')}
      </h1>
      <p style={{ marginTop: 16, fontSize: 15, color: CREAM.cream, maxWidth: 480, marginInline: 'auto' }}>
        {t('ndani.shell.gate_body', 'Ukurasa huu ni wa wafanyakazi wa Laetoli pekee. Tafadhali ingia kwa akaunti ya msimamizi au mwasilianie na timu.')}
      </p>
      <Link to="/" style={{ display: 'inline-block', marginTop: 24, color: CREAM.cream, textDecoration: 'underline' }}>{t('ndani.shell.back_home', '← Rudi nyumbani')}</Link>
    </main>
  )
}

export default function AdminShell({ children }: { children: ReactNode }): React.JSX.Element {
  const { t } = useLang()
  const role = getRole()
  const loc = useLocation()
  const segs = loc.pathname.replace(/^\/ndani\/?/, '').split('/').filter(Boolean)
  const items = ADMIN_NAV.filter((n) => !n.founderOnly || isFounder(role))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', background: CREAM.milk }}>
      <aside style={{
        background: JEWEL.tealDeep, color: CREAM.cream,
        padding: '28px 16px', position: 'sticky', top: 0, alignSelf: 'start', height: '100vh',
        overflowY: 'auto',
      }}>
        <Link to="/" style={{ color: CREAM.cream, fontSize: 12, textDecoration: 'none' }}>
          {t('ndani.shell.back_tbhos', '← TABHOS')}
        </Link>
        <div className="serif" style={{ marginTop: 14, fontSize: 24, letterSpacing: TYPE.tighterTrack }}>
          {t('ndani.shell.ndani_label', 'Ndani')}
        </div>
        <div style={{
          fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase',
          color: CREAM.cream, marginTop: 4, fontWeight: 700,
        }}>
          {t('ndani.shell.admin_role', 'Admin')} · {role}
        </div>
        <nav style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '.' || n.to === ''}
              style={({ isActive }) => ({
                padding: '10px 12px', borderRadius: 10,
                background: isActive ? JEWEL.goldHope : 'transparent',
                color: isActive ? JEWEL.tealDeep : CREAM.cream,
                textDecoration: 'none', fontSize: 13, fontWeight: isActive ? 700 : 500,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: '120ms',
              })}
            >
              <span>{n.label}</span>
              <span style={{ fontSize: 10, opacity: 0.55 }}>{n.en}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main style={{ padding: '24px 32px 80px', minWidth: 0 }}>
        <div style={{
          fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: 700,
          color: TEXT.muted, marginBottom: 6,
        }}>
          Ndani{segs.length ? ' / ' + segs.join(' / ') : ''}
        </div>
        {children}
      </main>
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }): React.JSX.Element {
  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      marginBottom: 20, flexWrap: 'wrap', gap: 12,
    }}>
      <div>
        <h1 className="serif" style={{ margin: 0, fontSize: 32, letterSpacing: TYPE.tighterTrack, color: TEXT.heading }}>
          {title}
        </h1>
        {subtitle ? (
          <p style={{ margin: '4px 0 0', fontSize: 14, color: TEXT.muted }}>{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{actions}</div> : null}
    </header>
  )
}

export function Section({ title, children, right }: { title?: string; children: ReactNode; right?: ReactNode }): React.JSX.Element {
  return (
    <section style={{
      background: CREAM.milk,
      border: `1px solid rgba(11,9,8,0.10)`,
      borderRadius: RADII.card,
      padding: 20, marginBottom: 16,
      boxShadow: '0 1px 0 rgba(11,9,8,0.04)',
    }}>
      {(title || right) ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          {title ? (
            <h2 className="serif" style={{ margin: 0, fontSize: 18, color: TEXT.heading, letterSpacing: TYPE.tightTrack }}>{title}</h2>
          ) : <span />}
          {right}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'bad' | 'info' }): React.JSX.Element {
  const tones = {
    neutral: { bg: hexToRgba(JEWEL.tealDeep, 0.08), fg: JEWEL.tealDeep },
    good:    { bg: hexToRgba('#1EB53A', 0.14), fg: '#0F6B22' },
    warn:    { bg: hexToRgba(JEWEL.goldHope, 0.18), fg: '#6B5210' },
    bad:     { bg: hexToRgba(JEWEL.maroonCrisis, 0.14), fg: JEWEL.maroonCrisis },
    info:    { bg: hexToRgba('#00A3DD', 0.14), fg: '#0B4F70' },
  }[tone]
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 999,
      background: tones.bg, color: tones.fg, fontSize: 11, fontWeight: 700,
      letterSpacing: 0.4, textTransform: 'uppercase',
    }}>{children}</span>
  )
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element {
  const { style, ...rest } = props
  return (
    <button {...rest} style={{
      padding: '8px 14px', borderRadius: RADII.chip,
      background: JEWEL.tealMwenza, color: CREAM.cream, border: 'none',
      cursor: 'pointer', fontSize: 13, fontWeight: 600,
      ...style,
    }} />
  )
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element {
  const { style, ...rest } = props
  return (
    <button {...rest} style={{
      padding: '8px 14px', borderRadius: RADII.chip,
      background: 'transparent', color: TEXT.body,
      border: `1px solid rgba(11,9,8,0.20)`,
      cursor: 'pointer', fontSize: 13, fontWeight: 600,
      ...style,
    }} />
  )
}

export function DangerButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element {
  const { style, ...rest } = props
  return (
    <button {...rest} style={{
      padding: '8px 14px', borderRadius: RADII.chip,
      background: JEWEL.maroonCrisis, color: CREAM.cream, border: 'none',
      cursor: 'pointer', fontSize: 13, fontWeight: 600,
      ...style,
    }} />
  )
}
