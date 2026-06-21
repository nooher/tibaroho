// mwenza/notes.ts — Mwenza shortcut to the universal Andika store.

import { saveNote, type AndikaNote } from '../andika';

export interface CaptureOptions {
  mood?: string;
  tags?: string[];
  route?: string;
}

export function captureNote(text: string, options: CaptureOptions = {}): AndikaNote {
  return saveNote({
    text,
    mood: options.mood,
    tags: options.tags ?? [],
    route:
      options.route ??
      (typeof window !== 'undefined' ? window.location.pathname : '/'),
  });
}
