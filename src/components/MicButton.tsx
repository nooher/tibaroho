import type React from 'react'
import { useState } from 'react'
import { BRAND, hexToRgba } from '../lib/glass'
import { listen, voiceSupported } from '../lib/rafiki/voice'
import { useLang } from '../lib/i18n'

interface Props {
  /** Called with the transcribed text when listening completes. */
  onTranscript: (text: string) => void
  /** Optional inline size override. */
  size?: number
  /** Optional className for layout. */
  className?: string
  /** Optional style override. */
  style?: React.CSSProperties
}

const TIP_SW = 'Bonyeza kuongea'
const TIP_EN = 'Press to speak'

/**
 * Reusable mic button. Click → listens via the Rafiki voice helper, then
 * fires `onTranscript`. Idle = ink fill, active = forest-green pulse.
 * Hidden when the browser has no SpeechRecognition.
 */
export function MicButton({ onTranscript, size = 32, className, style }: Props): React.JSX.Element | null {
  const [lang] = useLang()
  const [active, setActive] = useState(false)
  const supported = voiceSupported().listen

  if (!supported) return null

  const handleClick = async (): Promise<void> => {
    if (active) return
    setActive(true)
    try {
      const text = await listen(lang === 'en' ? 'en' : 'sw')
      if (text.trim().length > 0) onTranscript(text.trim())
    } catch {
      /* silent — user can just retry */
    } finally {
      setActive(false)
    }
  }

  const tip = lang === 'en' ? TIP_EN : TIP_SW

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={tip}
      title={tip}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        background: active ? BRAND.green : BRAND.ink,
        color: '#fff',
        border: `1px solid ${hexToRgba(BRAND.ink, 0.2)}`,
        cursor: 'pointer',
        flex: '0 0 auto',
        transition: 'background 160ms cubic-bezier(.25,.46,.45,.94)',
        boxShadow: active ? `0 0 0 4px ${hexToRgba(BRAND.green, 0.25)}` : 'none',
        ...style,
      }}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        width={Math.round(size * 0.5)}
        height={Math.round(size * 0.5)}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <line x1="12" y1="18" x2="12" y2="22" />
      </svg>
    </button>
  )
}

export default MicButton
