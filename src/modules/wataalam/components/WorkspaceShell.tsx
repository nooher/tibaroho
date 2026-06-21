import { NavLink, Outlet, Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, TYPE, hexToRgba } from '../../../lib/glass'

interface NavEntry {
  to: string
  label: string
  english: string
}

const NAV: NavEntry[] = [
  { to: '', label: 'Dashibodi', english: 'Dashboard' },
  { to: 'ratiba', label: 'Ratiba', english: 'Schedule' },
  { to: 'video', label: 'Telehealth', english: 'Telehealth' },
  { to: 'intake', label: 'Mapokezi', english: 'Intake' },
  { to: 'mipango', label: 'Mipango ya Tiba', english: 'Care plans' },
  { to: 'kodi', label: 'Coding', english: 'ICD-11' },
  { to: 'madai', label: 'Madai ya Bima', english: 'Claims' },
  { to: 'kumbukumbu', label: 'Kumbukumbu', english: 'Notes' },
  { to: 'matokeo', label: 'Matokeo', english: 'Outcomes' },
  { to: 'usimamizi', label: 'Usimamizi', english: 'Supervision' },
  { to: 'rufaa', label: 'Rufaa', english: 'Referrals' },
  { to: 'wasifu', label: 'Wasifu', english: 'Profile' },
  { to: 'elimu', label: 'Elimu (CEU)', english: 'CEU' },
]

export function WorkspaceShell() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 240px) 1fr',
        gap: 0,
        maxWidth: 1280,
        margin: '0 auto',
        padding: '24px 16px 64px',
        color: TEXT.body,
        fontFamily: TYPE.sans,
        minHeight: '70vh',
      }}
      className="wataalam-shell"
    >
      <aside
        aria-label="Urambazaji wa eneo la kazi"
        style={{
          position: 'sticky',
          top: 16,
          alignSelf: 'start',
          padding: 14,
          background: CREAM.ivory,
          border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
          borderRadius: RADII.sheet,
          maxHeight: 'calc(100vh - 32px)',
          overflow: 'auto',
          boxShadow: '0 1px 0 rgba(11,9,8,0.04), 0 8px 22px rgba(11,9,8,0.05)',
        }}
      >
        <Link
          to="/"
          style={{
            color: TEXT.muted,
            fontSize: 12,
            textDecoration: 'none',
            display: 'block',
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          ← Rudi nyumbani
        </Link>
        <h2
          style={{
            fontFamily: TYPE.serif,
            fontSize: 18,
            margin: '0 0 12px',
            letterSpacing: TYPE.tighterTrack,
            color: TEXT.heading,
            fontWeight: 800,
          }}
        >
          Eneo la Mtaalamu
        </h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 2 }}>
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === ''}
                  style={({ isActive }) => navItemStyle(isActive)}
                >
                  <span>{n.label}</span>
                  <span style={{ fontSize: 10, color: TEXT.muted, fontWeight: 500 }}>{n.english}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main style={{ paddingLeft: 16, minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  )
}

function navItemStyle(isActive: boolean): CSSProperties {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '9px 12px',
    borderRadius: RADII.chip,
    background: isActive ? BRAND.green : 'transparent',
    border: `1px solid ${isActive ? BRAND.green : 'transparent'}`,
    color: isActive ? TEXT.onJewel : TEXT.body,
    fontFamily: TYPE.sans,
    fontSize: 13,
    fontWeight: isActive ? 700 : 500,
    textDecoration: 'none',
    transition: 'background 160ms ease, color 160ms ease',
  }
}

export default WorkspaceShell
