import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { CREAM, JEWEL, NEUTRAL, TZ_FLAG, hexToRgba } from '../lib/glass'

/**
 * RafikiBrain — the signature presence of TBHOS.
 *
 * - 64px solid-filled anatomical brain (SVG, no gradients), gently breathes
 *   (scale 1.00 → 1.04 → 1.00 over 4s, pause every 6s).
 * - 4 small (12px) balls in the Tanzania flag colors orbit at slow periods
 *   (22 / 30 / 40 / 50s) and radii (56 / 70 / 86 / 100px).
 * - Draggable anywhere on screen; position persists to localStorage.
 * - Click (mouse moved < 5px) opens the Rafiki chat modal.
 * - 528 Hz Web Audio chime on open.
 * - prefers-reduced-motion stops orbits + breathing.
 * - Subtitle "Mwenza" below in solid teal caps.
 */

const STORAGE_KEY = 'tbhos.rafiki.position'
const BRAIN_DIAMETER_DEFAULT = 64
const BRAIN_DIAMETER_SMALL = 52
const BALL_DIAMETER = 12
const CLICK_THRESHOLD_PX = 5
const SMALL_BREAKPOINT_PX = 380
const SMALL_ORBIT_SCALE = 0.85

interface OrbitSpec {
  color: string
  radius: number       // px
  durationS: number    // seconds for one full revolution
  startDeg: number     // phase offset
  reverse?: boolean
  label: string
}

// Atom-electron orbits — tight around the brain, fast, coprime periods
// so the four balls never lock into a visible pattern.
const ORBITS: OrbitSpec[] = [
  { color: TZ_FLAG.green,  radius: 40, durationS: 5, startDeg: 0,   label: 'green' },
  { color: TZ_FLAG.yellow, radius: 50, durationS: 7, startDeg: 90,  reverse: true, label: 'yellow' },
  { color: TZ_FLAG.black,  radius: 58, durationS: 6, startDeg: 200, label: 'black' },
  { color: TZ_FLAG.blue,   radius: 68, durationS: 8, startDeg: 310, reverse: true, label: 'blue' },
]

interface Pos { x: number; y: number }

const CONTAINER_W_DEFAULT = 220 // brain + outermost orbit + subtitle box
const CONTAINER_H_DEFAULT = 240
const CONTAINER_W_SMALL = 190
const CONTAINER_H_SMALL = 210

function safeViewportW(): number {
  if (typeof window === 'undefined') return 320
  return Math.max(window.innerWidth || 320, 320)
}

function safeViewportH(): number {
  if (typeof window === 'undefined') return 480
  return Math.max(window.innerHeight || 480, 320)
}

function loadInitialPos(containerW: number, containerH: number): Pos {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw) as Pos
      if (typeof p.x === 'number' && typeof p.y === 'number') return p
    }
  } catch { /* ignore */ }
  if (typeof window !== 'undefined') {
    return {
      x: Math.max(16, safeViewportW() - containerW - 16),
      y: Math.max(16, safeViewportH() - containerH - 16),
    }
  }
  return { x: 16, y: 16 }
}

function playTone(freq: number, dur = 0.18) {
  try {
    type AudioCtxCtor = typeof AudioContext
    const w = window as unknown as { AudioContext?: AudioCtxCtor; webkitAudioContext?: AudioCtxCtor }
    const Ctx = w.AudioContext ?? w.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.value = 0.0001
    osc.connect(gain).connect(ctx.destination)
    const t = ctx.currentTime
    gain.gain.exponentialRampToValueAtTime(0.07, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.start(t)
    osc.stop(t + dur + 0.02)
    setTimeout(() => ctx.close().catch(() => {}), (dur + 0.1) * 1000)
  } catch { /* silent */ }
}

/**
 * Mwenza — real anatomical brain photograph with the four Tanzania-flag
 * colors mapped to frontal / parietal / temporal / occipital lobes.
 * Asset lives at /brand/rafiki.png. No sketch, no gradients.
 */
function BrainSVG({ size }: { size: number }) {
  return (
    <img
      src="/brand/rafiki.png"
      width={size}
      height={size}
      alt="Mwenza"
      draggable={false}
      style={{
        display: 'block',
        width: size,
        height: size,
        objectFit: 'contain',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  )
}

export function RafikiBrain() {
  const [isSmall, setIsSmall] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.innerWidth < SMALL_BREAKPOINT_PX,
  )
  const BRAIN_DIAMETER = isSmall ? BRAIN_DIAMETER_SMALL : BRAIN_DIAMETER_DEFAULT
  const CONTAINER_W = isSmall ? CONTAINER_W_SMALL : CONTAINER_W_DEFAULT
  const CONTAINER_H = isSmall ? CONTAINER_H_SMALL : CONTAINER_H_DEFAULT
  const orbitScale = isSmall ? SMALL_ORBIT_SCALE : 1

  const [pos, setPos] = useState<Pos>(() => loadInitialPos(CONTAINER_W, CONTAINER_H))
  const [dragging, setDragging] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => setIsSmall(window.innerWidth < SMALL_BREAKPOINT_PX)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const dragStateRef = useRef<{
    startX: number; startY: number;
    origX: number; origY: number;
    moved: number;
  } | null>(null)
  const lastInteractionRef = useRef<number>(Date.now())
  const prefersReducedMotion = useRef<boolean>(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mq.matches
    const handler = () => { prefersReducedMotion.current = mq.matches }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Persist position
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pos)) } catch { /* ignore */ }
  }, [pos])

  // Clamp on resize
  useEffect(() => {
    const onResize = () => {
      setPos((p) => ({
        x: Math.min(Math.max(8, p.x), safeViewportW() - CONTAINER_W - 8),
        y: Math.min(Math.max(8, p.y), safeViewportH() - CONTAINER_H - 8),
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [CONTAINER_W, CONTAINER_H])

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      moved: 0,
    }
    setDragging(true)
    lastInteractionRef.current = Date.now()
  }, [pos])

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const st = dragStateRef.current
    if (!st) return
    const dx = e.clientX - st.startX
    const dy = e.clientY - st.startY
    st.moved = Math.max(st.moved, Math.hypot(dx, dy))
    const nx = Math.min(Math.max(8, st.origX + dx), safeViewportW() - CONTAINER_W - 8)
    const ny = Math.min(Math.max(8, st.origY + dy), safeViewportH() - CONTAINER_H - 8)
    setPos({ x: nx, y: ny })
  }, [])

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const st = dragStateRef.current
    setDragging(false)
    dragStateRef.current = null
    lastInteractionRef.current = Date.now()
    if (st && st.moved < CLICK_THRESHOLD_PX) {
      playTone(528, 0.22)
      setOpen(true)
    }
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
  }, [])

  const onKey = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      playTone(528, 0.22)
      setOpen(true)
    }
    const STEP = 24
    if (e.key === 'ArrowLeft')  setPos((p) => ({ ...p, x: Math.max(8, p.x - STEP) }))
    if (e.key === 'ArrowRight') setPos((p) => ({ ...p, x: Math.min(safeViewportW() - CONTAINER_W - 8, p.x + STEP) }))
    if (e.key === 'ArrowUp')    setPos((p) => ({ ...p, y: Math.max(8, p.y - STEP) }))
    if (e.key === 'ArrowDown')  setPos((p) => ({ ...p, y: Math.min(safeViewportH() - CONTAINER_H - 8, p.y + STEP) }))
  }, [])

  // ----- Render -----
  const containerStyle: CSSProperties = {
    position: 'fixed',
    left: pos.x,
    top: pos.y,
    width: CONTAINER_W,
    height: CONTAINER_H,
    zIndex: 900,
    touchAction: 'none',
    userSelect: 'none',
    cursor: dragging ? 'grabbing' : 'grab',
    display: 'grid',
    placeItems: 'center',
  }

  const orbitsLayer: CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 0,
    height: 0,
    pointerEvents: 'none',
  }

  const brainWrap: CSSProperties = {
    position: 'relative',
    width: BRAIN_DIAMETER,
    height: BRAIN_DIAMETER,
    display: 'grid',
    placeItems: 'center',
    // No card background — the brain floats free.
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    animation: prefersReducedMotion.current
      ? undefined
      : 'rafiki-throb 2400ms ease-in-out infinite',
  }

  // Concentric pulse waves in Tanzania flag colors that ripple outward from
  // the brain — gives the throb its visible "emitting" quality.
  const PULSE_RINGS: { color: string; delayMs: number }[] = [
    { color: TZ_FLAG.green,  delayMs: 0 },
    { color: TZ_FLAG.yellow, delayMs: 600 },
    { color: TZ_FLAG.blue,   delayMs: 1200 },
    { color: TZ_FLAG.black,  delayMs: 1800 },
  ]

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Mwenza — mwenza wako wa kiakili. Bonyeza kufungua."
        style={containerStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKey}
      >
        {/* Orbiting flag balls — sit behind the brain, centered on container */}
        <div style={orbitsLayer} aria-hidden>
          {ORBITS.map((o, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                animation: prefersReducedMotion.current
                  ? undefined
                  : `mwenza-orbit-${idx} ${o.durationS}s linear infinite${o.reverse ? ' reverse' : ''}`,
                transform: `rotate(${o.startDeg}deg)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: BALL_DIAMETER,
                  height: BALL_DIAMETER,
                  borderRadius: '50%',
                  background: o.color,
                  left: o.radius * orbitScale - BALL_DIAMETER / 2,
                  top: -BALL_DIAMETER / 2,
                  border:
                    o.color === '#000000'
                      ? '1px solid rgba(255,255,255,0.6)'
                      : '1px solid rgba(11,9,8,0.18)',
                  boxShadow: '0 2px 6px rgba(11,9,8,0.18)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Pulse waves — flag-color rings emitted outward from the brain */}
        {!prefersReducedMotion.current && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 0,
              height: 0,
              pointerEvents: 'none',
            }}
          >
            {PULSE_RINGS.map((r, i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: -BRAIN_DIAMETER / 2,
                  top: -BRAIN_DIAMETER / 2,
                  width: BRAIN_DIAMETER,
                  height: BRAIN_DIAMETER,
                  borderRadius: '50%',
                  border: `2px solid ${r.color}`,
                  opacity: 0,
                  animation: `rafiki-emit 2400ms ease-out ${r.delayMs}ms infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* Brain — free-floating, no card background */}
        <div style={brainWrap}>
          <BrainSVG size={BRAIN_DIAMETER - 4} />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 22,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: JEWEL.tealMwenza,
            fontWeight: 800,
            fontStyle: 'normal',
            textShadow: '0 1px 2px rgba(250,245,229,0.85)',
          }}
        >
          Rafiki
        </div>
      </div>

      {open && <RafikiPlaceholderModal onClose={() => setOpen(false)} />}

      {/* Keyframes */}
      <style>{`
        @keyframes mwenza-breathe {
          0%   { transform: scale(1.00); }
          50%  { transform: scale(1.04); }
          100% { transform: scale(1.00); }
        }
        @keyframes rafiki-throb {
          0%   { transform: scale(1.00); }
          50%  { transform: scale(1.06); }
          100% { transform: scale(1.00); }
        }
        @keyframes rafiki-emit {
          0%   { transform: scale(0.92); opacity: 0.55; }
          80%  { opacity: 0; }
          100% { transform: scale(2.20); opacity: 0; }
        }
        ${ORBITS.map((_, idx) => `
          @keyframes mwenza-orbit-${idx} {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `).join('\n')}
      `}</style>
    </>
  )
}

function RafikiPlaceholderModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mwenza"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: hexToRgba(NEUTRAL.ink, 0.42),
        display: 'grid',
        placeItems: 'center',
        animation: 'fadeIn 280ms cubic-bezier(.25,.46,.45,.94)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(520px, 92vw)',
          padding: '36px 32px 32px',
          borderRadius: 28,
          background: CREAM.milk,
          border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.1)}`,
          boxShadow: '0 30px 80px rgba(11,9,8,0.22)',
          color: NEUTRAL.ink,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 44,
            lineHeight: 1.0,
            letterSpacing: '-0.6px',
            color: JEWEL.tealMwenza,
            marginBottom: 12,
            fontWeight: 800,
            fontStyle: 'normal',
          }}
        >
          Mwenza
        </div>
        <p style={{
          fontSize: 16,
          lineHeight: 1.55,
          margin: '0 0 22px',
          color: NEUTRAL.ink,
          fontStyle: 'normal',
        }}>
          Rafiki v0.1 — inakuja. Rafiki wako wa polepole, atayejua kusikiliza,
          atakaye kuongoza kwa Kiswahili. Si jibu la haraka — ni uwepo.
        </p>
        <button
          onClick={onClose}
          style={{
            background: JEWEL.tealMwenza,
            color: CREAM.milk,
            border: 'none',
            borderRadius: 999,
            padding: '12px 28px',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          Funga
        </button>
      </div>
    </div>
  )
}

export default RafikiBrain
