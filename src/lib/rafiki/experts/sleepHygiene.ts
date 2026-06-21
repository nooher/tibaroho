// experts/sleepHygiene.ts — sleep KB, CBT-I lite, sleep-diary prompts.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

const RX = /(usingizi|sleep|kushindwa kulala|insomnia|nightmare|ndoto mbaya|kulala vibaya|cant sleep|can't sleep)/i;

const SLEEP_HYGIENE_SW = [
  'Wakati mmoja wa kulala na wa kuamka — kila siku, hata wikendi.',
  'Hakuna kafiyini (kahawa, chai kali) baada ya saa 6 mchana.',
  'Skrini chini saa 1 kabla ya kulala. Mwanga wa bluu unazuia melatonin.',
  'Kitanda kwa usingizi tu — sio simu, sio chakula, sio kufanya kazi.',
  'Chumba kiwe baridi (~20°C), kimya, gizani.',
  'Mazoezi ya mchana yanasaidia — usifanye masaa 2 kabla ya kulala.',
  'Pombe inaharibu usingizi wa REM — punguza.',
  'Kama hujaweza kulala dakika 20, amka, fanya jambo tulivu kwenye mwanga hafifu, rudi tu ukisikia usingizi.',
];

const SLEEP_HYGIENE_EN = [
  'Same sleep/wake time daily — even weekends.',
  'No caffeine (coffee, strong tea) after noon.',
  'Screens off 1 hour before bed. Blue light blocks melatonin.',
  'Bed for sleep only — no phone, no food, no work.',
  'Cool room (~20°C), quiet, dark.',
  'Daytime exercise helps — avoid within 2 hours of bed.',
  'Alcohol disrupts REM sleep — reduce.',
  'If not asleep in 20 min, get up, do something calm in dim light, return only when sleepy.',
];

const SLEEP_DIARY_SW = [
  'Saa ya kwenda kitandani?',
  'Saa ya kulala?',
  'Mara ngapi uliamka usiku?',
  'Saa ya kuamka asubuhi?',
  'Ulijihisije ulipoamka (1-10)?',
  'Kafiyini, pombe au mazoezi jana?',
];

const SLEEP_DIARY_EN = [
  'What time to bed?',
  'What time asleep?',
  'How many times awake at night?',
  'Wake-up time?',
  'How rested on waking (1-10)?',
  'Caffeine, alcohol, or exercise yesterday?',
];

export const sleepHygieneExpert: RafikiExpert = {
  id: 'roho-sleep',
  domain: 'sleepHygiene',
  label: 'Usingizi',
  match(q) {
    if (RX.test(q.text)) return 0.78;
    return 0;
  },
  answer(q): RafikiAnswer {
    const sw =
      'Usingizi mzuri ni msingi wa afya ya akili. Hizi ni kanuni 8 za CBT-I:\n\n' +
      SLEEP_HYGIENE_SW.map((s, i) => `${i + 1}) ${s}`).join('\n') +
      '\n\nKama unataka tuanze daftari la usingizi (siku 7), niambie. Itanisaidia kuona mfumo wako.';
    const en =
      'Good sleep is the foundation of mental health. CBT-I 8 rules:\n\n' +
      SLEEP_HYGIENE_EN.map((s, i) => `${i + 1}) ${s}`).join('\n') +
      '\n\nIf you want to start a 7-day sleep diary, tell me. It will help me see your pattern.';
    return {
      domain: 'sleepHygiene',
      expert: 'roho-sleep',
      mode: q.mode ?? 'mfunzi',
      confidence: 'high',
      text: { sw, en },
      sources: [{ label: 'CBT-I — Edinger & Carney' }, { label: 'WHO mhGAP' }],
      data: { diary: { sw: SLEEP_DIARY_SW, en: SLEEP_DIARY_EN } },
      followUps: ['Anza daftari la usingizi', 'Stadi ya kupumua kabla ya kulala'],
    };
  },
};
