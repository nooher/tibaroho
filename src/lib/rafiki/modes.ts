// modes.ts — the 6 Rafiki personality modes. Each tunes formatting of the same
// expert answers without changing clinical content.

import type { RafikiAnswer, RafikiMode } from './types';

export interface ModeProfile {
  id: RafikiMode;
  label: string;
  swDescription: string;
  /** Mode-specific opener prepended in Swahili. */
  swOpener: string;
  enOpener: string;
  /** Trim long answers? mlinzi/mkumbusha = true. */
  brief: boolean;
}

export const MODES: Record<RafikiMode, ModeProfile> = {
  mwenza: {
    id: 'mwenza',
    label: 'Mwenza',
    swDescription: 'Mwenzi mwema — wa kusikiliza na kukufariji.',
    swOpener: 'Niko nawe. ',
    enOpener: 'I am with you. ',
    brief: false,
  },
  mfunzi: {
    id: 'mfunzi',
    label: 'Mfunzi',
    swDescription: 'Mkufunzi — wa kukuongoza kwa hatua zilizopangwa.',
    swOpener: 'Twende hatua kwa hatua. ',
    enOpener: 'Let us go step by step. ',
    brief: false,
  },
  mlinzi: {
    id: 'mlinzi',
    label: 'Mlinzi',
    swDescription: 'Mlinzi — wa hali ya hatari, mwepesi na wa moja kwa moja.',
    swOpener: 'Ninakusikia. ',
    enOpener: 'I hear you. ',
    brief: true,
  },
  mwandishi: {
    id: 'mwandishi',
    label: 'Mwandishi',
    swDescription: 'Mwandishi — wa kukusaidia kuandika au kuandaa maandishi.',
    swOpener: 'Tuandike pamoja. ',
    enOpener: 'Let us write together. ',
    brief: false,
  },
  mhakiki: {
    id: 'mhakiki',
    label: 'Mhakiki',
    swDescription: 'Mhakiki — wa kuuliza maswali ya kupimisha mawazo.',
    swOpener: 'Naomba nikupime. ',
    enOpener: 'Let me ask you something. ',
    brief: false,
  },
  mkumbusha: {
    id: 'mkumbusha',
    label: 'Mkumbusha',
    swDescription: 'Mkumbusha — mfupi, wa kitendo.',
    swOpener: '',
    enOpener: '',
    brief: true,
  },
};

export function applyMode(answer: RafikiAnswer, mode: RafikiMode): RafikiAnswer {
  const profile = MODES[mode] ?? MODES.mwenza;
  // Crisis answers (mlinzi) bypass mode rewrap — they're already shaped.
  if (answer.crisis && answer.crisis.level !== 'safe') {
    return { ...answer, mode };
  }
  const swText = profile.swOpener + answer.text.sw;
  const enText = answer.text.en ? profile.enOpener + answer.text.en : undefined;
  const sw = profile.brief ? brief(swText) : swText;
  const en = enText ? (profile.brief ? brief(enText) : enText) : undefined;
  return {
    ...answer,
    mode,
    text: { sw, en },
  };
}

function brief(s: string): string {
  // Take first two sentences max.
  const parts = s.split(/(?<=[.!?])\s+/);
  return parts.slice(0, 2).join(' ').trim();
}
