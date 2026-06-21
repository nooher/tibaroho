// experts/bibliotherapy.ts — Swahili book recommendations (Kasuku library).

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

interface BookRec {
  title: string;
  author: string;
  type: 'self-help' | 'fiction' | 'poetry' | 'memoir';
  topics: string[];
  whySw: string;
  whyEn: string;
}

const KASUKU_BOOKS: BookRec[] = [
  {
    title: 'What the Fish Knew (SILT Book One)',
    author: 'Anaim',
    type: 'fiction',
    topics: ['identity', 'belonging', 'silence', 'huzuni', 'upweke'],
    whySw: 'Riwaya ya Anaim — inazungumza kuhusu ukimya wa moyo na utafutaji wa maana. Inaweza kuwa kioo cha hisia.',
    whyEn: 'Anaim\'s novel — about the silence of the heart and the search for meaning. Can mirror your feelings.',
  },
  {
    title: 'Shaaban Robert — Maisha Yangu',
    author: 'Shaaban Robert',
    type: 'memoir',
    topics: ['resilience', 'kujifunza', 'ustahimilivu'],
    whySw: 'Mwandishi wetu mkuu anaeleza maisha kwa ujasiri — kufundisha kuwa magumu yanapita.',
    whyEn: 'Our great writer tells his life with courage — teaches that hard times pass.',
  },
  {
    title: 'Utenzi wa Bharani',
    author: 'Mwengo bin Athuman',
    type: 'poetry',
    topics: ['ushairi', 'falsafa', 'amani'],
    whySw: 'Ushairi wa zamani wa Kiswahili — uzuri wa lugha unaweza kutuliza akili.',
    whyEn: 'Classical Swahili poetry — the beauty of language can calm the mind.',
  },
  {
    title: 'Feeling Good (kwa Kiswahili)',
    author: 'David Burns',
    type: 'self-help',
    topics: ['unyogovu', 'CBT', 'mawazo'],
    whySw: 'Kitabu cha CBT kinachoeleweka. Mazoezi rahisi ya kubadili mawazo.',
    whyEn: 'Accessible CBT classic. Simple exercises to shift thoughts.',
  },
  {
    title: 'Man\'s Search for Meaning',
    author: 'Viktor Frankl',
    type: 'memoir',
    topics: ['maana', 'mateso', 'kuvumilia'],
    whySw: 'Mateso bila maana yanaumiza zaidi kuliko mateso yenye maana. Frankl anatuonyesha jinsi.',
    whyEn: 'Suffering without meaning hurts more than suffering with meaning. Frankl shows the way.',
  },
];

const RX = /(kitabu|book|nipendekezee|recommend|nisome|read something|ushairi|poem|riwaya|novel)/i;

const TOPIC_KEYS: Record<string, string[]> = {
  unyogovu: ['unyogovu', 'depression', 'huzuni'],
  upweke: ['upweke', 'lonely', 'alone'],
  maana: ['maana', 'meaning', 'purpose'],
  ushairi: ['ushairi', 'poem', 'poetry'],
};

function pickBooksForTopic(text: string): BookRec[] {
  const t = text.toLowerCase();
  const matches: BookRec[] = [];
  for (const [topic, keys] of Object.entries(TOPIC_KEYS)) {
    if (keys.some((k) => t.includes(k))) {
      matches.push(...KASUKU_BOOKS.filter((b) => b.topics.includes(topic)));
    }
  }
  return matches.length ? matches.slice(0, 3) : KASUKU_BOOKS.slice(0, 3);
}

export const bibliotherapyExpert: RafikiExpert = {
  id: 'roho-biblio',
  domain: 'bibliotherapy',
  label: 'Kasuku',
  match(q) {
    if (RX.test(q.text)) return 0.72;
    return 0;
  },
  answer(q): RafikiAnswer {
    const recs = pickBooksForTopic(q.text);
    const swList = recs.map((b) => `• "${b.title}" — ${b.author}\n  ${b.whySw}`).join('\n\n');
    const enList = recs.map((b) => `• "${b.title}" — ${b.author}\n  ${b.whyEn}`).join('\n\n');
    return {
      domain: 'bibliotherapy',
      expert: 'roho-biblio',
      mode: q.mode ?? 'mwenza',
      confidence: 'high',
      text: {
        sw: `Vitabu vichache kutoka maktaba ya Kasuku:\n\n${swList}\n\nUngependa kusoma sehemu pamoja?`,
        en: `A few books from the Kasuku library:\n\n${enList}\n\nWould you like to read a section together?`,
      },
      sources: [{ label: 'Kasuku Library', ref: 'Laetoli' }],
      data: { recommendations: recs.map((b) => b.title) },
      followUps: ['Nisomee sehemu fupi', 'Nipe vitabu vingine'],
    };
  },
};
