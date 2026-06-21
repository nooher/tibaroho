// karibu/lib/risk.ts — risk classification from scores + flags + conditions.
// Source: PHQ-9 (Kroenke 2001), GAD-7 (Spitzer 2006), AUDIT (WHO 2001),
// C-SSRS (Posner 2011), EPDS (Cox 1987), CRAFFT (Knight 2002).

import type { KaribuProfile } from './storage';

export type RiskTier = 'chini' | 'wastani' | 'juu' | 'dharura';

export interface RiskAssessment {
  tier: RiskTier;
  reasons_sw: string[];
  reasons_en: string[];
  ercRequired: boolean;     // emergency referral required
  source: string;
}

export function classifyRisk(p: KaribuProfile): RiskAssessment {
  const reasons_sw: string[] = [];
  const reasons_en: string[] = [];
  let tier: RiskTier = 'chini';
  let erc = false;

  const a = p.step4;
  if (a) {
    if (a.phq9.total >= 20) { reasons_sw.push('Mfadhaiko mkali (PHQ-9 ≥20)'); reasons_en.push('Severe depression (PHQ-9 ≥20)'); tier = 'juu'; }
    else if (a.phq9.total >= 15) { reasons_sw.push('Mfadhaiko wa kati (PHQ-9 15–19)'); reasons_en.push('Moderately severe depression'); tier = tier === 'chini' ? 'wastani' : tier; }
    else if (a.phq9.total >= 10) { reasons_sw.push('Mfadhaiko hafifu-wastani (PHQ-9 10–14)'); reasons_en.push('Moderate depression'); tier = tier === 'chini' ? 'wastani' : tier; }

    // PHQ-9 item 9 (suicidality) is index 8
    if (a.phq9.items[8] >= 1) { reasons_sw.push('Mawazo ya kujidhuru (PHQ-9 swali 9)'); reasons_en.push('Suicidal thoughts (PHQ-9 #9)'); tier = 'juu'; }

    if (a.gad7.total >= 15) { reasons_sw.push('Wasiwasi mkali (GAD-7 ≥15)'); reasons_en.push('Severe anxiety'); tier = tier === 'chini' ? 'wastani' : tier; }
    else if (a.gad7.total >= 10) { reasons_sw.push('Wasiwasi wa kati (GAD-7 10–14)'); reasons_en.push('Moderate anxiety'); }

    if (a.audit.total >= 20) { reasons_sw.push('Tegemezi ya pombe inawezekana (AUDIT ≥20)'); reasons_en.push('Likely alcohol dependence'); tier = tier === 'chini' ? 'wastani' : tier; }
    else if (a.audit.total >= 16) { reasons_sw.push('Pombe ya hatari (AUDIT 16–19)'); reasons_en.push('Harmful drinking'); }
    else if (a.audit.total >= 8) { reasons_sw.push('Pombe ya wasiwasi (AUDIT 8–15)'); reasons_en.push('Hazardous drinking'); }

    // C-SSRS — any "yes" on items 4/5 (active ideation with plan/intent) is emergency
    if (a.cssrs.total >= 4) { reasons_sw.push('C-SSRS: nia/mpango wa kujidhuru'); reasons_en.push('C-SSRS active ideation/plan'); tier = 'dharura'; erc = true; }
    else if (a.cssrs.total >= 2) { reasons_sw.push('C-SSRS: mawazo ya kujidhuru'); reasons_en.push('C-SSRS suicidal ideation'); if ((tier as RiskTier) !== 'dharura') tier = 'juu'; }

    if (a.epds && a.epds.total >= 13) { reasons_sw.push('Mfadhaiko wa kuzaa unaowezekana (EPDS ≥13)'); reasons_en.push('Likely perinatal depression'); if (tier === 'chini') tier = 'wastani'; }
    if (a.epds && a.epds.items[9] >= 1) { reasons_sw.push('EPDS swali 10: mawazo ya kujidhuru'); reasons_en.push('EPDS #10 self-harm'); tier = 'juu'; }

    if (a.crafft && a.crafft.total >= 2) { reasons_sw.push('CRAFFT chanya — utumiaji wa vileo unahitaji tathmini'); reasons_en.push('CRAFFT positive — substance use needs assessment'); if (tier === 'chini') tier = 'wastani'; }
  }

  const c = p.step3?.conditions ?? [];
  if (c.includes('saratani')) { reasons_sw.push('Saratani — tathmini ya hisia/maumivu'); reasons_en.push('Cancer — emotional/pain workup'); if (tier === 'chini') tier = 'wastani'; }
  if (c.includes('figo') && p.step3?.dialysis) { reasons_sw.push('Dialysis — mzigo wa kihisia ni mkubwa'); reasons_en.push('Dialysis — high emotional burden'); if (tier === 'chini') tier = 'wastani'; }
  if (p.step3?.pregnant && a && a.phq9.total >= 10) { reasons_sw.push('Mimba + dalili za mfadhaiko'); reasons_en.push('Pregnancy + depressive symptoms'); if (tier === 'chini') tier = 'wastani'; }

  if (p.step5?.ipv === 'sasa') { reasons_sw.push('Unyanyasaji wa karibu unaoendelea'); reasons_en.push('Current IPV'); tier = 'dharura'; erc = true; }
  if (p.step5?.housing === 'shida') { reasons_sw.push('Tatizo la makazi'); reasons_en.push('Housing instability'); if (tier === 'chini') tier = 'wastani'; }

  return {
    tier,
    reasons_sw,
    reasons_en,
    ercRequired: erc,
    source: 'PHQ-9 + GAD-7 + AUDIT + C-SSRS + EPDS + CRAFFT (validated thresholds)',
  };
}
