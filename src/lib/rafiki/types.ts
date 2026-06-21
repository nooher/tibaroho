// types.ts — the Rafiki contract. Sovereign Swahili-first behavioral-health AI.
// Every expert implements RafikiExpert; router picks top scorer. No external LLM.

export type RafikiLang = 'sw' | 'en' | 'sw_mtaa';

/** 6 personality modes — each tunes the same experts' formatting. */
export type RafikiMode =
  | 'mwenza'      // companion — warm conversational
  | 'mfunzi'      // coach — structured, program-aware
  | 'mlinzi'      // sentinel — crisis active, brief, action-focused
  | 'mwandishi'   // writer — drafting letters/journal
  | 'mhakiki'     // critic — Socratic challenger of distortions
  | 'mkumbusha';  // reminder — short, action-oriented

export type RafikiDomain =
  | 'triage'
  | 'psychoEducation'
  | 'activeListening'
  | 'cbtReframe'
  | 'motivationalInterviewing'
  | 'crisis'
  | 'medicationLiteracy'
  | 'sleepHygiene'
  | 'substanceUse'
  | 'familyRelationship'
  | 'faithInformed'
  | 'bibliotherapy'
  | 'goalsValues'
  | 'reminders'
  | 'jumla';

export type RafikiConfidence = 'high' | 'medium' | 'low';

export type CrisisLevel = 'safe' | 'caution' | 'urgent' | 'emergency';

export type FaithPreference = 'none' | 'christian' | 'muslim' | 'traditional' | 'multi';

export interface AssessmentScores {
  phq9?: number;     // 0..27 depression
  gad7?: number;     // 0..21 anxiety
  audit?: number;    // 0..40 alcohol
  pcl5?: number;     // 0..80 PTSD
  cssrs?: number;    // 0..5 suicide severity
  k10?: number;
  epds?: number;
  crafft?: number;
}

export interface RafikiQuery {
  text: string;
  lang?: RafikiLang;
  mode?: RafikiMode;
  faith?: FaithPreference;
  assessments?: AssessmentScores;
  context?: Record<string, unknown>;
}

export interface RafikiSource {
  label: string;
  ref?: string;
}

export interface RafikiCrisisInfo {
  level: CrisisLevel;
  hotlines?: { name: string; number: string; verified: boolean }[];
  safetyPlanPrompt?: boolean;
}

export interface RafikiAnswer {
  domain: RafikiDomain;
  expert: string;
  text: { sw: string; en?: string };
  confidence: RafikiConfidence;
  mode: RafikiMode;
  sources?: RafikiSource[];
  crisis?: RafikiCrisisInfo;
  /** Optional follow-up prompts the UI may surface. */
  followUps?: string[];
  /** Optional expert payload (e.g. thought record skeleton, goal). */
  data?: unknown;
}

export interface RafikiExpert {
  id: string;
  domain: RafikiDomain;
  label: string;
  match(q: RafikiQuery): number;
  answer(q: RafikiQuery): RafikiAnswer | Promise<RafikiAnswer>;
}

export interface MemoryEntry {
  key: string;
  value: unknown;
  ts: number;
  tags?: string[];
}

export interface RafikiSafety {
  /** Hard refusals — categories Rafiki will never do. */
  refusedDomains: string[];
  /** Crisis keywords (sw + en + sw_mtaa). */
  crisisKeywords: string[];
  /** Tanzania hotlines. */
  hotlines: { name: string; number: string; verified: boolean; scope: string }[];
}

export interface RafikiExchange {
  query: RafikiQuery;
  answer: RafikiAnswer;
  ts: number;
}
