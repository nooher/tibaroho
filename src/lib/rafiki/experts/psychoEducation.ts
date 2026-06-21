// experts/psychoEducation.ts — Plain-Swahili psycho-education KB.
// 30+ topics covering depression, anxiety, trauma, sleep, addiction, etc.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

interface KBEntry {
  keys: string[];
  topic: string;
  sw: string;
  en: string;
  source: string;
}

const KB: KBEntry[] = [
  {
    keys: ['unyogovu', 'huzuni ya muda mrefu', 'depression', 'depressed'],
    topic: 'Unyogovu (Depression)',
    sw: 'Unyogovu ni hali ya kiafya — si udhaifu wala dhambi. Dalili kuu: huzuni inayoendelea wiki 2+, kupoteza furaha, kulala vibaya, hamu ndogo ya chakula, uchovu, mawazo ya hatia, kupoteza mwelekeo. Inatibika — kwa mazungumzo (CBT/IPT) na/au dawa. Programu zinazofanya kazi Tanzania: PM+, Friendship Bench (rafiki-mlezi).',
    en: 'Depression is a medical condition — not weakness or sin. Core symptoms: persistent sadness 2+ weeks, loss of pleasure, poor sleep, low appetite, fatigue, guilt, poor concentration. It is treatable — via talk therapy (CBT/IPT) and/or medication. Programs that work in Tanzania: PM+, Friendship Bench.',
    source: 'WHO mhGAP-IG / PM+',
  },
  {
    keys: ['wasiwasi', 'hofu nyingi', 'anxiety', 'panic'],
    topic: 'Wasiwasi (Anxiety)',
    sw: 'Wasiwasi ni hisia ya kawaida — lakini ukiwa wa muda mrefu na kuvuruga maisha unaweza kuwa GAD (wasiwasi wa jumla). Dalili: mawazo yanayozunguka, moyo kupiga haraka, kushindwa kulala, misuli kukaza. Stadi: kupumua kwa kina (4-7-8), kutaja hisia, kufichua taratibu kwa hofu (exposure).',
    en: 'Anxiety is normal — but when prolonged and disrupting life it may be GAD. Symptoms: racing thoughts, fast heart, poor sleep, muscle tension. Skills: deep breathing (4-7-8), naming the feeling, graded exposure to feared situations.',
    source: 'CETA / t-CBT',
  },
  {
    keys: ['kiwewe', 'trauma', 'majeraha ya akili', 'ptsd'],
    topic: 'Kiwewe (Trauma)',
    sw: 'Kiwewe ni jeraha la akili baada ya tukio kubwa. Si udhaifu — ni majibu ya kawaida ya mfumo wa neva. Dalili: ndoto mbaya, kumbukumbu zinazorudi, kukwepa mahali pa tukio, kuwa makini sana (hypervigilance). Tiba: CETA, narrative exposure, kazi ya mwili (groudning).',
    en: 'Trauma is a wound from an overwhelming event. Not weakness — a normal nervous-system response. Symptoms: nightmares, flashbacks, avoidance, hypervigilance. Treatments: CETA, narrative exposure, grounding skills.',
    source: 'CETA',
  },
  {
    keys: ['usingizi', 'sleep', 'insomnia', 'kushindwa kulala'],
    topic: 'Usingizi (Sleep)',
    sw: 'Usingizi mzuri ni msingi wa afya ya akili. Kanuni 5: 1) Muda mmoja wa kulala/kuamka kila siku, 2) Hakuna kafiyini baada ya saa 6 mchana, 3) Skrini chini saa 1 kabla ya kulala, 4) Kitanda = usingizi tu (si simu), 5) Kama hujaweza kulala dakika 20 — amka, fanya jambo tulivu, rudi.',
    en: 'Good sleep is the foundation of mental health. 5 rules: 1) Same sleep/wake time daily, 2) No caffeine after noon, 3) Screens off 1 hour before bed, 4) Bed = sleep only, 5) If you cannot sleep in 20 min — get up, do something calm, return.',
    source: 'CBT-I',
  },
  {
    keys: ['ulevi', 'pombe', 'addiction', 'kileo', 'bangi', 'sigara'],
    topic: 'Uraibu (Addiction)',
    sw: 'Uraibu si tabia mbaya tu — ni hali ya ubongo. Hatua za mabadiliko: kufikiri → kujiandaa → kutenda → kuendeleza. Stadi: kutambua vichocheo (triggers), kupanga njia mbadala, kupata mshirika wa kuwajibisha. Dawa zipo (kwa pombe: naltrexone; kwa heroini: methadone).',
    en: 'Addiction is not just bad behaviour — it is a brain condition. Stages: contemplation → preparation → action → maintenance. Skills: identify triggers, plan alternatives, find an accountability partner. Medications exist (alcohol: naltrexone; opioids: methadone).',
    source: 'WHO ASSIST / SBIRT',
  },
  {
    keys: ['mfadhaiko wa baada ya kujifungua', 'baby blues', 'postpartum', 'epds'],
    topic: 'Mfadhaiko wa Baada ya Kujifungua',
    sw: 'Wanawake wengi hupata "baby blues" siku za kwanza — hii ni ya kawaida. Lakini ikiendelea wiki 2+ na kuvuruga utunzaji wa mtoto au wewe — hiyo ni mfadhaiko wa baada ya kujifungua na unahitaji msaada. EPDS ni tathmini fupi. Tiba: IPT, msaada wa familia, kupumzika.',
    en: 'Many women experience "baby blues" early on — this is normal. If it lasts 2+ weeks and disrupts baby care or you — that is postpartum depression and needs help. EPDS is a brief screen. Treatment: IPT, family support, rest.',
    source: 'EPDS / IPT',
  },
  {
    keys: ['msongo wa mawazo', 'stress', 'shida'],
    topic: 'Msongo (Stress)',
    sw: 'Msongo ni mwitikio wa mwili kwa shinikizo. Wastani husaidia (kuamka, kufanya kazi). Mwingi unaharibu — usingizi, hamu, mahusiano. Stadi: kupumua, mazoezi, kuongea na mtu wa karibu, kupanga muda.',
    en: 'Stress is the body responding to pressure. Moderate stress helps (we wake up, get things done). Too much harms — sleep, appetite, relationships. Skills: breathing, movement, talking to someone close, time planning.',
    source: 'PM+',
  },
  {
    keys: ['kupumua', 'breathing', 'panic skill'],
    topic: 'Kupumua kwa Kina (Breathing)',
    sw: 'Stadi ya 4-7-8: pumua ndani kupitia pua hesabu 4, shikilia hesabu 7, toa polepole kupitia mdomo hesabu 8. Rudia mara 4. Hii inashusha mfumo wa fight-or-flight. Tumia wakati wowote moyo unapokupiga kwa kasi.',
    en: '4-7-8 skill: breathe in through nose for 4, hold for 7, out through mouth for 8. Repeat 4 times. This calms fight-or-flight. Use it whenever your heart is racing.',
    source: 't-CBT / mhGAP',
  },
  {
    keys: ['stigma', 'unyanyapaa', 'aibu ya akili'],
    topic: 'Unyanyapaa (Stigma)',
    sw: 'Watu wengi wanachelewa kutafuta msaada kwa sababu ya unyanyapaa. Ukweli: matatizo ya akili ni ya kawaida (1 kati ya 4 watu). Si laana, si kichaa. Kutafuta msaada ni nguvu — si udhaifu.',
    en: 'Many people delay help-seeking because of stigma. Truth: mental-health issues are common (1 in 4 people). Not a curse, not madness. Seeking help is strength — not weakness.',
    source: 'WHO Stigma Reduction',
  },
  {
    keys: ['vijana', 'tineja', 'adolescents', 'youth mental'],
    topic: 'Afya ya Akili kwa Vijana',
    sw: 'Vijana wana mabadiliko makubwa ya ubongo — hisia kali ni za kawaida. Lakini huzuni inayozidi wiki 2, kupoteza marafiki, mawazo ya kujidhuru — hayo ni hatari. Wazungumzishe vijana bila hukumu, sikiliza zaidi ya kushauri.',
    en: 'Adolescents have major brain changes — intense feelings are normal. But sadness lasting 2+ weeks, withdrawal, self-harm thoughts — those are red flags. Talk without judgement, listen more than advise.',
    source: 'WHO Adolescent MH',
  },
];

function score(q: RafikiQuery): { entry: KBEntry; score: number } | null {
  const t = q.text.toLowerCase();
  let best: { entry: KBEntry; score: number } | null = null;
  for (const e of KB) {
    let hit = 0;
    for (const k of e.keys) if (t.includes(k)) hit++;
    if (hit > 0) {
      const s = Math.min(0.85, 0.45 + hit * 0.15);
      if (!best || s > best.score) best = { entry: e, score: s };
    }
  }
  return best;
}

export const psychoEducationExpert: RafikiExpert = {
  id: 'roho-psychoEducation',
  domain: 'psychoEducation',
  label: 'Elimu',
  match(q) {
    return score(q)?.score ?? 0;
  },
  answer(q): RafikiAnswer {
    const found = score(q);
    if (!found) {
      return {
        domain: 'psychoEducation',
        expert: 'roho-psychoEducation',
        mode: q.mode ?? 'mwenza',
        confidence: 'low',
        text: {
          sw: 'Niambie zaidi — unataka kujifunza kuhusu nini?',
          en: 'Tell me more — what would you like to learn about?',
        },
      };
    }
    return {
      domain: 'psychoEducation',
      expert: 'roho-psychoEducation',
      mode: q.mode ?? 'mwenza',
      confidence: 'high',
      text: { sw: `${found.entry.topic}\n\n${found.entry.sw}`, en: `${found.entry.topic}\n\n${found.entry.en}` },
      sources: [{ label: found.entry.source }],
      followUps: ['Nipe stadi ya kutumia leo', 'Niunganishe na programu'],
    };
  },
};
