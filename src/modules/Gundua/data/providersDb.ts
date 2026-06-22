/**
 * Live provider directory hook — reads tr_providers ⋈ tr_users from
 * Supabase and maps the rows onto the existing `Provider` UI shape so
 * List/Filter/ProviderProfile keep working unchanged.
 *
 * Fallback strategy:
 *  - If backend is unconfigured OR the query returns zero rows OR errors,
 *    we return the hardcoded `PROVIDERS` seed so dev/demo + first-launch
 *    still show a populated directory.
 *  - When real providers exist in DB, we use ONLY them (no seed mixing).
 */
import { useEffect, useState } from 'react'
import { hasBackend, supabase } from '../../../lib/supabase'
import { PROVIDERS, type Provider, type ProviderKind, type Mode, type LanguageCode } from './providers'

// DB types live in src/lib/db.ts. ProviderKind names diverge between the
// UI module (psychiatrist|psychologist|lay_counsellor|faith_counsellor|
// school_counsellor|gp_mh|addiction_counsellor) and tr_providers.kind
// (clinician|lay_counsellor|faith|school|ngo). Map conservatively.
function mapKind(dbKind: string): ProviderKind {
  switch (dbKind) {
    case 'lay_counsellor':       return 'lay_counsellor'
    case 'faith':                return 'faith_counsellor'
    case 'school':               return 'school_counsellor'
    case 'clinician':            return 'psychiatrist'
    case 'ngo':                  return 'lay_counsellor'
    default:                     return 'psychiatrist'
  }
}

function mapMode(modalities?: string[]): Mode {
  if (!modalities || modalities.length === 0) return 'virtual'
  const hasVirtual = modalities.includes('virtual') || modalities.includes('hybrid')
  const hasInPerson = modalities.includes('in_person') || modalities.includes('hybrid')
  if (hasVirtual && hasInPerson) return 'both'
  return hasInPerson ? 'in_person' : 'virtual'
}

function mapLang(code: string): LanguageCode {
  const v = code.toLowerCase()
  if (v === 'sw' || v === 'en' || v === 'sw_mtaa' || v === 'ar' || v === 'fr') return v
  if (v === 'tsl' || v === 'lugha_alama' || v === 'sign') return 'lugha_alama'
  return 'sw'
}

interface ProviderRow {
  id: string
  user_id: string
  kind: string
  bio_sw: string | null
  bio_en: string | null
  languages: string[] | null
  regions: string[] | null
  fee_default: number
  accepts_insurance: string[] | null
  modalities: string[] | null
  verified: boolean
  tr_users?: { display_name?: string | null; region?: string | null } | null
}

function rowToProvider(r: ProviderRow): Provider {
  const region = r.regions?.[0] ?? r.tr_users?.region ?? 'Dar es Salaam'
  const name = r.tr_users?.display_name ?? 'Mtaalam'
  return {
    id: r.id,
    name,
    honorific: 'Dr.',
    credentials: '',
    kind: mapKind(r.kind),
    specialtiesSw: [],
    specialtiesEn: [],
    languages: (r.languages ?? ['sw']).map(mapLang),
    mode: mapMode(r.modalities ?? undefined),
    feeTzs: r.fee_default ?? 0,
    insurances: ((r.accepts_insurance ?? []) as unknown) as Provider['insurances'],
    location: {
      region,
      city: region,
      lat: 0,
      lng: 0,
    },
    rating: 4.5,
    reviewsCount: 0,
    accepting: true,
    yearsExperience: 0,
    licenseNumber: '',
    verified: r.verified,
    bioSw: r.bio_sw ?? '',
    bioEn: r.bio_en ?? '',
  }
}

export interface UseProvidersResult {
  providers: Provider[]
  loading: boolean
  source: 'db' | 'seed'
  error: string | null
}

/**
 * Read provider directory from Supabase. Returns the hardcoded seed when
 * backend is unconfigured or empty so the UI always renders something.
 */
export function useProviders(): UseProvidersResult {
  const [providers, setProviders] = useState<Provider[]>(PROVIDERS)
  const [loading, setLoading] = useState<boolean>(hasBackend)
  const [source, setSource] = useState<'db' | 'seed'>('seed')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (!hasBackend || !supabase) {
      setLoading(false)
      return
    }
    void (async () => {
      const { data, error: e } = await supabase
        .from('tr_providers')
        .select('id, user_id, kind, bio_sw, bio_en, languages, regions, fee_default, accepts_insurance, modalities, verified, tr_users!inner(display_name, region)')
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(200)
      if (cancelled) return
      if (e) {
        setError(e.message)
        setLoading(false)
        return
      }
      const rows = (data ?? []) as unknown as ProviderRow[]
      if (rows.length === 0) {
        setLoading(false)
        return
      }
      setProviders(rows.map(rowToProvider))
      setSource('db')
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  return { providers, loading, source, error }
}
