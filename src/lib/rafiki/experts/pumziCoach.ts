// experts/pumziCoach.ts — Mwenza routes breathing requests into the Pumzi player.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';
import { PUMZI_SESSIONS } from '../../../modules/pumzi/data/sessions';

const RX = /(pumua|kupumua|breath|pumzi|panic|wasiwasi|anxiety|usingizi|stress|focus|umakini|copd|asthma|pumu)/i;

function pickSessionId(text: string): string {
  const t = text.toLowerCase();
  if (/(panic|wasiwasi|anxiety|insomnia|usingizi|kushindwa kulala)/.test(t)) return '478';
  if (/(focus|umakini|kazi|performance)/.test(t)) return 'box';
  if (/(energy|nguvu|asubuhi|morning|energiz)/.test(t)) return 'bhastrika';
  if (/(copd|pumu|asthma|kushindwa kupumua)/.test(t)) return 'pursedlip';
  if (/(meditate|meditation|tafakari)/.test(t)) return 'ujjayi';
  if (/(wim hof|cold)/.test(t)) return 'wimhof';
  if (/(balance|usawa|nadi|alternate)/.test(t)) return 'nadi';
  return 'coherence';
}

export const pumziCoach: RafikiExpert = {
  id: 'roho-pumzi',
  domain: 'sleepHygiene',
  label: 'Pumzi',
  match(q) {
    if (RX.test(q.text)) return 0.82;
    return 0;
  },
  answer(q): RafikiAnswer {
    const id = pickSessionId(q.text);
    const session = PUMZI_SESSIONS.find((s) => s.id === id) ?? PUMZI_SESSIONS[2];
    const pattern = session.pattern.seconds.join('-');

    const sw =
      `Tujaribu ${session.name_sw} (${pattern}). ` +
      `Kaa vizuri, weka mabega chini, pumua kupitia pua. ` +
      `Mizunguko ${session.pattern.rounds}, takriban ${Math.max(1, Math.round(session.duration_s / 60))} dakika. ` +
      `Bonyeza /pumzi/${session.id} ili nianze kukuongoza.`;
    const en =
      `Let us try ${session.name_en} (${pattern}). ` +
      `Sit upright, shoulders down, breathe through the nose. ` +
      `${session.pattern.rounds} rounds, about ${Math.max(1, Math.round(session.duration_s / 60))} min. ` +
      `Open /pumzi/${session.id} so I can coach you.`;

    return {
      domain: 'sleepHygiene',
      expert: 'roho-pumzi',
      mode: q.mode ?? 'mfunzi',
      confidence: 'high',
      text: { sw, en },
      sources: [{ label: session.evidence_citation }],
      followUps: ['Anza sasa', 'Nifundishe nyingine', 'Eleza polepole'],
      data: { sessionId: session.id, route: `/pumzi/${session.id}` },
    };
  },
};
