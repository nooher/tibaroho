// index.ts — Akili's public API (Tumaini vendored fork).
// Sovereign by design: every expert is pure, deterministic TS (no external LLM).
// snilExpert removed in this fork because it depends on an external
// @laetoli/snil package that is not vendored here.

import { createAkili, createAkiliSession } from './router';
import type { Akili } from './router';
import { jumlaExpert } from './experts/jumla';
import { afyaExpert } from './experts/afya';
import { fasihiExpert, lughaExpert } from './experts/fasihi';
import { sheriaExpert } from './experts/sheria';
import { kilimoExpert } from './experts/kilimo';
import { elimuExpert } from './experts/elimu';
import { biasharaExpert } from './experts/biashara';
import { logistikiExpert } from './experts/logistiki';
import type { AkiliAnswer, AkiliQuery, DomainExpert } from './types';

/** Default expert registry. Tie-priority comes first; jumla last as fallback. */
export const defaultExperts: DomainExpert[] = [
  afyaExpert,
  fasihiExpert,
  lughaExpert,
  sheriaExpert,
  kilimoExpert,
  elimuExpert,
  biasharaExpert,
  logistikiExpert,
  jumlaExpert,
];

export const akili: Akili = createAkili(defaultExperts);

export function askAkili(q: AkiliQuery | string): Promise<AkiliAnswer> {
  return akili.ask(q);
}

export { createAkili, createAkiliSession };
export type { Akili, AkiliExchange, AkiliSession } from './router';
export { jumlaExpert } from './experts/jumla';
export { afyaExpert } from './experts/afya';
export { fasihiExpert, lughaExpert } from './experts/fasihi';
export { sheriaExpert } from './experts/sheria';
export { kilimoExpert } from './experts/kilimo';
export { elimuExpert } from './experts/elimu';
export { biasharaExpert } from './experts/biashara';
export { logistikiExpert } from './experts/logistiki';

export * from './types';
