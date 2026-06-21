// experts/medsReasoner.ts — TibaAfya bridge expert.

import { federated } from '../federated';
import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

const RX = /(dawa|medication|kumeza|niliruka|nilisahau|mwingiliano|interaction|madhara|side effect|prescription)/i;

export const medsReasonerExpert: RafikiExpert = {
  id: 'roho-medsReasoner',
  domain: 'medicationLiteracy',
  label: 'TibaAfya',
  match(q) {
    return RX.test(q.text) ? 0.8 : 0;
  },
  answer(q): RafikiAnswer {
    const r = federated.tibaafya.ask(q.text, {});
    return {
      domain: 'medicationLiteracy',
      expert: 'roho-medsReasoner',
      mode: q.mode ?? 'mwenza',
      confidence: 'high',
      text: {
        sw: `${r.ack}\n${r.respond}\n${r.next_step}`,
        en: 'TibaAfya medication guidance — see Swahili response above.',
      },
      sources: [{ label: r.source }],
      followUps: ['Madhara ya dawa hii', 'Mwingiliano na dawa zangu', 'Wakati gani wa kumeza'],
    };
  },
};
