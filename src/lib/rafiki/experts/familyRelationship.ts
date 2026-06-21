// experts/familyRelationship.ts — communication skills, conflict, IPV screen.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';
import { detectIPV, TZ_HOTLINES } from '../safety';

const RX = /(mke|mume|mpenzi|spouse|husband|wife|partner|familia|family|mtoto|child|baba|mama|ndoa|marriage|mgogoro|conflict|tumegombana)/i;

const I_STATEMENTS_SW = [
  'Mfumo wa "Mimi-kauli": "Ninajisikia ___ wakati ___, kwa sababu ___. Ningependa ___."',
  'Mfano: "Najisikia kuachwa wakati hujibu simu zangu, kwa sababu nakuhitaji. Ningependa tujaribu kupiga simu kila jioni."',
];

const I_STATEMENTS_EN = [
  '"I-statement" pattern: "I feel ___ when ___ because ___. I would like ___."',
  'Example: "I feel left out when you don\'t answer my calls, because I need you. I would like us to try a call each evening."',
];

const ACTIVE_LISTENING_RULES_SW = [
  'Sikiliza kabla ya kujibu — bila kupanga jibu ndani.',
  'Rudia ulichosikia kwa maneno yako mwenyewe ("Kwa hivyo unasema...?").',
  'Tambua hisia, sio tu maneno.',
  'Epuka "Wewe daima..." au "Wewe kamwe..."',
  'Pumzika dakika 10 ikiwa hasira inafika juu.',
];

const ACTIVE_LISTENING_RULES_EN = [
  'Listen before replying — without rehearsing your answer.',
  'Repeat what you heard in your own words ("So you are saying...?").',
  'Notice feelings, not just words.',
  'Avoid "You always..." or "You never..."',
  'Take a 10-minute break if anger peaks.',
];

export const familyRelationshipExpert: RafikiExpert = {
  id: 'roho-family',
  domain: 'familyRelationship',
  label: 'Familia',
  match(q) {
    if (detectIPV(q.text)) return 0.9;
    if (RX.test(q.text)) return 0.7;
    return 0;
  },
  answer(q): RafikiAnswer {
    if (detectIPV(q.text)) {
      const ipvHotline = TZ_HOTLINES.find((h) => h.scope === 'ipv');
      return {
        domain: 'familyRelationship',
        expert: 'roho-family',
        mode: 'mlinzi',
        confidence: 'high',
        text: {
          sw:
            'Ninakusikia, na ninakujali. Hujasababisha haya — vurugu si kosa la mwathirika. ' +
            'Usalama wako ni wa kwanza.\n\n' +
            `• TAMWA GBV Helpline: ${ipvHotline?.number ?? '0800 110055'}\n` +
            '• Polisi (Gender Desk): 112\n' +
            '• Pendekezo: andaa "begi la kuondoka" — hati, simu, fedha kidogo, mahali pa kwenda.',
          en:
            'I hear you, and I care. You did not cause this — abuse is never the victim\'s fault. ' +
            'Your safety comes first.\n\n' +
            `• TAMWA GBV Helpline: ${ipvHotline?.number ?? '0800 110055'}\n` +
            '• Police (Gender Desk): 112\n' +
            '• Suggestion: prepare a "go bag" — documents, phone, some money, a place to go.',
        },
        sources: [{ label: 'TAMWA' }, { label: 'WHO IPV Response' }],
        crisis: {
          level: 'urgent',
          hotlines: ipvHotline
            ? [{ name: ipvHotline.name, number: ipvHotline.number, verified: ipvHotline.verified }]
            : [],
          safetyPlanPrompt: true,
        },
        followUps: ['Nipe mpango wa kuondoka salama', 'Nipigie polisi'],
      };
    }
    const sw =
      'Mawasiliano ndani ya familia ni stadi inayojifunzwa. Kanuni 2 kuu:\n\n' +
      'A) Mimi-kauli (bila lawama):\n' +
      I_STATEMENTS_SW.map((s) => `   ${s}`).join('\n') +
      '\n\nB) Kusikiliza kwa makini:\n' +
      ACTIVE_LISTENING_RULES_SW.map((s) => `   • ${s}`).join('\n');
    const en =
      'Family communication is a learned skill. 2 core rules:\n\n' +
      'A) I-statements (no blame):\n' +
      I_STATEMENTS_EN.map((s) => `   ${s}`).join('\n') +
      '\n\nB) Active listening:\n' +
      ACTIVE_LISTENING_RULES_EN.map((s) => `   • ${s}`).join('\n');
    return {
      domain: 'familyRelationship',
      expert: 'roho-family',
      mode: q.mode ?? 'mfunzi',
      confidence: 'high',
      text: { sw, en },
      sources: [{ label: 'Gottman Method' }, { label: 'CETA Family Module' }],
      followUps: ['Nipe mfano wa mazungumzo', 'Tutengeneze mpango wa familia'],
    };
  },
};
