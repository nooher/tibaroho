// voice.ts — Web Speech API wrapper. Speak + listen with Swahili-first fallback.

import type { RafikiLang } from './types';

const LANG_MAP: Record<RafikiLang, string[]> = {
  sw: ['sw-TZ', 'sw-KE', 'sw'],
  sw_mtaa: ['sw-TZ', 'sw'],
  en: ['en-US', 'en-GB', 'en'],
};

function pickVoice(lang: RafikiLang): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !window.speechSynthesis) return undefined;
  const voices = window.speechSynthesis.getVoices();
  for (const code of LANG_MAP[lang]) {
    const v = voices.find((vv) => vv.lang.toLowerCase().startsWith(code.toLowerCase()));
    if (v) return v;
  }
  // English fallback for Swahili devices missing TZ voice.
  return voices.find((v) => v.lang.startsWith('en')) ?? voices[0];
}

export function speak(text: string, lang: RafikiLang = 'sw'): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (!text.trim()) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const v = pickVoice(lang);
    if (v) {
      utter.voice = v;
      utter.lang = v.lang;
    } else {
      utter.lang = LANG_MAP[lang][0];
    }
    utter.rate = 0.95;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  } catch {
    /* unsupported */
  }
}

export function stopSpeaking(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* */
  }
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function listen(lang: RafikiLang = 'sw'): Promise<string> {
  return new Promise((resolve, reject) => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      reject(new Error('Speech recognition not supported in this browser'));
      return;
    }
    const rec = new Ctor();
    rec.lang = LANG_MAP[lang][0];
    rec.continuous = false;
    rec.interimResults = false;
    let resolved = false;
    rec.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript ?? '';
      resolved = true;
      resolve(transcript);
    };
    rec.onerror = (e) => {
      if (!resolved) reject(new Error(e.error || 'speech-error'));
    };
    rec.onend = () => {
      if (!resolved) resolve('');
    };
    try {
      rec.start();
    } catch (err) {
      reject(err);
    }
  });
}

export function voiceSupported(): { speak: boolean; listen: boolean } {
  return {
    speak: typeof window !== 'undefined' && !!window.speechSynthesis,
    listen: !!getRecognitionCtor(),
  };
}
