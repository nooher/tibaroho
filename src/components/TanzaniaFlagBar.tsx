import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

/**
 * The Tanzania flag bar — the sanctioned gradient exception.
 *
 * One thin horizontal strip. Four color blocks (green · yellow · black · blue)
 * with hairline yellow seam lines marking the flag's diagonal accents
 * (visual approximation in a single-line bar).
 *
 * 6px tall desktop, 4px tall mobile. Fixed to viewport top or bottom.
 */
export function TanzaniaFlagBar({ position }: { position: 'top' | 'bottom' }) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const h = isMobile ? 4 : 6

  const style: CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    height: h,
    zIndex: 1000,
    pointerEvents: 'none',
    [position]: 0,
    // Flag color split — green / yellow seam / black / yellow seam / blue
    background:
      'linear-gradient(90deg,' +
      ' var(--flag-green) 0 36%,' +
      ' var(--flag-yellow) 36% 39%,' +
      ' var(--flag-black) 39% 61%,' +
      ' var(--flag-yellow) 61% 64%,' +
      ' var(--flag-blue) 64% 100%)',
    boxShadow:
      position === 'top'
        ? '0 1px 0 rgba(0,0,0,0.35)'
        : '0 -1px 0 rgba(0,0,0,0.35)',
  }

  return <div aria-hidden style={style} />
}

export default TanzaniaFlagBar
