import type React from 'react'
import { useEffect, useState } from 'react'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, TYPE, hexToRgba } from '../lib/glass'
import { getArchitecture, getSharedTechStack } from '../lib/architectureMeta'
import { MODULES } from '../lib/modules'

interface Props {
  moduleSlug: string
}

const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * "Arkitekti · ⓘ" — small clickable chip rendered next to module hero
 * titles. Click opens a right-side glass-on-cream sheet that reveals
 * sub-engines, EBM citations, tech stack, and (toggle) mock source
 * snippets (SQL · FHIR · Rafiki routing).
 */
export function ArchitectureBadge({ moduleSlug }: Props): React.JSX.Element | null {
  const meta = getArchitecture(moduleSlug)
  const mod = MODULES.find((m) => m.slug === moduleSlug)
  const [open, setOpen] = useState(false)
  const [showSource, setShowSource] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!meta) return null
  const accent = mod?.accent ?? BRAND.green

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Fungua arkitekti ya moduli — Open module architecture"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          marginTop: 12,
          borderRadius: RADII.chip,
          background: CREAM.ivory,
          color: BRAND.ink,
          border: `1px solid ${hexToRgba(BRAND.ink, 0.18)}`,
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: TYPE.sans,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: accent,
            display: 'inline-block',
          }}
        />
        Arkitekti
        <span aria-hidden style={{ opacity: 0.6 }}>ⓘ</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Arkitekti ya ${mod?.name ?? moduleSlug}`}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: hexToRgba(NEUTRAL.ink, 0.32),
            display: 'flex',
            justifyContent: 'flex-end',
            animation: PREFERS_REDUCED_MOTION ? undefined : 'arc-fade 200ms ease',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <aside
            style={{
              width: 'min(480px, 100vw)',
              height: '100%',
              overflowY: 'auto',
              background: CREAM.milk,
              borderLeft: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`,
              boxShadow: '-24px 0 64px rgba(11,9,8,0.18)',
              padding: '28px 26px 60px',
              animation: PREFERS_REDUCED_MOTION
                ? undefined
                : 'arc-slide 240ms cubic-bezier(.25,.46,.45,.94)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div>
                <div
                  style={{
                    fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: TEXT.hint, fontWeight: 700,
                  }}
                >
                  Arkitekti · Module architecture
                </div>
                <h2
                  style={{
                    margin: '6px 0 0',
                    fontFamily: TYPE.serif,
                    fontSize: 28,
                    letterSpacing: TYPE.tighterTrack,
                    color: BRAND.ink,
                  }}
                >
                  {mod?.name ?? moduleSlug}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Funga — Close"
                style={{
                  background: 'transparent',
                  border: `1px solid ${hexToRgba(BRAND.ink, 0.2)}`,
                  borderRadius: 999,
                  width: 32, height: 32,
                  display: 'grid', placeItems: 'center',
                  cursor: 'pointer', color: BRAND.ink, fontSize: 16,
                }}
              >
                ×
              </button>
            </div>

            <Section title="Injini ndogo · Sub-engines">
              <ul style={listStyle}>
                {meta.engines.map((e) => (
                  <li key={e} style={liStyle}>
                    <Dot color={accent} /> {e}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Marejeleo ya EBM · Citations">
              <ul style={{ ...listStyle, gap: 10 }}>
                {meta.citations.map((c) => (
                  <li key={c.label} style={{ ...liStyle, alignItems: 'flex-start' }}>
                    <Dot color={c.verified ? BRAND.green : BRAND.yellow} />
                    <span style={{ display: 'inline-block' }}>
                      <span style={{ fontWeight: 600 }}>{c.label}</span>
                      <span style={{ display: 'block', fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                        {c.source}{c.year ? ` · ${c.year}` : ''}
                        {' · '}
                        <span style={{ color: c.verified ? BRAND.green : BRAND.yellow }}>
                          {c.verified ? 'imethibitishwa' : 'haijathibitishwa'}
                        </span>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Mfumo wa Teknolojia · Tech stack">
              <ul style={listStyle}>
                {getSharedTechStack().map((t) => (
                  <li key={t} style={liStyle}>
                    <Dot color={BRAND.blue} /> {t}
                  </li>
                ))}
              </ul>
            </Section>

            <button
              type="button"
              onClick={() => setShowSource((v) => !v)}
              aria-expanded={showSource}
              style={{
                marginTop: 8,
                padding: '10px 14px',
                borderRadius: RADII.chip,
                background: showSource ? accent : 'transparent',
                color: showSource ? CREAM.milk : BRAND.ink,
                border: `1px solid ${hexToRgba(BRAND.ink, 0.2)}`,
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {showSource ? '⌃ Ficha chanzo · Hide source' : '⌄ Onyesha chanzo · View source'}
            </button>

            {showSource && (
              <div style={{ marginTop: 18 }}>
                <CodeBlock label="SQL · sample query" code={meta.mockSQL} />
                <CodeBlock label="FHIR R4 · sample resource" code={meta.mockFHIR} />
                <CodeBlock label="Rafiki · routing trace" code={meta.mockRouting} />
              </div>
            )}

            <p style={{ marginTop: 28, fontSize: 11, opacity: 0.6, lineHeight: 1.6 }}>
              Sehemu hizi ni vielelezo vya muundo — sio data ya mgonjwa halisi.
              {' '}These are illustrative samples — not real patient data.
            </p>
          </aside>
        </div>
      )}

      <style>{`
        @keyframes arc-slide { from { transform: translateX(24px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes arc-fade  { from { opacity: 0 } to { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes arc-slide { from { opacity: 1 } to { opacity: 1 } }
          @keyframes arc-fade  { from { opacity: 1 } to { opacity: 1 } }
        }
      `}</style>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <section style={{ marginTop: 24 }}>
      <h3
        style={{
          margin: '0 0 10px',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: TEXT.hint,
          fontWeight: 700,
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  )
}

function Dot({ color }: { color: string }): React.JSX.Element {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 8, height: 8, borderRadius: 999,
        background: color, flex: '0 0 auto', marginTop: 6,
      }}
    />
  )
}

function CodeBlock({ label, code }: { label: string; code: string }): React.JSX.Element {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: TEXT.hint, fontWeight: 700, marginBottom: 6,
        }}
      >
        {label}
      </div>
      <pre
        style={{
          margin: 0,
          padding: '12px 14px',
          background: CREAM.paper,
          border: `1px solid ${hexToRgba(BRAND.ink, 0.12)}`,
          borderRadius: 12,
          fontSize: 12,
          lineHeight: 1.5,
          color: BRAND.inkSoft,
          overflowX: 'auto',
          fontFamily:
            "'JetBrains Mono', 'SF Mono', 'Consolas', 'Liberation Mono', monospace",
          whiteSpace: 'pre',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  color: BRAND.ink,
  fontSize: 14,
  lineHeight: 1.5,
}

const liStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

export default ArchitectureBadge
