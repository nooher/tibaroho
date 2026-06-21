// index.ts — Rafiki engine barrel. Single ask() entrypoint + a default session.

import { createRafiki, createRafikiSession } from './router';
import type { Rafiki, RafikiSession } from './router';
import { allExperts } from './experts';
import type { RafikiAnswer, RafikiQuery } from './types';

export const roho: Rafiki = createRafiki(allExperts);

/** Stateless one-shot ask. */
export function ask(q: RafikiQuery | string): Promise<RafikiAnswer> {
  return roho.ask(q);
}

/** Convenience factory for a multi-turn session. */
export function newSession(maxTurns = 8): RafikiSession {
  return createRafikiSession(roho, maxTurns);
}

// Re-exports
export { createRafiki, createRafikiSession } from './router';
export type { Rafiki, RafikiSession } from './router';
export { allExperts } from './experts';
export * from './types';
export {
  remember,
  recall,
  recallByTag,
  wipe,
  summary,
  emptyMemory,
  looksLikeFollowUp,
  updateMemory,
  injectContext,
} from './memory';
export type { RafikiMemory } from './memory';
export {
  CRISIS_KEYWORDS_HIGH,
  CRISIS_KEYWORDS_MED,
  TZ_HOTLINES,
  detectCrisis,
  detectIPV,
  isHardRefusal,
  refusalAnswer,
  crisisAnswer,
  generateClinicalBrief,
  ROHO_SAFETY_CONFIG,
} from './safety';
export { MODES, applyMode } from './modes';
export type { ModeProfile } from './modes';
export { speak, stopSpeaking, listen, voiceSupported } from './voice';
export {
  analyzeImage,
  wrapAudio,
  extractDocumentText,
  transcribeAudio,
  routeFileToModal,
  summarizeDocument,
} from './multimodal';
export type {
  ImageSentiment,
  AudioCarrier,
  DocumentExtract,
  TranscriptionResult,
  ModalKind,
} from './multimodal';
export { pumziCoach } from './experts/pumziCoach';
export {
  ROUTE_PREFERENCES,
  findPreferenceForPath,
  useCurrentRoute,
} from './route_awareness';
export type { RoutePreference } from './route_awareness';
export { captureNote } from './notes';
export { translate, translateText } from './translate';
export { shapeAnswer } from './router';
export type { RafikiShaped } from './router';
export {
  listReminders,
  saveReminder,
  deleteReminder,
  dueReminders,
} from './experts/reminders';
export type { Reminder } from './experts/reminders';
export { DISTORTIONS } from './experts/cbtReframe';
export type { Distortion } from './experts/cbtReframe';
export { CSSRS_ITEMS, SAFETY_PLAN_STEPS_SW, SAFETY_PLAN_STEPS_EN } from './experts/crisis';
export { PHQ9, GAD7, AUDIT, CSSRS_URGENT_FROM } from './experts/triage';
export { MH_REG_2016, findRegulationAnswer, askMHRegulation } from './kb/mh_regulations_2016';
export type { MHRegEntry } from './kb/mh_regulations_2016';
export { TUMAINI_FAQ, findFaqAnswer, askFaq } from './kb/tumaini_faq';
export type { FaqEntry } from './kb/tumaini_faq';
export { TZ_MH_ACT_2008, findActAnswer, askMHAct2008 } from './kb/tz_mental_health_act_2008';
export type { ActEntry } from './kb/tz_mental_health_act_2008';
