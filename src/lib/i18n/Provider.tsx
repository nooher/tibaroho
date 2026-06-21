// Provider.tsx — React Context provider for the Tumaini i18n catalog.
//
// Resolution order on mount:
//   1. localStorage `tumaini.lang.v1`
//   2. URL query `?lang=`
//   3. navigator.language mapped to a supported lane
//   4. default `sw`
//
// Side-effects on change:
//   - persist to localStorage
//   - update URL `?lang=` (without history pollution — replaceState)
//   - set document.documentElement.lang
//   - set document.documentElement.dir = rtl|ltr
//   - dispatch legacy `tumaini:tlang` event so existing listeners keep working

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { CATALOG, LANGS, lookup, type Lang } from './catalog'

export type { Lang } from './catalog'

const STORAGE_KEY = 'tumaini.lang.v1'
const LEGACY_KEY = 'tumaini.tlang'
const QUERY_KEY = 'lang'

function isLang(v: string | null | undefined): v is Lang {
  return v === 'sw' || v === 'en' || v === 'ar' || v === 'ru' || v === 'zh'
}

function detectLang(): Lang {
  // 1. localStorage
  if (typeof localStorage !== 'undefined') {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      if (isLang(v)) return v
      const legacy = localStorage.getItem(LEGACY_KEY)
      if (isLang(legacy)) return legacy
    } catch { /* noop */ }
  }
  // 2. URL ?lang=
  if (typeof window !== 'undefined' && window.location) {
    try {
      const params = new URLSearchParams(window.location.search)
      const q = params.get(QUERY_KEY)
      if (isLang(q)) return q
    } catch { /* noop */ }
  }
  // 3. navigator.language
  if (typeof navigator !== 'undefined' && navigator.language) {
    const code = navigator.language.toLowerCase().split('-')[0]
    if (code === 'sw' || code === 'en' || code === 'ar' || code === 'ru') return code
    if (code === 'zh') return 'zh'
  }
  // 4. default
  return 'sw'
}

function applySideEffects(l: Lang): void {
  if (typeof document === 'undefined') return
  try {
    document.documentElement.lang = l
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
  } catch { /* noop */ }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, l)
      localStorage.setItem(LEGACY_KEY, l) // keep old key in sync
    }
  } catch { /* noop */ }
  try {
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href)
      url.searchParams.set(QUERY_KEY, l)
      window.history.replaceState({}, '', url.toString())
    }
  } catch { /* noop */ }
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tumaini:tlang', { detail: l }))
      window.dispatchEvent(new CustomEvent('tibaroho:lang', { detail: l === 'sw' || l === 'en' ? l : 'en' }))
    }
  } catch { /* noop */ }
}

export interface LangContextShape {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, fallback?: string) => string
  langs: readonly Lang[]
}

const LangContext = createContext<LangContextShape | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectLang())

  // Apply side-effects when lang changes (also fires on first mount).
  useEffect(() => {
    applySideEffects(lang)
  }, [lang])

  // Listen for legacy event so older components can still drive the lang.
  useEffect(() => {
    const onLegacy = (e: Event) => {
      const ce = e as CustomEvent<Lang>
      if (isLang(ce.detail) && ce.detail !== lang) setLangState(ce.detail)
    }
    if (typeof window === 'undefined') return
    window.addEventListener('tumaini:tlang', onLegacy)
    return () => window.removeEventListener('tumaini:tlang', onLegacy)
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    if (!isLang(l)) return
    setLangState(l)
  }, [])

  const t = useCallback(
    (key: string, fallback?: string) => lookup(key, lang, fallback),
    [lang],
  )

  const value = useMemo<LangContextShape>(
    () => ({ lang, setLang, t, langs: LANGS }),
    [lang, setLang, t],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextShape {
  const ctx = useContext(LangContext)
  if (!ctx) {
    // Fallback so components used outside a provider still get sw.
    return {
      lang: 'sw',
      setLang: () => { /* noop */ },
      t: (k: string, f?: string) => {
        const e = CATALOG[k]
        return e?.sw ?? f ?? k
      },
      langs: LANGS,
    }
  }
  return ctx
}
