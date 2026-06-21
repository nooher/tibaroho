// karibu/lib/storage.ts — local persistence of the Karibu profile.

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
