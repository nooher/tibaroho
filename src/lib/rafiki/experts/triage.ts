// experts/triage.ts — routes user to Tier 0/1/2/3 based on PHQ-9/GAD-7/AUDIT/
// C-SSRS scores + free-text. Provides stepped-care recommendation.

import type { AssessmentScores, RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

/** WHO / DSM / standard cut-offs. */
export const PHQ9 = {
  minimal: [0, 4], mild: [5, 9], moderate: [10, 14], moderatelySevere: [15, 19], severe: [20, 27],
};
export const GAD7 = { minimal: [0, 4], mild: [5, 9], moderate: [10, 14], severe: [15, 21] };
export const AUDIT = { lowRisk: [0, 7], harmful: [8, 15], hazardous: [16, 19], dependence: [20, 40] };
export const CSSRS_URGENT_FROM = 4;

const RX = /\b(tier|hatua|nipi|niende wapi|level|score|triage|tatua|nimepata alama|i scored)\b/i;

type Tier = 0 | 1 | 2 | 3;

function tierFor(s: AssessmentScores | undefined): { tier: Tier; reason: string } {
  if (!s) return { tier: 0, reason: 'Hakuna alama bado — anza tathmini.' };
  if ((s.cssrs ?? 0) >= CSSRS_URGENT_FROM)
    return { tier: 3, reason: 'C-SSRS inaonyesha hatari ya haraka.' };
  if ((s.phq9 ?? 0) >= 20 || (s.gad7 ?? 0) >= 15 || (s.audit ?? 0) >= 20)
    return { tier: 3, reason: 'Alama kali — unahitaji mtaalamu wa afya ya akili.' };
  if ((s.phq9 ?? 0) >= 15 || (s.gad7 ?? 0) >= 10 || (s.audit ?? 0) >= 16)
    return { tier: 2, reason: 'Wastani-kali — mpango wa kitabibu unaweza kusaidia.' };
  if ((s.phq9 ?? 0) >= 5 || (s.gad7 ?? 0) >= 5 || (s.audit ?? 0) >= 8)
    return { tier: 1, reason: 'Mwanga-wastani — programu fupi (PM+, Friendship Bench).' };
  return { tier: 0, reason: 'Alama nzuri — endelea kujijali (kujifunza, usingizi, mazoezi).' };
}

const TIER_DESC_SW: Record<Tier, string> = {
  0: 'Hatua 0 — Kujijali: kupumzika, mazoezi, mtandao wa familia.',
  1: 'Hatua 1 — Programu fupi za nje ya hospitali (PM+, Friendship Bench, CETA-lite).',
  2: 'Hatua 2 — Tiba ya kisaikolojia inayoongozwa (CBT/IPT) na mfuatiliaji.',
  3: 'Hatua 3 — Mtaalamu wa afya ya akili na/au tiba ya dharura.',
};

const TIER_DESC_EN: Record<Tier, string> = {
  0: 'Tier 0 — Self-care: rest, exercise, social support.',
  1: 'Tier 1 — Brief community programs (PM+, Friendship Bench, CETA-lite).',
  2: 'Tier 2 — Guided psychological therapy (CBT/IPT) with a clinician.',
  3: 'Tier 3 — Specialist mental-health clinician and/or urgent care.',
};

export const triageExpert: RafikiExpert = {
  id: 'roho-triage',
  domain: 'triage',
  label: 'Tatua',
  match(q: RafikiQuery): number {
    if (q.assessments && Object.keys(q.assessments).length > 0) return 0.9;
    if (RX.test(q.text)) return 0.7;
    return 0;
  },
  answer(q: RafikiQuery): RafikiAnswer {
    const { tier, reason } = tierFor(q.assessments);
    return {
      domain: 'triage',
      expert: 'roho-triage',
      mode: q.mode ?? 'mwenza',
      confidence: 'high',
      text: {
        sw:
          `Kulingana na unayonieleza, mapendekezo yangu: ${TIER_DESC_SW[tier]}\n\n` +
          `Sababu: ${reason}\n\n` +
          'Hizi ni mapendekezo, si utambuzi. Daktari ataweza kuthibitisha.',
        en:
          `Based on what you shared, my recommendation: ${TIER_DESC_EN[tier]}\n\n` +
          `Why: ${reason}\n\n` +
          'These are recommendations, not a diagnosis. A clinician can confirm.',
      },
      sources: [
        { label: 'WHO mhGAP-IG v2', ref: 'WHO' },
        { label: 'PHQ-9 / GAD-7 / AUDIT', ref: 'standardized scoring' },
        { label: 'C-SSRS', ref: 'Columbia Lighthouse Project' },
      ],
      data: { tier, scores: q.assessments },
      followUps:
        tier >= 2
          ? ['Nipange miadi na mtaalamu', 'Nipe orodha ya hospitali karibu nami']
          : ['Anza programu ya PM+', 'Nifundishe stadi ya kupumua'],
    };
  },
};
