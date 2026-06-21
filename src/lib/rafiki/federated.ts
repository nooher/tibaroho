// federated.ts — Rafiki federation layer.
//
// Strategy: Rafiki owns the behavioral-health primary lane (14 experts under
// ./experts) — assessments, crisis routing, CBT/MI/active-listening, faith,
// family, sleep, perinatal, substance, psychoed, reasoners. For any question
// it cannot answer with high confidence, federate to the VENDORED Akili
// router (src/lib/akili), which itself wraps:
//
//   • afya     → TibaAI (32 conditions, 18 drugs, 14 labs — sovereign)
//   • fasihi   → Kasuku literature engine
//   • lugha    → Kasuku Swahili dictionary / translate / phonemize
//   • sheria   → Tanzanian law & rights basics
//   • kilimo   → agriculture
//   • elimu    → study help / education system
//   • biashara → small business / financial literacy
//   • logistiki→ CargoLink Rubani (logistics)
//   • jumla    → greetings / about / fallback
//
// Net effect: any question — clinical, legal, medication, agricultural,
// civic — gets a real sovereign answer, no external LLM, no network.

import { askAkili, type AkiliAnswer } from '../akili';

export interface FederatedContext {
  faith?: 'none' | 'christian' | 'muslim' | 'traditional' | 'multi';
  conditions?: string[];
  trimester?: number;
  age?: number;
  lang?: 'sw' | 'en' | 'sw_mtaa';
}

export interface FederatedReply {
  ack: string;
  respond: string;
  next_step: string;
  source: string;
  domain: string;
  confidence: 'high' | 'medium' | 'low';
}

// ─────────────────────────────────────────────────────────────────────────────
// Light Swahili cue map — used ONLY to label the originating engine so the
// caller can render the right badge ("TibaAI", "TibaMama", "Akili — sheria",
// etc.). The actual answer comes from Akili regardless. Returning a labelled
// hint up front avoids confusing users when they ask a renal question and
// hear back from the umbrella router.
// ─────────────────────────────────────────────────────────────────────────────
const DOMAIN_HINTS: Array<{ label: string; rx: RegExp }> = [
  { label: 'TibaAI',     rx: /(homa|fever|malaria|tb|hiv|vvu|asthma|pumu|kifua|cd4|art|viral)/i },
  { label: 'TibaFigo',   rx: /(figo|kidney|renal|ckd|creatinine|dialysis|dialisi|egfr|epo)/i },
  { label: 'TibaAfya',   rx: /(dawa|medication|kidonge|kumeza|niliruka|mwingiliano|interaction|madhara)/i },
  { label: 'TibaMama',   rx: /(mimba|pregnant|epds|baby blues|kicks|chanjo|rch|mtoto|trimester)/i },
  { label: 'Akili · Sheria', rx: /(haki|sheria|katiba|mahakama|kesi|polisi|talaka)/i },
  { label: 'Akili · Elimu',  rx: /(shule|chuo|necta|form|elimu|masomo|mwalimu|kidato)/i },
  { label: 'Akili · Biashara',rx: /(biashara|mtaji|tin|brela|kodi|sole|kibarua)/i },
  { label: 'Kasuku',     rx: /(shairi|riwaya|kitabu|hadithi|fasihi|methali|maandiko)/i },
];

function labelFromQuery(q: string): string {
  for (const h of DOMAIN_HINTS) if (h.rx.test(q)) return h.label;
  return 'Akili (sovereign federation)';
}

function mapConfidence(c: AkiliAnswer['confidence']): FederatedReply['confidence'] {
  // Akili confidence is 'high' | 'medium' | 'low' — same shape, but kept as a
  // mapper in case the contract diverges later.
  return c;
}

function summarize(text: string, max = 280): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

/**
 * Federate to Akili — sovereign, deterministic, no network.
 * The Akili router picks the right expert (TibaAI for clinical, Kasuku for
 * literature, sheria for law, etc.) and returns a domain-specific answer.
 */
export async function askFederated(
  query: string,
  ctx: FederatedContext = {},
): Promise<FederatedReply> {
  const label = labelFromQuery(query);
  try {
    const a = await askAkili({ text: query, lang: ctx.lang ?? 'sw' });
    const body = a.text?.sw || a.text?.en || '';
    const src  = a.sources?.[0]?.label || a.domain || 'Akili';
    return {
      ack: 'Nakusikia.',
      respond: summarize(body) || 'Sina jibu maalum bado — niambie zaidi.',
      next_step: 'Hatua: Tuongee na mtaalamu wa karibu kwa undani zaidi.',
      source: src,
      domain: label,
      confidence: mapConfidence(a.confidence),
    };
  } catch (e) {
    return {
      ack: 'Nakusikia.',
      respond: 'Sijaweza kufika kwenye injini ya majibu sasa hivi — niambie zaidi au tujaribu tena.',
      next_step: 'Hatua: Tujaribu kuuliza tena, au tuongee na mtaalamu.',
      source: 'Akili (federation error: ' + (e instanceof Error ? e.message : String(e)) + ')',
      domain: 'Akili',
      confidence: 'low',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy shape kept for any older callers that imported `federated.tibaai`
// etc. They now all funnel through askFederated under the hood.
// ─────────────────────────────────────────────────────────────────────────────
function legacyAsk(q: string, ctx: FederatedContext = {}): FederatedReply {
  // Synchronous shim — best-effort. Real callers should switch to askFederated.
  // We return a stub immediately and fire the real query in the background.
  void askFederated(q, ctx)
  return {
    ack: 'Nakusikia.',
    respond: 'Inafuatilia kwenye Akili (sovereign engine)…',
    next_step: 'Hatua: Subiri jibu, au tumia askFederated() kwa async response.',
    source: labelFromQuery(q),
    domain: labelFromQuery(q),
    confidence: 'low',
  }
}

export const federated = {
  tibaai:   { domain: 'clinical',  ask: (q: string, c: FederatedContext = {}) => legacyAsk(q, c) },
  tibafigo: { domain: 'renal',     ask: (q: string, c: FederatedContext = {}) => legacyAsk(q, c) },
  tibaafya: { domain: 'meds',      ask: (q: string, c: FederatedContext = {}) => legacyAsk(q, c) },
  tibamama: { domain: 'perinatal', ask: (q: string, c: FederatedContext = {}) => legacyAsk(q, c) },
}

// ── Routing helpers (used by Rafiki router to decide whether to federate) ───
export function detectFederatedDomain(text: string): keyof typeof federated | null {
  const t = text.toLowerCase();
  if (/(vvu|hiv|ukimwi|art|cd4|viral load|malaria|tb|kifua|homa)/i.test(t)) return 'tibaai';
  if (/(figo|kidney|ckd|dialysis|dialisi|creatinine|epo|egfr)/i.test(t)) return 'tibafigo';
  if (/(dawa|medication|kumeza|niliruka|mwingiliano|interaction|madhara|kidonge)/i.test(t)) return 'tibaafya';
  if (/(mimba|pregnant|epds|baby blues|kicks|chanjo|mtoto|rch)/i.test(t)) return 'tibamama';
  return null;
}
