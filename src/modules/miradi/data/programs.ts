/**
 * TBHOS — canonical program catalogue.
 *
 * Every program here is FREE at use-point (fee_default=0). Evidence citations
 * point to the upstream manual or trial; we Swahili-adapt content with
 * cultural-fit reviewers before clinical deployment. EMDR is provider_only
 * because it requires trained therapists.
 */

export type Modality = 'virtual' | 'in_person' | 'hybrid' | 'asynchronous'

export interface Session {
  index: number
  name_sw: string
  name_en?: string
  summary_sw: string
  activities: string[]
  homework?: string
}

export interface Program {
  id: string
  slug: string
  name_sw: string
  name_en: string
  sessions: Session[]
  target: string[]
  evidence_citation: string
  citation: string
  audience: string
  modality: Modality
  fee_default: 0
  provider_only?: boolean
  faith?: 'none' | 'christian' | 'muslim' | 'traditional' | 'multi'
  notes_sw?: string
}

const s = (
  index: number, name_sw: string, name_en: string, summary_sw: string,
  activities: string[], homework?: string,
): Session => ({ index, name_sw, name_en, summary_sw, activities, homework })

export const PROGRAMS: Program[] = [
  {
    id: 'pm_plus', slug: 'pm_plus',
    name_sw: 'PM+ Kiswahili',
    name_en: 'Problem Management Plus (Swahili)',
    sessions: [
      s(1, 'Kudhibiti Mafadhaiko', 'Managing Stress',
        'Tunajifunza pumzi ya tumbo polepole — chombo cha kwanza cha kupunguza mkazo wa mwili na akili.',
        ['Utangulizi wa PM+ na makubaliano ya pamoja', 'Mazoezi ya pumzi polepole (dakika 3)', 'Kutambua dalili za mwili za mfadhaiko', 'Mpango wa kufanya kila siku'],
        'Fanya pumzi polepole mara 3 kila siku kwa wiki nzima.'),
      s(2, 'Kudhibiti Matatizo', 'Managing Problems',
        'Tunatumia "Steps ya Kutatua Matatizo" kuchagua tatizo moja na kulivunja katika hatua zinazoshikika.',
        ['Mapitio ya kazi ya nyumbani', 'Orodhesha matatizo, chagua moja linaloweza kushughulikiwa', 'Hatua 5: tatizo → suluhu → faida/hasara → mpango → mapitio', 'Anza utekelezaji wa hatua ya kwanza'],
        'Tekeleza hatua moja iliyokubaliwa.'),
      s(3, 'Tenda — Anza Hatua Ndogo', 'Behavioural Activation',
        'Unyogovu hupunguza shughuli; tunarudisha shughuli zenye maana — hata ndogo — kwa makusudi.',
        ['Tambua shughuli zilizoporwa na unyogovu', 'Chagua 2-3 ndogo, zenye maana au furaha', 'Panga ratiba ya wiki', 'Tabia ya "tenda kwanza, hisia hufuata"'],
        'Tenda shughuli 2-3 zilizopangwa kila siku.'),
      s(4, 'Imarisha Msaada wa Kijamii', 'Strengthening Social Support',
        'Hakuna mtu anayepona peke yake — tunatambua watu wa kuaminika na njia salama za kuomba msaada.',
        ['Ramani ya watu wa kuaminika (rafiki, familia, mlezi)', 'Mazoezi ya kuomba msaada bila hatia', 'Mipaka — wapi kuvuta mstari', 'Kuepuka utengaji'],
        'Wasiliana na mtu mmoja wa kuaminika wiki hii.'),
      s(5, 'Kaa Vyema — Kuendelea', 'Staying Well',
        'Mpango wa kuendelea baada ya PM+: vichocheo vya kurudi nyuma, ishara za onyo, hatua za dharura.',
        ['Mapitio ya jumla ya stadi 4', 'Mpango wa kibinafsi wa "Kaa Vyema"', 'Ishara za onyo + nani wa kupiga simu', 'Sherehe ya kumaliza'],
        'Tumia mpango wa Kaa Vyema kila wiki kwa mwezi 1.'),
    ],
    target: ['depression', 'anxiety', 'stress', 'common_mental_disorder'],
    evidence_citation: 'WHO PM+ Individual (Generic field-trial version, 2016); Bryant RA et al., 2017 Kenya RCT (women refugees).',
    citation: 'WHO. Problem Management Plus (PM+): Individual psychological help. Geneva: WHO; 2018.',
    audience: 'Watu wazima walio na dhiki ya kawaida ya kiakili — unyogovu mdogo-wastani, wasiwasi.',
    modality: 'hybrid', fee_default: 0,
  },
  {
    id: 'ceta', slug: 'ceta',
    name_sw: 'CETA Kiswahili',
    name_en: 'Common Elements Treatment Approach',
    sessions: [
      s(1, 'Tathmini + Ushiriki', 'Engagement + Assessment', 'Kutambua matatizo na malengo; kuchagua vipengele vya matibabu.', ['Tathmini PHQ-9/GAD-7/PCL-5', 'Maelezo ya mfano', 'Lengo la mteja'], 'Andika malengo 3 mahususi.'),
      s(2, 'Elimu ya Kisaikolojia', 'Psychoeducation', 'Maelezo ya unyogovu/wasiwasi/PTSD; uhusiano kati ya mawazo, hisia, tabia.', ['CBT-triangle', 'Hadithi ya kawaida'], 'Andika mfano binafsi.'),
      s(3, 'Mazoezi ya Pumzi + Kupumzika', 'Anxiety Management', 'Vipengele vya kupunguza wasiwasi wa mwili.', ['Pumzi ya tumbo', 'PMR — relaxation', 'Mazingira salama'], 'Mara 2 kwa siku.'),
      s(4, 'Tabia — Behavioural Activation', 'Behavioural Activation', 'Kurudisha shughuli zenye maana.', ['Orodha ya shughuli', 'Ratiba'], 'Tenda 3 kwa siku.'),
      s(5, 'Kuhakiki Mawazo', 'Cognitive Restructuring', 'Kupinga upotoshaji wa mawazo.', ['Rekodi ya mawazo', '10 distortions'], 'Rekodi 2 kwa siku.'),
      s(6, 'Kukabiliana na Hatua', 'Gradual Exposure', 'Kwa wasiwasi/PTSD — mfululizo wa hatua.', ['Hierarchy', 'In-vivo'], 'Hatua moja kwa wiki.'),
      s(7, 'Kuhuisha Kumbukumbu (kwa PTSD tu)', 'Imaginal Exposure (PTSD only)', 'Mwongozo wa kuelezea tukio salama.', ['Rekodi sauti', 'SUDS'], 'Sikiliza tena.'),
      s(8, 'Kuendelea + Kumaliza', 'Relapse Prevention', 'Mpango wa muda mrefu.', ['Mapitio', 'Mpango'], 'Mpango wa kibinafsi.'),
    ],
    target: ['depression', 'anxiety', 'ptsd'],
    evidence_citation: 'Murray LK et al., 2014 (transdiagnostic CBT for LMIC). Multiple RCTs.',
    citation: 'Murray LK, et al. A common elements treatment approach for adult mental health problems in low- and middle-income countries. Cogn Behav Pract. 2014;21(2):111-123.',
    audience: 'Watu wazima walio na unyogovu, wasiwasi, au PTSD; rahisi kufundishwa kwa wahudumu wa kawaida.',
    modality: 'hybrid', fee_default: 0,
  },
  {
    id: 'friendship_bench', slug: 'friendship_bench',
    name_sw: 'Benchi ya Urafiki',
    name_en: 'Friendship Bench',
    sessions: [
      s(1, 'Kufungua Akili', 'Opening the Mind', 'Mteja anaeleza tatizo lake; mshauri anatumia ujuzi wa kusikiliza.', ['Salimiana, jenga uaminifu', 'Mteja anaeleza kifupi', 'Kutambua tatizo moja kuu'], 'Fikiri kuhusu tatizo lililochaguliwa.'),
      s(2, 'Kuinua Akili', 'Uplifting', 'Kuvunja tatizo na kupendekeza suluhisho.', ['Mapendekezo ya pamoja ya suluhu', 'Faida/hasara', 'Chagua suluhu moja'], 'Anza hatua ya kwanza ya suluhu.'),
      s(3, 'Kuimarisha', 'Strengthening', 'Behavioural activation + kufuatilia hatua.', ['Mapitio', 'Shughuli ndogo', 'Kuimarisha matumaini'], 'Tenda shughuli mbili.'),
      s(4, 'Mapitio', 'Review', 'Mapitio ya hatua na marekebisho.', ['Kupima maendeleo', 'Marekebisho'], 'Endeleza mpango.'),
      s(5, 'Kuimarisha Mtandao', 'Strengthening Network', 'Kuunganisha na kikundi cha rika.', ['Peer support'], 'Hudhuria kikundi.'),
      s(6, 'Kumaliza + Mpango wa Mbele', 'Closing + Forward Plan', 'Mpango wa kuendelea baada ya benchi.', ['Mpango wa kibinafsi'], 'Tumia mpango.'),
    ],
    target: ['depression', 'common_mental_disorder'],
    evidence_citation: 'Chibanda D et al., JAMA 2016 — lay-counsellor delivered, Zimbabwe.',
    citation: 'Chibanda D, Weiss HA, Verhey R, et al. Effect of a primary care-based psychological intervention on symptoms of common mental disorders in Zimbabwe. JAMA. 2016;316(24):2618-2626.',
    audience: 'Watu wazima — hutolewa na "Bibi" (mshauri wa jamii) kwenye benchi ya mbao.',
    modality: 'in_person', fee_default: 0,
    notes_sw: 'Benchi ya mbao — mahali pa heshima, faragha, na ujirani.',
  },
  {
    id: 'ipt', slug: 'ipt',
    name_sw: 'IPT — Tiba ya Mahusiano',
    name_en: 'Interpersonal Therapy',
    sessions: Array.from({ length: 12 }, (_, i) => {
      const k = i + 1
      if (k <= 3) return s(k, `Awamu ya Awali — Kikao ${k}`, 'Initial phase', 'Tathmini ya mahusiano, interpersonal inventory, chagua eneo moja kati ya 4.', ['Inventory', 'Chagua eneo', 'Mkataba'], 'Andika watu muhimu.')
      if (k <= 9) return s(k, `Awamu ya Kati — Kikao ${k}`, 'Middle phase', 'Kazi kwenye eneo lililochaguliwa (huzuni, mizozo, mabadiliko, upweke).', ['Kazi ya eneo', 'Skills'], 'Hatua moja ya mahusiano.')
      return s(k, `Awamu ya Mwisho — Kikao ${k}`, 'Termination phase', 'Kupitia mafanikio na kuandaa kwa kuendelea.', ['Mapitio', 'Mpango'], 'Mpango wa muda mrefu.')
    }),
    target: ['depression', 'perinatal_depression'],
    evidence_citation: 'Bolton P et al., JAMA 2003 (Uganda Group IPT trial).',
    citation: 'Weissman MM, Markowitz JC, Klerman GL. The Guide to Interpersonal Psychotherapy. Oxford University Press; 2017.',
    audience: 'Watu wazima walio na unyogovu unaohusiana na mahusiano, mabadiliko ya maisha, au kuomboleza.',
    modality: 'hybrid', fee_default: 0,
  },
  {
    id: 'tcbt', slug: 'tcbt',
    name_sw: 't-CBT — CBT ya Mafupi',
    name_en: 'Trans-diagnostic CBT (8 sessions)',
    sessions: [
      s(1, 'Maelezo ya CBT', 'CBT model', 'Mfano wa mawazo-hisia-tabia.', ['Triangle', 'Lengo'], 'Mfano binafsi.'),
      s(2, 'Kuhuisha Tabia', 'Behavioural Activation', 'Shughuli zenye maana.', ['Orodha', 'Ratiba'], 'Tenda 3.'),
      s(3, 'Pumzi + Kupumzika', 'Relaxation', 'Mwili.', ['Pumzi', 'PMR'], 'Mara 2/siku.'),
      s(4, 'Rekodi ya Mawazo', 'Thought records', 'Kutambua upotoshaji.', ['Rekodi', 'Distortions'], 'Rekodi 2/siku.'),
      s(5, 'Kupinga Mawazo', 'Cognitive restructuring', 'Tafsiri mbadala.', ['Reframe'], 'Reframe 2.'),
      s(6, 'Kukabiliana', 'Exposure', 'Kuanza hatua kwa hatua.', ['Hierarchy'], 'Hatua moja.'),
      s(7, 'Kutatua Matatizo', 'Problem solving', 'Hatua 5.', ['Hatua 5'], 'Tatua moja.'),
      s(8, 'Kuendelea', 'Maintenance', 'Mpango wa kuendelea.', ['Mpango'], 'Mpango.'),
    ],
    target: ['depression', 'anxiety'],
    evidence_citation: 'Beck Institute trans-diagnostic protocol.',
    citation: 'Beck JS. Cognitive Behavior Therapy: Basics and Beyond, 3rd ed. Guilford; 2020.',
    audience: 'Watu wazima.', modality: 'virtual', fee_default: 0,
  },
  {
    id: 'mi', slug: 'mi',
    name_sw: 'MI — Mahojiano ya Kuhamasisha',
    name_en: 'Motivational Interviewing (brief, 4 sessions)',
    sessions: [
      s(1, 'Kuvutia', 'Engaging', 'OARS, kujenga uaminifu.', ['Open Q', 'Affirm', 'Reflect', 'Summarize'], 'Andika thamani 3.'),
      s(2, 'Kuelekeza', 'Focusing', 'Chagua tabia moja.', ['Focus'], 'Lengo.'),
      s(3, 'Kuhamasisha', 'Evoking', 'Change-talk.', ['DARN-CAT'], 'Andika sababu 3.'),
      s(4, 'Kupanga', 'Planning', 'Mpango wa hatua.', ['SMART'], 'Anza hatua moja.'),
    ],
    target: ['substance_use', 'alcohol', 'behaviour_change'],
    evidence_citation: 'Miller WR, Rollnick S — MI core.',
    citation: 'Miller WR, Rollnick S. Motivational Interviewing: Helping People Change. 3rd ed. Guilford; 2013.',
    audience: 'Watu wenye matumizi mabaya ya pombe/madawa au mabadiliko ya kitabia.', modality: 'hybrid', fee_default: 0,
  },
  {
    id: 'pst', slug: 'pst',
    name_sw: 'PST — Kutatua Matatizo',
    name_en: 'Problem Solving Therapy (6 sessions)',
    sessions: Array.from({ length: 6 }, (_, i) => s(i + 1, `Kikao ${i + 1}`, `Session ${i + 1}`, 'Hatua 7 za PST: tambua, fafanua, malengo, suluhu, chagua, fanya, tathmini.', ['Hatua 7', 'Mfano'], 'Tatua tatizo moja.')),
    target: ['depression', 'stress'], evidence_citation: 'Nezu AM et al., PST manual.',
    citation: "Nezu AM, Nezu CM, D'Zurilla TJ. Problem-Solving Therapy: A Treatment Manual. Springer; 2013.",
    audience: 'Watu wazima.', modality: 'virtual', fee_default: 0,
  },
  {
    id: 'mbsr_lite', slug: 'mbsr_lite',
    name_sw: 'MBSR-Lite — Akili Timamu',
    name_en: 'Mindfulness-Based Stress Reduction (6-week lite)',
    sessions: Array.from({ length: 6 }, (_, i) => s(i + 1, `Wiki ${i + 1}`, `Week ${i + 1}`, 'Mazoezi ya kuwa hapa-na-sasa: body-scan, pumzi, kutembea, kula, mawazo.', ['Body-scan dak 20', 'Mazoezi binafsi'], 'Dak 15 kila siku.')),
    target: ['stress', 'anxiety'], evidence_citation: 'Kabat-Zinn J, MBSR.',
    citation: 'Kabat-Zinn J. Full Catastrophe Living. Bantam; 2013.',
    audience: 'Watu wazima.', modality: 'virtual', fee_default: 0,
  },
  {
    id: 'dbt_skills', slug: 'dbt_skills',
    name_sw: 'DBT — Stadi 4',
    name_en: 'DBT Skills (4 modules)',
    sessions: [
      s(1, 'Kuwa Makini', 'Mindfulness', 'Kuwa hapa-na-sasa, akili ya hekima.', ['Wise mind', 'What/How skills'], 'Mazoezi.'),
      s(2, 'Uvumilivu wa Dhiki', 'Distress Tolerance', 'TIPP, ACCEPTS, IMPROVE.', ['TIPP', 'IMPROVE'], 'Tumia stadi.'),
      s(3, 'Kudhibiti Hisia', 'Emotion Regulation', 'PLEASE, opposite action.', ['PLEASE', 'Opposite'], 'Tumia.'),
      s(4, 'Mahusiano Yenye Ufanisi', 'Interpersonal Effectiveness', 'DEAR MAN, GIVE, FAST.', ['DEARMAN'], 'Mazungumzo 1.'),
    ],
    target: ['emotion_dysregulation', 'self_harm', 'borderline'],
    evidence_citation: 'Linehan MM — DBT skills.',
    citation: 'Linehan MM. DBT Skills Training Manual, 2nd ed. Guilford; 2015.',
    audience: 'Vijana/watu wazima walio na hisia kali, kujidhuru.',
    modality: 'hybrid', fee_default: 0,
  },
  {
    id: 'family_connections', slug: 'family_connections',
    name_sw: 'Familia Karibu',
    name_en: 'Family Connections (for BPD families)',
    sessions: Array.from({ length: 12 }, (_, i) => s(i + 1, `Kikao ${i + 1}`, `Session ${i + 1}`, 'Familia hujifunza mfano wa BPD, validation, DBT-skills, mawasiliano salama.', ['Psychoed', 'Validation', 'DBT for family'], 'Mazoezi nyumbani.')),
    target: ['borderline_family', 'family_support'],
    evidence_citation: 'Hoffman PD et al., NEABPD Family Connections programme.',
    citation: 'Hoffman PD, Fruzzetti AE, Buteau E, et al. Family Connections: a program for relatives of persons with borderline personality disorder. Fam Process. 2005;44(2):217-25.',
    audience: 'Wanafamilia wa watu wenye BPD.', modality: 'in_person', fee_default: 0,
  },
  {
    id: 'faith_christian', slug: 'faith_christian',
    name_sw: 'Imani — Kikristo',
    name_en: 'Faith-Informed Care (Christian, opt-in)',
    sessions: [
      s(1, 'Sala + Salama', 'Prayer + Safety', 'Sala kama chombo cha kupumzika; mipaka.', ['Sala', 'Mipaka'], 'Sala kila siku.'),
      s(2, 'Maandiko + Mawazo', 'Scripture + Thoughts', 'Maandiko ya kutuliza dhamiri.', ['Maandiko 3'], 'Kariri 1.'),
      s(3, 'Jumuiya', 'Community', 'Mshirika wa kanisa kama msaada.', ['Kikundi'], 'Hudhuria.'),
      s(4, 'Tunza Rafiki', 'Soul Care', 'Mpango wa kibinafsi.', ['Mpango'], 'Tumia.'),
    ],
    target: ['depression', 'spiritual_distress'],
    evidence_citation: 'Koenig HG — handbook of religion and mental health.',
    citation: 'Koenig HG. Religion, Spirituality, and Health: The Research and Clinical Implications. ISRN Psychiatry. 2012.',
    audience: 'Wakristo wanaopendelea utunzaji wenye imani.', modality: 'hybrid', fee_default: 0, faith: 'christian',
  },
  {
    id: 'faith_muslim', slug: 'faith_muslim',
    name_sw: 'Imani — Kiislamu',
    name_en: 'Faith-Informed Care (Muslim, opt-in)',
    sessions: [
      s(1, 'Dhikr + Salama', 'Dhikr + Safety', 'Dhikr na sala kama chombo cha amani.', ['Dhikr', 'Sala 5'], 'Dhikr kila siku.'),
      s(2, "Qur'an + Mawazo", "Qur'an + Thoughts", 'Aya za faraja.', ['Aya 3'], 'Soma.'),
      s(3, 'Umma', 'Community', 'Msaada wa msikiti.', ['Msikiti'], 'Hudhuria.'),
      s(4, 'Tunza Rafiki', 'Soul Care', 'Mpango binafsi.', ['Mpango'], 'Tumia.'),
    ],
    target: ['depression', 'spiritual_distress'],
    evidence_citation: 'Naeem F et al., culturally adapted CBT.',
    citation: 'Naeem F, Phiri P, Rathod S, Kingdon D. Cultural adaptation of CBT for psychosis. Indian J Psychol Med. 2019.',
    audience: 'Waislamu wanaopendelea utunzaji wenye imani.', modality: 'hybrid', fee_default: 0, faith: 'muslim',
  },
  {
    id: 'faith_traditional', slug: 'faith_traditional',
    name_sw: 'Imani — Mila',
    name_en: 'Faith-Informed Care (Traditional, opt-in)',
    sessions: Array.from({ length: 4 }, (_, i) => s(i + 1, `Kikao ${i + 1}`, `Session ${i + 1}`, 'Ushauri unaojumuisha wazee, mizimu ya familia, na waganga wa kienyeji walio na haki.', ['Mzee', 'Familia'], 'Mazungumzo na mzee.')),
    target: ['spiritual_distress', 'cultural_idiom'],
    evidence_citation: 'WHO mhGAP — collaboration with traditional healers.',
    citation: 'WHO. mhGAP Intervention Guide, v2.0. 2016.',
    audience: 'Watu wanaohitaji mfumo wa kimila.', modality: 'in_person', fee_default: 0, faith: 'traditional',
  },
  {
    id: 'emdr', slug: 'emdr',
    name_sw: 'EMDR — Tiba ya Kumbukumbu',
    name_en: 'Eye Movement Desensitization & Reprocessing',
    sessions: Array.from({ length: 8 }, (_, i) => s(i + 1, `Awamu ${i + 1}`, `Phase ${i + 1}`, 'Awamu 8 za EMDR — historia, maandalizi, tathmini, kupunguza unyeti, kuiingiza, skana ya mwili, kufunga, kutathmini.', ['Awamu mahususi'], 'Kazi ya nyumbani kulingana na awamu.')),
    target: ['ptsd', 'trauma'],
    evidence_citation: 'Shapiro F — EMDR; WHO recommended for PTSD.',
    citation: 'Shapiro F. Eye Movement Desensitization and Reprocessing (EMDR) Therapy, 3rd ed. Guilford; 2018.',
    audience: 'Wahudumu wa afya ya akili waliopata mafunzo ya EMDR Level I+ tu.',
    modality: 'in_person', fee_default: 0, provider_only: true,
    notes_sw: 'Inahitaji mafunzo rasmi ya EMDR. Haitolewi na walezi wa kawaida.',
  },
]

export function programBySlug(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug)
}
