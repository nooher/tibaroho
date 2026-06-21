import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, TYPE, hexToRgba } from '../lib/glass'
import { MODULES } from '../lib/modules'
import { clearPersona, PERSONAS, setPersona } from '../lib/personas'
import { useLang, setLang } from '../lib/i18n'

interface Command {
  id: string
  label: string         // Swahili (primary)
  english: string       // English helper for fuzzy match + a11y
  group: 'Nenda' | 'Persona' | 'Vitendo' | 'Mfumo'
  run: () => void
}

const REDUCE_MOTION_KEY = 'tumaini.reduceMotion'
const THEME_KEY = 'tumaini.theme'

function fuzzy(needle: string, haystack: string): number {
  if (!needle) return 1
  const n = needle.toLowerCase()
  const h = haystack.toLowerCase()
  if (h.includes(n)) return 2
  let i = 0
  for (const ch of h) {
    if (ch === n[i]) i++
    if (i >= n.length) return 1
  }
  return 0
}

/**
 * Cmd+K / Ctrl+K / "/" — global command palette.
 *
 * Modal sheet on cream surface, max-width 600, centered. Filters Swahili +
 * English labels. Arrow keys + Enter to select, Esc to close.
 */
export function CommandPalette() {
  const nav = useNavigate()
  const [, setLangState] = useLang()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
  }, [])

  const commands: Command[] = useMemo(() => {
    const out: Command[] = []

    // --- Navigation
    for (const m of MODULES) {
      out.push({
        id: `go:${m.slug}`,
        label: `Nenda ${m.name}`,
        english: `Go to ${m.english}`,
        group: 'Nenda',
        run: () => nav(`/${m.slug}`),
      })
    }
    out.push({
      id: 'go:welcome',
      label: 'Nenda Welcome',
      english: 'Go to public landing',
      group: 'Nenda',
      run: () => nav('/welcome'),
    })
    out.push({
      id: 'go:karibu',
      label: 'Nenda Karibu Wizard',
      english: 'Go to Karibu wizard',
      group: 'Nenda',
      run: () => nav('/karibu'),
    })

    // --- Persona
    for (const p of PERSONAS) {
      out.push({
        id: `persona:${p.id}`,
        label: `Badilisha persona: ${p.name}`,
        english: `Switch persona to ${p.english}`,
        group: 'Persona',
        run: () => {
          const result = setPersona(p.id)
          if (result) nav(result.startRoute)
        },
      })
    }
    out.push({
      id: 'persona:clear',
      label: 'Futa persona ya demo',
      english: 'Clear persona',
      group: 'Persona',
      run: () => clearPersona(),
    })

    // --- Quick actions
    out.push({
      id: 'act:journal',
      label: 'Andika diary mpya',
      english: 'New journal entry',
      group: 'Vitendo',
      run: () => nav('/mimi?action=journal'),
    })
    out.push({
      id: 'act:mood',
      label: 'Andika hisia za sasa',
      english: 'New mood check',
      group: 'Vitendo',
      run: () => nav('/mimi?action=mood'),
    })
    out.push({
      id: 'act:rafiki',
      label: 'Fungua Rafiki',
      english: 'Open Rafiki AI',
      group: 'Vitendo',
      run: () => nav('/rafiki'),
    })
    out.push({
      id: 'act:breath',
      label: 'Anza kikao cha kupumua',
      english: 'Start breathing session',
      group: 'Vitendo',
      run: () => nav('/pumzi'),
    })
    out.push({
      id: 'act:phq9',
      label: 'Pima PHQ-9',
      english: 'Take PHQ-9 assessment',
      group: 'Vitendo',
      run: () => nav('/mimi?action=phq9'),
    })
    out.push({
      id: 'act:gad7',
      label: 'Pima GAD-7',
      english: 'Take GAD-7 assessment',
      group: 'Vitendo',
      run: () => nav('/mimi?action=gad7'),
    })

    // --- System
    out.push({
      id: 'sys:lang',
      label: 'Badilisha lugha (SW / EN)',
      english: 'Toggle language',
      group: 'Mfumo',
      run: () => {
        try {
          const cur = localStorage.getItem('tibaroho.lang')
          const next = cur === 'en' ? 'sw' : 'en'
          setLang(next)
          setLangState(next)
        } catch {
          /* noop */
        }
      },
    })
    out.push({
      id: 'sys:theme',
      label: 'Badilisha mwanga (cream / ink)',
      english: 'Toggle light / dark',
      group: 'Mfumo',
      run: () => {
        try {
          const cur = localStorage.getItem(THEME_KEY) || 'cream'
          const next = cur === 'cream' ? 'ink' : 'cream'
          localStorage.setItem(THEME_KEY, next)
          document.documentElement.dataset.theme = next
        } catch {
          /* noop */
        }
      },
    })
    out.push({
      id: 'sys:motion',
      label: 'Punguza msogeo',
      english: 'Toggle reduced motion',
      group: 'Mfumo',
      run: () => {
        try {
          const cur = localStorage.getItem(REDUCE_MOTION_KEY) === 'true'
          const next = !cur
          localStorage.setItem(REDUCE_MOTION_KEY, String(next))
          document.documentElement.dataset.reduceMotion = String(next)
        } catch {
          /* noop */
        }
      },
    })

    return out
  }, [nav, setLangState])

  const filtered = useMemo(() => {
    if (!query.trim()) return commands
    const ranked = commands
      .map((c) => ({
        c,
        score: Math.max(fuzzy(query, c.label), fuzzy(query, c.english)),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
    return ranked.map((x) => x.c)
  }, [commands, query])

  // Reset active index when filter changes.
  useEffect(() => {
    setActive(0)
  }, [query, open])

  // Global keyboard handler.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase()
      const inField =
        tag === 'input' || tag === 'textarea' || tag === 'select' ||
        (e.target as HTMLElement | null)?.isContentEditable
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === '/' && !inField && !open) {
        e.preventDefault()
        setOpen(true)
      } else if (e.key === 'Escape' && open) {
        e.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!open) return null

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = filtered[active]
      if (cmd) {
        cmd.run()
        close()
      }
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Amri za haraka"
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: hexToRgba(NEUTRAL.ink, 0.42),
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onListKey}
        style={{
          width: 'min(600px, 92vw)',
          background: CREAM.milk,
          border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`,
          borderRadius: RADII.modal,
          boxShadow: '0 24px 64px rgba(11,9,8,0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            borderBottom: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span aria-hidden style={{ fontSize: 16, color: BRAND.green }}>
            &#9906;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tafuta amri… (Cmd+K)"
            aria-label="Tafuta amri"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: TYPE.sans,
              fontSize: 16,
              color: NEUTRAL.ink,
            }}
          />
          <kbd
            style={{
              fontSize: 11,
              padding: '3px 7px',
              borderRadius: 6,
              background: CREAM.ivory,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.15)}`,
              color: TEXT.muted,
              fontFamily: TYPE.sans,
            }}
          >
            Esc
          </kbd>
        </div>

        <ul
          ref={listRef}
          role="listbox"
          aria-label="Orodha ya amri"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 6,
            maxHeight: '50vh',
            overflowY: 'auto',
          }}
        >
          {filtered.length === 0 && (
            <li
              style={{
                padding: '20px 14px',
                fontSize: 13,
                color: TEXT.muted,
                textAlign: 'center',
              }}
            >
              Hakuna amri inayolingana.
            </li>
          )}
          {filtered.map((c, i) => {
            const isActive = i === active
            return (
              <li
                key={c.id}
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  c.run()
                  close()
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: RADII.card,
                  background: isActive ? CREAM.ivory : 'transparent',
                  border: isActive
                    ? `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`
                    : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 14,
                  color: NEUTRAL.ink,
                  fontFamily: TYPE.sans,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: BRAND.green,
                    minWidth: 60,
                  }}
                >
                  {c.group}
                </span>
                <span style={{ flex: 1 }}>{c.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    color: TEXT.hint,
                  }}
                >
                  {c.english}
                </span>
              </li>
            )
          })}
        </ul>

        <div
          style={{
            padding: '8px 14px',
            borderTop: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
            fontSize: 11,
            color: TEXT.hint,
            display: 'flex',
            gap: 14,
          }}
        >
          <span>&uarr;&darr; Songa</span>
          <span>&crarr; Chagua</span>
          <span>Esc Funga</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
