// router.ts — Akili-style router for Rafiki. Scores all experts, picks top,
// falls back to jumla. Crisis detection always wins regardless of mode.

import { applyMode } from './modes';
import {
  emptyMemory,
  injectContext,
  looksLikeFollowUp,
  updateMemory,
  type RafikiMemory,
} from './memory';
import {
  crisisAnswer,
  detectCrisis,
  isHardRefusal,
  refusalAnswer,
} from './safety';
import type {
  RafikiAnswer,
  RafikiExchange,
  RafikiExpert,
  RafikiQuery,
} from './types';

export interface Rafiki {
  ask(q: RafikiQuery | string): Promise<RafikiAnswer>;
  experts: RafikiExpert[];
}

/** Three-line shape: acknowledge, respond, next-step. */
export interface RafikiShaped {
  ack: string;
  respond: string;
  next_step: string;
}

const ACK_SW = 'Nakusikia.';
const ACK_EN = 'I hear you.';
const NEXT_PREFIX_SW = 'Hatua:';
const NEXT_PREFIX_EN = 'Step:';

/**
 * Ensure the answer's .text reads as: "Nakusikia." + body + "Hatua: …".
 * Pass-through if the expert already wrote its own "Hatua:" line.
 */
export function shapeAnswer(ans: RafikiAnswer, _q: RafikiQuery): RafikiAnswer {
  const dataRecord =
    typeof ans.data === 'object' && ans.data !== null
      ? (ans.data as Record<string, unknown>)
      : undefined;
  if (dataRecord && dataRecord.shaped === false) return ans;

  const sw = ans.text.sw ?? '';
  const en = ans.text.en;

  if (sw.includes(NEXT_PREFIX_SW)) return ans;

  const swLines = sw.split('\n').map((l) => l.trim()).filter(Boolean);
  const swBody = swLines.length > 0 ? swLines.join(' ') : sw;
  const swFirst = swBody.split(/(?<=[\.!?])\s+/)[0] ?? swBody;
  const swRest = swBody.slice(swFirst.length).trim();
  const swNext = swRest
    ? `${NEXT_PREFIX_SW} ${swRest.split(/(?<=[\.!?])\s+/).slice(0, 1).join(' ')}`
    : `${NEXT_PREFIX_SW} Tuendelee polepole.`;
  const newSw = `${ACK_SW}\n${swFirst}\n${swNext}`;

  let newEn: string | undefined = en;
  if (typeof en === 'string' && en.length > 0 && !en.includes(NEXT_PREFIX_EN)) {
    const enBody = en.split('\n').map((l) => l.trim()).filter(Boolean).join(' ');
    const enFirst = enBody.split(/(?<=[\.!?])\s+/)[0] ?? enBody;
    const enRest = enBody.slice(enFirst.length).trim();
    const enNext = enRest
      ? `${NEXT_PREFIX_EN} ${enRest.split(/(?<=[\.!?])\s+/).slice(0, 1).join(' ')}`
      : `${NEXT_PREFIX_EN} Let us continue gently.`;
    newEn = `${ACK_EN}\n${enFirst}\n${enNext}`;
  }

  const shaped: RafikiShaped = {
    ack: ACK_SW,
    respond: swFirst,
    next_step: swNext,
  };

  return {
    ...ans,
    text: { sw: newSw, en: newEn },
    data: { ...(dataRecord ?? {}), shaped },
  };
}

export const FOLLOWUP_BOOST = 0.25;
const FOLLOWUP_FLOOR = 0.6;

function normalize(q: RafikiQuery | string): RafikiQuery {
  if (typeof q === 'string') return { text: q, lang: 'sw', mode: 'mwenza' };
  return { lang: 'sw', mode: 'mwenza', ...q, text: q.text ?? '' };
}

function emptyRegistryAnswer(q: RafikiQuery): RafikiAnswer {
  return {
    domain: 'jumla',
    expert: 'router',
    mode: q.mode ?? 'mwenza',
    text: {
      sw: 'Samahani, hakuna mtaalamu aliyesajiliwa kwa sasa.',
      en: 'Sorry, no expert is currently registered.',
    },
    confidence: 'low',
  };
}

function fallbackExpert(experts: RafikiExpert[]): RafikiExpert | undefined {
  return experts.find((e) => e.domain === 'jumla') ?? experts[experts.length - 1];
}

export function createRafiki(experts: RafikiExpert[] = []): Rafiki {
  const registry = [...experts];

  async function dispatch(query: RafikiQuery): Promise<RafikiAnswer> {
    if (registry.length === 0) return emptyRegistryAnswer(query);

    // 1. Safety FIRST — hard refusals
    if (isHardRefusal(query.text)) {
      return applyMode(refusalAnswer(query), query.mode ?? 'mwenza');
    }

    // 2. Safety — crisis detection overrides mode → mlinzi
    const crisisLevel = detectCrisis(query.text);
    if (crisisLevel === 'emergency' || crisisLevel === 'urgent') {
      return crisisAnswer(crisisLevel, query);
    }

    // 3. Follow-up boost
    const mem = (query.context?.memory as RafikiMemory | undefined) ?? undefined;
    const isFollowUp = !!mem?.lastDomain && looksLikeFollowUp(query.text);

    const scored = registry.map((expert, order) => {
      let score = 0;
      try {
        const s = expert.match(query);
        score = Number.isFinite(s) ? Math.max(0, Math.min(1, s)) : 0;
      } catch {
        score = 0;
      }
      if (isFollowUp && mem?.lastDomain === expert.domain) {
        score = Math.min(1, Math.max(score + FOLLOWUP_BOOST, FOLLOWUP_FLOOR));
      }
      return { expert, score, order };
    });

    const candidates = scored
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score || a.order - b.order);

    const fb = fallbackExpert(registry);

    if (candidates.length === 0 || candidates[0].score <= 0.001) {
      if (fb) {
        try {
          const ans = await fb.answer(query);
          return applyMode(ans, query.mode ?? 'mwenza');
        } catch {
          return emptyRegistryAnswer(query);
        }
      }
      return emptyRegistryAnswer(query);
    }

    for (const { expert } of candidates) {
      try {
        const raw = await expert.answer(query);
        const ans = shapeAnswer(raw, query);
        // Caution-level crisis still escalates to mlinzi mode on the answer.
        if (crisisLevel === 'caution') {
          return applyMode({ ...ans, crisis: { level: 'caution' } }, 'mlinzi');
        }
        return applyMode(ans, query.mode ?? 'mwenza');
      } catch {
        // fall through
      }
    }

    if (fb && !candidates.some((c) => c.expert === fb)) {
      try {
        const ans = await fb.answer(query);
        return applyMode(ans, query.mode ?? 'mwenza');
      } catch {
        /* fall through */
      }
    }
    return emptyRegistryAnswer(query);
  }

  return {
    experts: registry,
    ask: (q) => dispatch(normalize(q)),
  };
}

// ── Multi-turn session ──────────────────────────────────────────────────────

export interface RafikiSession {
  ask(q: RafikiQuery | string): Promise<RafikiAnswer>;
  history(): RafikiExchange[];
  memory(): RafikiMemory;
  reset(): void;
}

export function createRafikiSession(roho: Rafiki, maxTurns = 8): RafikiSession {
  let exchanges: RafikiExchange[] = [];
  let mem: RafikiMemory = emptyMemory();

  return {
    async ask(q) {
      const query = normalize(q);
      const context = injectContext(
        { ...(query.context ?? {}), history: exchanges },
        mem,
      );
      const withCtx: RafikiQuery = { ...query, context };
      const answer = await roho.ask(withCtx);
      const exchange: RafikiExchange = { query, answer, ts: Date.now() };
      exchanges = [...exchanges, exchange].slice(-maxTurns);
      mem = updateMemory(mem, query, answer, maxTurns);
      return answer;
    },
    history: () => [...exchanges],
    memory: () => mem,
    reset: () => {
      exchanges = [];
      mem = emptyMemory();
    },
  };
}
