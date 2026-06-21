// experts/clinicalReasoner.ts — TibaAI bridge expert.

import { federated } from '../federated';
import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

const RX = /(homa|malaria|kifua kikuu|tb|vvu|hiv|ukimwi|ugonjwa|maumivu ya tumbo|kuhara|kichefuchefu|fever|tuberculosis)/i;

export const clinicalReasonerExpert: RafikiExpert = {
  id: 'roho-clinicalReasoner',
  domain: 'psychoEducation',
  label: 'TibaAI',
  match(q) {
    return RX.test(q.text) ? 0.78 : 0;
  },
  answer(q): RafikiAnswer {
    const r = federated.tibaai.ask(q.text, {});
    return {
      domain: 'psychoEducation',
      expert: 'roho-clinicalReasoner',
      mode: q.mode ?? 'mwenza',
      confidence: 'high',
      text: {
        sw: `${r.ack}\n${r.respond}\n${r.next_step}`,
        en: 'TibaAI clinical guidance — see Swahili response above.',
      },
      sources: [{ label: r.source }],
      followUps: ['Nipe maelezo zaidi', 'Mwambie mtaalamu wa karibu', 'Tubadili mada'],
    };
  },
};
