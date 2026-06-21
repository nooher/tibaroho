// andika.ts — universal note capture, local-first with optional cloud sync.

import { hasBackend, supabase } from './supabase'

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
    try {
      void supabase
        .from('tr_notes')
        .upsert({
          id: note.id,
          text: note.text,
          ts: note.ts,
          route: note.route,
          mood: note.mood ?? null,
          tags: note.tags,
          has_image: !!note.imageDataUrl,
        })
        .then(() => {})
    } catch {
      /* graceful fail */
    }
  }
  return note
}

export function deleteNote(id: string): void {
  const all = readAll().filter((n) => n.id !== id)
  writeAll(all)
  if (hasBackend && supabase) {
    try {
      void supabase.from('tr_notes').delete().eq('id', id).then(() => {})
    } catch {
      /* graceful */
    }
  }
}
