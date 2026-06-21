// experts/activeListening.ts — reflective summary, emotion labeling, validation.
// Template engine with empathy phrases in Swahili.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

const EMOTION_LEX: { keys: string[]; sw: string; en: string }[] = [
  { keys: ['huzuni', 'sad', 'unhappy', 'msononeko'], sw: 'huzuni', en: 'sadness' },
  { keys: ['hasira', 'angry', 'furious', 'nimekasirika'], sw: 'hasira', en: 'anger' },
  { keys: ['hofu', 'fear', 'afraid', 'wasiwasi', 'anxious'], sw: 'hofu/wasiwasi', en: 'fear/anxiety' },
  { keys: ['upweke', 'lonely', 'alone', 'peke yangu'], sw: 'upweke', en: 'loneliness' },
  { keys: ['aibu', 'shame', 'ashamed', 'kuona aibu'], sw: 'aibu', en: 'shame' },
  { keys: ['hatia', 'guilt', 'guilty', 'nimekosea'], sw: 'hatia', en: 'guilt' },
  { keys: ['uchovu', 'tired', 'exhausted', 'nimechoka'], sw: 'uchovu', en: 'exhaustion' },
  { keys: ['furaha', 'happy', 'glad', 'nimefurahi'], sw: 'furaha', en: 'joy' },
  { keys: ['kuchanganyikiwa', 'confused', 'sijui nifanye'], sw: 'kuchanganyikiwa', en: 'confusion' },
];

const VALIDATIONS_SW = [
  'Inafaa kabisa kuhisi hivyo katika hali kama hii.',
  'Sio wewe peke yako — wengi wamekuwa hapa.',
  'Nakuelewa, na maumivu hayo ni halali.',
  'Asante kwa kunieleza — si rahisi.',
  'Hisia hizo si dhaifu — ni za kibinadamu.',
];

const VALIDATIONS_EN = [
  'It makes sense to feel that way in this situation.',
  'You are not alone — many have been here.',
  'I hear you, and that pain is valid.',
  'Thank you for sharing — it is not easy.',
  'Those feelings are not weakness — they are human.',
];

const RX = /(nahisi|najisikia|i feel|i'm feeling|naumia|nimechoka|nimekasirika|huzuni|hofu|upweke|aibu|hatia|kuchanganyikiwa|hurt|sad|angry|lonely)/i;

function detectEmotions(text: string): { sw: string; en: string }[] {
  const t = text.toLowerCase();
  const found: { sw: string; en: string }[] = [];
  for (const e of EMOTION_LEX) {
    if (e.keys.some((k) => t.includes(k))) found.push({ sw: e.sw, en: e.en });
  }
  return found;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const activeListeningExpert: RafikiExpert = {
  id: 'roho-activeListening',
  domain: 'activeListening',
  label: 'Sikiliza',
  match(q) {
    if (RX.test(q.text)) return 0.7;
    if (detectEmotions(q.text).length > 0) return 0.65;
    return 0;
  },
  answer(q): RafikiAnswer {
    const emos = detectEmotions(q.text);
    const labelSw = emos.length ? emos.map((e) => e.sw).join(', ') : 'uzito';
    const labelEn = emos.length ? emos.map((e) => e.en).join(', ') : 'weight';

    const reflectionSw =
      `Nasikia ${labelSw} katika unayonieleza. ` +
      pick(VALIDATIONS_SW) +
      ' Je, ni kitu gani kimeleta hisia hii leo? Ukitaka tunaweza kuongea kidogo zaidi.';
    const reflectionEn =
      `I hear ${labelEn} in what you are sharing. ` +
      pick(VALIDATIONS_EN) +
      ' What brought this feeling up today? We can talk a little more if you want.';

    return {
      domain: 'activeListening',
      expert: 'roho-activeListening',
      mode: q.mode ?? 'mwenza',
      confidence: 'high',
      text: { sw: reflectionSw, en: reflectionEn },
      sources: [{ label: 'Active Listening — Friendship Bench / MI core skill' }],
      followUps: ['Niambie zaidi', 'Nipe stadi ya kupumua', 'Tubadili mada'],
    };
  },
};
