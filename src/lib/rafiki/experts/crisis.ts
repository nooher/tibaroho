// experts/crisis.ts — C-SSRS branching tree + safety plan + hotline routing.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';
import { TZ_HOTLINES, crisisAnswer, detectCrisis } from '../safety';

/** Real C-SSRS items, Swahili + English. */
export const CSSRS_ITEMS = [
  {
    id: 1,
    sw: 'Je, umewahi kutamani ulale na usiamke tena, au ufe?',
    en: 'Have you wished you were dead or wished you could go to sleep and not wake up?',
  },
  {
    id: 2,
    sw: 'Je, umewahi kuwa na mawazo ya kujiua?',
    en: 'Have you actually had any thoughts of killing yourself?',
  },
  {
    id: 3,
    sw: 'Je, umewahi kufikiria jinsi ya kufanya hivyo?',
    en: 'Have you been thinking about how you might do this?',
  },
  {
    id: 4,
    sw: 'Je, umewahi kuwa na nia ya kufanya kitendo hicho?',
    en: 'Have you had these thoughts with some intention of acting on them?',
  },
  {
    id: 5,
    sw: 'Je, umeshaanza au kupanga maelezo ya kufanya hivyo?',
    en: 'Have you started to work out or worked out the details of how to do this?',
  },
  {
    id: 6,
    sw: 'Je, umewahi kufanya jambo lolote kujidhuru au kujaribu kujiua?',
    en: 'Have you ever done anything, started to do anything, or prepared to do anything to end your life?',
  },
];

/** A safety plan, Stanley-Brown style. */
export const SAFETY_PLAN_STEPS_SW = [
  '1) Ishara za onyo ndani yangu (hisia, mawazo, hali)',
  '2) Stadi za ndani ninazoweza kufanya bila msaada (kupumua, kutembea, sala/dua)',
  '3) Watu/maeneo yanayonitia faraja',
  '4) Watu ninaoweza kupigia simu nikipata shida',
  '5) Wataalamu na simu za dharura (112, Lifeline 0800 110014, Muhimbili)',
  '6) Kufanya mazingira yangu kuwa salama (kuondoa vitu hatari)',
];

export const SAFETY_PLAN_STEPS_EN = [
  '1) Warning signs in me (feelings, thoughts, situations)',
  '2) Internal coping skills I can do alone (breathing, walking, prayer)',
  '3) People and places that calm me',
  '4) People I can call when in trouble',
  '5) Professionals and emergency numbers (112, Lifeline 0800 110014, Muhimbili)',
  '6) Making my environment safe (removing dangerous items)',
];

const RX_CRISIS_QUERY = /(c-?ssrs|safety plan|mpango wa usalama|ninaogopa nitajidhuru|nataka msaada wa dharura)/i;

export const crisisExpert: RafikiExpert = {
  id: 'roho-crisis',
  domain: 'crisis',
  label: 'Mlinzi',
  match(q) {
    const level = detectCrisis(q.text);
    if (level === 'emergency') return 1;
    if (level === 'urgent') return 0.95;
    if (level === 'caution') return 0.7;
    if (RX_CRISIS_QUERY.test(q.text)) return 0.85;
    return 0;
  },
  answer(q): RafikiAnswer {
    const level = detectCrisis(q.text);
    if (level === 'emergency' || level === 'urgent') {
      return crisisAnswer(level, q);
    }
    // C-SSRS branching kickoff
    const sw =
      'Ningependa kukuuliza maswali machache ya usalama (C-SSRS). Hatutahukumu — ni kuelewa tu.\n\n' +
      CSSRS_ITEMS.map((i) => `${i.id}. ${i.sw}`).join('\n') +
      '\n\nKama jibu la 4 au 5 ni "ndio", piga simu sasa: 112 au 0800 110014.';
    const en =
      'I would like to ask a few brief safety questions (C-SSRS). No judgement — just understanding.\n\n' +
      CSSRS_ITEMS.map((i) => `${i.id}. ${i.en}`).join('\n') +
      '\n\nIf 4 or 5 is "yes", call now: 112 or 0800 110014.';
    return {
      domain: 'crisis',
      expert: 'roho-crisis',
      mode: 'mlinzi',
      confidence: 'high',
      text: { sw, en },
      sources: [
        { label: 'C-SSRS', ref: 'Columbia Lighthouse Project' },
        { label: 'Stanley-Brown Safety Plan' },
      ],
      crisis: {
        level: level === 'safe' ? 'caution' : level,
        hotlines: TZ_HOTLINES.map(({ name, number, verified }) => ({
          name,
          number,
          verified,
        })),
        safetyPlanPrompt: true,
      },
      data: { cssrs: CSSRS_ITEMS, safetyPlan: { sw: SAFETY_PLAN_STEPS_SW, en: SAFETY_PLAN_STEPS_EN } },
      followUps: ['Anzisha mpango wa usalama', 'Nipigie simu ya msaada'],
    };
  },
};
