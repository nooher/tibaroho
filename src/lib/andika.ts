// andika.ts — universal note capture, local-first with optional Supabase sync.
//
// Persists to tr_journal_entries (the canonical schema table). Notes that
// originate outside the patient journal get an extra tag like 'andika:route:/mimi'
// so the journal view can filter to "real" entries vs. ambient captures, and
// Rafiki chat (which uses the 'rafiki:<mode>' tag set) stays separate.

import { hasBackend, supabase } from './supabase'
import { getMeId } from './me'

export interface AndikaNote {
  id: string
  text: string
  ts: number
  route: string
  mood?: string
  tags: string[]
  imageDataUrl?: string
}

const STORAGE_KEY = 'tumaini.notes.v1'

function readAll(): AndikaNote[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((n): n is AndikaNote => {
      if (typeof n !== 'object' || n === null) return false
      const o = n as Record<string, unknown>
      return typeof o.id === 'string' && typeof o.text === 'string' && typeof o.ts === 'number'
    })
  } catch {
    return []
  }
}

function writeAll(notes: AndikaNote[]): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    /* ignore */
  }
}

function genId(): string {
  return `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function listNotes(): AndikaNote[] {
  return readAll().sort((a, b) => b.ts - a.ts)
}

// Mood string (e.g. 'tulivu', '3') → smallint 1..10 for the journal column.
function moodToSmallint(mood?: string): number | null {
  if (!mood) return null
  const n = Number.parseInt(mood, 10)
  if (Number.isFinite(n) && n >= 1 && n <= 10) return n
  return null
}

export function saveNote(partial: Partial<AndikaNote> & { text: string }): AndikaNote {
  const note: AndikaNote = {
    id: partial.id ?? genId(),
    text: partial.text,
    ts: partial.ts ?? Date.now(),
    route: partial.route ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    mood: partial.mood,
    tags: partial.tags ?? [],
    imageDataUrl: partial.imageDataUrl,
  }
  const all = readAll()
  const existing = all.findIndex((n) => n.id === note.id)
  if (existing >= 0) all[existing] = note
  else all.unshift(note)
  writeAll(all)

  if (hasBackend && supabase) {
    void (async () => {
      try {
        const userId = await getMeId()
        const tags = note.tags.slice()
        // Stamp route + image presence as tags so we can reconstruct on read.
        tags.push(`andika:route:${note.route}`)
        if (note.imageDataUrl) tags.push('andika:has_image')
        if (note.mood) tags.push(`andika:mood:${note.mood}`)
        await supabase.from('tr_journal_entries').upsert({
          id: note.id,
          user_id: userId,
          body: note.text,
          mood: moodToSmallint(note.mood),
          tags,
          created_at: new Date(note.ts).toISOString(),
        })
      } catch { /* graceful */ }
    })()
  }
  return note
}

export function deleteNote(id: string): void {
  const all = readAll().filter((n) => n.id !== id)
  writeAll(all)
  if (hasBackend && supabase) {
    void (async () => {
      try { await supabase.from('tr_journal_entries').delete().eq('id', id) } catch { /* graceful */ }
    })()
  }
}
