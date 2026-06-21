// experts/motivationalInterviewing.ts — MI: OARS, rolling with resistance, change talk.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

const CHANGE_TALK_ELICITORS_SW = [
  'Ni nini kingekuwa sababu ya wewe kufikiria mabadiliko hayo?',
  'Kwa upande mmoja unaona faida gani za kubadili? Na upande mwingine?',
  'Ungejua nini kuhusu wewe mwenyewe ukifanikiwa kubadilika?',
  'Ni mara gani umewahi kufanikiwa katika jambo gumu? Ulifanyaje?',
  'Kama mambo yataendelea hivi kwa mwaka mmoja, utahisije?',
];

const CHANGE_TALK_ELICITORS_EN = [
  'What would be a reason for you to consider this change?',
  'On one hand, what are the benefits of changing? On the other hand?',
  'What would you learn about yourself if you succeeded?',
  'When have you succeeded at something hard before? How?',
  'If things continue as they are for a year, how will you feel?',
];

const RX_AMBIVALENT = /(nataka.*lakini|i want.*but|labda|maybe|sijui kama|not sure|huenda)/i;
const RX_CHANGE = /(nataka kuacha|nataka kubadilika|i want to quit|want to change|stop drinking|stop smoking|change my)/i;
const RX_RESIST = /(siwezi kuacha|haitawezekana|cant stop|can't change|nimejaribu|i've tried)/i;

export const motivationalInterviewingExpert: RafikiExpert = {
  id: 'roho-mi',
  domain: 'motivationalInterviewing',
  label: 'MI',
  match(q) {
    if (RX_CHANGE.test(q.text)) return 0.75;
    if (RX_AMBIVALENT.test(q.text)) return 0.7;
    if (RX_RESIST.test(q.text)) return 0.65;
    return 0;
  },
  answer(q): RafikiAnswer {
    const isResist = RX_RESIST.test(q.text);
    const elicSw = CHANGE_TALK_ELICITORS_SW[Math.floor(Math.random() * CHANGE_TALK_ELICITORS_SW.length)];
    const elicEn = CHANGE_TALK_ELICITORS_EN[Math.floor(Math.random() * CHANGE_TALK_ELICITORS_EN.length)];

    const sw = isResist
      ? `Nakuelewa — umejaribu na ni vigumu. Sitakulazimisha. Wewe ndiye unayejua maisha yako. ` +
        `Ni vipi tunaweza kuongea bila shinikizo? ${elicSw}`
      : `Nakusikia kuwa una hisia mbili. Hiyo ni ya kawaida sana — mabadiliko ni magumu. ` +
        `Tukitafakari kidogo: ${elicSw}\n\n` +
        'Stadi za MI: O-Open questions, A-Affirmations, R-Reflective listening, S-Summaries.';

    const en = isResist
      ? `I understand — you have tried and it is hard. I will not push you. You know your life best. ` +
        `Can we talk without pressure? ${elicEn}`
      : `I hear you have mixed feelings. That is very normal — change is hard. ` +
        `Let us reflect for a moment: ${elicEn}\n\n` +
        'MI core skills: OARS — Open questions, Affirmations, Reflective listening, Summaries.';

    return {
      domain: 'motivationalInterviewing',
      expert: 'roho-mi',
      mode: q.mode ?? 'mwenza',
      confidence: 'high',
      text: { sw, en },
      sources: [{ label: 'Miller & Rollnick — MI 3rd ed.' }],
      followUps: ['Tupime faida na hasara', 'Anza ngazi ndogo ya mabadiliko'],
    };
  },
};
