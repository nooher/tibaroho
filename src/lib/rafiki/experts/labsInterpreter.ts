// labsInterpreter.ts — Mwenza expert that interprets simple lab phrasings.
// Looks for patterns like "TEST = VALUE" or "TEST: VALUE" and consults
// REF_RANGES for a Swahili-first interpretation.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types'
import { REF_RANGES, interpretLab, findRangeByText } from '../../../modules/Mimi/labs/data/refRanges'

const RX_TRIGGER = /(maabara|\blab\b|kipimo|hb|hemoglob|glucose|creatinine|cholesterol|cd4|viral load|hba1c)/i
const RX_NUMBER = /\d+(\.\d+)?/

function extractPair(text: string): { range: ReturnType<typeof findRangeByText>; value: number | string } | undefined {
  // Try TEST = VALUE or TEST: VALUE
  const m = text.match(/([A-Za-z][A-Za-z0-9 _-]{1,30})\s*[:=]\s*([0-9]+(?:\.[0-9]+)?|positive|negative|chanya|hasi|reactive|non-reactive)/i)
  if (m) {
    const range = findRangeByText(m[1])
    if (range) return { range, value: m[2] }
  }
  // Fallback: find any known test mentioned, then first number
  const range = findRangeByText(text)
  if (!range) return undefined
  const num = text.match(RX_NUMBER)
  if (num) return { range, value: Number(num[0]) }
  if (range.qualitative) {
    return { range, value: text }
  }
  return undefined
}

export const labsInterpreter: RafikiExpert = {
  id: 'roho-labs',
  domain: 'psychoEducation',
  label: 'Labs',
  match(q) {
    if (!RX_TRIGGER.test(q.text)) return 0
    if (!RX_NUMBER.test(q.text) && !/(chanya|positive|hasi|negative|reactive)/i.test(q.text)) return 0
    return 0.85
  },
  answer(q: RafikiQuery): RafikiAnswer {
    const pair = extractPair(q.text)
    if (!pair || !pair.range) {
      return {
        domain: 'psychoEducation',
        expert: 'roho-labs',
        mode: q.mode ?? 'mwenza',
        confidence: 'low',
        text: {
          sw: 'Sijaweza kutambua kipimo. Andika kwa muundo wa "JINA = THAMANI", mfano "Hb = 10.5".',
          en: 'I could not detect a lab test. Try the form "NAME = VALUE", e.g. "Hb = 10.5".',
        },
      }
    }
    const result = interpretLab(pair.value, pair.range)
    const questions = [
      `Je, matokeo haya yanahitaji kipimo cha kufuatilia?`,
      `Ni nini husababisha mabadiliko ya ${pair.range.name_sw}?`,
      `Je, kuna mtindo wa maisha au dawa zinazoweza kusaidia?`,
    ]
    return {
      domain: 'psychoEducation',
      expert: 'roho-labs',
      mode: q.mode ?? 'mwenza',
      confidence: 'medium',
      text: {
        sw: `${result.message_sw}\nKumbuka: tafsiri ya daktari ni muhimu kwa muktadha wa hali yako.`,
        en: `${result.message_en}\nNote: a clinician's interpretation matters for your full context.`,
      },
      sources: [{ label: pair.range.source }],
      followUps: questions,
      data: { rangeId: pair.range.id, flag: result.flag, totalKnownTests: REF_RANGES.length },
    }
  },
}
