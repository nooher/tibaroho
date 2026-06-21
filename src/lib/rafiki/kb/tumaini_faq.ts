/**
 * Tumaini Behavioral Health FAQ — Tanzania & East Africa Edition.
 *
 * Source: Tumaini_Behavioral_Health_FAQ_Tanzania_East_Africa.docx
 * (founder-curated, hand-authored 65 entries).
 *
 * Each entry below is a faithful Swahili rendering of the original English
 * FAQ. The English is preserved verbatim in summary_en for citation
 * integrity. Tanzania-natural Swahili (not literal machine-translation)
 * was used for summary_sw. Citation points back to the source DOCX
 * section header.
 */

export interface FaqEntry {
  id: string
  topic: string
  summary_sw: string
  summary_en: string
  q_patterns: RegExp[]
  next_step_sw: string
  citation: string
}

const SRC = 'Tumaini BH FAQ Tanzania & East Africa Edition'

export const TUMAINI_FAQ: FaqEntry[] = [
  // ─── General behavioral health ──────────────────────────────────────────
  {
    id: 'bh-definition',
    topic: 'general',
    summary_sw:
      'Afya ya tabia (behavioral health) ni pana zaidi ya afya ya akili — inajumuisha afya ya akili, hisia, matumizi ya vilevi, tabia, mahusiano, ujuzi wa kuvumilia hali ngumu, na jinsi tunavyojibu changamoto za maisha.',
    summary_en:
      'Behavioral health includes mental health, emotional wellbeing, substance use, habits, behaviors, relationships, coping skills, and the ways people respond to life challenges.',
    q_patterns: [/(behavioral health|afya ya tabia|tabia ya afya)/i],
    next_step_sw: 'Niambie zaidi nini kinakuhusu — nitakusaidia kuongoza kwa hatua zinazofaa.',
    citation: `${SRC} · General Behavioral Health`,
  },
  {
    id: 'bh-vs-mh',
    topic: 'general',
    summary_sw:
      'Afya ya akili (mental health) ni sehemu MOJA ya afya ya tabia. Afya ya tabia inajumuisha pia tabia za maisha, matumizi ya vilevi, na utendaji wa kijamii.',
    summary_en:
      'Mental health is one component of behavioral health. Behavioral health also includes behaviors, lifestyle patterns, substance use, and social functioning.',
    q_patterns: [/(tofauti|difference).*(behavioral|tabia).*(mental|akili)/i],
    next_step_sw: 'Kama unahitaji kupima afya yako, nawezekuongoza kwa kipimo cha kawaida.',
    citation: `${SRC} · General Behavioral Health`,
  },
  {
    id: 'bh-affects-physical',
    topic: 'general',
    summary_sw:
      'Ndio — hali za afya ya tabia zinaweza kuchangia shinikizo la damu, kisukari, magonjwa ya moyo, maumivu ya muda mrefu, matatizo ya usingizi, na kutofuata maelekezo ya matibabu.',
    summary_en:
      'Yes. Behavioral health conditions can contribute to hypertension, diabetes, heart disease, chronic pain, sleep problems, and poor treatment adherence.',
    q_patterns: [/(akili|tabia|behavioral|mental).*(huathiri|affect|inaweza).*(mwili|physical|kimwili)/i],
    next_step_sw: 'Ongea na daktari wako wa kawaida — afya ya akili na ya mwili huenda pamoja.',
    citation: `${SRC} · General Behavioral Health`,
  },
  {
    id: 'bh-physical-affects-bh',
    topic: 'general',
    summary_sw:
      'Ndio — magonjwa ya muda mrefu, magonjwa ya mishipa ya fahamu, maambukizi, ulemavu na maumivu yanaweza kuchangia sonona, wasiwasi, na dhiki ya kihisia.',
    summary_en:
      'Yes. Chronic illnesses, neurological disorders, infections, disability, and pain can contribute to depression, anxiety, and emotional distress.',
    q_patterns: [/(magonjwa|illness|physical).*(huathiri|affect).*(akili|mental|tabia)/i],
    next_step_sw: 'Daktari wako anaweza kukutathmini kwa pamoja — afya ya mwili na akili.',
    citation: `${SRC} · General Behavioral Health`,
  },

  // ─── Depression and mood disorders ──────────────────────────────────────
  {
    id: 'depression-what',
    topic: 'depression',
    summary_sw:
      'Sonona (depression) ni hali ya kiafya inayoonyeshwa na: huzuni inayoendelea, kupoteza hamu, nguvu kidogo, mabadiliko ya usingizi, mabadiliko ya hamu ya chakula, na kushindwa kufanya kazi za kawaida.',
    summary_en:
      'Depression is a medical condition characterized by persistent sadness, loss of interest, low energy, sleep changes, appetite changes, and impaired functioning.',
    q_patterns: [/(sonona|depression|nini.*depress|huzuni ya muda mrefu)/i],
    next_step_sw: 'Nitumie kipimo cha PHQ-9 ili kupima ukubwa wa sonona — sio uchunguzi, lakini husaidia kuongoza.',
    citation: `${SRC} · Depression and Mood Disorders`,
  },
  {
    id: 'depression-no-reason',
    topic: 'depression',
    summary_sw:
      'Ndio — sonona inaweza kutokea kwa sababu za kibailojia, kisaikolojia, kijamii, kimazingira, au kimatibabu. Sio lazima kuwepo sababu maalum.',
    summary_en:
      'Yes. Depression can occur due to biological, psychological, social, environmental, or medical factors.',
    q_patterns: [/(sonona|depression).*(bila sababu|no reason|sababu maalum)/i],
    next_step_sw: 'Kupata daktari au CHW wa karibu — sababu inaweza kupatikana kwa uchunguzi.',
    citation: `${SRC} · Depression and Mood Disorders`,
  },
  {
    id: 'depression-not-weakness',
    topic: 'depression',
    summary_sw:
      'Hapana — sonona NI hali ya kiafya, sio udhaifu wa kibinafsi. Mtu mwenye sonona anahitaji msaada, sio kukashifiwa.',
    summary_en:
      'No. Depression is a health condition, not a personal failure.',
    q_patterns: [/(sonona|depression).*(udhaifu|weakness|laana)/i],
    next_step_sw: 'Tafuta msaada bila aibu — sonona huponywa.',
    citation: `${SRC} · Depression and Mood Disorders`,
  },
  {
    id: 'depression-children',
    topic: 'depression',
    summary_sw:
      'Ndio — sonona inaweza kuwakumba watu wa rika zote, ikiwemo watoto na vijana. Ushiriki wa mzazi, mwalimu na mtaalam ni muhimu.',
    summary_en:
      'Yes. Depression can affect people of all ages.',
    q_patterns: [/(watoto|children|vijana).*(sonona|depression)/i],
    next_step_sw: 'Ongea na mwalimu/CHW/kliniki ya watoto — usicheleweshe.',
    citation: `${SRC} · Depression and Mood Disorders`,
  },

  // ─── Anxiety and stress ─────────────────────────────────────────────────
  {
    id: 'anxiety-what',
    topic: 'anxiety',
    summary_sw:
      'Wasiwasi (anxiety) ni hofu, wasiwasi, au uoga uliopita kawaida unaoingilia maisha ya kila siku.',
    summary_en:
      'Anxiety is excessive fear, worry, or nervousness that interferes with daily life.',
    q_patterns: [/(wasiwasi|anxiety|hofu ya muda mrefu)/i],
    next_step_sw: 'Niambie tafadhali — naweza kukufundisha mbinu ya pumzi 4-7-8 kupunguza hali sasa.',
    citation: `${SRC} · Anxiety and Stress`,
  },
  {
    id: 'stress-vs-anxiety',
    topic: 'anxiety',
    summary_sw:
      'Msongo wa mawazo (stress) kwa kawaida hutoka kwa changamoto maalum; wasiwasi (anxiety) huweza kuendelea hata bila tishio la sasa.',
    summary_en:
      'Stress is usually related to a specific challenge, while anxiety may persist even when no immediate threat exists.',
    q_patterns: [/(tofauti|difference).*(stress|msongo).*(anxiety|wasiwasi)/i],
    next_step_sw: 'Pima na GAD-7 kupima ukubwa wa wasiwasi.',
    citation: `${SRC} · Anxiety and Stress`,
  },
  {
    id: 'anxiety-physical',
    topic: 'anxiety',
    summary_sw:
      'Ndio — wasiwasi unaweza kusababisha kifua kubana, mapigo ya moyo, jasho, kizunguzungu, tumbo, maumivu ya kichwa, na matatizo ya usingizi.',
    summary_en:
      'Yes. Anxiety may cause chest tightness, palpitations, sweating, dizziness, stomach discomfort, headaches, and sleep difficulties.',
    q_patterns: [/(wasiwasi|anxiety).*(dalili|symptoms|mwili|physical|kifua|moyo)/i],
    next_step_sw: 'Daktari anaweza kuondoa sababu za kimwili kwanza, halafu tuongelee mbinu za kupunguza.',
    citation: `${SRC} · Anxiety and Stress`,
  },

  // ─── Trauma and PTSD ────────────────────────────────────────────────────
  {
    id: 'trauma-what',
    topic: 'trauma',
    summary_sw:
      'Kiwewe (trauma) ni mwitikio wa kihisia kwa matukio yanayodhuru sana au yanayohatarisha maisha.',
    summary_en:
      'Trauma is an emotional response to deeply distressing or life-threatening experiences.',
    q_patterns: [/(kiwewe|trauma|jeraha la akili)/i],
    next_step_sw: 'Ni salama kuongea — niambie kile kilichotokea kama upo tayari, au tuanze na utulizo.',
    citation: `${SRC} · Trauma and PTSD`,
  },
  {
    id: 'ptsd-what',
    topic: 'trauma',
    summary_sw:
      'PTSD (Post-Traumatic Stress Disorder) ni hali inayohusisha: kumbukumbu zinazoingia ghafla, kuepuka, kuchunga kupita kawaida, na dhiki ya kihisia baada ya tukio la kiwewe.',
    summary_en:
      'Post-Traumatic Stress Disorder is a condition involving intrusive memories, avoidance, hypervigilance, and emotional distress after traumatic events.',
    q_patterns: [/(ptsd|post.*traumatic|dhiki baada ya kiwewe)/i],
    next_step_sw: 'PCL-5 ni kipimo. Tuanze kuwa salama mwilini kwanza — pumua polepole nawe.',
    citation: `${SRC} · Trauma and PTSD`,
  },

  // ─── Substance use ──────────────────────────────────────────────────────
  {
    id: 'alcohol-mh',
    topic: 'substance',
    summary_sw:
      'Ndio — pombe inaweza kuongeza sonona, wasiwasi, matatizo ya usingizi, mzozo wa familia, na hatari ya kujiua.',
    summary_en:
      'Yes. Alcohol can worsen depression, anxiety, sleep disorders, relationship problems, and suicide risk.',
    q_patterns: [/(pombe|alcohol).*(sonona|depression|akili|mental)/i],
    next_step_sw: 'AUDIT ni kipimo cha pombe. Nitumie sasa kwa dakika 2.',
    citation: `${SRC} · Substance Use`,
  },
  {
    id: 'drugs-psychosis',
    topic: 'substance',
    summary_sw:
      'Baadhi ya vilevi (k.m. bangi nzito, methamfetamini, kokeini) vinaweza kusababisha au kuongeza saikosi, wasiwasi, sonona, na matatizo ya akili.',
    summary_en:
      'Some substances can trigger or worsen psychosis, anxiety, depression, and cognitive problems.',
    q_patterns: [/(bangi|cannabis|drug|dawa za kulevya|methamfetamini).*(saikosi|psychosis|akili)/i],
    next_step_sw: 'Hospitali ya akili (Mirembe, Muhimbili NIMH) ni hatua salama kwa tathmini ya haraka.',
    citation: `${SRC} · Substance Use`,
  },
  {
    id: 'addiction-what',
    topic: 'substance',
    summary_sw:
      'Uraibu (addiction) ni hali ya muda mrefu inayoonyeshwa na matumizi ya vilevi kwa kulazimishwa, hata pale madhara yanapojulikana.',
    summary_en:
      'Addiction is a chronic condition characterized by compulsive substance use despite harmful consequences.',
    q_patterns: [/(uraibu|addiction|nimezoea pombe)/i],
    next_step_sw: 'Mpango wa MI (Motivational Interviewing) na CBT husaidia. Naweza kukufundisha hatua za kwanza.',
    citation: `${SRC} · Substance Use`,
  },

  // ─── Suicide and crisis ─────────────────────────────────────────────────
  {
    id: 'suicide-warning',
    topic: 'crisis',
    summary_sw:
      'Ishara za onyo: hisia ya kutokuwa na matumaini, kuongea kuhusu kifo, kujitenga, kutoa vitu vyako vya thamani, na historia ya kujidhuru. Hizi ni dharura.',
    summary_en:
      'Warning signs include hopelessness, talking about death, social withdrawal, giving away possessions, and previous self-harm.',
    q_patterns: [/(kujiua|suicide|kujidhuru|hujidhuru|hofu ya kifo).*(ishara|signs|warning)/i],
    next_step_sw:
      'Kama wewe au mtu wa karibu yuko hatarini, piga 116 (Child Helpline), 112 (dharura), au nenda hospitali ya karibu MARA MOJA.',
    citation: `${SRC} · Suicide and Crisis`,
  },
  {
    id: 'suicide-take-seriously',
    topic: 'crisis',
    summary_sw:
      'NDIO — kila kuongelea mawazo ya kujiua kunatakiwa kuchukuliwa kwa uzito na kutathminiwa MARA MOJA. Sio kelele — ni ombi la msaada.',
    summary_en:
      'Yes. Every expression of suicidal thoughts should be taken seriously and assessed promptly.',
    q_patterns: [/(mawazo|thoughts).*(kujiua|suicide).*(uzito|seriously)/i],
    next_step_sw: 'C-SSRS ni kipimo cha haraka. Naweza kukusaidia kupima sasa hivi.',
    citation: `${SRC} · Suicide and Crisis`,
  },

  // ─── Children & adolescents ─────────────────────────────────────────────
  {
    id: 'behavior-underlying',
    topic: 'children',
    summary_sw:
      'Ndio — baadhi ya tabia za mtoto zinaweza kuonyesha ADHD, wasiwasi, kiwewe, sonona, usonji (autism), matatizo ya kujifunza, au msongo wa familia.',
    summary_en:
      'Yes. Some behavioral problems may be associated with ADHD, anxiety, trauma, depression, autism, learning disorders, or family stress.',
    q_patterns: [/(tabia.*mtoto|child.*behavior).*(akili|mental|adhd)/i],
    next_step_sw: 'SDQ ni kipimo cha tabia za watoto. Mwalimu wake na kliniki ya watoto wanaweza kusaidia.',
    citation: `${SRC} · Children and Adolescents`,
  },
  {
    id: 'adhd-what',
    topic: 'children',
    summary_sw:
      'ADHD (Attention-Deficit/Hyperactivity Disorder) ni hali ya ukuaji wa ubongo inayoathiri umakini, udhibiti wa msukumo, na kiwango cha shughuli.',
    summary_en:
      'Attention-Deficit/Hyperactivity Disorder is a neurodevelopmental condition affecting attention, impulse control, and activity levels.',
    q_patterns: [/(adhd|attention deficit|umakini|hyperactiv)/i],
    next_step_sw: 'Daktari wa watoto au mtaalam wa afya ya akili ya watoto ndiye anayethibitisha utambuzi.',
    citation: `${SRC} · Children and Adolescents`,
  },

  // ─── Related conditions and secondary effects ───────────────────────────
  {
    id: 'bh-education',
    topic: 'secondary',
    summary_sw:
      'Ndio — afya ya tabia inayoathiri inaweza kupunguza umakini, mahudhurio, ufanisi wa kitaaluma, na ufaulu wa elimu.',
    summary_en:
      'Yes. They can reduce concentration, attendance, academic performance, and educational attainment.',
    q_patterns: [/(elimu|education|shule|school).*(akili|mental|tabia)/i],
    next_step_sw: 'Mwalimu mlezi anaweza kushirikiana na CHW wa shule — Shule+ ni eneo letu kwa hili.',
    citation: `${SRC} · Related Conditions`,
  },
  {
    id: 'bh-employment',
    topic: 'secondary',
    summary_sw:
      'Ndio — afya ya tabia inaweza kuathiri uzalishaji, mahudhurio, mahusiano kazini, na hatua za kazi.',
    summary_en:
      'Yes. They can affect productivity, attendance, interpersonal relationships, and career progression.',
    q_patterns: [/(kazi|employment|mahala pa kazi).*(akili|mental|tabia)/i],
    next_step_sw: 'EAP (Employee Assistance Program) ya kampuni inaweza kusaidia. Wafanyakazi ni eneo letu.',
    citation: `${SRC} · Related Conditions`,
  },
  {
    id: 'bh-families',
    topic: 'secondary',
    summary_sw:
      'Ndio — afya ya tabia inaweza kuchangia mzozo wa familia, msongo wa walezi, ugumu wa mahusiano, na shida za kiuchumi.',
    summary_en:
      'Yes. They can contribute to family conflict, caregiver stress, relationship difficulties, and economic hardship.',
    q_patterns: [/(familia|family|nyumbani).*(akili|mental|tabia)/i],
    next_step_sw: 'Family Therapy iko Tanzania. Niambie zaidi kuhusu hali ya familia yako.',
    citation: `${SRC} · Related Conditions`,
  },
  {
    id: 'bh-sleep',
    topic: 'secondary',
    summary_sw:
      'Ndio — matatizo ya usingizi yanaweza kuwa sababu na pia matokeo ya afya ya tabia. Yanafanya pamoja.',
    summary_en:
      'Yes. Sleep problems may be both causes and consequences of behavioral health conditions.',
    q_patterns: [/(usingizi|sleep|insomnia).*(akili|mental|tabia)/i],
    next_step_sw: 'Sleep hygiene ni mbinu rahisi — naweza kukufundisha.',
    citation: `${SRC} · Related Conditions`,
  },
  {
    id: 'bh-chronic-pain',
    topic: 'secondary',
    summary_sw:
      'Ndio — maumivu ya muda mrefu na afya ya tabia mara nyingi huathirana. Matibabu yanahitaji mtazamo wa pamoja.',
    summary_en:
      'Yes. Chronic pain and behavioral health conditions often influence each other.',
    q_patterns: [/(maumivu.*muda mrefu|chronic pain).*(akili|mental)/i],
    next_step_sw: 'CBT ya maumivu (CBT for pain) ina ushahidi. Ongea na mtaalam wa maumivu.',
    citation: `${SRC} · Related Conditions`,
  },

  // ─── East Africa context ────────────────────────────────────────────────
  {
    id: 'culture-bh',
    topic: 'culture',
    summary_sw:
      'Ndio — imani za kitamaduni, kidini, kifamilia, na za kijamii zinaongoza jinsi watu wanavyoelewa na kutafuta msaada wa afya ya tabia.',
    summary_en:
      'Yes. Cultural, religious, family, and community beliefs influence how people understand and seek help for behavioral health concerns.',
    q_patterns: [/(utamaduni|culture|imani|religion).*(akili|mental|tabia)/i],
    next_step_sw: 'Tunaheshimu utamaduni wako — niambie nini ni muhimu kwako.',
    citation: `${SRC} · East Africa Context`,
  },
  {
    id: 'faith-bh',
    topic: 'culture',
    summary_sw:
      'Ndio — msaada wa kidini unaweza kushirikiana na matibabu yenye ushahidi (evidence-based) ikitumiwa kwa busara. Faith-informed care ni mbinu halali.',
    summary_en:
      'Yes. Faith-based support can complement evidence-based behavioral health care when used appropriately.',
    q_patterns: [/(imani|faith|sala|prayer|dini|religion).*(akili|matibabu|treatment)/i],
    next_step_sw: 'Kiongozi wako wa kiroho na mtaalam wa afya wanaweza kushirikiana — sio chaguo moja tu.',
    citation: `${SRC} · East Africa Context`,
  },
  {
    id: 'community-ea',
    topic: 'culture',
    summary_sw:
      'Mitandao imara ya familia na jamii Afrika Mashariki ni kichocheo kikuu cha ustahimilivu, kupona, na ustawi. Rafiki na ndugu ni dawa pia.',
    summary_en:
      'Strong family and community networks often play a major role in resilience, recovery, and wellbeing.',
    q_patterns: [/(jamii|community|familia|family|rafiki|friends).*(msaada|support|kupona|recovery)/i],
    next_step_sw: 'Tugundue ni nani ndani ya mzunguko wako anaweza kuwa nguzo yako.',
    citation: `${SRC} · East Africa Context`,
  },
]

/** Find the best-matching FAQ entry for a query, or null. */
export function findFaqAnswer(query: string): FaqEntry | null {
  const q = query.toLowerCase()
  for (const e of TUMAINI_FAQ) {
    for (const rx of e.q_patterns) {
      if (rx.test(q)) return e
    }
  }
  return null
}

/** Rafiki-style shaped reply. */
export function askFaq(query: string): {
  domain: string
  respond: string
  next_step: string
  citation: string
} | null {
  const hit = findFaqAnswer(query)
  if (!hit) return null
  return {
    domain: 'Tumaini BH FAQ · Tanzania & East Africa',
    respond: hit.summary_sw,
    next_step: `Hatua: ${hit.next_step_sw}`,
    citation: hit.citation,
  }
}
