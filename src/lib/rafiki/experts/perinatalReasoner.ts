// experts/perinatalReasoner.ts — TibaMama bridge expert.

import { federated } from '../federated';
import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

const RX = /(mimba|pregnant|anc|epds|baby blues|kicks|chanjo|immunization|mtoto|postpartum|kunyonyesha|mkunga)/i;

export const perinatalReasonerExpert: RafikiExpert = {
  id: 'roho-perinatalReasoner',
  domain: 'psychoEducation',
  label: 'TibaMama',
  match(q) {
    return RX.test(q.text) ? 0.8 : 0;
  },
  answer(q): RafikiAnswer {
    const r = federated.tibamama.ask(q.text, {});
    return {
      domain: 'psychoEducation',
      expert: 'roho-perinatalReasoner',
      mode: q.mode ?? 'mwenza',
      confidence: 'high',
      text: {
        sw: `${r.ack}\n${r.respond}\n${r.next_step}`,
        en: 'TibaMama perinatal guidance — see Swahili response above.',
      },
      sources: [{ label: r.source }],
      followUps: ['Ratiba ya ANC', 'Lishe ya mama mjamzito', 'Postpartum care'],
    };
  },
};
