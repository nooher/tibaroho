// refRanges.ts — seed reference ranges for ~50 lab tests used in Tanzania
// clinics. Source citations are documentary — not legal — guidance.
// For qualitative tests ref_low/ref_high are undefined and interpretLab
// must short-circuit on the qualitative branch.

export interface RefRange {
  id: string
  name_sw: string
  name_en: string
  unit: string
  ref_low?: number
  ref_high?: number
  critical_low?: number
  critical_high?: number
  qualitative?: boolean
  source: string
}

export const REF_RANGES: RefRange[] = [
  // ── CBC ────────────────────────────────────────────────────────────
  { id: 'wbc', name_sw: 'Chembe nyeupe za damu (WBC)', name_en: 'White blood cells', unit: '10^9/L', ref_low: 4.0, ref_high: 11.0, critical_low: 1.5, critical_high: 30, source: 'WHO 2021 hematology' },
  { id: 'rbc', name_sw: 'Chembe nyekundu za damu (RBC)', name_en: 'Red blood cells', unit: '10^12/L', ref_low: 4.0, ref_high: 5.5, source: 'WHO 2021 hematology' },
  { id: 'hb', name_sw: 'Hemoglobini (Hb)', name_en: 'Hemoglobin', unit: 'g/dL', ref_low: 12.0, ref_high: 16.0, critical_low: 7.0, critical_high: 20, source: 'Tanzania STG 2023' },
  { id: 'hct', name_sw: 'Hematokriti (HCT)', name_en: 'Hematocrit', unit: '%', ref_low: 36, ref_high: 48, source: 'WHO 2021 hematology' },
  { id: 'plt', name_sw: 'Vipande (PLT)', name_en: 'Platelets', unit: '10^9/L', ref_low: 150, ref_high: 400, critical_low: 50, critical_high: 1000, source: 'WHO 2021 hematology' },
  { id: 'mcv', name_sw: 'MCV', name_en: 'Mean corpuscular volume', unit: 'fL', ref_low: 80, ref_high: 100, source: 'NIH MedlinePlus' },
  { id: 'mch', name_sw: 'MCH', name_en: 'Mean corpuscular hemoglobin', unit: 'pg', ref_low: 27, ref_high: 33, source: 'NIH MedlinePlus' },
  { id: 'mchc', name_sw: 'MCHC', name_en: 'Mean corpuscular hemoglobin concentration', unit: 'g/dL', ref_low: 32, ref_high: 36, source: 'NIH MedlinePlus' },
  { id: 'neut_pct', name_sw: 'Asilimia ya Neutrofili', name_en: 'Neutrophils %', unit: '%', ref_low: 40, ref_high: 70, source: 'NIH MedlinePlus' },
  { id: 'lymph_pct', name_sw: 'Asilimia ya Lymphocyte', name_en: 'Lymphocytes %', unit: '%', ref_low: 20, ref_high: 45, source: 'NIH MedlinePlus' },

  // ── Liver ──────────────────────────────────────────────────────────
  { id: 'alt', name_sw: 'ALT', name_en: 'Alanine aminotransferase', unit: 'U/L', ref_low: 7, ref_high: 56, critical_high: 1000, source: 'NIH MedlinePlus' },
  { id: 'ast', name_sw: 'AST', name_en: 'Aspartate aminotransferase', unit: 'U/L', ref_low: 10, ref_high: 40, critical_high: 1000, source: 'NIH MedlinePlus' },
  { id: 'alp', name_sw: 'ALP', name_en: 'Alkaline phosphatase', unit: 'U/L', ref_low: 44, ref_high: 147, source: 'NIH MedlinePlus' },
  { id: 'ggt', name_sw: 'GGT', name_en: 'Gamma-glutamyl transferase', unit: 'U/L', ref_low: 9, ref_high: 48, source: 'NIH MedlinePlus' },
  { id: 'tbil', name_sw: 'Bilirubini jumla', name_en: 'Total bilirubin', unit: 'mg/dL', ref_low: 0.1, ref_high: 1.2, critical_high: 15, source: 'NIH MedlinePlus' },
  { id: 'albumin', name_sw: 'Albumini', name_en: 'Albumin', unit: 'g/dL', ref_low: 3.5, ref_high: 5.0, source: 'NIH MedlinePlus' },
  { id: 'total_protein', name_sw: 'Protini jumla', name_en: 'Total protein', unit: 'g/dL', ref_low: 6.0, ref_high: 8.3, source: 'NIH MedlinePlus' },

  // ── Renal / Electrolytes ───────────────────────────────────────────
  { id: 'creatinine', name_sw: 'Kretinini', name_en: 'Creatinine', unit: 'mg/dL', ref_low: 0.6, ref_high: 1.3, critical_high: 8, source: 'KDIGO 2024' },
  { id: 'urea', name_sw: 'Urea (BUN)', name_en: 'Blood urea nitrogen', unit: 'mg/dL', ref_low: 7, ref_high: 20, critical_high: 100, source: 'KDIGO 2024' },
  { id: 'egfr', name_sw: 'eGFR', name_en: 'Estimated GFR', unit: 'mL/min/1.73m^2', ref_low: 90, critical_low: 15, source: 'KDIGO 2024' },
  { id: 'k', name_sw: 'Potasiamu (K)', name_en: 'Potassium', unit: 'mmol/L', ref_low: 3.5, ref_high: 5.0, critical_low: 2.5, critical_high: 6.5, source: 'Tanzania STG 2023' },
  { id: 'na', name_sw: 'Sodiamu (Na)', name_en: 'Sodium', unit: 'mmol/L', ref_low: 135, ref_high: 145, critical_low: 120, critical_high: 160, source: 'Tanzania STG 2023' },
  { id: 'cl', name_sw: 'Kloridi (Cl)', name_en: 'Chloride', unit: 'mmol/L', ref_low: 98, ref_high: 107, source: 'NIH MedlinePlus' },
  { id: 'ca', name_sw: 'Kalsiamu (Ca)', name_en: 'Calcium', unit: 'mg/dL', ref_low: 8.6, ref_high: 10.2, critical_low: 6, critical_high: 13, source: 'NIH MedlinePlus' },
  { id: 'p', name_sw: 'Fosforasi (P)', name_en: 'Phosphate', unit: 'mg/dL', ref_low: 2.5, ref_high: 4.5, source: 'NIH MedlinePlus' },
  { id: 'mg', name_sw: 'Magnesiamu (Mg)', name_en: 'Magnesium', unit: 'mg/dL', ref_low: 1.7, ref_high: 2.2, source: 'NIH MedlinePlus' },

  // ── Glucose / Lipids ───────────────────────────────────────────────
  { id: 'fasting_glucose', name_sw: 'Sukari ya damu (mfungo)', name_en: 'Fasting glucose', unit: 'mg/dL', ref_low: 70, ref_high: 99, critical_low: 40, critical_high: 400, source: 'Tanzania STG 2023' },
  { id: 'hba1c', name_sw: 'HbA1c', name_en: 'Glycated hemoglobin', unit: '%', ref_low: 4.0, ref_high: 5.6, critical_high: 14, source: 'Tanzania STG 2023' },
  { id: 'tc', name_sw: 'Kolestoroli jumla', name_en: 'Total cholesterol', unit: 'mg/dL', ref_high: 200, source: 'NIH MedlinePlus' },
  { id: 'ldl', name_sw: 'LDL', name_en: 'Low-density lipoprotein', unit: 'mg/dL', ref_high: 100, source: 'NIH MedlinePlus' },
  { id: 'hdl', name_sw: 'HDL', name_en: 'High-density lipoprotein', unit: 'mg/dL', ref_low: 40, source: 'NIH MedlinePlus' },
  { id: 'tg', name_sw: 'Trigliserides', name_en: 'Triglycerides', unit: 'mg/dL', ref_high: 150, source: 'NIH MedlinePlus' },

  // ── Urinalysis ─────────────────────────────────────────────────────
  { id: 'urine_ph', name_sw: 'pH ya mkojo', name_en: 'Urine pH', unit: '', ref_low: 4.5, ref_high: 8.0, source: 'NIH MedlinePlus' },
  { id: 'urine_sg', name_sw: 'Uzito wa mkojo (SG)', name_en: 'Urine specific gravity', unit: '', ref_low: 1.005, ref_high: 1.030, source: 'NIH MedlinePlus' },
  { id: 'urine_protein', name_sw: 'Protini ya mkojo', name_en: 'Urine protein', unit: '', qualitative: true, source: 'NIH MedlinePlus' },
  { id: 'urine_glucose', name_sw: 'Sukari ya mkojo', name_en: 'Urine glucose', unit: '', qualitative: true, source: 'NIH MedlinePlus' },
  { id: 'urine_leukocyte', name_sw: 'Leukocyte (mkojo)', name_en: 'Urine leukocyte esterase', unit: '', qualitative: true, source: 'NIH MedlinePlus' },
  { id: 'urine_nitrite', name_sw: 'Nitriti (mkojo)', name_en: 'Urine nitrite', unit: '', qualitative: true, source: 'NIH MedlinePlus' },

  // ── HIV / Hepatitis / TB / Malaria ─────────────────────────────────
  { id: 'cd4', name_sw: 'Hesabu ya CD4', name_en: 'CD4 count', unit: 'cells/uL', ref_low: 500, critical_low: 200, source: 'Tanzania STG 2023' },
  { id: 'hiv_vl', name_sw: 'HIV viral load', name_en: 'HIV viral load', unit: 'copies/mL', ref_high: 50, critical_high: 1000, source: 'NTLG 2022' },
  { id: 'hiv_ab', name_sw: 'Kingamwili za HIV', name_en: 'HIV antibody', unit: '', qualitative: true, source: 'NTLG 2022' },
  { id: 'hbsag', name_sw: 'HBsAg', name_en: 'Hepatitis B surface antigen', unit: '', qualitative: true, source: 'WHO 2021 viral hepatitis' },
  { id: 'hcv_ab', name_sw: 'Kingamwili za HCV', name_en: 'Hepatitis C antibody', unit: '', qualitative: true, source: 'WHO 2021 viral hepatitis' },
  { id: 'malaria_rdt', name_sw: 'RDT ya malaria', name_en: 'Malaria rapid diagnostic test', unit: '', qualitative: true, source: 'Tanzania STG 2023' },
  { id: 'tb_afb', name_sw: 'AFB ya makohozi (TB)', name_en: 'TB sputum AFB smear', unit: '', qualitative: true, source: 'NTLG 2022' },

  // ── Coagulation ───────────────────────────────────────────────────
  { id: 'inr', name_sw: 'INR', name_en: 'International normalized ratio', unit: '', ref_low: 0.8, ref_high: 1.1, critical_high: 5, source: 'NIH MedlinePlus' },
  { id: 'pt', name_sw: 'PT', name_en: 'Prothrombin time', unit: 's', ref_low: 11, ref_high: 13.5, source: 'NIH MedlinePlus' },
  { id: 'aptt', name_sw: 'aPTT', name_en: 'Activated partial thromboplastin time', unit: 's', ref_low: 25, ref_high: 35, source: 'NIH MedlinePlus' },
]

export type LabFlag = 'low' | 'normal' | 'high' | 'critical' | 'unknown'

export interface LabInterpretation {
  flag: LabFlag
  message_sw: string
  message_en: string
}

/** Interpret a value vs a reference range. Handles qualitative tests too. */
export function interpretLab(value: number | string, range: RefRange): LabInterpretation {
  if (range.qualitative) {
    const s = String(value).trim().toLowerCase()
    const positive = /(positive|chanya|reactive|pos|\+)/.test(s)
    const negative = /(negative|hasi|nonreactive|non-reactive|neg|-)/.test(s)
    if (positive) {
      return {
        flag: 'high',
        message_sw: `${range.name_sw}: matokeo CHANYA. Tafadhali jadili na daktari hatua zinazofuata.`,
        message_en: `${range.name_en}: POSITIVE. Please discuss next steps with your clinician.`,
      }
    }
    if (negative) {
      return {
        flag: 'normal',
        message_sw: `${range.name_sw}: matokeo HASI. Endelea na ushauri wa daktari kuhusu uchunguzi wa kuendelea.`,
        message_en: `${range.name_en}: NEGATIVE. Continue with clinician's guidance on follow-up.`,
      }
    }
    return {
      flag: 'unknown',
      message_sw: `${range.name_sw}: matokeo yanahitaji tafsiri ya daktari.`,
      message_en: `${range.name_en}: result needs clinician interpretation.`,
    }
  }
  const v = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(v)) {
    return { flag: 'unknown', message_sw: 'Thamani haijaeleweka.', message_en: 'Value not recognized.' }
  }
  if (range.critical_low !== undefined && v <= range.critical_low) {
    return {
      flag: 'critical',
      message_sw: `${range.name_sw} iko CHINI SANA (${v} ${range.unit}). Hii ni dharura — wasiliana na daktari haraka.`,
      message_en: `${range.name_en} CRITICALLY LOW (${v} ${range.unit}). Seek urgent clinical review.`,
    }
  }
  if (range.critical_high !== undefined && v >= range.critical_high) {
    return {
      flag: 'critical',
      message_sw: `${range.name_sw} iko JUU SANA (${v} ${range.unit}). Hii ni dharura — wasiliana na daktari haraka.`,
      message_en: `${range.name_en} CRITICALLY HIGH (${v} ${range.unit}). Seek urgent clinical review.`,
    }
  }
  if (range.ref_low !== undefined && v < range.ref_low) {
    return {
      flag: 'low',
      message_sw: `${range.name_sw} iko chini ya kawaida (${v} ${range.unit}, kawaida ≥ ${range.ref_low}).`,
      message_en: `${range.name_en} below reference (${v} ${range.unit}, ref ≥ ${range.ref_low}).`,
    }
  }
  if (range.ref_high !== undefined && v > range.ref_high) {
    return {
      flag: 'high',
      message_sw: `${range.name_sw} iko juu ya kawaida (${v} ${range.unit}, kawaida ≤ ${range.ref_high}).`,
      message_en: `${range.name_en} above reference (${v} ${range.unit}, ref ≤ ${range.ref_high}).`,
    }
  }
  return {
    flag: 'normal',
    message_sw: `${range.name_sw} iko ndani ya kawaida (${v} ${range.unit}).`,
    message_en: `${range.name_en} within reference (${v} ${range.unit}).`,
  }
}

export function findRangeByText(text: string): RefRange | undefined {
  const t = text.toLowerCase()
  return REF_RANGES.find((r) =>
    t.includes(r.id) ||
    t.includes(r.name_en.toLowerCase()) ||
    t.includes(r.name_sw.toLowerCase()),
  )
}
