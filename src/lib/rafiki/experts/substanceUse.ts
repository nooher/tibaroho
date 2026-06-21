// experts/substanceUse.ts — AUDIT-routed brief intervention + MI + harm reduction.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';
import { AUDIT } from './triage';

const RX = /(pombe|kileo|alcohol|drink|sigara|tobacco|smoking|bangi|cannabis|weed|cocaine|heroin|miraa|khat|kujivuta|kulewa)/i;

interface BriefIntervention {
  zone: 'low' | 'harmful' | 'hazardous' | 'dependence';
  sw: string;
  en: string;
}

function classifyAudit(score: number | undefined): BriefIntervention {
  const s = score ?? 0;
  if (s <= AUDIT.lowRisk[1]) {
    return {
      zone: 'low',
      sw: 'Matumizi yako yapo katika ngazi ya hatari ndogo. Endelea hivyo — fahamu mipaka yako.',
      en: 'Your use is in the low-risk zone. Keep it that way — know your limits.',
    };
  }
  if (s <= AUDIT.harmful[1]) {
    return {
      zone: 'harmful',
      sw:
        'Matumizi yako yapo katika hatari ya wastani. Hili linaweza kuathiri afya, kazi, na mahusiano. ' +
        'Pendekezo: punguza siku za kunywa, weka kikomo cha vinywaji, achana na pombe siku 2 kwa wiki.',
      en:
        'Your use is at moderate risk. This can affect health, work, relationships. ' +
        'Suggestion: reduce drinking days, set drink limits, take 2 alcohol-free days per week.',
    };
  }
  if (s <= AUDIT.hazardous[1]) {
    return {
      zone: 'hazardous',
      sw:
        'Matumizi yako yapo katika hatari kubwa. Naomba uone mtaalamu wa afya. ' +
        'Hatua za kuanza: andika kila kinywaji, pata mshirika wa kuwajibisha.',
      en:
        'Your use is at high risk. Please see a clinician. ' +
        'First steps: log every drink, find an accountability partner.',
    };
  }
  return {
    zone: 'dependence',
    sw:
      'Alama zinaonyesha uwezekano wa utegemezi. Hii inahitaji msaada wa kitabibu — kuacha ghafla ' +
      'pombe kunaweza kuwa hatari (seizures). Tafadhali ona daktari kabla ya kuacha.',
    en:
      'Scores suggest possible dependence. This needs medical support — abrupt alcohol cessation ' +
      'can be dangerous (seizures). Please see a doctor before stopping.',
  };
}

const HARM_REDUCTION_SW = [
  'Kunywa maji kati ya vinywaji.',
  'Usinywe na tumbo tupu.',
  'Mtu mmoja anajua uko wapi.',
  'Usiendeshe gari ukiwa umelewa.',
  'Sindano safi kila wakati (kwa wanaotumia).',
];

const HARM_REDUCTION_EN = [
  'Drink water between drinks.',
  'Never on an empty stomach.',
  'Someone knows where you are.',
  'Do not drive after drinking.',
  'Always clean needles (for those who inject).',
];

export const substanceUseExpert: RafikiExpert = {
  id: 'roho-substance',
  domain: 'substanceUse',
  label: 'Kileo',
  match(q) {
    if (typeof q.assessments?.audit === 'number') return 0.85;
    if (RX.test(q.text)) return 0.7;
    return 0;
  },
  answer(q): RafikiAnswer {
    const bi = classifyAudit(q.assessments?.audit);
    const sw =
      `${bi.sw}\n\n` +
      'Stadi za kupunguza madhara:\n' +
      HARM_REDUCTION_SW.map((s) => `• ${s}`).join('\n') +
      '\n\nWewe ndiye unayejua maisha yako. Sitakuhukumu — ungependa kuongea kuhusu hatua gani?';
    const en =
      `${bi.en}\n\n` +
      'Harm-reduction skills:\n' +
      HARM_REDUCTION_EN.map((s) => `• ${s}`).join('\n') +
      '\n\nYou know your life best. No judgement — what step would you like to discuss?';
    return {
      domain: 'substanceUse',
      expert: 'roho-substance',
      mode: q.mode ?? 'mwenza',
      confidence: 'high',
      text: { sw, en },
      sources: [
        { label: 'AUDIT', ref: 'WHO' },
        { label: 'SBIRT — Brief Intervention' },
        { label: 'MI — Miller & Rollnick' },
      ],
      data: { auditZone: bi.zone },
      followUps: ['Anza shajara ya kunywa', 'Niunganishe na kikundi cha msaada'],
    };
  },
};
