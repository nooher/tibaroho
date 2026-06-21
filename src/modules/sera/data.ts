/**
 * Sera (Policy & Ministry) — mock regional data.
 * Backend-wire flag: TODO — replace with Supabase `mh_region_metrics` view.
 */
export interface RegionMetric {
  id: string
  name: string
  /** Simplified polygon — single point approximation for the SVG silhouette. */
  cx: number
  cy: number
  /** Approx PHQ-9 mean (0–27). Mock. */
  phq9Mean: number
  /** Screening reach as % of adult pop (mock). */
  screeningReach: number
  /** Treatment engagement %. */
  treatmentEngagement: number
  /** 12-week remission rate %. */
  remission12wk: number
  /** Suicide attempts per 100k (mock). */
  suicideRate: number
  /** Providers per 100k (mock). */
  providerDensity: number
  /** MoH framework status. */
  framework: 'signed' | 'pending' | 'inProgress'
}

/**
 * Tanzania regions (26). Coordinates are simplified centroids
 * laid out on a 600×600 viewBox approximating Tanzania's outline.
 * NOT geodetically accurate — they preserve relative positions for
 * a presentable national map. Backend will replace with real GeoJSON.
 */
export const REGIONS: RegionMetric[] = [
  { id: 'dar',       name: 'Dar es Salaam', cx: 470, cy: 360, phq9Mean: 11.2, screeningReach: 18, treatmentEngagement: 41, remission12wk: 32, suicideRate: 9.4, providerDensity: 4.1, framework: 'signed' },
  { id: 'arusha',    name: 'Arusha',        cx: 380, cy: 180, phq9Mean: 8.4,  screeningReach: 22, treatmentEngagement: 38, remission12wk: 36, suicideRate: 6.1, providerDensity: 2.8, framework: 'signed' },
  { id: 'mwanza',    name: 'Mwanza',        cx: 240, cy: 200, phq9Mean: 9.8,  screeningReach: 14, treatmentEngagement: 29, remission12wk: 27, suicideRate: 7.7, providerDensity: 1.9, framework: 'inProgress' },
  { id: 'dodoma',    name: 'Dodoma',        cx: 340, cy: 320, phq9Mean: 9.1,  screeningReach: 16, treatmentEngagement: 33, remission12wk: 30, suicideRate: 6.8, providerDensity: 2.1, framework: 'signed' },
  { id: 'mbeya',     name: 'Mbeya',         cx: 230, cy: 460, phq9Mean: 10.2, screeningReach: 13, treatmentEngagement: 27, remission12wk: 25, suicideRate: 8.2, providerDensity: 1.6, framework: 'pending' },
  { id: 'tabora',    name: 'Tabora',        cx: 250, cy: 300, phq9Mean: 9.4,  screeningReach: 11, treatmentEngagement: 24, remission12wk: 22, suicideRate: 7.1, providerDensity: 1.3, framework: 'pending' },
  { id: 'tanga',     name: 'Tanga',         cx: 460, cy: 240, phq9Mean: 8.7,  screeningReach: 17, treatmentEngagement: 34, remission12wk: 31, suicideRate: 5.9, providerDensity: 2.0, framework: 'signed' },
  { id: 'pwani',     name: 'Pwani',         cx: 450, cy: 340, phq9Mean: 9.0,  screeningReach: 15, treatmentEngagement: 30, remission12wk: 28, suicideRate: 6.5, providerDensity: 1.8, framework: 'inProgress' },
  { id: 'iringa',    name: 'Iringa',        cx: 290, cy: 420, phq9Mean: 9.6,  screeningReach: 12, treatmentEngagement: 26, remission12wk: 24, suicideRate: 7.0, providerDensity: 1.5, framework: 'pending' },
  { id: 'kigoma',    name: 'Kigoma',        cx: 130, cy: 290, phq9Mean: 11.6, screeningReach: 9,  treatmentEngagement: 20, remission12wk: 18, suicideRate: 9.1, providerDensity: 0.9, framework: 'pending' },
  { id: 'kili',      name: 'Kilimanjaro',   cx: 430, cy: 200, phq9Mean: 8.0,  screeningReach: 24, treatmentEngagement: 42, remission12wk: 39, suicideRate: 5.4, providerDensity: 3.0, framework: 'signed' },
  { id: 'lindi',     name: 'Lindi',         cx: 460, cy: 460, phq9Mean: 9.9,  screeningReach: 10, treatmentEngagement: 22, remission12wk: 20, suicideRate: 7.6, providerDensity: 1.1, framework: 'pending' },
  { id: 'manyara',   name: 'Manyara',       cx: 360, cy: 240, phq9Mean: 8.9,  screeningReach: 14, treatmentEngagement: 28, remission12wk: 26, suicideRate: 6.4, providerDensity: 1.7, framework: 'inProgress' },
  { id: 'mara',      name: 'Mara',          cx: 280, cy: 150, phq9Mean: 9.5,  screeningReach: 12, treatmentEngagement: 25, remission12wk: 23, suicideRate: 7.3, providerDensity: 1.4, framework: 'inProgress' },
  { id: 'mtwara',    name: 'Mtwara',        cx: 480, cy: 500, phq9Mean: 10.3, screeningReach: 11, treatmentEngagement: 23, remission12wk: 21, suicideRate: 7.9, providerDensity: 1.2, framework: 'pending' },
  { id: 'pemba',     name: 'Pemba',         cx: 510, cy: 290, phq9Mean: 8.6,  screeningReach: 19, treatmentEngagement: 36, remission12wk: 33, suicideRate: 5.7, providerDensity: 2.4, framework: 'signed' },
  { id: 'unguja',    name: 'Unguja',        cx: 510, cy: 330, phq9Mean: 8.8,  screeningReach: 20, treatmentEngagement: 37, remission12wk: 34, suicideRate: 5.6, providerDensity: 2.5, framework: 'signed' },
  { id: 'rukwa',     name: 'Rukwa',         cx: 170, cy: 420, phq9Mean: 10.1, screeningReach: 10, treatmentEngagement: 21, remission12wk: 19, suicideRate: 8.0, providerDensity: 1.0, framework: 'pending' },
  { id: 'ruvuma',    name: 'Ruvuma',        cx: 360, cy: 510, phq9Mean: 9.7,  screeningReach: 12, treatmentEngagement: 24, remission12wk: 22, suicideRate: 7.4, providerDensity: 1.3, framework: 'pending' },
  { id: 'shinyanga', name: 'Shinyanga',     cx: 250, cy: 240, phq9Mean: 9.3,  screeningReach: 13, treatmentEngagement: 27, remission12wk: 25, suicideRate: 7.0, providerDensity: 1.5, framework: 'inProgress' },
  { id: 'singida',   name: 'Singida',       cx: 310, cy: 290, phq9Mean: 9.0,  screeningReach: 13, treatmentEngagement: 28, remission12wk: 26, suicideRate: 6.7, providerDensity: 1.6, framework: 'inProgress' },
  { id: 'geita',     name: 'Geita',         cx: 200, cy: 220, phq9Mean: 10.0, screeningReach: 10, treatmentEngagement: 22, remission12wk: 20, suicideRate: 8.1, providerDensity: 1.1, framework: 'pending' },
  { id: 'katavi',    name: 'Katavi',        cx: 180, cy: 360, phq9Mean: 10.5, screeningReach: 8,  treatmentEngagement: 19, remission12wk: 17, suicideRate: 8.7, providerDensity: 0.8, framework: 'pending' },
  { id: 'njombe',    name: 'Njombe',        cx: 290, cy: 470, phq9Mean: 9.8,  screeningReach: 12, treatmentEngagement: 25, remission12wk: 23, suicideRate: 7.5, providerDensity: 1.4, framework: 'pending' },
  { id: 'simiyu',    name: 'Simiyu',        cx: 290, cy: 210, phq9Mean: 9.7,  screeningReach: 11, treatmentEngagement: 24, remission12wk: 22, suicideRate: 7.4, providerDensity: 1.3, framework: 'pending' },
  { id: 'songwe',    name: 'Songwe',        cx: 200, cy: 460, phq9Mean: 10.4, screeningReach: 9,  treatmentEngagement: 21, remission12wk: 19, suicideRate: 8.3, providerDensity: 1.0, framework: 'pending' },
]

export const NATIONAL = {
  rolloutPct: 38,
  enrolment: 142_330,
  remissionRate12wk: 27.4,
  costPerRemissionUSD: 184,
  equityGap: 0.31, // ratio of best:worst region remission
  workforceCoverage: 0.42, // % of districts with ≥1 trained lay counsellor
  frameworkSignings: REGIONS.filter((r) => r.framework === 'signed').length,
  crisisEventsYoY: -0.08, // -8% vs last year
}

/** Color a PHQ-9 mean against a 5-band cream-compatible scale. */
export function phq9Color(mean: number): string {
  if (mean < 8) return '#2E5E64'        // teal — low
  if (mean < 9) return '#3F6B70'        // mid-low
  if (mean < 10) return '#B8951F'       // gold — mid
  if (mean < 11) return '#9C5A1F'       // amber — elevated
  return '#5E1F3E'                       // maroon — high
}

export const FRAMEWORK_LABEL: Record<RegionMetric['framework'], { sw: string; en: string; color: string }> = {
  signed:     { sw: 'Imesainiwa',     en: 'Signed',      color: '#2E5E64' },
  inProgress: { sw: 'Inaendelea',     en: 'In progress', color: '#B8951F' },
  pending:    { sw: 'Inasubiri',      en: 'Pending',     color: '#5E1F3E' },
}
