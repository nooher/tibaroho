// mwenza/translate.ts — wrap the sovereign translation catalog for Mwenza.

import { t, translateText as catalogTranslate, type TLang } from '../translate';

export function translate(key: string, lang: TLang): string {
  return t(key, lang);
}

export function translateText(text: string, fromLang: TLang, toLang: TLang): string {
  return catalogTranslate(text, fromLang, toLang);
}

export type { TLang };
