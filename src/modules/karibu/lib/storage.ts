// karibu/lib/storage.ts — Karibu profile persistence.
// Local-first (instant UX) with Supabase write-through for consents and the
// user's lang/region/faith preferences. The wizard itself stays sync against
// localStorage so step-to-step transitions don't await network.

import { db } from '../../../lib/db'
import { hasBackend, supabase } from '../../../lib/supabase'
import { getMeId } from '../../../lib/me'

export type KaribuLang = 'sw' | 'en' | 'ar' | 'fr';
export type KaribuGender = 'mke' | 'mume' | 'mwingine' | 'sitakipa';
export type KaribuLiteracy = 'kusoma_kwa_urahisi' | 'kusoma_polepole' | 'sauti_tu';
export type KaribuFaith = 'none' | 'christian' | 'muslim' | 'mila';
export type KaribuTone = 'shangazi' | 'rika' | 'mwalimu' | 'mtaalamu';
export type KaribuContactMode = 'simu' | 'sms' | 'app';

export interface KaribuStep1 {
  name: string;          // pseudonym OK
  age: number;
  gender: KaribuGender;
  region: string;
  language: KaribuLang;
  literacy: KaribuLiteracy;
}

export interface KaribuStep2 {
  reasons: string[];     // chips picked
}

export interface KaribuStep3 {
  conditions: string[];        // ids like 'hiv', 'kisukari', etc.
  pregnant: boolean;
  trimester?: 1 | 2 | 3;
  dialysis?: boolean;
}

export interface KaribuStep4 {
  phq9: { items: number[]; total: number };
  gad7: { items: number[]; total: number };
  audit: { items: number[]; total: number };
  cssrs: { items: number[]; total: number };
  epds?: { items: number[]; total: number };   // only if pregnant
  crafft?: { items: number[]; total: number }; // only if 12-21
}

export interface KaribuStep5 {
  sleep_hours: number;
  exercise_days: number;
  social_support: 'nzuri' | 'wastani' | 'kidogo' | 'sina';
  employment: 'ajira' | 'biashara' | 'kilimo' | 'mwanafunzi' | 'sina';
  housing: 'salama' | 'wastani' | 'shida';
  ipv: 'hapana' | 'imewahi' | 'sasa';
}

export interface KaribuTrustContact {
  name: string;
  relation: string;
  phone: string;
}

export interface KaribuStep6 {
  tone: KaribuTone;
  faith: KaribuFaith;
  trust: KaribuTrustContact[];
  contact_mode: KaribuContactMode;
}

export interface KaribuStep7 {
  goals: string[];           // 1..3
  consent_plan: boolean;
}

export interface KaribuProfile {
  v: 1;
  step1?: KaribuStep1;
  step2?: KaribuStep2;
  step3?: KaribuStep3;
  step4?: KaribuStep4;
  step5?: KaribuStep5;
  step6?: KaribuStep6;
  step7?: KaribuStep7;
  startedAt?: string;
  completedAt?: string;
}

const KEY = 'tumaini.karibu.v1';
const KEY_DONE = 'tumaini.karibu.v1.complete';

export function loadProfile(): KaribuProfile {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { v: 1, startedAt: new Date().toISOString() };
    return JSON.parse(raw) as KaribuProfile;
  } catch {
    return { v: 1, startedAt: new Date().toISOString() };
  }
}

export function saveProfile(p: KaribuProfile): void {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* noop */ }
}

export function markComplete(): void {
  try {
    localStorage.setItem(KEY_DONE, 'true');
    const p = loadProfile();
    p.completedAt = new Date().toISOString();
    saveProfile(p);
  } catch { /* noop */ }
}

export function isComplete(): boolean {
  try { return localStorage.getItem(KEY_DONE) === 'true'; } catch { return false; }
}

export function resetKaribu(): void {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(KEY_DONE);
  } catch { /* noop */ }
}

// ─── Supabase write-through ────────────────────────────────────────────────
// Map the Karibu faith enum to the tr_users.faith text column.
const FAITH_MAP: Record<KaribuFaith, string> = {
  none: 'none',
  christian: 'christian',
  muslim: 'muslim',
  mila: 'mila',
};

/**
 * Persist the finished profile to Supabase:
 *  - tr_users patch (lang, region, faith)
 *  - tr_consents rows for service / data_share / research / minor_assent
 *    (whichever the profile collected via step6/step7)
 *
 * Falls through to localStorage-only when there's no backend.
 */
export async function persistProfileToBackend(p: KaribuProfile): Promise<void> {
  // Always mark complete locally so the wizard exit is instant.
  markComplete();

  if (!hasBackend || !supabase) return;

  let userId: string;
  try {
    userId = await getMeId();
  } catch {
    return;
  }

  // 1) Update tr_users with lang / region / faith if we have them.
  const userPatch: Record<string, unknown> = {};
  if (p.step1?.language) userPatch.lang = p.step1.language;
  if (p.step1?.region)   userPatch.region = p.step1.region;
  if (p.step6?.faith)    userPatch.faith = FAITH_MAP[p.step6.faith] ?? 'none';
  if (Object.keys(userPatch).length) {
    try {
      await supabase.from('tr_users').update(userPatch).eq('id', userId);
    } catch { /* graceful */ }
  }

  // 2) Consents.
  //  - 'service'      : finishing Karibu implies service consent
  //  - 'data_share'   : implied by completing the Care-plan step (step7.consent_plan)
  //  - 'minor_assent' : only if step1.age < 18
  const consents: Array<{ kind: string; granted: boolean; notes?: string }> = [];
  consents.push({ kind: 'service', granted: true });
  if (p.step7?.consent_plan) consents.push({ kind: 'data_share', granted: true });
  if ((p.step1?.age ?? 99) < 18) consents.push({ kind: 'minor_assent', granted: true });

  // Insert sequentially so an early failure doesn't poison later writes.
  for (const c of consents) {
    try {
      await db.insert('tr_consents', {
        user_id: userId,
        kind: c.kind,
        granted: c.granted,
        granted_at: new Date().toISOString(),
        notes: c.notes,
      });
    } catch { /* graceful — RLS / network */ }
  }

  // 3) Best-effort audit row.
  try { await db.audit('karibu.complete', 'tr_users', userId, { lang: p.step1?.language }); } catch { /* noop */ }
}

/** Mark Karibu complete *and* sync to backend. Wrapper around the sync
 *  markComplete() above so callers can simply `void markCompleteAsync(p)`. */
export async function markCompleteAsync(p: KaribuProfile): Promise<void> {
  await persistProfileToBackend(p);
}
