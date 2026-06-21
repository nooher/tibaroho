// experts/goalsValues.ts — ACT values clarification + workable goals + action steps.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

const RX = /(maadili|values|lengo|goal|nataka kufanikiwa|sina mwelekeo|purpose|niko wapi kwenye maisha|kusudi)/i;

const VALUES_DOMAINS_SW = [
  'Familia',
  'Marafiki na jamii',
  'Kazi/elimu',
  'Afya na mwili',
  'Imani/maana',
  'Burudani na ubunifu',
  'Mchango kwa jamii',
];

const VALUES_DOMAINS_EN = [
  'Family',
  'Friends and community',
  'Work/education',
  'Health and body',
  'Faith/meaning',
  'Recreation and creativity',
  'Contribution to society',
];

const VALUES_QUESTIONS_SW = [
  'Ni nini muhimu kwako kuhusu eneo hili?',
  'Ungependa kukumbukwa vipi katika eneo hili?',
  'Kama sikuwa na hofu, ningefanya nini hapa?',
];

const VALUES_QUESTIONS_EN = [
  'What matters to you in this area?',
  'How would you want to be remembered in this area?',
  'If I had no fear, what would I do here?',
];

export const goalsValuesExpert: RafikiExpert = {
  id: 'roho-goals',
  domain: 'goalsValues',
  label: 'Maadili',
  match(q) {
    if (RX.test(q.text)) return 0.7;
    return 0;
  },
  answer(q): RafikiAnswer {
    const sw =
      'Katika ACT (Acceptance & Commitment Therapy), maadili ni dira ya maisha — sio hitimisho la kufikia.\n\n' +
      'Maeneo 7 ya maisha:\n' +
      VALUES_DOMAINS_SW.map((d, i) => `${i + 1}) ${d}`).join('\n') +
      '\n\nChagua moja, kisha jiulize:\n' +
      VALUES_QUESTIONS_SW.map((q) => `• ${q}`).join('\n') +
      '\n\nLENGO LA SMART: Specific (Mahususi), Measurable (Inayopimwa), Achievable (Yawezekana), ' +
      'Relevant (Inayofaa), Time-bound (Yenye muda). Hatua ya kwanza ndogo ni ipi?';
    const en =
      'In ACT, values are a life-compass — not a destination.\n\n' +
      '7 life domains:\n' +
      VALUES_DOMAINS_EN.map((d, i) => `${i + 1}) ${d}`).join('\n') +
      '\n\nPick one, then ask:\n' +
      VALUES_QUESTIONS_EN.map((q) => `• ${q}`).join('\n') +
      '\n\nSMART goal: Specific, Measurable, Achievable, Relevant, Time-bound. ' +
      'What is the smallest first step?';
    return {
      domain: 'goalsValues',
      expert: 'roho-goals',
      mode: q.mode ?? 'mfunzi',
      confidence: 'high',
      text: { sw, en },
      sources: [{ label: 'ACT — Hayes' }, { label: 'SMART Goals' }],
      data: { domains: VALUES_DOMAINS_SW },
      followUps: ['Nisaidie kuandika lengo la SMART', 'Tukamilishe Mti wa Maisha (Tree of Life)'],
    };
  },
};
