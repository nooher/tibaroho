/**
 * WHO Mental Health Atlas 2024 — global mental health system overview.
 *
 * Source: "Mental health atlas 2024", © WHO 2024.
 * Source PDF: iris.who.int (item cef28a0f-ca49-4d96-9dc1-3a156ed228e4).
 *
 * The Atlas is WHO's quadrennial snapshot of mental health systems
 * globally. This module surfaces high-level findings a clinician,
 * researcher, or policy-maker would cite.
 *
 * Honesty: Tanzania-specific Atlas data is in country tables that are
 * not safely citable from this PDF text body alone. Entries below cite
 * GLOBAL or REGION-level findings from the Atlas; for Tanzania-specific
 * profile, see src/lib/epi/tanzania.ts which draws on Tanzania HSSP V
 * and WHO Atlas country profiles.
 */

export interface AtlasEntry {
  id: string
  topic: string
  summary_sw: string
  summary_en: string
  q_patterns: RegExp[]
  next_step_sw: string
  citation: string
}

const SRC = 'WHO Mental Health Atlas 2024'

export const WHO_ATLAS_2024: AtlasEntry[] = [
  {
    id: 'atlas-global-expenditure',
    topic: 'financing',
    summary_sw:
      'Kwa kiwango cha dunia, takwimu kutoka nchi 75 zinaonyesha kuwa wastani wa matumizi ya serikali kwa afya ya akili ni 2.1% tu ya bajeti ya jumla ya afya. Hii ni nyongeza kidogo tu kutoka miaka iliyopita — sio sambamba na ongezeko la mahitaji.',
    summary_en:
      'Globally, data from 75 countries show that the median government expenditure on mental health is 2.1% of total health budget — barely increased from prior years, not keeping pace with growing need.',
    q_patterns: [/(matumizi|expenditure|bajeti|budget).*(afya.*akili|mental health)/i],
    next_step_sw: 'Tanzania HSSP V inalenga kuongeza budget ya afya ya akili — angalia sera za nyumbani.',
    citation: `${SRC} · §3 Mental health financing`,
  },
  {
    id: 'atlas-workforce',
    topic: 'workforce',
    summary_sw:
      'Kwa kiwango cha dunia, wauguzi wa afya ya akili (psychiatric nurses) ndio sehemu kubwa zaidi (43%) ya nguvu kazi ya specialist; ikifuatwa na psychologists (22%) na psychiatrists (16%). Tanzania na nchi nyingi za kipato cha chini, idadi ya specialists ni chini sana kwa hivyo CHW + lay counsellors + faith network ni nguzo.',
    summary_en:
      'Globally, mental health nurses are the largest specialist workforce (43%), then psychologists (22%), then psychiatrists (16%). In Tanzania and many low-income countries, specialist density is low — so CHWs, lay counsellors, and faith networks are essential pillars.',
    q_patterns: [/(nguvu kazi|workforce|psychiatrist|psychologist).*(afya.*akili|mental health)/i],
    next_step_sw: 'Tanzania ina <1 psychiatrist kwa watu 100,000 (WHO Atlas estimate) — CHW training ni kipaumbele.',
    citation: `${SRC} · §3 Workforce`,
  },
  {
    id: 'atlas-policy-progress',
    topic: 'policy',
    summary_sw:
      'Kati ya 2020 na 2024, kuna ongezeko la nchi zenye sera za afya ya akili zilizoazima na zinazotekelezwa — ikiwa ni pamoja na mageuzi makubwa ya kuhakikisha haki za binadamu. Lakini fedha bado ni kikwazo kikubwa — sera nyingi hazina ufadhili wa kutosha.',
    summary_en:
      'Between 2020-2024, more countries have adopted and implemented mental health policies, including major reforms ensuring human rights. But funding remains the main barrier — many policies lack adequate financing.',
    q_patterns: [/(sera|policy|plan).*(afya.*akili|mental health)/i],
    next_step_sw: 'Tanzania ina Mental Health Act 2008 + Mental Health (General) Regulations 2016 — sera ipo, ufadhili ni changamoto.',
    citation: `${SRC} · §2 Mental health policy`,
  },
  {
    id: 'atlas-treatment-gap',
    topic: 'gap',
    summary_sw:
      'Treatment gap (pengo la matibabu) ni kubwa duniani: hata katika nchi za kipato cha juu, asilimia kubwa ya watu wenye matatizo ya akili hawapati huduma. Katika nchi za kipato cha chini kama Tanzania, pengo linaweza kufika 85-90%. Sababu: ufukara, stigma, ukosefu wa nguvu kazi, ukosefu wa dawa.',
    summary_en:
      'Global treatment gap remains wide: even high-income countries see large proportions of people with MH conditions not receiving care. In low-income countries like Tanzania, gap may reach 85-90%. Causes: poverty, stigma, workforce shortage, medication access.',
    q_patterns: [/(treatment gap|pengo.*matibabu|hawapati huduma)/i],
    next_step_sw: 'mhGAP IG v2.0 ilikuwa imeundwa hasa kupunguza pengo hili — task-shifting kwa CHW.',
    citation: `${SRC} · Executive summary — Treatment gap`,
  },
  {
    id: 'atlas-suicide-data',
    topic: 'suicide',
    summary_sw:
      'Kifo cha kujiua duniani: takriban watu 700,000 hujiua kila mwaka. Sub-Saharan Africa ina kiwango kinachoongezeka kwa vijana wa kiume. Tanzania: tafiti za WHO zinaonyesha kifo cha kujiua kati ya 5-10 kwa kila 100,000. Means za kawaida: sumu za kilimo, kujitundika, kuingia mtoni.',
    summary_en:
      'Global suicide: ~700,000 deaths annually. Sub-Saharan Africa rising in young males. Tanzania: WHO estimates 5-10 per 100,000 (varies by year/study). Common means: agricultural poisons, hanging, drowning.',
    q_patterns: [/(suicide|kujiua).*(data|takwimu|kiwango|rate)/i],
    next_step_sw: 'Tanzania crisis line: Lifeline 0800 110 014 + 116 (watoto) + 112 (dharura).',
    citation: `${SRC} · Suicide prevention chapter`,
  },
  {
    id: 'atlas-information-systems',
    topic: 'data',
    summary_sw:
      'Mfumo wa taarifa za afya ya akili (HMIS) ni dhaifu katika nchi nyingi — taarifa za prevalence, ufuatiliaji wa wagonjwa, na matumizi ya dawa hazikusanywi kwa ufanisi. Tanzania ina DHIS2 kama mfumo wa kitaifa, lakini moduli ya afya ya akili bado inaendelea kuimarishwa.',
    summary_en:
      'Mental health information systems are weak in many countries — prevalence data, patient tracking, medication use are not systematically captured. Tanzania uses DHIS2 nationally, but the MH module is still being strengthened.',
    q_patterns: [/(taarifa|data|HMIS|DHIS).*(afya.*akili|mental health)/i],
    next_step_sw: 'TABHOS inaweza kushirikiana na DHIS2 ya MoH Tanzania kwa FHIR-based bridge.',
    citation: `${SRC} · Information systems chapter`,
  },
  {
    id: 'atlas-human-rights',
    topic: 'rights',
    summary_sw:
      'Atlas inasisitiza haki za binadamu: kuondoa coercion (kushikilia kwa nguvu), kuhakikisha consent, kupunguza muda wa hospitalisation ya nguvu. Tanzania Mental Health Act 2008 + Regulations 2016 zina vipengele vya haki za wagonjwa — lakini ushahidi wa utekelezaji ni mdogo.',
    summary_en:
      'Atlas emphasises human rights: reducing coercion, ensuring consent, minimising involuntary hospitalisation duration. Tanzania Mental Health Act 2008 + 2016 Regulations have rights provisions — but implementation evidence is limited.',
    q_patterns: [/(haki|human rights).*(mental health|afya.*akili)/i],
    next_step_sw: 'Tanzania PWB (Patient Welfare Board) ya mkoa wako ina mamlaka ya kushughulikia malalamiko.',
    citation: `${SRC} · Human rights and mental health`,
  },
  {
    id: 'atlas-children-adolescents',
    topic: 'children',
    summary_sw:
      'Huduma za afya ya akili kwa watoto + vijana: zinakosekana sana duniani. Mfumo wa specialist kwa watoto ni dhaifu — wagonjwa wengi wadogo wanahudumiwa na walezi/walimu/CHW pasipo specialist. Tanzania na nchi nyingine zinahitaji uwekezaji kwenye child psychiatry training na shule-based services.',
    summary_en:
      'Child + adolescent mental health services are scarce globally. Specialist systems for youth are weak — most under-18 patients are served by carers/teachers/CHWs without specialists. Tanzania and similar countries need investment in child psychiatry training and school-based services.',
    q_patterns: [/(watoto|vijana|children|adolescent).*(afya.*akili|mental health|specialist)/i],
    next_step_sw: 'Tanzania: Shule+ inalenga shule-based MH; CMH module ya mhGAP inaweza kuongoza CHW.',
    citation: `${SRC} · Child and adolescent MH services`,
  },
  {
    id: 'atlas-essential-medicines',
    topic: 'medication',
    summary_sw:
      'Upatikanaji wa dawa muhimu za afya ya akili: kwa nchi za kipato cha juu, dawa zote 10 za mhGAP essential list zinapatikana mara nyingi; katika nchi za kipato cha chini kama Tanzania, ni 4-6 tu zinazopatikana kwa ufuatiliaji. Hii inaongeza pengo la matibabu — hata kama daktari anataka kuagiza, dawa haipatikani.',
    summary_en:
      'Essential MH medicine availability: in high-income countries, all 10 mhGAP essential medicines are usually available; in low-income like Tanzania, only 4-6 are routinely available. This widens the treatment gap — even if doctor wants to prescribe, the drug is unavailable.',
    q_patterns: [/(dawa|medication|drugs).*(upatikanaji|availability).*(akili|mental)/i],
    next_step_sw: 'MSD (Medical Stores Department) Tanzania ndio supply chain — wasiliana kwa stock-out reports.',
    citation: `${SRC} · Essential medicines availability`,
  },
  {
    id: 'atlas-promotion-prevention',
    topic: 'prevention',
    summary_sw:
      'Upangaji wa kuhamasisha afya ya akili na kuzuia: bado dhaifu duniani. Programs kama mental health at workplace, anti-stigma campaigns, parenting skills programs, na school-based emotional literacy ni za kawaida ila hazifikii uwekezaji wa kutosha. Tanzania: programs za Kemia/Kasi za Afya ya Akili ni ndogo, mara nyingi NGO-led.',
    summary_en:
      'Mental health promotion + prevention planning remains weak. Programmes like workplace MH, anti-stigma campaigns, parenting skills, school emotional literacy are common in concept but underfunded. Tanzania: prevention programmes are small, mostly NGO-led.',
    q_patterns: [/(prevention|kuzuia|promotion|kuhamasisha).*(afya.*akili|mental health)/i],
    next_step_sw: 'Tanzania: shirikiana na BAKWATA, TEC, ELCT, NGO kama Friendship Bench kwa community programs.',
    citation: `${SRC} · Promotion and prevention`,
  },
]

export function findAtlasAnswer(query: string): AtlasEntry | null {
  const q = query.toLowerCase()
  for (const e of WHO_ATLAS_2024) {
    for (const rx of e.q_patterns) {
      if (rx.test(q)) return e
    }
  }
  return null
}

export function askAtlas(query: string): { domain: string; respond: string; next_step: string; citation: string } | null {
  const hit = findAtlasAnswer(query)
  if (!hit) return null
  return {
    domain: 'WHO Mental Health Atlas 2024',
    respond: hit.summary_sw,
    next_step: `Hatua: ${hit.next_step_sw}`,
    citation: hit.citation,
  }
}
