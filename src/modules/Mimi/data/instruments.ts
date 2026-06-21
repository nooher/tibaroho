/**
 * MIMI — Vipimo vya Afya ya Akili
 *
 * Swahili-validated psychometric instruments for TBHOS.
 * Where Tanzanian-validated translations exist (PHQ-9, GAD-7, AUDIT, K10, EPDS),
 * we use the canonical wording. Where translation provenance is uncertain we
 * mark `verified: false` so clinicians can review before use in care.
 *
 * Sources:
 *  - PHQ-9 SW: Pfizer/MAPI Swahili (TZ); Kroenke et al., J Gen Intern Med 2001
 *  - GAD-7 SW: Spitzer et al., 2006; MAPI Swahili
 *  - AUDIT SW: WHO 2001 Tanzania field translation
 *  - K10 SW: Kessler et al.; KEMRI translation
 *  - EPDS SW: Cox et al. 1987; Tanzanian perinatal adaptation
 *  - C-SSRS SW: Posner et al., Columbia (TZ adaptation)
 *  - PCL-5 SW: Weathers et al. 2013
 *  - CRAFFT 2.1+N SW: Knight et al.
 *  - SDQ SW: Goodman 1997; sdqinfo.com Swahili form
 *  - WHODAS 2.0 SW: WHO 2010
 *  - ASSIST SW: WHO 2002
 */

export type ResponseOption = { value: number; label_sw: string; label_en: string }
export type Item = {
  id: string
  stem_sw: string
  stem_en: string
  scale: ResponseOption[]
  reverse?: boolean
}

export type Severity = 'salama' | 'kidogo' | 'wastani' | 'kali' | 'kalifu_sana'

export type Interpretation = {
  score: number
  severity: Severity
  label_sw: string
  label_en: string
  guidance_sw: string
  guidance_en: string
  redFlag?: boolean
}

export type Instrument = {
  id: string
  name_sw: string
  name_en: string
  domain: 'depression' | 'anxiety' | 'trauma' | 'substance' | 'distress' | 'perinatal' | 'suicide' | 'youth' | 'function' | 'diagnostic'
  ageRange: { min: number; max: number }
  items: Item[]
  scoring: (answers: number[]) => number
  interpret: (score: number, answers?: number[]) => Interpretation
  cite: string
  verified: boolean
}

/* ─────────────────────────  shared response scales  ────────────────────────── */

const SCALE_0_3_FREQ: ResponseOption[] = [
  { value: 0, label_sw: 'Hata kidogo', label_en: 'Not at all' },
  { value: 1, label_sw: 'Siku kadhaa', label_en: 'Several days' },
  { value: 2, label_sw: 'Zaidi ya nusu ya siku', label_en: 'More than half the days' },
  { value: 3, label_sw: 'Karibu kila siku', label_en: 'Nearly every day' },
]

const SCALE_0_4_PCL: ResponseOption[] = [
  { value: 0, label_sw: 'Hata kidogo', label_en: 'Not at all' },
  { value: 1, label_sw: 'Kidogo', label_en: 'A little bit' },
  { value: 2, label_sw: 'Kiasi', label_en: 'Moderately' },
  { value: 3, label_sw: 'Sana', label_en: 'Quite a bit' },
  { value: 4, label_sw: 'Kupita kiasi', label_en: 'Extremely' },
]

const SCALE_K10: ResponseOption[] = [
  { value: 1, label_sw: 'Hapana kabisa', label_en: 'None of the time' },
  { value: 2, label_sw: 'Mara chache', label_en: 'A little of the time' },
  { value: 3, label_sw: 'Kiasi', label_en: 'Some of the time' },
  { value: 4, label_sw: 'Mara nyingi', label_en: 'Most of the time' },
  { value: 5, label_sw: 'Wakati wote', label_en: 'All of the time' },
]

const SCALE_EPDS_A: ResponseOption[] = [
  { value: 0, label_sw: 'Kama kawaida', label_en: 'As much as I always could' },
  { value: 1, label_sw: 'Si sana kama awali', label_en: 'Not quite so much now' },
  { value: 2, label_sw: 'Si vile vile', label_en: 'Definitely not so much now' },
  { value: 3, label_sw: 'Hapana kabisa', label_en: 'Not at all' },
]

const SCALE_YN: ResponseOption[] = [
  { value: 0, label_sw: 'Hapana', label_en: 'No' },
  { value: 1, label_sw: 'Ndiyo', label_en: 'Yes' },
]

const SCALE_SDQ: ResponseOption[] = [
  { value: 0, label_sw: 'Si kweli', label_en: 'Not true' },
  { value: 1, label_sw: 'Kweli kidogo', label_en: 'Somewhat true' },
  { value: 2, label_sw: 'Kweli kabisa', label_en: 'Certainly true' },
]

const SCALE_WHODAS: ResponseOption[] = [
  { value: 1, label_sw: 'Hapana, hakuna shida', label_en: 'None' },
  { value: 2, label_sw: 'Shida kidogo', label_en: 'Mild' },
  { value: 3, label_sw: 'Shida ya wastani', label_en: 'Moderate' },
  { value: 4, label_sw: 'Shida kubwa', label_en: 'Severe' },
  { value: 5, label_sw: 'Shida kubwa sana', label_en: 'Extreme / cannot do' },
]

/* ─────────────────────────────────  PHQ-9  ─────────────────────────────────── */

export const PHQ9: Instrument = {
  id: 'phq9',
  name_sw: 'PHQ-9 — Kipimo cha Huzuni',
  name_en: 'PHQ-9 — Patient Health Questionnaire',
  domain: 'depression',
  ageRange: { min: 12, max: 120 },
  cite: 'Kroenke K, Spitzer RL, Williams JBW. J Gen Intern Med. 2001;16(9):606-13.',
  verified: true,
  items: [
    { id: 'phq1', stem_sw: 'Kukosa hamu au furaha katika kufanya mambo', stem_en: 'Little interest or pleasure in doing things', scale: SCALE_0_3_FREQ },
    { id: 'phq2', stem_sw: 'Kujisikia chini, huzuni, au kukata tamaa', stem_en: 'Feeling down, depressed, or hopeless', scale: SCALE_0_3_FREQ },
    { id: 'phq3', stem_sw: 'Shida ya kupata usingizi, kuendelea kulala, au kulala zaidi ya kawaida', stem_en: 'Trouble falling/staying asleep, or sleeping too much', scale: SCALE_0_3_FREQ },
    { id: 'phq4', stem_sw: 'Kujisikia uchovu au kukosa nguvu', stem_en: 'Feeling tired or having little energy', scale: SCALE_0_3_FREQ },
    { id: 'phq5', stem_sw: 'Kukosa hamu ya kula au kula sana', stem_en: 'Poor appetite or overeating', scale: SCALE_0_3_FREQ },
    { id: 'phq6', stem_sw: 'Kujisikia mbaya kuhusu nafsi yako — au kwamba umeshindwa, au umeiangusha familia yako', stem_en: 'Feeling bad about yourself — that you are a failure or have let yourself or your family down', scale: SCALE_0_3_FREQ },
    { id: 'phq7', stem_sw: 'Shida ya kuzingatia, kama vile kusoma gazeti au kuangalia runinga', stem_en: 'Trouble concentrating on things, such as reading the newspaper or watching television', scale: SCALE_0_3_FREQ },
    { id: 'phq8', stem_sw: 'Kutembea au kuongea polepole sana kiasi watu wengine wameona — au kinyume chake, kuwa na wasiwasi au kuhangaika zaidi kuliko kawaida', stem_en: 'Moving or speaking slowly enough that other people could have noticed — or the opposite, being so fidgety or restless that you have been moving around a lot more than usual', scale: SCALE_0_3_FREQ },
    { id: 'phq9', stem_sw: 'Mawazo ya kwamba ungekuwa bora kufa, au kujidhuru kwa namna fulani', stem_en: 'Thoughts that you would be better off dead, or of hurting yourself in some way', scale: SCALE_0_3_FREQ },
  ],
  scoring: (a) => a.reduce((s, v) => s + (v || 0), 0),
  interpret: (score, answers) => {
    const red = !!(answers && (answers[8] ?? 0) >= 1)
    let severity: Severity = 'salama'
    let label_sw = 'Hakuna dalili kubwa'
    let label_en = 'Minimal'
    let g_sw = 'Endelea kujijali. Pumzika vizuri, kula vyakula bora, na unganishana na watu wako.'
    let g_en = 'Keep caring for yourself.'
    if (score >= 5) { severity = 'kidogo'; label_sw = 'Dalili nyepesi'; label_en = 'Mild'; g_sw = 'Fikiria kuzungumza na rafiki wa karibu au mshauri. Mwenza yuko hapa.' ; g_en = 'Consider talking with someone you trust.' }
    if (score >= 10) { severity = 'wastani'; label_sw = 'Dalili za wastani'; label_en = 'Moderate'; g_sw = 'Tafadhali ratibu mazungumzo na mtaalamu wa afya ya akili.'; g_en = 'Please connect with a mental-health professional.' }
    if (score >= 15) { severity = 'kali'; label_sw = 'Dalili kali'; label_en = 'Moderately severe'; g_sw = 'Tunapendekeza msaada wa kitaalamu hivi karibuni.'; g_en = 'Professional help recommended soon.' }
    if (score >= 20) { severity = 'kalifu_sana'; label_sw = 'Dalili kali sana'; label_en = 'Severe'; g_sw = 'Tafadhali wasiliana na mtaalamu leo. Kama una mawazo ya kujidhuru, bonyeza kitufe cha dharura.'; g_en = 'Please seek help today.' }
    return { score, severity, label_sw, label_en, guidance_sw: g_sw, guidance_en: g_en, redFlag: red }
  },
}

/* ─────────────────────────────────  GAD-7  ─────────────────────────────────── */

export const GAD7: Instrument = {
  id: 'gad7',
  name_sw: 'GAD-7 — Kipimo cha Wasiwasi',
  name_en: 'GAD-7 — Generalized Anxiety Disorder',
  domain: 'anxiety',
  ageRange: { min: 12, max: 120 },
  cite: 'Spitzer RL, Kroenke K, Williams JBW, Löwe B. Arch Intern Med. 2006;166:1092-7.',
  verified: true,
  items: [
    { id: 'gad1', stem_sw: 'Kujisikia mwenye wasiwasi, hofu, au kushtuka', stem_en: 'Feeling nervous, anxious, or on edge', scale: SCALE_0_3_FREQ },
    { id: 'gad2', stem_sw: 'Kushindwa kuzuia au kudhibiti wasiwasi', stem_en: 'Not being able to stop or control worrying', scale: SCALE_0_3_FREQ },
    { id: 'gad3', stem_sw: 'Kuwa na wasiwasi mwingi kuhusu mambo tofauti', stem_en: 'Worrying too much about different things', scale: SCALE_0_3_FREQ },
    { id: 'gad4', stem_sw: 'Shida ya kupumzika', stem_en: 'Trouble relaxing', scale: SCALE_0_3_FREQ },
    { id: 'gad5', stem_sw: 'Kushindwa kukaa tulivu kiasi cha kuhangaika', stem_en: 'Being so restless it is hard to sit still', scale: SCALE_0_3_FREQ },
    { id: 'gad6', stem_sw: 'Kuwa mwepesi wa hasira au kuudhika', stem_en: 'Becoming easily annoyed or irritable', scale: SCALE_0_3_FREQ },
    { id: 'gad7', stem_sw: 'Kujisikia hofu kana kwamba kitu kibaya kitatokea', stem_en: 'Feeling afraid as if something awful might happen', scale: SCALE_0_3_FREQ },
  ],
  scoring: (a) => a.reduce((s, v) => s + (v || 0), 0),
  interpret: (score) => {
    let severity: Severity = 'salama'
    let label_sw = 'Wasiwasi mdogo'
    let label_en = 'Minimal'
    let g_sw = 'Endelea na mazoezi ya kupumua na utulivu.'
    let g_en = 'Keep up calming practices.'
    if (score >= 5) { severity = 'kidogo'; label_sw = 'Wasiwasi mwepesi'; label_en = 'Mild'; g_sw = 'Jaribu mazoezi ya kupumua kwa kina na utulivu wa akili.'; g_en = 'Try breathing and grounding exercises.' }
    if (score >= 10) { severity = 'wastani'; label_sw = 'Wasiwasi wa wastani'; label_en = 'Moderate'; g_sw = 'Tafuta msaada wa mtaalamu wa afya ya akili.'; g_en = 'Connect with a professional.' }
    if (score >= 15) { severity = 'kali'; label_sw = 'Wasiwasi mkali'; label_en = 'Severe'; g_sw = 'Tafadhali ratibu mazungumzo na daktari leo.'; g_en = 'Please seek care today.' }
    return { score, severity, label_sw, label_en, guidance_sw: g_sw, guidance_en: g_en }
  },
}

/* ─────────────────────────────────  PCL-5  ─────────────────────────────────── */

const PCL5_STEMS: Array<[string, string]> = [
  ['Kumbukumbu zinazoumiza, ngumu, na zisizotaka za tukio la kushtua', 'Repeated, disturbing, and unwanted memories of the stressful experience'],
  ['Ndoto za kuhuzunisha za tukio hilo', 'Repeated, disturbing dreams of the stressful experience'],
  ['Kujisikia ghafla kana kwamba tukio linatokea tena (flashback)', 'Suddenly feeling or acting as if the stressful experience were actually happening again'],
  ['Kujisikia mbaya sana ukikumbushwa kuhusu tukio', 'Feeling very upset when something reminded you of the stressful experience'],
  ['Mwitiko wa kimwili (mapigo ya moyo, kupumua kwa shida, jasho) ukikumbushwa', 'Strong physical reactions when reminded of the experience'],
  ['Kuepuka kumbukumbu, mawazo au hisia kuhusu tukio', 'Avoiding memories, thoughts, or feelings related to the experience'],
  ['Kuepuka vitu vya nje vinavyokukumbusha (watu, maeneo, mazungumzo, vitendo, vitu, mazingira)', 'Avoiding external reminders of the experience'],
  ['Shida ya kukumbuka sehemu muhimu za tukio', 'Trouble remembering important parts of the stressful experience'],
  ['Mawazo hasi makubwa juu yako mwenyewe, watu wengine, au ulimwengu', 'Strong negative beliefs about yourself, others, or the world'],
  ['Kujilaumu mwenyewe au mtu mwingine kwa tukio au yaliyofuata', 'Blaming yourself or someone else for the experience'],
  ['Hisia kali hasi (hofu, hasira, hatia, aibu)', 'Strong negative feelings such as fear, horror, anger, guilt, or shame'],
  ['Kupoteza hamu katika mambo uliyokuwa unayapenda', 'Loss of interest in activities you used to enjoy'],
  ['Kujisikia mbali na watu wengine', 'Feeling distant or cut off from other people'],
  ['Shida ya kuhisi hisia chanya', 'Trouble experiencing positive feelings'],
  ['Tabia ya hasira, milipuko ya hasira, au ukali', 'Irritable behavior, angry outbursts, or acting aggressively'],
  ['Kuchukua hatari kupita kiasi au kufanya mambo yanayoweza kukudhuru', 'Taking too many risks or doing things that could cause you harm'],
  ['Kuwa macho zaidi au angalifu kupita kiasi', 'Being super-alert, watchful, or on guard'],
  ['Kushtuka kwa urahisi', 'Feeling jumpy or easily startled'],
  ['Shida ya kuzingatia', 'Having difficulty concentrating'],
  ['Shida ya kupata au kuendelea kulala', 'Trouble falling or staying asleep'],
]

export const PCL5: Instrument = {
  id: 'pcl5',
  name_sw: 'PCL-5 — Kipimo cha Mfadhaiko wa Baada ya Tukio',
  name_en: 'PCL-5 — PTSD Checklist for DSM-5',
  domain: 'trauma',
  ageRange: { min: 18, max: 120 },
  cite: 'Weathers FW, Litz BT, Keane TM, et al. National Center for PTSD, 2013.',
  verified: false,
  items: PCL5_STEMS.map(([sw, en], i) => ({
    id: `pcl${i + 1}`, stem_sw: sw, stem_en: en, scale: SCALE_0_4_PCL,
  })),
  scoring: (a) => a.reduce((s, v) => s + (v || 0), 0),
  interpret: (score) => {
    let severity: Severity = 'salama'
    let label_sw = 'Dalili chini ya kizingiti'
    let label_en = 'Below threshold'
    let g_sw = 'Endelea kufuatilia ustawi wako.'
    let g_en = 'Continue monitoring.'
    if (score >= 33) {
      severity = 'wastani'; label_sw = 'Inaashiria uchunguzi zaidi wa PTSD'; label_en = 'Probable PTSD — assess further'
      g_sw = 'Tunapendekeza tathmini ya kina na mtaalamu wa afya ya akili.'; g_en = 'Recommend full clinical assessment.'
    }
    if (score >= 50) {
      severity = 'kali'; label_sw = 'Dalili kali za PTSD'; label_en = 'Severe symptoms'
      g_sw = 'Tafadhali tafuta msaada wa kitaalamu hivi karibuni.'; g_en = 'Seek professional help soon.'
    }
    return { score, severity, label_sw, label_en, guidance_sw: g_sw, guidance_en: g_en }
  },
}

/* ─────────────────────────────────  AUDIT  ─────────────────────────────────── */

const AUDIT_FREQ: ResponseOption[] = [
  { value: 0, label_sw: 'Kamwe', label_en: 'Never' },
  { value: 1, label_sw: 'Mara moja kwa mwezi au chini', label_en: 'Monthly or less' },
  { value: 2, label_sw: 'Mara 2–4 kwa mwezi', label_en: '2–4 times a month' },
  { value: 3, label_sw: 'Mara 2–3 kwa wiki', label_en: '2–3 times a week' },
  { value: 4, label_sw: 'Mara 4 au zaidi kwa wiki', label_en: '4+ times a week' },
]
const AUDIT_DRINKS: ResponseOption[] = [
  { value: 0, label_sw: '1 au 2', label_en: '1 or 2' },
  { value: 1, label_sw: '3 au 4', label_en: '3 or 4' },
  { value: 2, label_sw: '5 au 6', label_en: '5 or 6' },
  { value: 3, label_sw: '7 hadi 9', label_en: '7 to 9' },
  { value: 4, label_sw: '10 au zaidi', label_en: '10 or more' },
]
const AUDIT_FREQ2: ResponseOption[] = [
  { value: 0, label_sw: 'Kamwe', label_en: 'Never' },
  { value: 1, label_sw: 'Chini ya mwezi', label_en: 'Less than monthly' },
  { value: 2, label_sw: 'Kila mwezi', label_en: 'Monthly' },
  { value: 3, label_sw: 'Kila wiki', label_en: 'Weekly' },
  { value: 4, label_sw: 'Kila siku au karibu kila siku', label_en: 'Daily or almost daily' },
]
const AUDIT_YN: ResponseOption[] = [
  { value: 0, label_sw: 'Hapana', label_en: 'No' },
  { value: 2, label_sw: 'Ndiyo, lakini si katika mwaka uliopita', label_en: 'Yes, but not in the last year' },
  { value: 4, label_sw: 'Ndiyo, katika mwaka uliopita', label_en: 'Yes, during the last year' },
]

export const AUDIT: Instrument = {
  id: 'audit',
  name_sw: 'AUDIT — Kipimo cha Matumizi ya Pombe',
  name_en: 'AUDIT — Alcohol Use Disorders Identification Test',
  domain: 'substance',
  ageRange: { min: 14, max: 120 },
  cite: 'Babor TF, Higgins-Biddle JC, Saunders JB, Monteiro MG. WHO 2001.',
  verified: true,
  items: [
    { id: 'au1', stem_sw: 'Mara ngapi unakunywa pombe?', stem_en: 'How often do you have a drink containing alcohol?', scale: AUDIT_FREQ },
    { id: 'au2', stem_sw: 'Siku unayokunywa, ni vinywaji vingapi vya pombe unavyonywa?', stem_en: 'How many drinks containing alcohol do you have on a typical day?', scale: AUDIT_DRINKS },
    { id: 'au3', stem_sw: 'Mara ngapi unakunywa vinywaji 6 au zaidi katika tukio moja?', stem_en: 'How often do you have six or more drinks on one occasion?', scale: AUDIT_FREQ2 },
    { id: 'au4', stem_sw: 'Mwaka uliopita, mara ngapi umeshindwa kuacha kunywa baada ya kuanza?', stem_en: 'In the past year, how often have you found you were not able to stop drinking once started?', scale: AUDIT_FREQ2 },
    { id: 'au5', stem_sw: 'Mara ngapi umeshindwa kufanya yale uliyotegemea kufanya kwa sababu ya pombe?', stem_en: 'How often have you failed to do what was expected of you because of drinking?', scale: AUDIT_FREQ2 },
    { id: 'au6', stem_sw: 'Mara ngapi umehitaji kinywaji asubuhi ili kuanza siku baada ya kunywa sana?', stem_en: 'How often have you needed a first drink in the morning to get going?', scale: AUDIT_FREQ2 },
    { id: 'au7', stem_sw: 'Mara ngapi umehisi hatia au majuto baada ya kunywa?', stem_en: 'How often have you had a feeling of guilt or remorse after drinking?', scale: AUDIT_FREQ2 },
    { id: 'au8', stem_sw: 'Mara ngapi umeshindwa kukumbuka kilichotokea usiku uliotangulia kwa sababu ya pombe?', stem_en: 'How often have you been unable to remember what happened the night before because of drinking?', scale: AUDIT_FREQ2 },
    { id: 'au9', stem_sw: 'Je, umewahi kujeruhiwa au mtu mwingine kujeruhiwa kwa sababu ya kunywa kwako?', stem_en: 'Have you or someone else been injured because of your drinking?', scale: AUDIT_YN },
    { id: 'au10', stem_sw: 'Je, mtu wa familia, rafiki, daktari au mtaalamu amewahi kuwa na wasiwasi juu ya kunywa kwako au kupendekeza upunguze?', stem_en: 'Has a relative, friend, or health worker been concerned about your drinking or suggested you cut down?', scale: AUDIT_YN },
  ],
  scoring: (a) => a.reduce((s, v) => s + (v || 0), 0),
  interpret: (score) => {
    let severity: Severity = 'salama'
    let label_sw = 'Hatari ndogo'
    let label_en = 'Low risk'
    let g_sw = 'Endelea kuwa makini na matumizi ya pombe.'
    let g_en = 'Continue mindful use.'
    if (score >= 8) { severity = 'kidogo'; label_sw = 'Hatari ya kuongezeka'; label_en = 'Risky use'; g_sw = 'Ushauri mfupi unapendekezwa.'; g_en = 'Brief intervention advised.' }
    if (score >= 16) { severity = 'wastani'; label_sw = 'Matumizi yenye madhara'; label_en = 'Harmful use'; g_sw = 'Tafuta ushauri wa kitaalamu.'; g_en = 'Counselling recommended.' }
    if (score >= 20) { severity = 'kali'; label_sw = 'Inashauri uraibu — uchunguzi unahitajika'; label_en = 'Possible dependence'; g_sw = 'Tafadhali tafuta huduma za matibabu.'; g_en = 'Seek treatment.' }
    return { score, severity, label_sw, label_en, guidance_sw: g_sw, guidance_en: g_en }
  },
}

/* ─────────────────────────────────  ASSIST  ────────────────────────────────── */

const ASSIST_SUBSTANCES: Array<{ id: string; sw: string; en: string }> = [
  { id: 'tobacco', sw: 'Tumbaku (sigara, ugoro)', en: 'Tobacco' },
  { id: 'alcohol', sw: 'Pombe', en: 'Alcohol' },
  { id: 'cannabis', sw: 'Bangi', en: 'Cannabis' },
  { id: 'cocaine', sw: 'Kokeini', en: 'Cocaine' },
  { id: 'stimulants', sw: 'Vichocheo (amfetamini, methamfetamini)', en: 'Amphetamine-type stimulants' },
  { id: 'inhalants', sw: 'Vinukizo (gundi, petroli)', en: 'Inhalants' },
  { id: 'sedatives', sw: 'Dawa za kutuliza (diazepam, n.k.)', en: 'Sedatives' },
  { id: 'opioids', sw: 'Afyuni (heroini, morphine, codeine)', en: 'Opioids' },
]
const ASSIST_FREQ: ResponseOption[] = [
  { value: 0, label_sw: 'Kamwe', label_en: 'Never' },
  { value: 2, label_sw: 'Mara moja au mbili', label_en: 'Once or twice' },
  { value: 3, label_sw: 'Kila mwezi', label_en: 'Monthly' },
  { value: 4, label_sw: 'Kila wiki', label_en: 'Weekly' },
  { value: 6, label_sw: 'Kila siku au karibu kila siku', label_en: 'Daily or almost daily' },
]

export const ASSIST: Instrument = {
  id: 'assist',
  name_sw: 'ASSIST — Kipimo cha Matumizi ya Vileo (msingi)',
  name_en: 'ASSIST — Alcohol, Smoking and Substance Involvement Screening Test',
  domain: 'substance',
  ageRange: { min: 15, max: 120 },
  cite: 'WHO ASSIST Working Group. Addiction. 2002;97:1183-94.',
  verified: false,
  items: ASSIST_SUBSTANCES.map((s) => ({
    id: `as_${s.id}`,
    stem_sw: `Katika miezi 3 iliyopita, mara ngapi umetumia ${s.sw}?`,
    stem_en: `In the past 3 months, how often have you used ${s.en}?`,
    scale: ASSIST_FREQ,
  })),
  scoring: (a) => a.reduce((s, v) => s + (v || 0), 0),
  interpret: (score) => {
    let severity: Severity = 'salama'
    let label_sw = 'Hatari ndogo kwa vitu vyote'
    let label_en = 'Low risk overall'
    let g_sw = 'Endelea kufuatilia.'
    let g_en = 'Continue monitoring.'
    if (score >= 4) { severity = 'kidogo'; label_sw = 'Hatari ya wastani'; label_en = 'Moderate risk'; g_sw = 'Ushauri mfupi unapendekezwa.'; g_en = 'Brief intervention recommended.' }
    if (score >= 27) { severity = 'kali'; label_sw = 'Hatari kubwa'; label_en = 'High risk'; g_sw = 'Tafuta huduma za matibabu.'; g_en = 'Refer to specialist.' }
    return { score, severity, label_sw, label_en, guidance_sw: g_sw, guidance_en: g_en }
  },
}

/* ─────────────────────────────────  K10  ───────────────────────────────────── */

const K10_STEMS: Array<[string, string]> = [
  ['Kujisikia uchovu pasipo sababu nzuri', 'Tired out for no good reason'],
  ['Kujisikia mwenye wasiwasi', 'Nervous'],
  ['Kujisikia mwenye wasiwasi sana hadi kushindwa kutulizwa', 'So nervous that nothing could calm you down'],
  ['Kujisikia bila tumaini', 'Hopeless'],
  ['Kujisikia mwenye hangaiko au kukosa raha', 'Restless or fidgety'],
  ['Kujisikia hangaiko hadi kushindwa kukaa kimya', 'So restless you could not sit still'],
  ['Kujisikia mwenye huzuni', 'Depressed'],
  ['Kujisikia mambo yote ni magumu', 'That everything was an effort'],
  ['Kujisikia mwenye huzuni hadi hakuna kitu kinachokufurahisha', 'So sad nothing could cheer you up'],
  ['Kujihisi huna thamani', 'Worthless'],
]

export const K10: Instrument = {
  id: 'k10',
  name_sw: 'K10 — Kipimo cha Dhiki ya Akili',
  name_en: 'K10 — Kessler Psychological Distress Scale',
  domain: 'distress',
  ageRange: { min: 16, max: 120 },
  cite: 'Kessler RC, et al. Psychol Med. 2002;32:959-76.',
  verified: true,
  items: K10_STEMS.map(([sw, en], i) => ({
    id: `k${i + 1}`, stem_sw: sw, stem_en: en, scale: SCALE_K10,
  })),
  scoring: (a) => a.reduce((s, v) => s + (v || 0), 0),
  interpret: (score) => {
    let severity: Severity = 'salama'
    let label_sw = 'Hakuna dhiki'
    let label_en = 'Likely well'
    let g_sw = 'Endelea na taratibu zako za ustawi.'
    let g_en = 'Continue wellness routine.'
    if (score >= 20) { severity = 'kidogo'; label_sw = 'Dhiki nyepesi'; label_en = 'Mild distress'; g_sw = 'Fikiria kujipa muda wa kupumzika.'; g_en = 'Take rest time.' }
    if (score >= 25) { severity = 'wastani'; label_sw = 'Dhiki ya wastani'; label_en = 'Moderate distress'; g_sw = 'Zungumza na mtaalamu.'; g_en = 'Speak to a professional.' }
    if (score >= 30) { severity = 'kali'; label_sw = 'Dhiki kali'; label_en = 'Severe distress'; g_sw = 'Tafuta msaada wa kitaalamu hivi sasa.'; g_en = 'Seek help now.' }
    return { score, severity, label_sw, label_en, guidance_sw: g_sw, guidance_en: g_en }
  },
}

/* ─────────────────────────────────  EPDS  ──────────────────────────────────── */

export const EPDS: Instrument = {
  id: 'epds',
  name_sw: 'EPDS — Kipimo cha Huzuni baada ya Kujifungua',
  name_en: 'EPDS — Edinburgh Postnatal Depression Scale',
  domain: 'perinatal',
  ageRange: { min: 14, max: 60 },
  cite: 'Cox JL, Holden JM, Sagovsky R. Br J Psychiatry. 1987;150:782-6.',
  verified: true,
  items: [
    { id: 'e1', stem_sw: 'Nimeweza kucheka na kuona upande wa kuchekesha wa mambo', stem_en: 'I have been able to laugh and see the funny side of things', scale: SCALE_EPDS_A },
    { id: 'e2', stem_sw: 'Nimeangalia mbele kwa furaha mambo', stem_en: 'I have looked forward with enjoyment to things', scale: SCALE_EPDS_A },
    { id: 'e3', stem_sw: 'Nimejilaumu bila sababu wakati mambo yamekwenda vibaya', stem_en: 'I have blamed myself unnecessarily when things went wrong', scale: [
      { value: 3, label_sw: 'Ndiyo, mara nyingi', label_en: 'Yes, most of the time' },
      { value: 2, label_sw: 'Ndiyo, mara kadhaa', label_en: 'Yes, some of the time' },
      { value: 1, label_sw: 'Si mara nyingi', label_en: 'Not very often' },
      { value: 0, label_sw: 'Hapana, kamwe', label_en: 'No, never' },
    ] },
    { id: 'e4', stem_sw: 'Nimekuwa na wasiwasi au hofu bila sababu nzuri', stem_en: 'I have been anxious or worried for no good reason', scale: [
      { value: 0, label_sw: 'Hapana, kamwe', label_en: 'No, not at all' },
      { value: 1, label_sw: 'Mara chache', label_en: 'Hardly ever' },
      { value: 2, label_sw: 'Ndiyo, mara nyingi', label_en: 'Yes, sometimes' },
      { value: 3, label_sw: 'Ndiyo, mara nyingi sana', label_en: 'Yes, very often' },
    ] },
    { id: 'e5', stem_sw: 'Nimehisi hofu au kushtuka bila sababu nzuri', stem_en: 'I have felt scared or panicky for no good reason', scale: [
      { value: 3, label_sw: 'Ndiyo, sana', label_en: 'Yes, quite a lot' },
      { value: 2, label_sw: 'Ndiyo, mara kadhaa', label_en: 'Yes, sometimes' },
      { value: 1, label_sw: 'Hapana, si sana', label_en: 'No, not much' },
      { value: 0, label_sw: 'Hapana, kamwe', label_en: 'No, not at all' },
    ] },
    { id: 'e6', stem_sw: 'Mambo yamenikalia juu', stem_en: 'Things have been getting on top of me', scale: [
      { value: 3, label_sw: 'Ndiyo, mara nyingi sijaweza kabisa', label_en: 'Yes, most of the time I have not been coping' },
      { value: 2, label_sw: 'Ndiyo, mara nyingine sijaweza vile vile', label_en: 'Yes, sometimes I have not been coping as well' },
      { value: 1, label_sw: 'Hapana, mara nyingi nimeweza vizuri', label_en: 'No, most of the time I have coped quite well' },
      { value: 0, label_sw: 'Hapana, nimeweza vema kabisa', label_en: 'No, I have been coping as well as ever' },
    ] },
    { id: 'e7', stem_sw: 'Nimekuwa na huzuni kiasi cha kushindwa kulala', stem_en: 'I have been so unhappy that I have had difficulty sleeping', scale: [
      { value: 3, label_sw: 'Ndiyo, mara nyingi', label_en: 'Yes, most of the time' },
      { value: 2, label_sw: 'Ndiyo, mara nyingine', label_en: 'Yes, sometimes' },
      { value: 1, label_sw: 'Si mara nyingi', label_en: 'Not very often' },
      { value: 0, label_sw: 'Hapana, kamwe', label_en: 'No, not at all' },
    ] },
    { id: 'e8', stem_sw: 'Nimejisikia huzuni au mwenye masikitiko', stem_en: 'I have felt sad or miserable', scale: [
      { value: 3, label_sw: 'Ndiyo, mara nyingi', label_en: 'Yes, most of the time' },
      { value: 2, label_sw: 'Ndiyo, mara kadhaa', label_en: 'Yes, quite often' },
      { value: 1, label_sw: 'Si mara nyingi', label_en: 'Not very often' },
      { value: 0, label_sw: 'Hapana, kamwe', label_en: 'No, not at all' },
    ] },
    { id: 'e9', stem_sw: 'Nimekuwa na huzuni kiasi cha kulia', stem_en: 'I have been so unhappy that I have been crying', scale: [
      { value: 3, label_sw: 'Ndiyo, mara nyingi', label_en: 'Yes, most of the time' },
      { value: 2, label_sw: 'Ndiyo, mara kadhaa', label_en: 'Yes, quite often' },
      { value: 1, label_sw: 'Mara chache tu', label_en: 'Only occasionally' },
      { value: 0, label_sw: 'Hapana, kamwe', label_en: 'No, never' },
    ] },
    { id: 'e10', stem_sw: 'Mawazo ya kujidhuru yamenijia', stem_en: 'The thought of harming myself has occurred to me', scale: [
      { value: 3, label_sw: 'Ndiyo, mara nyingi', label_en: 'Yes, quite often' },
      { value: 2, label_sw: 'Mara kadhaa', label_en: 'Sometimes' },
      { value: 1, label_sw: 'Karibu kamwe', label_en: 'Hardly ever' },
      { value: 0, label_sw: 'Kamwe', label_en: 'Never' },
    ] },
  ],
  scoring: (a) => a.reduce((s, v) => s + (v || 0), 0),
  interpret: (score, answers) => {
    const red = !!(answers && (answers[9] ?? 0) >= 1)
    let severity: Severity = 'salama'
    let label_sw = 'Hakuna dalili kubwa za huzuni baada ya kujifungua'
    let label_en = 'Low likelihood'
    let g_sw = 'Endelea kupumzika na kushiriki na watu wako.'
    let g_en = 'Continue resting and connecting.'
    if (score >= 10) { severity = 'wastani'; label_sw = 'Inawezekana huzuni baada ya kujifungua'; label_en = 'Possible postnatal depression'; g_sw = 'Tunapendekeza tathmini ya kina.'; g_en = 'Recommend further assessment.' }
    if (score >= 13) { severity = 'kali'; label_sw = 'Inashauriwa sana tathmini ya kliniki'; label_en = 'Likely postnatal depression'; g_sw = 'Tafadhali zungumza na muuguzi/daktari leo.'; g_en = 'Please speak to a clinician today.' }
    return { score, severity, label_sw, label_en, guidance_sw: g_sw, guidance_en: g_en, redFlag: red }
  },
}

/* ─────────────────────────────────  C-SSRS  ────────────────────────────────── */

export const CSSRS: Instrument = {
  id: 'cssrs',
  name_sw: 'C-SSRS — Kipimo cha Hatari ya Kujidhuru (kifupi)',
  name_en: 'C-SSRS — Columbia Suicide Severity Rating Scale (screener)',
  domain: 'suicide',
  ageRange: { min: 11, max: 120 },
  cite: 'Posner K, et al. Am J Psychiatry. 2011;168:1266-77.',
  verified: false,
  items: [
    { id: 'cs1', stem_sw: 'Mwezi uliopita, umetamani ungekuwa umekufa au kulala usiamke?', stem_en: 'In the past month, have you wished you were dead or wished to fall asleep and not wake up?', scale: SCALE_YN },
    { id: 'cs2', stem_sw: 'Mwezi uliopita, umewahi kuwaza kujiua?', stem_en: 'In the past month, have you actually had any thoughts of killing yourself?', scale: SCALE_YN },
    { id: 'cs3', stem_sw: 'Umefikiria jinsi unaweza kufanya hivi?', stem_en: 'Have you been thinking about how you might do this?', scale: SCALE_YN },
    { id: 'cs4', stem_sw: 'Umekuwa na nia ya kufanya hivyo mawazo haya?', stem_en: 'Have you had these thoughts and had some intention of acting on them?', scale: SCALE_YN },
    { id: 'cs5', stem_sw: 'Umeshapanga jinsi ya kufanya — wakati, mahali, jinsi?', stem_en: 'Have you started to work out or worked out the details of how to kill yourself? Do you intend to carry out this plan?', scale: SCALE_YN },
    { id: 'cs6', stem_sw: 'Maisha yako yote, umewahi kufanya kitu, kuanza kufanya, au kujiandaa kufanya kitu cha kumaliza maisha yako?', stem_en: 'Have you ever done anything, started to do anything, or prepared to do anything to end your life?', scale: SCALE_YN },
  ],
  scoring: (a) => a.reduce((s, v) => s + (v || 0), 0),
  interpret: (_score, answers) => {
    const a = answers || []
    const high = (a[2] || a[3] || a[4] || a[5]) === 1
    const moderate = a[1] === 1
    const low = a[0] === 1
    if (high) {
      return { score: _score, severity: 'kalifu_sana', label_sw: 'HATARI KUBWA', label_en: 'HIGH RISK', guidance_sw: 'Tafadhali wasiliana na huduma za dharura SASA. Kitufe cha dharura kiko hapa.', guidance_en: 'Please connect with emergency services NOW.', redFlag: true }
    }
    if (moderate) {
      return { score: _score, severity: 'kali', label_sw: 'Hatari ya wastani', label_en: 'Moderate risk', guidance_sw: 'Tafadhali zungumza na mtaalamu leo.', guidance_en: 'Speak with a professional today.', redFlag: true }
    }
    if (low) {
      return { score: _score, severity: 'wastani', label_sw: 'Hatari nyepesi', label_en: 'Low risk', guidance_sw: 'Mwenza yuko hapa kukusikiliza. Zungumza na rafiki au mshauri.', guidance_en: 'Mwenza is here. Speak with a trusted person.', redFlag: true }
    }
    return { score: 0, severity: 'salama', label_sw: 'Hakuna dalili za hatari', label_en: 'No active risk', guidance_sw: 'Endelea kujijali.', guidance_en: 'Continue self-care.' }
  },
}

/* ─────────────────────────────────  CRAFFT  ────────────────────────────────── */

const CRAFFT_STEMS: Array<[string, string]> = [
  ['Umewahi kupanda gari likiendeshwa na mtu (ikiwa ni pamoja na wewe mwenyewe) aliyekuwa amelewa au ametumia dawa za kulevya?', 'Have you ever ridden in a CAR driven by someone (including yourself) who was "high" or using alcohol/drugs?'],
  ['Je, unatumia pombe au dawa za kulevya kupumzika, kujisikia vizuri, au kuingia katika hali?', 'Do you ever use alcohol or drugs to RELAX, feel better about yourself, or fit in?'],
  ['Je, unatumia pombe au dawa za kulevya ukiwa peke yako?', 'Do you ever use alcohol or drugs while you are by yourself, ALONE?'],
  ['Je, unasahau mambo uliyofanya ukiwa umetumia pombe au dawa za kulevya?', 'Do you ever FORGET things you did while using alcohol or drugs?'],
  ['Je, familia au marafiki wanakuambia kwamba upunguze matumizi yako?', 'Do your FAMILY or FRIENDS ever tell you that you should cut down on your drinking or drug use?'],
  ['Je, umewahi kuingia matatizoni ukiwa umetumia pombe au dawa za kulevya?', 'Have you ever gotten into TROUBLE while you were using alcohol or drugs?'],
]

export const CRAFFT: Instrument = {
  id: 'crafft',
  name_sw: 'CRAFFT — Kipimo cha Matumizi ya Vileo kwa Vijana',
  name_en: 'CRAFFT — Adolescent Substance Use Screen',
  domain: 'youth',
  ageRange: { min: 12, max: 21 },
  cite: 'Knight JR, et al. Arch Pediatr Adolesc Med. 1999;153:591-6.',
  verified: false,
  items: CRAFFT_STEMS.map(([sw, en], i) => ({
    id: `cr${i + 1}`, stem_sw: sw, stem_en: en, scale: SCALE_YN,
  })),
  scoring: (a) => a.reduce((s, v) => s + (v || 0), 0),
  interpret: (score) => {
    if (score >= 2) {
      return { score, severity: 'kali', label_sw: 'Hatari kubwa — uchunguzi unahitajika', label_en: 'High risk — full assessment', guidance_sw: 'Zungumza na mshauri leo.', guidance_en: 'Speak with a counselor today.' }
    }
    return { score, severity: 'salama', label_sw: 'Hatari ndogo', label_en: 'Low risk', guidance_sw: 'Endelea kufanya maamuzi salama.', guidance_en: 'Keep making safe choices.' }
  },
}

/* ─────────────────────────────────  SDQ (25)  ──────────────────────────────── */

const SDQ_STEMS: Array<[string, string, boolean?]> = [
  ['Ninazingatia hisia za watu wengine', 'I try to be nice to other people. I care about their feelings'],
  ['Sina utulivu, siwezi kukaa kimya kwa muda mrefu', 'I am restless, I cannot stay still for long'],
  ['Mara nyingi nina maumivu ya kichwa, tumbo, au kichefuchefu', 'I get a lot of headaches, stomach-aches or sickness'],
  ['Mara nyingi nashiriki vitu na watu wengine', 'I usually share with others'],
  ['Mara nyingi napata hasira au milipuko', 'I get very angry and often lose my temper'],
  ['Niko peke yangu mara nyingi; ninapenda kucheza peke yangu', 'I am usually on my own. I generally play alone or keep to myself'],
  ['Mara nyingi nafanya yale niambiwayo', 'I usually do as I am told', true],
  ['Nina wasiwasi mwingi, mara nyingi naonekana mwenye hofu', 'I worry a lot'],
  ['Husaidia mtu yeyote anayejisikia mbaya, mwenye huzuni, au mgonjwa', 'I am helpful if someone is hurt, upset or feeling ill'],
  ['Nikisubiri, hutaharuki kwa urahisi', 'I am constantly fidgeting or squirming'],
  ['Nina rafiki mzuri au zaidi', 'I have one good friend or more', true],
  ['Mara nyingi napigana; ninaweza kuwafanya wengine wafanye nitakavyo', 'I fight a lot. I can make other people do what I want'],
  ['Mara nyingi nina huzuni, nimekata tamaa, au machozi', 'I am often unhappy, depressed or tearful'],
  ['Watoto wengine kwa kawaida wananipenda', 'Other young people generally like me', true],
  ['Ninajifadhaisha kwa urahisi; sijazingatia kazi yangu', 'I am easily distracted, I find it difficult to concentrate'],
  ['Nina hofu katika hali mpya; napoteza ujasiri kwa urahisi', 'I am nervous in new situations. I easily lose confidence'],
  ['Ninawajali watoto wadogo', 'I am kind to younger children'],
  ['Mara nyingi watu wananishtumu kwa uongo au udanganyifu', 'I am often accused of lying or cheating'],
  ['Watoto wengine wananiudhi au kunikejeli', 'Other children or young people pick on me or bully me'],
  ['Ninajitolea kusaidia wengine (wazazi, walimu, watoto)', 'I often volunteer to help others'],
  ['Hufikiria kabla ya kutenda', 'I think before I do things', true],
  ['Hunyakua vitu visivyo vyangu nyumbani, shuleni, au mahali pengine', 'I take things that are not mine from home, school or elsewhere'],
  ['Hupatana zaidi na watu wazima kuliko watoto wenzangu', 'I get on better with adults than with people my own age'],
  ['Nina hofu nyingi; naogopa kwa urahisi', 'I have many fears, I am easily scared'],
  ['Humaliza kazi nilizoanza; nina uwezo wa kuzingatia', 'I finish the work I am doing. My attention is good', true],
]

export const SDQ: Instrument = {
  id: 'sdq',
  name_sw: 'SDQ — Hojaji ya Nguvu na Changamoto',
  name_en: 'SDQ — Strengths and Difficulties Questionnaire',
  domain: 'youth',
  ageRange: { min: 4, max: 17 },
  cite: 'Goodman R. J Child Psychol Psychiatry. 1997;38:581-6.',
  verified: false,
  items: SDQ_STEMS.map(([sw, en, rev], i) => ({
    id: `sd${i + 1}`, stem_sw: sw, stem_en: en, scale: SCALE_SDQ, reverse: !!rev,
  })),
  scoring: (a) => a.reduce((s, v, i) => {
    const item = SDQ_STEMS[i]
    const reverse = item && item[2]
    const v0 = v || 0
    return s + (reverse ? 2 - v0 : v0)
  }, 0),
  interpret: (score) => {
    let severity: Severity = 'salama'
    let label_sw = 'Karibu wastani'
    let label_en = 'Close to average'
    if (score >= 17) { severity = 'kidogo'; label_sw = 'Juu kidogo'; label_en = 'Slightly raised' }
    if (score >= 20) { severity = 'wastani'; label_sw = 'Juu'; label_en = 'High' }
    if (score >= 24) { severity = 'kali'; label_sw = 'Juu sana'; label_en = 'Very high' }
    return { score, severity, label_sw, label_en, guidance_sw: 'Zungumza na mwalimu au mshauri kuhusu nguvu na changamoto za mtoto.', guidance_en: 'Discuss findings with caregiver or counselor.' }
  },
}

/* ─────────────────────────────────  WHODAS 2.0 (12)  ───────────────────────── */

const WHODAS_STEMS: Array<[string, string]> = [
  ['Kusimama kwa muda mrefu kama dakika 30', 'Standing for long periods such as 30 minutes'],
  ['Kushughulikia majukumu yako ya kaya', 'Taking care of your household responsibilities'],
  ['Kujifunza jambo jipya, kwa mfano njia mpya ya kwenda mahali', 'Learning a new task, for example, learning how to get to a new place'],
  ['Kushiriki katika shughuli za jamii kama sherehe au mikutano', 'How much of a problem did you have joining in community activities'],
  ['Kuwa na athari za kihisia kutokana na hali yako ya afya', 'How much have you been emotionally affected by your health problems'],
  ['Kuzingatia kufanya jambo kwa dakika 10', 'Concentrating on doing something for ten minutes'],
  ['Kutembea umbali mrefu kama kilometa moja', 'Walking a long distance such as a kilometre'],
  ['Kuosha mwili wako wote', 'Washing your whole body'],
  ['Kuvaa nguo', 'Getting dressed'],
  ['Kushughulika na watu usiowafahamu', 'Dealing with people you do not know'],
  ['Kudumisha urafiki', 'Maintaining a friendship'],
  ['Kufanya kazi yako ya kila siku au shule', 'Your day-to-day work or school'],
]

export const WHODAS: Instrument = {
  id: 'whodas',
  name_sw: 'WHODAS 2.0 — Kipimo cha Utendaji (kifupi)',
  name_en: 'WHODAS 2.0 — Disability Assessment Schedule (12-item)',
  domain: 'function',
  ageRange: { min: 12, max: 120 },
  cite: 'WHO. Measuring Health and Disability: Manual for WHODAS 2.0. Geneva: WHO; 2010.',
  verified: false,
  items: WHODAS_STEMS.map(([sw, en], i) => ({
    id: `wd${i + 1}`, stem_sw: sw, stem_en: en, scale: SCALE_WHODAS,
  })),
  scoring: (a) => a.reduce((s, v) => s + (v || 0), 0),
  interpret: (score) => {
    let severity: Severity = 'salama'
    let label_sw = 'Hakuna shida kubwa'
    let label_en = 'No major disability'
    if (score >= 24) { severity = 'kidogo'; label_sw = 'Shida nyepesi'; label_en = 'Mild' }
    if (score >= 36) { severity = 'wastani'; label_sw = 'Shida ya wastani'; label_en = 'Moderate' }
    if (score >= 48) { severity = 'kali'; label_sw = 'Shida kali'; label_en = 'Severe' }
    return { score, severity, label_sw, label_en, guidance_sw: 'Tutapanga huduma kulingana na maeneo yenye shida zaidi.', guidance_en: 'Care plan will target areas of difficulty.' }
  },
}

/* ─────────────────────────────────  M.I.N.I. placeholder  ──────────────────── */

export const MINI: Instrument = {
  id: 'mini',
  name_sw: 'M.I.N.I. — Modyuli ya Uchunguzi (mfupi)',
  name_en: 'M.I.N.I. — Mini Diagnostic Interview (placeholder)',
  domain: 'diagnostic',
  ageRange: { min: 18, max: 120 },
  cite: 'Sheehan DV, et al. J Clin Psychiatry. 1998;59 Suppl 20:22-33.',
  verified: false,
  items: [
    { id: 'mi1', stem_sw: 'Modyuli ya M.I.N.I. itatekelezwa na mtaalamu — bonyeza hapa kuanza mahojiano yaliyoongozwa.', stem_en: 'M.I.N.I. modules are clinician-administered. Tap to begin a guided interview.', scale: SCALE_YN },
  ],
  scoring: () => 0,
  interpret: () => ({
    score: 0, severity: 'salama', label_sw: 'Inahitaji mtaalamu', label_en: 'Clinician-administered',
    guidance_sw: 'Tafadhali wasiliana na mtaalamu kufanya M.I.N.I. kwa undani.',
    guidance_en: 'Please connect with a clinician to administer M.I.N.I.',
  }),
}

/* ─────────────────────────────────  registry  ──────────────────────────────── */

export const INSTRUMENTS: Instrument[] = [
  PHQ9, GAD7, PCL5, AUDIT, ASSIST, K10, EPDS, CSSRS, CRAFFT, SDQ, WHODAS, MINI,
]

export const instrumentById = (id: string): Instrument | undefined =>
  INSTRUMENTS.find((i) => i.id === id)
