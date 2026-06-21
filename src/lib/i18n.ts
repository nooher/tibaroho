// i18n.ts — legacy entry point. Forwards to the new i18n/ provider so the
// older 2-lane `[lang, setLang]` tuple keeps working for callers that have
// not migrated to the object hook yet.
//
// New code should import from './i18n/Provider' or './i18n/useLang' and use
// the `{ lang, setLang, t }` object hook.

import { useLang as useLangObj, type Lang as FullLang } from './i18n/Provider'

export type Lang = 'sw' | 'en'

export function getInitialLang(): Lang {
  try {
    const v = localStorage.getItem('tumaini.lang.v1') ?? localStorage.getItem('tibaroho.lang')
    if (v === 'sw' || v === 'en') return v
    if (v === 'ar' || v === 'ru' || v === 'zh') return 'en' // fallback for 2-lane callers
  } catch { /* ignore */ }
  return 'sw'
}

export function setLang(l: Lang) {
  try { localStorage.setItem('tumaini.lang.v1', l) } catch { /* ignore */ }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tumaini:tlang', { detail: l }))
    window.dispatchEvent(new CustomEvent('tibaroho:lang', { detail: l }))
  }
}

/**
 * Legacy 2-lane hook. Returns `[lang, setLang]` for callers that pre-date
 * the multi-lane catalog. New code should use the object hook from
 * `./i18n/Provider` instead.
 */
export function useLang(): [Lang, (l: Lang) => void] {
  const { lang: full, setLang: setFull } = useLangObj()
  const collapsed: Lang = full === 'sw' ? 'sw' : 'en'
  const setBoth = (l: Lang) => {
    setFull(l as FullLang)
  }
  return [collapsed, setBoth]
}
