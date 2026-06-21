// experts/cbtReframe.ts — CBT cognitive reframing.
// 12 cognitive distortions + Socratic Q library + thought-record skeleton.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

export interface Distortion {
  id: string;
  swName: string;
  enName: string;
  sw: string;
  en: string;
  /** Markers in user text. */
  cues: string[];
}

export const DISTORTIONS: Distortion[] = [
  {
    id: 'all-or-nothing',
    swName: 'Yote-au-Hakuna',
    enName: 'All-or-Nothing',
    sw: 'Kuona mambo kama meusi au meupe — bila kati. Mfano: "Nikishindwa moja, basi nimeshindwa kabisa."',
    en: 'Seeing things as black or white. Example: "If I fail one, I have failed completely."',
    cues: ['kabisa', 'kamwe', 'siku zote', 'always', 'never', 'totally', 'completely'],
  },
  {
    id: 'overgeneralization',
    swName: 'Kufanya Jumla Kupita Kiasi',
    enName: 'Overgeneralization',
    sw: 'Kutoka tukio moja kwenda hitimisho la milele. Mfano: "Amenikataa — hakuna mtu atakayenipenda."',
    en: 'From one event to a forever conclusion. Example: "He rejected me — nobody will ever love me."',
    cues: ['hakuna mtu', 'kila mtu', 'nobody', 'everyone', 'always happens'],
  },
  {
    id: 'mental-filter',
    swName: 'Kuchuja Mabaya',
    enName: 'Mental Filter',
    sw: 'Kuona mabaya tu, kupuuza mazuri. Mfano: Sifa 9 nzuri, lakini unashikilia 1 mbaya.',
    en: 'Seeing only negatives, ignoring positives. Example: 9 compliments, but you hold the 1 critique.',
    cues: ['lakini', 'mbaya tu', 'haifurahishi', 'nothing good', 'but'],
  },
  {
    id: 'disqualifying-positive',
    swName: 'Kukataa Mazuri',
    enName: 'Disqualifying the Positive',
    sw: 'Mazuri yanayotokea "hayahesabiwi". Mfano: "Amesifia kwa sababu ni rafiki tu."',
    en: 'Discounting positives. Example: "She praised me only because she is my friend."',
    cues: ['ni kwa sababu tu', 'doesn\'t count', 'just because'],
  },
  {
    id: 'jumping-to-conclusions',
    swName: 'Kuruka Hitimisho',
    enName: 'Jumping to Conclusions',
    sw: 'Kuhitimisha bila ushahidi. Aina 2: kusoma mawazo ya wengine na kutabiri mabaya yajayo.',
    en: 'Concluding without evidence. 2 types: mind-reading + fortune-telling.',
    cues: ['nina hakika', 'nadhani anafikiri', 'i know he thinks', 'definitely will'],
  },
  {
    id: 'magnification',
    swName: 'Kukuza Mabaya',
    enName: 'Magnification (Catastrophizing)',
    sw: 'Kufanya tatizo dogo kuwa janga. Mfano: "Sijaitwa kwenye harusi — maisha yangu yameisha."',
    en: 'Turning a small problem into a disaster. "I was not invited — my life is over."',
    cues: ['ni mwisho', 'maisha yameisha', 'janga', 'disaster', 'end of', 'awful'],
  },
  {
    id: 'emotional-reasoning',
    swName: 'Hisia kama Ushahidi',
    enName: 'Emotional Reasoning',
    sw: 'Kuhisi kama kuthibitisha. "Nasikia mjinga, basi mimi ni mjinga."',
    en: '"I feel it, so it must be true." "I feel stupid, so I am stupid."',
    cues: ['nasikia kwamba', 'i feel like i am', 'must be'],
  },
  {
    id: 'should-statements',
    swName: '"Lazima/Sharti"',
    enName: 'Should Statements',
    sw: 'Kanuni za nguvu. "Lazima niwe mkamilifu." Husababisha hatia.',
    en: 'Rigid rules. "I must be perfect." Brings guilt.',
    cues: ['lazima', 'sharti', 'must', 'should', 'ought to'],
  },
  {
    id: 'labeling',
    swName: 'Kujibatiza',
    enName: 'Labeling',
    sw: 'Kujipa lebo kali. "Mimi ni mshindwa." (Si "nimeshindwa mara hii.")',
    en: 'Harsh self-labels. "I am a failure." (Not "I failed this time.")',
    cues: ['mimi ni mshindwa', 'i am a failure', 'i am stupid', 'mimi ni mbaya'],
  },
  {
    id: 'personalization',
    swName: 'Kujihusisha Mwenyewe',
    enName: 'Personalization',
    sw: 'Kujilaumu kwa mambo yasiyo yako. "Mtoto wangu amefeli — ni kosa langu."',
    en: 'Blaming yourself for things outside your control. "My child failed — it is my fault."',
    cues: ['kosa langu', 'my fault', 'because of me'],
  },
  {
    id: 'blame',
    swName: 'Kutupia Lawama Wengine',
    enName: 'Blame',
    sw: 'Kuwalaumu wengine kwa hisia zako bila kujichunguza.',
    en: 'Blaming others for all your feelings without self-reflection.',
    cues: ['ni kosa lake', 'because of him', 'because of her'],
  },
  {
    id: 'unfair-comparisons',
    swName: 'Kulinganisha Kibaya',
    enName: 'Unfair Comparisons',
    sw: 'Kujilinganisha na wengine kwa namna isiyo ya haki. "Yeye amefanikiwa, mimi sio kitu."',
    en: 'Unfair comparisons. "He succeeded, I am nothing."',
    cues: ['yeye amefanikiwa', 'compared to', 'kuliko mimi'],
  },
];

const SOCRATIC_SW = [
  'Una ushahidi gani kwamba mawazo hayo ni ya kweli?',
  'Una ushahidi gani kwamba si ya kweli?',
  'Je, kuna njia nyingine ya kuona hali hii?',
  'Ungetoa ushauri gani kwa rafiki yako akiwa katika hali hii?',
  'Kitakuwaje kibaya zaidi? Je, ungeweza kuvumilia?',
  'Mawazo hayo yanakusaidia kufikia unachotaka?',
];

const SOCRATIC_EN = [
  'What evidence do you have that these thoughts are true?',
  'What evidence do you have that they are not true?',
  'Is there another way to see this situation?',
  'What would you tell a friend in this situation?',
  'What is the worst case? Could you cope?',
  'Are these thoughts helping you get where you want to go?',
];

function detectDistortion(text: string): Distortion | null {
  const t = text.toLowerCase();
  for (const d of DISTORTIONS) if (d.cues.some((c) => t.includes(c))) return d;
  return null;
}

const RX_TRIGGER = /(siwezi|nimeshindwa|hakuna mtu|kila kitu|cant|can't|nothing|nobody|always|never|i'm a failure)/i;

export const cbtReframeExpert: RafikiExpert = {
  id: 'roho-cbtReframe',
  domain: 'cbtReframe',
  label: 'CBT',
  match(q) {
    const d = detectDistortion(q.text);
    if (d) return 0.78;
    if (RX_TRIGGER.test(q.text)) return 0.55;
    return 0;
  },
  answer(q): RafikiAnswer {
    const d = detectDistortion(q.text) ?? DISTORTIONS[1];
    const qSw = SOCRATIC_SW[Math.floor(Math.random() * SOCRATIC_SW.length)];
    const qEn = SOCRATIC_EN[Math.floor(Math.random() * SOCRATIC_EN.length)];
    const sw =
      `Nasikia jinsi mawazo hayo yanavyokuumiza. Yanafanana na mtindo wa "${d.swName}" — ${d.sw}\n\n` +
      `Swali la kupimisha: ${qSw}\n\n` +
      'Tunaweza kuandika "rekodi ya wazo" pamoja: 1) Hali, 2) Wazo la moja kwa moja, 3) Hisia, ' +
      '4) Ushahidi unaolithibitisha, 5) Ushahidi unaolipinga, 6) Wazo lenye uwiano.';
    const en =
      `I hear how those thoughts are hurting. They look like "${d.enName}" — ${d.en}\n\n` +
      `A question to test it: ${qEn}\n\n` +
      'We can write a "thought record" together: 1) Situation, 2) Automatic thought, 3) Feeling, ' +
      '4) Evidence for, 5) Evidence against, 6) Balanced thought.';
    return {
      domain: 'cbtReframe',
      expert: 'roho-cbtReframe',
      mode: q.mode ?? 'mhakiki',
      confidence: 'high',
      text: { sw, en },
      sources: [
        { label: 'Beck Cognitive Therapy' },
        { label: 'CETA t-CBT module' },
      ],
      data: { distortion: d.id, thoughtRecord: ['situation', 'thought', 'feeling', 'for', 'against', 'balanced'] },
      followUps: ['Hebu tuandike rekodi ya wazo', 'Onyesha mifano mingine ya mitindo hii'],
    };
  },
};
