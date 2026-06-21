// safety.ts — refusals, crisis detection, hotlines, clinical hand-off.
// Sovereign: rule-based keyword + sentiment. No external LLM.

import type {
  CrisisLevel,
  RafikiAnswer,
  RafikiExchange,
  RafikiQuery,
  RafikiSafety,
} from './types';

/** Tanzania hotlines. NOTE: marked verified=false where confirmation pending. */
export const TZ_HOTLINES: RafikiSafety['hotlines'] = [
  {
    name: 'Tanzania Police Emergency',
    number: '112',
    verified: true,
    scope: 'emergency',
  },
  {
    name: 'Muhimbili National Hospital — Mental Health',
    number: '+255 22 215 0302',
    verified: false,
    scope: 'suicide',
  },
  {
    name: 'Tanzania Lifeline (Suicide Prevention)',
    number: '0800 110014',
    verified: false,
    scope: 'suicide',
  },
  {
    name: 'TAMWA Gender-Based Violence Helpline',
    number: '0800 110055',
    verified: false,
    scope: 'ipv',
  },
  {
    name: 'C-Sema Child Helpline',
    number: '116',
    verified: true,
    scope: 'child',
  },
];

/**
 * Crisis keywords across Swahili (formal + mtaa) + English.
 * Matched as word fragments — case-insensitive.
 */
export const CRISIS_KEYWORDS_HIGH = [
  // Swahili — suicide
  'kujiua', 'najiua', 'nataka kufa', 'nichukulie roho', 'niuwe', 'kujinyonga',
  'kujikatakata', 'sina sababu ya kuishi', 'maisha hayana maana', 'kujidhuru',
  // Swahili — mtaa
  'nimechoka maisha', 'natamani kufa', 'kufa ni rahisi',
  // English
  'kill myself', 'suicide', 'end my life', 'want to die', 'cut myself',
  'self harm', 'self-harm', 'hang myself', 'no reason to live',
];

export const CRISIS_KEYWORDS_MED = [
  'kuumia', 'nimechoka sana', 'huzuni kubwa', 'nimevunjika moyo',
  'hopeless', 'worthless', 'helpless', 'overwhelmed', 'cannot cope',
  'hatuwezi kuvumilia', 'sina nguvu tena',
];

export const IPV_KEYWORDS = [
  'mume ananipiga', 'mke ananipiga', 'ananitishia', 'kunyanyaswa',
  'beats me', 'hits me', 'abused', 'threatening me', 'unsafe at home',
];

export const HARD_REFUSAL_PATTERNS = [
  // Diagnosis
  /\b(unidiagnose|nipa diagnosis|nigundue ugonjwa|diagnose me|what disease do i have)\b/i,
  // Prescription
  /\b(niandikie dawa|nipe dawa ya|prescribe|prescription for)\b/i,
  // Replace clinician
  /\b(badala ya daktari|usinipeleke kwa daktari|don't tell.*doctor|instead of (a )?doctor)\b/i,
  // Harm instructions
  /\b(how to (kill|hurt|harm|poison)|jinsi ya kuua|jinsi ya kujidhuru)\b/i,
];

const norm = (s: string) => (s ?? '').toLowerCase();

export function detectCrisis(text: string): CrisisLevel {
  const t = norm(text);
  if (!t.trim()) return 'safe';
  for (const k of CRISIS_KEYWORDS_HIGH) {
    if (t.includes(k)) return 'emergency';
  }
  // Multiple medium markers escalate to urgent.
  let medCount = 0;
  for (const k of CRISIS_KEYWORDS_MED) {
    if (t.includes(k)) medCount++;
  }
  if (medCount >= 2) return 'urgent';
  if (medCount === 1) return 'caution';
  return 'safe';
}

export function detectIPV(text: string): boolean {
  const t = norm(text);
  return IPV_KEYWORDS.some((k) => t.includes(k));
}

export function isHardRefusal(text: string): boolean {
  return HARD_REFUSAL_PATTERNS.some((rx) => rx.test(text));
}

/** Build a refusal RafikiAnswer for diagnosis/prescription/etc. */
export function refusalAnswer(q: RafikiQuery): RafikiAnswer {
  return {
    domain: 'jumla',
    expert: 'roho-safety',
    mode: q.mode ?? 'mwenza',
    confidence: 'high',
    text: {
      sw:
        'Naheshimu sana ulichoniuliza, lakini Mwenza haitoi utambuzi wa ugonjwa, ' +
        'maagizo ya dawa, wala maelekezo ya kujidhuru. Hayo ni kazi ya mtaalamu ' +
        'wa afya. Nitakusaidia kuandaa maelezo kwa mtaalamu, au tunaweza kuongea ' +
        'kuhusu hisia zako. Unapendelea lipi?',
      en:
        'I respect what you are asking, but Mwenza does not give medical diagnoses, ' +
        'prescriptions, or instructions for self-harm. Those belong with a clinician. ' +
        'I can help you prepare notes for a provider, or we can talk about how you ' +
        'are feeling. Which would help?',
    },
    sources: [{ label: 'Mwenza Safety Policy' }],
    followUps: [
      'Nisaidie kuandaa maelezo kwa daktari',
      'Hebu tuongee kuhusu hisia zangu',
    ],
  };
}

/** Build a crisis-level RafikiAnswer with hotlines and a safety-plan prompt. */
export function crisisAnswer(level: CrisisLevel, q: RafikiQuery): RafikiAnswer {
  const isEmergency = level === 'emergency';
  const sw = isEmergency
    ? 'Ninakusikia, na ninakujali sana. Maumivu unayohisi ni makubwa. ' +
      'Tafadhali wasiliana na msaada SASA HIVI:\n\n' +
      '• Polisi/Dharura: 112\n' +
      '• Lifeline (kujiua): 0800 110014\n' +
      '• Muhimbili Afya ya Akili: +255 22 215 0302\n\n' +
      'Kama uko karibu na mtu mwingine, mwambie unahitaji msaada sasa. ' +
      'Niko hapa nawe — twende hatua moja moja. Je, uko salama mahali ulipo?'
    : 'Ninasikia uzito wa unayopitia. Sijaribu kupunguza maumivu yako. ' +
      'Tunaweza kuyapanga pamoja. Ningependa kukuuliza maswali machache ' +
      'mafupi ili nielewe vyema (C-SSRS). Je, uko tayari?';

  const en = isEmergency
    ? 'I hear you, and I care. What you are feeling is heavy. Please reach out NOW:\n\n' +
      '• Police/Emergency: 112\n' +
      '• Lifeline (suicide): 0800 110014\n' +
      '• Muhimbili Mental Health: +255 22 215 0302\n\n' +
      'If someone is near you, tell them you need help now. ' +
      'I am here with you — one step at a time. Are you safe where you are?'
    : 'I hear how heavy this is. I am not minimizing it. We can take it together. ' +
      'May I ask you a few brief screening questions (C-SSRS) so I understand better?';

  return {
    domain: 'crisis',
    expert: 'roho-crisis',
    mode: 'mlinzi',
    confidence: 'high',
    text: { sw, en },
    sources: [
      { label: 'C-SSRS', ref: 'Columbia Lighthouse Project' },
      { label: 'Tanzania Hotlines', ref: 'Mwenza Safety KB' },
    ],
    crisis: {
      level,
      hotlines: TZ_HOTLINES.filter((h) => h.scope === 'suicide' || h.scope === 'emergency')
        .map(({ name, number, verified }) => ({ name, number, verified })),
      safetyPlanPrompt: true,
    },
    followUps: [
      'Niko salama kwa sasa',
      'Anza C-SSRS',
      'Nipigie simu ya msaada',
    ],
  };
}

/** Build a Swahili+English clinical brief from session history. */
export function generateClinicalBrief(history: RafikiExchange[]): {
  sw: string;
  en: string;
} {
  if (history.length === 0) {
    return {
      sw: 'Hakuna mazungumzo ya kushiriki kwa sasa.',
      en: 'No conversation history to share yet.',
    };
  }
  const turns = history.slice(-12);
  const concerns: string[] = [];
  const crises: string[] = [];
  for (const ex of turns) {
    if (ex.answer.crisis && ex.answer.crisis.level !== 'safe') {
      crises.push(`${ex.answer.crisis.level} — ${ex.query.text.slice(0, 120)}`);
    } else {
      concerns.push(`• ${ex.query.text.slice(0, 140)}`);
    }
  }
  const sw =
    'MUHTASARI WA KIBALOZI (kwa mtaalamu):\n\n' +
    `Idadi ya mazungumzo: ${turns.length}\n` +
    (crises.length
      ? `Viashiria vya hatari:\n${crises.map((c) => '• ' + c).join('\n')}\n\n`
      : '') +
    `Mada kuu zilizoongelewa:\n${concerns.slice(0, 8).join('\n')}\n\n` +
    'Hii ni muhtasari wa mazungumzo na Rafiki — sio utambuzi.';
  const en =
    'CLINICAL BRIEF (for provider):\n\n' +
    `Conversation turns: ${turns.length}\n` +
    (crises.length
      ? `Risk markers:\n${crises.map((c) => '• ' + c).join('\n')}\n\n`
      : '') +
    `Concerns discussed:\n${concerns.slice(0, 8).join('\n')}\n\n` +
    'This is a Mwenza conversation summary — not a diagnosis.';
  return { sw, en };
}

export const ROHO_SAFETY_CONFIG: RafikiSafety = {
  refusedDomains: ['diagnosis', 'prescription', 'replace-clinician', 'harm-instruction'],
  crisisKeywords: [...CRISIS_KEYWORDS_HIGH, ...CRISIS_KEYWORDS_MED],
  hotlines: TZ_HOTLINES,
};
