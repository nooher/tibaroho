import type { Provider } from '../data/providers'
import type { FilterState } from '../components/Filters'

export function applyFilters(providers: Provider[], f: FilterState): Provider[] {
  const q = f.q.trim().toLowerCase()
  return providers.filter((p) => {
    if (f.acceptingOnly && !p.accepting) return false
    if (f.kind !== 'all' && p.kind !== f.kind) return false
    if (f.language !== 'all' && !p.languages.includes(f.language)) return false
    if (f.mode !== 'all' && p.mode !== f.mode && p.mode !== 'both') return false
    if (f.region !== 'all' && p.location.region !== f.region) return false
    if (f.insurance !== 'all' && !p.insurances.includes(f.insurance)) return false
    if (f.maxFee !== null && p.feeTzs > f.maxFee) return false
    if (f.minRating > 0 && p.rating < f.minRating) return false
    if (q) {
      const hay = [
        p.name,
        p.honorific,
        p.credentials,
        p.location.city,
        p.location.region,
        p.location.neighborhood ?? '',
        ...p.specialtiesSw,
        ...p.specialtiesEn,
      ]
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export type SortKey = 'relevance' | 'rating' | 'fee_low' | 'fee_high'

export function sortProviders(providers: Provider[], key: SortKey): Provider[] {
  const arr = [...providers]
  switch (key) {
    case 'rating':
      arr.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
      break
    case 'fee_low':
      arr.sort((a, b) => a.feeTzs - b.feeTzs)
      break
    case 'fee_high':
      arr.sort((a, b) => b.feeTzs - a.feeTzs)
      break
    case 'relevance':
    default:
      arr.sort(
        (a, b) =>
          Number(b.accepting) - Number(a.accepting) ||
          b.rating - a.rating ||
          b.reviewsCount - a.reviewsCount,
      )
  }
  return arr
}
