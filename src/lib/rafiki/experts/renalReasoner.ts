// experts/renalReasoner.ts — TibaFigo bridge expert.

import { federated } from '../federated';
import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

const RX = /(figo|kidney|ckd|renal|dialysis|dialisi|creatinine|epo|hemodial|peritoneal|esrd)/i;

export const renalReasonerExpert: RafikiExpert = {
  id: 'roho-renalReasoner',
  domain: 'psychoEducation',
  label: 'TibaFigo',
  match(q) {
    return RX.test(q.text) ? 0.82 : 0;
  },
  answer(q): RafikiAnswer {
    const r = federated.tibafigo.ask(q.text, {});
    return {
      domain: 'psychoEducation',
      expert: 'roho-renalReasoner',
      mode: q.mode ?? 'mwenza',
      confidence: 'high',
      text: {
        sw: `${r.ack}\n${r.respond}\n${r.next_step}`,
        en: 'TibaFigo renal guidance — see Swahili response above.',
      },
      sources: [{ label: r.source }],
      followUps: ['Vipimo gani vya figo?', 'Lishe ya CKD', 'Maandalizi ya dialysis'],
    };
  },
};
