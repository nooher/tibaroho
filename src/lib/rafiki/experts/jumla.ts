// experts/jumla.ts — warm Swahili+English fallback.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

const RX_GREET = /\b(habari|jambo|salama|mambo|shikamoo|hujambo|hello|hi|hey|niaje|vipi)\b/i;
const RX_ABOUT = /\b(roho ni nini|wewe ni nani|unaweza nini|what is roho|what can you do|who are you|nisaidie|help)\b/i;

const ABOUT_SW =
  'Mimi ni Mwenza — mwenzi wako wa afya ya akili wa Laetoli (T) Ltd, anayefanya kazi kwa Kiswahili kwanza ' +
  'na bila kutegemea AI ya nje.\n\n' +
  'Naweza kukusaidia na:\n' +
  '• Kusikiliza unayohisi\n' +
  '• Kupima hali (PHQ-9, GAD-7, AUDIT)\n' +
  '• Kufundisha stadi za CBT, MI, ACT\n' +
  '• Kushauri kuhusu dawa, usingizi, pombe, familia\n' +
  '• Mpango wa usalama wakati wa hatari\n\n' +
  'Sitoi utambuzi wala dawa — hilo ni la daktari. Niko nawe.';

const ABOUT_EN =
  'I am Mwenza — Laetoli (T) Ltd\'s sovereign Swahili-first mental-health companion, running without any external AI.\n\n' +
  'I can help with:\n' +
  '• Listening to how you feel\n' +
  '• Screening (PHQ-9, GAD-7, AUDIT)\n' +
  '• Teaching CBT, MI, ACT skills\n' +
  '• Guidance on meds, sleep, alcohol, family\n' +
  '• A safety plan when things are hard\n\n' +
  'I do not diagnose or prescribe — that belongs with a clinician. I am here with you.';

export const jumlaExpert: RafikiExpert = {
  id: 'roho-jumla',
  domain: 'jumla',
  label: 'Jumla',
  match(q) {
    if (!q.text.trim()) return 0.05;
    if (RX_GREET.test(q.text)) return 0.5;
    if (RX_ABOUT.test(q.text)) return 0.55;
    return 0.05;
  },
  answer(q): RafikiAnswer {
    if (RX_GREET.test(q.text)) {
      return {
        domain: 'jumla',
        expert: 'roho-jumla',
        mode: q.mode ?? 'mwenza',
        confidence: 'high',
        text: {
          sw: 'Habari! Mimi ni Mwenza. Niambie unahisije leo, au niulize chochote kuhusu afya ya akili.',
          en: 'Hello! I am Mwenza. Tell me how you feel today, or ask me anything about mental health.',
        },
        sources: [{ label: 'Mwenza KB' }],
        followUps: ['Najisikia vibaya leo', 'Nipime kwa PHQ-9', 'Nifundishe kupumua'],
      };
    }
    if (RX_ABOUT.test(q.text)) {
      return {
        domain: 'jumla',
        expert: 'roho-jumla',
        mode: q.mode ?? 'mwenza',
        confidence: 'high',
        text: { sw: ABOUT_SW, en: ABOUT_EN },
        sources: [{ label: 'Mwenza KB', ref: 'Laetoli' }],
      };
    }
    return {
      domain: 'jumla',
      expert: 'roho-jumla',
      mode: q.mode ?? 'mwenza',
      confidence: 'low',
      text: {
        sw:
          'Sijaweza kuelewa vyema. Naweza kukusaidia na: kusikiliza hisia zako, stadi za CBT/MI, dawa, ' +
          'usingizi, pombe, familia, na mpango wa usalama. Jaribu kuuliza tena.',
        en:
          'I could not quite understand. I can help with: listening, CBT/MI skills, medications, sleep, ' +
          'alcohol, family, and safety planning. Please try again.',
      },
      sources: [{ label: 'Mwenza KB' }],
    };
  },
};
