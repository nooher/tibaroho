// experts/reminders.ts — local reminder scheduler (meds, exercises, check-ins).
// localStorage-backed queue; UI can poll due reminders.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

export interface Reminder {
  id: string;
  label: string;
  swLabel: string;
  /** ISO time of next fire. */
  nextAt: number;
  /** Cron-lite: 'daily', 'weekly', 'once', plus hour HH:MM. */
  schedule: { kind: 'daily' | 'weekly' | 'once'; time: string };
  category: 'med' | 'exercise' | 'checkin' | 'appointment';
}

const STORE = 'tibaroho.roho.reminders.v1';

function storage(): Storage | null {
  try {
    if (typeof window !== 'undefined') return window.localStorage;
  } catch {
    /* */
  }
  return null;
}

export function listReminders(): Reminder[] {
  const s = storage();
  if (!s) return [];
  try {
    const raw = s.getItem(STORE);
    return raw ? (JSON.parse(raw) as Reminder[]) : [];
  } catch {
    return [];
  }
}

export function saveReminder(r: Reminder): void {
  const s = storage();
  if (!s) return;
  const all = listReminders().filter((x) => x.id !== r.id);
  all.push(r);
  try {
    s.setItem(STORE, JSON.stringify(all));
  } catch {
    /* */
  }
}

export function deleteReminder(id: string): void {
  const s = storage();
  if (!s) return;
  const all = listReminders().filter((x) => x.id !== id);
  try {
    s.setItem(STORE, JSON.stringify(all));
  } catch {
    /* */
  }
}

export function dueReminders(now = Date.now()): Reminder[] {
  return listReminders().filter((r) => r.nextAt <= now);
}

const RX = /(nikumbushe|remind me|kumbusho|reminder|set a reminder|kunywa dawa|exercise|check in)/i;

function parseTime(text: string): string {
  const m = text.match(/(\d{1,2}):(\d{2})/);
  if (m) return `${m[1].padStart(2, '0')}:${m[2]}`;
  return '08:00';
}

function detectCategory(text: string): Reminder['category'] {
  const t = text.toLowerCase();
  if (/dawa|medication|pill|kidonge/.test(t)) return 'med';
  if (/mazoezi|exercise|tembea|workout/.test(t)) return 'exercise';
  if (/miadi|appointment/.test(t)) return 'appointment';
  return 'checkin';
}

export const remindersExpert: RafikiExpert = {
  id: 'roho-reminders',
  domain: 'reminders',
  label: 'Kumbusho',
  match(q) {
    if (RX.test(q.text)) return 0.72;
    return 0;
  },
  answer(q): RafikiAnswer {
    const time = parseTime(q.text);
    const category = detectCategory(q.text);
    const swLabels: Record<Reminder['category'], string> = {
      med: 'Kunywa dawa',
      exercise: 'Mazoezi',
      checkin: 'Hali yako leo',
      appointment: 'Miadi',
    };
    const enLabels: Record<Reminder['category'], string> = {
      med: 'Take medication',
      exercise: 'Exercise',
      checkin: 'How you are today',
      appointment: 'Appointment',
    };
    const id = `r_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const today = new Date();
    const [hh, mm] = time.split(':').map(Number);
    today.setHours(hh, mm, 0, 0);
    if (today.getTime() <= Date.now()) today.setDate(today.getDate() + 1);
    const reminder: Reminder = {
      id,
      label: enLabels[category],
      swLabel: swLabels[category],
      nextAt: today.getTime(),
      schedule: { kind: 'daily', time },
      category,
    };
    saveReminder(reminder);
    return {
      domain: 'reminders',
      expert: 'roho-reminders',
      mode: q.mode ?? 'mkumbusha',
      confidence: 'high',
      text: {
        sw: `Sawa — nimekuwekea kumbusho la "${swLabels[category]}" saa ${time} kila siku.`,
        en: `Done — I set a daily reminder for "${enLabels[category]}" at ${time}.`,
      },
      sources: [{ label: 'Mwenza Reminder Queue' }],
      data: reminder,
      followUps: ['Onyesha kumbusho zote', 'Futa kumbusho hili'],
    };
  },
};
