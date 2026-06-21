/**
 * Tumaini · TBHOS lifecycle compass.
 *
 * Every module screen tags itself against one or more of these 9 stages.
 * The strip widget (LifecycleCompass) renders them as small dots above
 * the page content. Each stage is clickable and routes to a filtered
 * view in the matching module.
 */
import { JEWEL } from './glass'

export type LifecycleStageId =
  | 'kukuza'
  | 'kinga'
  | 'tambua'
  | 'tathmini'
  | 'hatua'
  | 'tiba'
  | 'dharura'
  | 'upyaji'
  | 'uendelevu'

export interface LifecycleStage {
  id: LifecycleStageId
  sw: string
  en: string
  color: string
  icon: 'sun' | 'shield' | 'magnify' | 'clipboard' | 'spark' | 'heart' | 'alert' | 'growth' | 'infinity'
  /** Where clicking this stage in the compass should land the user. */
  href: string
}

export const LIFECYCLE_STAGES: readonly LifecycleStage[] = [
  { id: 'kukuza',    sw: 'Kukuza',         en: 'Promotion',          color: JEWEL.tealMwenza,   icon: 'sun',       href: '/gundua' },
  { id: 'kinga',     sw: 'Kinga',          en: 'Prevention',         color: '#2E5E64',           icon: 'shield',    href: '/shuleplus' },
  { id: 'tambua',    sw: 'Tambua',         en: 'Detection',          color: JEWEL.goldHope,      icon: 'magnify',   href: '/huduma/tathmini' },
  { id: 'tathmini',  sw: 'Tathmini',       en: 'Diagnosis',          color: JEWEL.indigoWisdom,  icon: 'clipboard', href: '/huduma/icd11' },
  { id: 'hatua',     sw: 'Hatua za awali', en: 'Brief Intervention', color: '#3F6B70',           icon: 'spark',     href: '/miradi' },
  { id: 'tiba',      sw: 'Tiba',           en: 'Treatment',          color: JEWEL.tealMwenza,    icon: 'heart',     href: '/wataalam' },
  { id: 'dharura',   sw: 'Dharura',        en: 'Crisis',             color: JEWEL.maroonCrisis,  icon: 'alert',     href: '/huduma/rufaa' },
  { id: 'upyaji',    sw: 'Upyaji',         en: 'Recovery',           color: JEWEL.goldHope,      icon: 'growth',    href: '/mimi' },
  { id: 'uendelevu', sw: 'Uendelevu',      en: 'Maintenance',        color: '#2E5E64',           icon: 'infinity',  href: '/rafiki' },
] as const

export function findStage(id: LifecycleStageId): LifecycleStage | undefined {
  return LIFECYCLE_STAGES.find((s) => s.id === id)
}
