// karibu/lib/recommend.ts — turn profile into tracker bundle + care plan + Mwenza tone.

import type { KaribuProfile, KaribuTone } from './storage';
import { classifyRisk, type RiskTier } from './risk';

export interface CarePlanItem {
  id: string;
  title_sw: string;
  body_sw: string;
  source: string;
}

export interface Recommendation {
  trackers: string[];          // tracker ids to activate
  care_plan: CarePlanItem[];
  mwenza_mode: KaribuTone;
  risk_tier: RiskTier;
}

export function recommend(p: KaribuProfile): Recommendation {
  const risk = classifyRisk(p);
  const trackers = new Set<string>(['mood']);          // mood always on
  const plan: CarePlanItem[] = [];

  const c = p.step3?.conditions ?? [];
  if (c.includes('hiv')) {
    trackers.add('hiv'); trackers.add('dawa');
    plan.push({ id: 'art', title_sw: 'ART ya kila siku', body_sw: 'Meza ART kwa wakati ule ule kila siku. Lengo: viral load isiyoonekana (<50). U=U.',
      source: 'NACP Tanzania ART Guidelines 2023' });
  }
  if (c.includes('kisukari')) {
    trackers.add('sukari'); trackers.add('dawa');
    plan.push({ id: 'dm-control', title_sw: 'Udhibiti wa sukari', body_sw: 'Lengo HbA1c <7%, fasting 4-7 mmol/L. Andika sukari mara 2 kwa siku.',
      source: 'WHO PEN + Tanzania STG' });
  }
  if (c.includes('shinikizo')) {
    trackers.add('shinikizo'); trackers.add('dawa');
    plan.push({ id: 'bp-control', title_sw: 'Udhibiti wa shinikizo', body_sw: 'Lengo BP <140/90 (ICR <130/80). Pima BP nyumbani mara 1 kwa siku.',
      source: 'NICE NG136 + Tanzania STG' });
  }
  if (c.includes('pumu') || c.includes('copd')) {
    trackers.add('pumzi'); trackers.add('dawa');
    plan.push({ id: 'asthma', title_sw: 'Pumu/COPD', body_sw: 'Inhaler ya kuzuia kila siku. Inhaler ya dharura ikiwa pumzi inakuwa nzito.',
      source: 'GINA 2024 + GOLD 2024' });
  }
  if (c.includes('saratani')) {
    trackers.add('saratani'); trackers.add('maumivu'); trackers.add('dawa');
    plan.push({ id: 'cancer-symptom', title_sw: 'Ufuatiliaji wa saratani', body_sw: 'Andika maumivu, kichefuchefu, na uchovu kila siku. Mwambie daktari kabla ya kila chemo.',
      source: 'WHO Cancer Control + Tanzania STG' });
  }
  if (c.includes('figo')) {
    trackers.add('dawa'); trackers.add('shinikizo');
    if (p.step3?.dialysis) {
      trackers.add('dialysis');
      plan.push({ id: 'dialysis', title_sw: 'Dialysis ratiba', body_sw: 'Hudhuria session zote. Andika uzito kabla/baada, BP, na ulaji wa maji.',
        source: 'KDIGO Hemodialysis 2018' });
    } else {
      plan.push({ id: 'ckd', title_sw: 'Lishe ya CKD', body_sw: 'Punguza chumvi, fosforasi (nyama nyekundu), na potassium (ndizi, nazi). Kunywa maji kwa kiasi.',
        source: 'KDIGO 2024' });
    }
  }
  if (c.includes('tb')) {
    trackers.add('dawa');
    plan.push({ id: 'tb', title_sw: 'TB DOTS', body_sw: 'Meza RIPE kila siku miezi 2 + RH miezi 4. Hudhuria DOT clinic.',
      source: 'NTLP Tanzania 2023' });
  }
  if (c.includes('sicklecell')) {
    trackers.add('maumivu'); trackers.add('dawa');
  }
  if (c.includes('kifafa')) {
    trackers.add('dawa');
    plan.push({ id: 'epilepsy', title_sw: 'Kifafa', body_sw: 'Meza dawa kila siku. Epuka pombe na ukosefu wa usingizi.',
      source: 'WHO mhGAP EPI' });
  }
  if (c.includes('moyo')) {
    trackers.add('shinikizo'); trackers.add('dawa');
  }
  if (c.includes('anemia')) {
    trackers.add('dawa');
  }

  if (p.step3?.pregnant) {
    trackers.add('mimba');
    plan.push({ id: 'anc', title_sw: 'ANC visit 8', body_sw: 'Anza ANC kabla wiki 12. Folic acid 5mg + iron + tetanus + IPTp.',
      source: 'WHO ANC 2016 + Tanzania RCH' });
  }

  // Mood disorders dominate
  const phq = p.step4?.phq9.total ?? 0;
  const gad = p.step4?.gad7.total ?? 0;
  if (phq >= 10 || gad >= 10) {
    plan.push({ id: 'mh-basic', title_sw: 'Stadi za afya ya akili', body_sw: 'Stadi 3 kila siku: kupumua, kuandika hisia, na tendo moja zuri.',
      source: 'WHO mhGAP DEP/ANX' });
    trackers.add('mood');
  }

  // Substance
  const audit = p.step4?.audit.total ?? 0;
  if (audit >= 8) {
    trackers.add('tamaa');
    plan.push({ id: 'mi', title_sw: 'Motivational Interviewing', body_sw: 'Tafakari thamani zako: pombe inakuwezesha au inakuzuia?',
      source: 'Miller & Rollnick 2013' });
  }

  // Reasons-driven extras
  const reasons = p.step2?.reasons ?? [];
  if (reasons.includes('amani') || reasons.includes('najua tu')) {
    trackers.add('bidii');
  }

  // Mwenza tone — default to user choice or "shangazi" warmth
  const mwenza_mode: KaribuTone = p.step6?.tone ?? 'shangazi';

  if (risk.tier === 'dharura' || risk.ercRequired) {
    plan.unshift({ id: 'safety', title_sw: 'Mpango wa usalama', body_sw: 'Piga 112 au nenda hospitali sasa. Mwambie mtu wa duara la usalama.',
      source: 'WHO mhGAP SUI + Tanzania STG' });
  }

  return {
    trackers: Array.from(trackers),
    care_plan: plan,
    mwenza_mode,
    risk_tier: risk.tier,
  };
}
