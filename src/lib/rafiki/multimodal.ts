// multimodal.ts — image color-sentiment, audio passthrough, document text extract.
// v1: provider-bound for clinical hand-off; sentiment is heuristic only.

export interface ImageSentiment {
  /** Dominant warmth: -1 (cool/sad) .. +1 (warm/bright). */
  warmth: number;
  /** Mean brightness 0..1. */
  brightness: number;
  /** Heuristic mood label in Swahili + English. */
  mood: { sw: string; en: string };
}

export async function analyzeImage(file: Blob): Promise<ImageSentiment> {
  if (typeof window === 'undefined' || !window.createImageBitmap) {
    return {
      warmth: 0,
      brightness: 0.5,
      mood: { sw: 'Haijaweza kuchambua picha', en: 'Image analysis unavailable' },
    };
  }
  try {
    const bmp = await window.createImageBitmap(file);
    const w = 64;
    const h = Math.max(1, Math.floor((bmp.height / bmp.width) * w));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no-2d-context');
    ctx.drawImage(bmp, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i]; g += data[i + 1]; b += data[i + 2];
      n++;
    }
    r /= n; g /= n; b /= n;
    const brightness = (r + g + b) / (3 * 255);
    // warmth: red+yellow channels vs blue
    const warmth = ((r + g) / 2 - b) / 255;
    const moodSw = brightness < 0.3
      ? 'Picha ina uzito — rangi nyeusi/giza.'
      : warmth < -0.05
      ? 'Picha ina rangi za baridi — utulivu au huzuni.'
      : warmth > 0.1
      ? 'Picha ina rangi za joto — nguvu au matumaini.'
      : 'Picha ina mwanga wa wastani.';
    const moodEn = brightness < 0.3
      ? 'Image carries weight — dark tones.'
      : warmth < -0.05
      ? 'Image has cool tones — calm or sadness.'
      : warmth > 0.1
      ? 'Image has warm tones — energy or hope.'
      : 'Image is moderate.';
    return { warmth, brightness, mood: { sw: moodSw, en: moodEn } };
  } catch {
    return {
      warmth: 0,
      brightness: 0.5,
      mood: { sw: 'Imeshindwa kuchambua picha', en: 'Could not analyze image' },
    };
  }
}

export interface AudioCarrier {
  blob: Blob;
  durationMs?: number;
  type: string;
}

export function wrapAudio(blob: Blob, durationMs?: number): AudioCarrier {
  return { blob, durationMs, type: blob.type || 'audio/webm' };
}

export interface DocumentExtract {
  text: string;
  charCount: number;
  truncated: boolean;
}

const MAX_DOC_CHARS = 50_000;

/**
 * Best-effort transcription. Uses the Web Speech API live mic when available,
 * via the listen() helper. For an arbitrary AudioCarrier (recorded blob) v1
 * returns an empty low-confidence stub — server-side transcription is the
 * sovereign path; we do NOT call an external LLM.
 */
import type { RafikiLang } from './types';
import { listen } from './voice';

export interface TranscriptionResult {
  text: string;
  confidence: 'high' | 'medium' | 'low';
}

export async function transcribeAudio(
  audio: AudioCarrier | undefined,
  lang: RafikiLang,
): Promise<TranscriptionResult> {
  if (!audio || !audio.blob || audio.blob.size === 0) {
    try {
      const text = await listen(lang);
      return { text, confidence: text ? 'medium' : 'low' };
    } catch {
      return { text: '', confidence: 'low' };
    }
  }
  // Pre-recorded blob path requires a sovereign on-device ASR — not in v1.
  return { text: '', confidence: 'low' };
}

export type ModalKind = 'image' | 'audio' | 'document' | 'unknown';

export async function routeFileToModal(file: File): Promise<ModalKind> {
  const type = (file.type || '').toLowerCase();
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('audio/')) return 'audio';
  if (
    type === 'application/pdf' ||
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type.startsWith('text/')
  ) {
    return 'document';
  }
  const name = file.name.toLowerCase();
  if (/\.(png|jpe?g|gif|webp|svg|heic)$/.test(name)) return 'image';
  if (/\.(mp3|wav|webm|m4a|ogg|opus)$/.test(name)) return 'audio';
  if (/\.(pdf|docx?|txt|md|rtf)$/.test(name)) return 'document';
  return 'unknown';
}

export function summarizeDocument(extract: DocumentExtract, maxWords = 80): string {
  const text = (extract.text || '').trim();
  if (!text) return '';
  const sentences = text.split(/(?<=[\.!?])\s+/);
  const out: string[] = [];
  let count = 0;
  for (const s of sentences) {
    const words = s.split(/\s+/).filter(Boolean);
    if (count + words.length > maxWords) {
      const remaining = maxWords - count;
      if (remaining > 0) out.push(words.slice(0, remaining).join(' ') + '…');
      break;
    }
    out.push(s);
    count += words.length;
    if (count >= maxWords) break;
  }
  return out.join(' ').trim();
}

export async function extractDocumentText(file: Blob): Promise<DocumentExtract> {
  // v1: plain-text + UTF-8 best-effort. PDFs/DOCX needs server side; flag explicitly.
  try {
    const txt = await file.text();
    const truncated = txt.length > MAX_DOC_CHARS;
    return {
      text: truncated ? txt.slice(0, MAX_DOC_CHARS) : txt,
      charCount: txt.length,
      truncated,
    };
  } catch {
    return { text: '', charCount: 0, truncated: false };
  }
}
