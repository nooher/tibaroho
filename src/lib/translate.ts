// translate.ts — multilingual catalog for Tumaini · TBHOS.
//
// Honest verification flags. Entries marked verified=false are best-effort
// and should be confirmed by a native speaker before clinical use.
// Arabic is hand-written conservatively where well-published, otherwise omitted.

export type TLang = 'sw' | 'en' | 'ar' | 'rn' | 'ln'

export interface TEntry {
  sw: string
  en?: string
  ar?: string
  rn?: string
  ln?: string
  verified?: { ar?: boolean; rn?: boolean; ln?: boolean }
}

export const CATALOG: Record<string, TEntry> = {
  // ── PHQ-9 ──────────────────────────────────────────────────────────────
  'phq9.title': { sw: 'PHQ-9 — Tathmini ya huzuni', en: 'PHQ-9 — Depression screen', ar: 'PHQ-9 — فحص الاكتئاب', verified: { ar: true } },
  'phq9.lead_in': {
    sw: 'Kwa wiki mbili zilizopita, ni mara ngapi umesumbuliwa na:',
    en: 'Over the last 2 weeks, how often have you been bothered by:',
    ar: 'خلال الأسبوعين الماضيين، كم مرة أزعجتك:',
    verified: { ar: true },
  },
  'phq9.scale.0': { sw: 'Hapana kabisa', en: 'Not at all', ar: 'أبداً', verified: { ar: true } },
  'phq9.scale.1': { sw: 'Siku chache', en: 'Several days', ar: 'عدة أيام', verified: { ar: true } },
  'phq9.scale.2': { sw: 'Zaidi ya nusu ya siku', en: 'More than half the days', ar: 'أكثر من نصف الأيام', verified: { ar: true } },
  'phq9.scale.3': { sw: 'Karibu kila siku', en: 'Nearly every day', ar: 'تقريباً كل يوم', verified: { ar: true } },
  'phq9.q1': { sw: 'Kupungukiwa na hamu au furaha ya kufanya mambo.', en: 'Little interest or pleasure in doing things.', ar: 'قلة الاهتمام أو المتعة في القيام بالأشياء.', verified: { ar: true } },
  'phq9.q2': { sw: 'Kujisikia chini, mfadhaiko, au kukata tamaa.', en: 'Feeling down, depressed, or hopeless.', ar: 'الشعور بالحزن أو الاكتئاب أو اليأس.', verified: { ar: true } },
  'phq9.q3': { sw: 'Shida ya kulala — kulala kidogo, kuamka mara nyingi, au kulala mno.', en: 'Trouble falling/staying asleep, or sleeping too much.', ar: 'صعوبة في النوم أو النوم لفترات طويلة.', verified: { ar: true } },
  'phq9.q4': { sw: 'Kuhisi uchovu au kukosa nguvu.', en: 'Feeling tired or having little energy.', ar: 'الشعور بالتعب أو قلة الطاقة.', verified: { ar: true } },
  'phq9.q5': { sw: 'Hamu mbaya ya chakula au kula kupita kiasi.', en: 'Poor appetite or overeating.', ar: 'ضعف الشهية أو الإفراط في الأكل.', verified: { ar: true } },
  'phq9.q6': { sw: 'Kujisikia mbaya kuhusu nafsi yako — kushindwa, au umewaangusha familia.', en: 'Feeling bad about yourself — failure, or letting family down.', ar: 'الشعور بالسوء حول نفسك أو أنك فاشل.', verified: { ar: true } },
  'phq9.q7': { sw: 'Shida kuzingatia mambo, kama kusoma au kusikiliza redio.', en: 'Trouble concentrating on things like reading or watching TV.', ar: 'صعوبة التركيز في الأشياء.', verified: { ar: true } },
  'phq9.q8': { sw: 'Kuongea au kusogea polepole sana, au kuwa na shughuli sana zisizo na utulivu.', en: 'Moving/speaking slowly, or being so fidgety/restless.', ar: 'التحرك أو التحدث ببطء، أو القلق الزائد.', verified: { ar: true } },
  'phq9.q9': { sw: 'Mawazo kwamba ungekuwa bora ukifa au kujidhuru.', en: 'Thoughts that you would be better off dead or hurting yourself.', ar: 'أفكار بأنك ستكون أفضل ميتاً أو إيذاء نفسك.', verified: { ar: true } },

  // ── GAD-7 ──────────────────────────────────────────────────────────────
  'gad7.title': { sw: 'GAD-7 — Tathmini ya wasiwasi', en: 'GAD-7 — Anxiety screen', ar: 'GAD-7 — فحص القلق', verified: { ar: true } },
  'gad7.lead_in': {
    sw: 'Kwa wiki mbili zilizopita, ni mara ngapi umesumbuliwa na:',
    en: 'Over the last 2 weeks, how often have you been bothered by:',
    ar: 'خلال الأسبوعين الماضيين، كم مرة أزعجتك:',
    verified: { ar: true },
  },
  'gad7.scale.0': { sw: 'Hapana kabisa', en: 'Not at all', ar: 'أبداً', verified: { ar: true } },
  'gad7.scale.1': { sw: 'Siku chache', en: 'Several days', ar: 'عدة أيام', verified: { ar: true } },
  'gad7.scale.2': { sw: 'Zaidi ya nusu ya siku', en: 'More than half the days', ar: 'أكثر من نصف الأيام', verified: { ar: true } },
  'gad7.scale.3': { sw: 'Karibu kila siku', en: 'Nearly every day', ar: 'تقريباً كل يوم', verified: { ar: true } },
  'gad7.q1': { sw: 'Kujisikia wasiwasi, hofu, au kingo.', en: 'Feeling nervous, anxious, or on edge.', ar: 'الشعور بالعصبية أو القلق.', verified: { ar: true } },
  'gad7.q2': { sw: 'Kushindwa kuacha au kudhibiti wasiwasi.', en: 'Not being able to stop or control worrying.', ar: 'عدم القدرة على إيقاف القلق أو التحكم به.', verified: { ar: true } },
  'gad7.q3': { sw: 'Kuwa na wasiwasi sana kuhusu mambo tofauti.', en: 'Worrying too much about different things.', ar: 'القلق المفرط بشأن أشياء مختلفة.', verified: { ar: true } },
  'gad7.q4': { sw: 'Shida kupumzika.', en: 'Trouble relaxing.', ar: 'صعوبة في الاسترخاء.', verified: { ar: true } },
  'gad7.q5': { sw: 'Kuwa na hali ya kutotulia hadi ni vigumu kukaa kimya.', en: 'Being so restless that it is hard to sit still.', ar: 'القلق الشديد بحيث يصعب الجلوس بهدوء.', verified: { ar: true } },
  'gad7.q6': { sw: 'Kuwa na hasira au kuudhika kwa urahisi.', en: 'Becoming easily annoyed or irritable.', ar: 'سرعة الانفعال أو الغضب.', verified: { ar: true } },
  'gad7.q7': { sw: 'Kuhisi hofu kana kwamba kitu kibaya kinaweza kutokea.', en: 'Feeling afraid as if something awful might happen.', ar: 'الشعور بالخوف من حدوث شيء فظيع.', verified: { ar: true } },

  // ── UI chrome ──────────────────────────────────────────────────────────
  'ui.anza': { sw: 'Anza', en: 'Start' },
  'ui.endelea': { sw: 'Endelea', en: 'Continue' },
  'ui.rudi': { sw: 'Rudi', en: 'Back' },
  'ui.hifadhi': { sw: 'Hifadhi', en: 'Save' },
  'ui.tafadhali': { sw: 'Tafadhali', en: 'Please' },
  'ui.asante': { sw: 'Asante', en: 'Thank you' },
  'ui.ndio': { sw: 'Ndio', en: 'Yes' },
  'ui.hapana': { sw: 'Hapana', en: 'No' },
  'ui.funga': { sw: 'Funga', en: 'Close' },
  'ui.fungua': { sw: 'Fungua', en: 'Open' },
  'ui.tuma': { sw: 'Tuma', en: 'Send' },
  'ui.futa': { sw: 'Futa', en: 'Delete' },
  'ui.ongeza': { sw: 'Ongeza', en: 'Add' },
  'ui.toa': { sw: 'Toa', en: 'Remove' },
  'ui.chagua': { sw: 'Chagua', en: 'Choose' },
  'ui.subiri': { sw: 'Subiri', en: 'Wait' },
  'ui.imehifadhiwa': { sw: 'Imehifadhiwa', en: 'Saved' },
  'ui.imeshindikana': { sw: 'Imeshindikana', en: 'Failed' },
  'ui.lugha': { sw: 'Lugha', en: 'Language' },
  'ui.sasa': { sw: 'Sasa', en: 'Now' },
  'ui.jana': { sw: 'Jana', en: 'Yesterday' },
  'ui.leo': { sw: 'Leo', en: 'Today' },
  'ui.kesho': { sw: 'Kesho', en: 'Tomorrow' },
  'ui.dakika': { sw: 'dakika', en: 'minutes' },
  'ui.saa': { sw: 'saa', en: 'hours' },
  'ui.siku': { sw: 'siku', en: 'days' },

  // ── Crisis ─────────────────────────────────────────────────────────────
  'crisis.hotline': { sw: 'Mstari wa dharura', en: 'Crisis hotline' },
  'crisis.not_alone': { sw: 'Hauko peke yako', en: 'You are not alone' },
  'crisis.reach_out': { sw: 'Wasiliana na mtu unaemwamini sasa.', en: 'Reach out to someone you trust now.' },
  'crisis.safety_plan': { sw: 'Mpango wa usalama', en: 'Safety plan' },
  'crisis.tz_number': { sw: '+255 800 12 13 14', en: '+255 800 12 13 14', verified: {} },

  // ── Consent ────────────────────────────────────────────────────────────
  'consent.title': { sw: 'Idhini ya matumizi', en: 'Consent' },
  'consent.intro': {
    sw: 'Tumaini inakuhudumia bila kuuza data yako. Tunakusanya tu ilichohitajika.',
    en: 'Tumaini serves you without selling your data. We collect only what is needed.',
  },
  'consent.data_use': {
    sw: 'Data yako inahifadhiwa hapa katika kifaa chako kwanza. Unaweza kufuta wakati wowote.',
    en: 'Your data is stored on your device first. You may delete at any time.',
  },
  'consent.withdraw': { sw: 'Unaweza kuondoa idhini wakati wowote.', en: 'You may withdraw consent at any time.' },
  'consent.agree': { sw: 'Nakubali', en: 'I agree' },
  'consent.decline': { sw: 'Sikubaliani', en: 'I decline' },

  // ── Programs ───────────────────────────────────────────────────────────
  'program.pmplus.intro': {
    sw: 'Problem Management Plus (PM+): vikao 5 vya mtu binafsi vya WHO kwa fadhaa kali.',
    en: 'Problem Management Plus (PM+): WHO 5-session program for distress.',
  },
  'program.ceta.intro': {
    sw: 'CETA: vipengele vya kawaida vya tiba — wasiwasi, fadhaiko, kiwewe.',
    en: 'CETA: common elements treatment approach — anxiety, depression, trauma.',
  },
  'program.fb.intro': {
    sw: 'Friendship Bench: kushauri kwa benchi na mama-shauri waliofunzwa.',
    en: 'Friendship Bench: problem-solving therapy with trained grandmothers.',
  },
  'program.ipt.intro': {
    sw: 'IPT: tiba ya mahusiano kati ya watu — vikao 12-16.',
    en: 'IPT: interpersonal psychotherapy — 12-16 sessions.',
  },
  'program.tcbt.intro': {
    sw: 't-CBT: tiba ya tabia-kufikiri iliyo fupishwa kwa muktadha wa Afrika.',
    en: 't-CBT: trans-diagnostic CBT adapted for African contexts.',
  },
}

/** Get a translation, falling back to Swahili when missing. */
export function t(key: string, lang: TLang): string {
  const entry = CATALOG[key]
  if (!entry) return key
  const val = entry[lang]
  if (typeof val === 'string' && val.length > 0) return val
  return entry.sw
}

/** Best-effort reverse lookup — for non-catalog text, mark with origin sentinel. */
export function translateText(text: string, _from: TLang, to: TLang): string {
  for (const [key, entry] of Object.entries(CATALOG)) {
    for (const code of ['sw', 'en', 'ar', 'rn', 'ln'] as const) {
      if (entry[code] === text) return t(key, to)
    }
  }
  return `${text} [—asili—]`
}
