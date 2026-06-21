/**
 * Tanzania Mental Health Act, 2008 — Chapter 98.
 *
 * Source: Act No. 21 of 2008 (Assented 6 December 2008, commenced 1 July
 * 2011 by Mental Health Act Date of Commencement Notice 2011). Public
 * legislation reproduced on TanzLII / Laws.Africa under CC BY 4.0.
 *
 * This is the PARENT law. The Mental Health (General) Regulations 2016
 * (GN No. 122) implement it under §38 — see mh_regulations_2016.ts.
 *
 * Honesty note: each entry cites the specific §section number from the Act.
 * Plain Swahili rendering is provided alongside the verbatim English.
 */

export interface ActEntry {
  id: string
  section: string                  // e.g. '§11(3)'
  topic: string
  summary_sw: string
  summary_en: string
  q_patterns: RegExp[]
  next_step_sw: string
  citation: string
}

const CITE = 'Mental Health Act 2008 · Cap.98 (Act No. 21 of 2008)'

export const TZ_MH_ACT_2008: ActEntry[] = [
  // ─── Part I — Preliminary ───────────────────────────────────────────────
  {
    id: 'act-application',
    section: '§2',
    topic: 'scope',
    summary_sw:
      'Mental Health Act ya 2008 inatumika Tanzania Bara (Mainland) tu. Zanzibar ina sheria yake.',
    summary_en:
      'The Mental Health Act applies to Mainland Tanzania only.',
    q_patterns: [/(act|sheria).*(zanzibar|bara|mainland|wapi)/i],
    next_step_sw: 'Kwa Zanzibar, angalia Sheria ya Afya ya Akili ya Zanzibar.',
    citation: `${CITE} §2`,
  },
  {
    id: 'act-definitions',
    section: '§3',
    topic: 'definitions',
    summary_sw:
      'Maneno muhimu (§3): "Board" = Mental Health Board (§16). "Medical Officer" = daktari aliyesajiliwa. "Mental disorder" = hali ya akili au tabia iliyoorodheshwa katika ICD-WHO. "Reception order" = amri ya maandishi ya kulazwa. "Substance abuse" = matumizi ya pombe, sigara au madawa ya kulevya yanayosababisha madhara.',
    summary_en:
      'Key definitions in §3: "Board" = Mental Health Board (§16). "Medical Officer" = registered medical practitioner. "Mental disorder" = mental/behavioural disorder classified by WHO ICD. "Reception order" = written authority for admission. "Substance abuse" = maladaptive alcohol/tobacco/drug use causing impairment.',
    q_patterns: [/(definition|maana|ufafanuzi).*(act|sheria.*akili)/i],
    next_step_sw: 'Ufafanuzi kamili upo katika sheria yenyewe.',
    citation: `${CITE} §3`,
  },

  // ─── Part II — Voluntary + Temporary ────────────────────────────────────
  {
    id: 'act-voluntary',
    section: '§4',
    topic: 'voluntary_admission',
    summary_sw:
      'Voluntary admission (§4): mtu mwenye umri wa miaka 18+ anaweza kuomba kulazwa mwenyewe — atakubaliwa. Watoto chini ya 18 wanahitaji ridhaa ya mzazi/mlezi. Akihukumiwa salama na incharge, atatolewa kama wengine. ENDELEZA huduma kama outpatient.',
    summary_en:
      'Voluntary admission (§4): A person 18+ who voluntarily submits shall be accepted. Under-18 needs parent/guardian. If assessed no longer dangerous, may leave like any other patient. Continuity of outpatient care required.',
    q_patterns: [/(voluntary|kwa hiari).*(admission|kulazwa)/i, /(je naweza.*kulazwa.*hiari)/i],
    next_step_sw: 'Nenda kituo cha afya ya akili kilicho karibu — Mirembe, Muhimbili NIMH, au regional.',
    citation: `${CITE} §4`,
  },
  {
    id: 'act-voluntary-becomes-incapable',
    section: '§5',
    topic: 'voluntary_admission',
    summary_sw:
      'Voluntary patient akipoteza uwezo wa kuelezea ridhaa (§5): ASIWEKWE kama voluntary kwa zaidi ya SIKU 30; atatakiwa kutolewa au kuhamishiwa kwenye involuntary admission. Mtoto chini ya 18 asiyepatikana na mzazi: Officer In-Charge atajulisha District Social Welfare Officer.',
    summary_en:
      'If a voluntary patient becomes incapable of expressing consent (§5): they shall NOT be kept as voluntary for more than 30 days; must be discharged or moved to involuntary procedure. Under-18 without guardian: officer notifies District Social Welfare Officer.',
    q_patterns: [/(voluntary|hiari).*(siku 30|30 days|expression|kushindwa)/i],
    next_step_sw: 'Familia inaweza kuwasiliana na Patient Welfare Board kufuatilia.',
    citation: `${CITE} §5`,
  },
  {
    id: 'act-temporary',
    section: '§6',
    topic: 'temporary_admission',
    summary_sw:
      'Temporary admission (§6): mtu mwenye matatizo ya akili anayeweza kunufaika na matibabu lakini ASHASHINDWA kuelezea ridhaa, atapokelewa kwenye kituo cha akili kama "temporary patient". Lengo: matibabu na huduma.',
    summary_en:
      'Temporary admission (§6): A person with mental disorder likely to benefit from temporary treatment but incapable of expressing consent shall be received as temporary patient.',
    q_patterns: [/(temporary|muda mfupi).*(admission|kulazwa).*(akili|mental)/i],
    next_step_sw: 'Tofauti na involuntary — temporary haina court order; ni hatua ya kati.',
    citation: `${CITE} §6`,
  },

  // ─── Part III — Management of persons with mental disorder ──────────────
  {
    id: 'act-court-jurisdiction',
    section: '§7',
    topic: 'court',
    summary_sw:
      'Mahakama (§7): Resident Magistrate Court na District Court zina mamlaka sawa katika masuala ya watu wenye matatizo ya akili. Si lazima High Court.',
    summary_en:
      'Resident Magistrate\'s Court and District Court have concurrent jurisdiction over mentally disordered persons (§7).',
    q_patterns: [/(mahakama|court).*(akili|mental|disorder)/i],
    next_step_sw: 'Nenda Resident Magistrate au District Court — sio High Court kwa anza.',
    citation: `${CITE} §7`,
  },
  {
    id: 'act-reception-order-petition',
    section: '§8',
    topic: 'reception_order',
    summary_sw:
      'Reception order (§8): Maombi yanafanywa kupitia "petition" iliyowekwa katika Second Schedule. Lazima ieleze (1) maelezo kamili ya mgonjwa, (2) sababu za kuomba, (3) uhusiano wa mwombaji na mgonjwa.',
    summary_en:
      'Application for reception order (§8): Made by petition per Second Schedule — must disclose patient particulars, reasons for application, and petitioner\'s relation.',
    q_patterns: [/(reception order|amri ya kulazwa|petition.*akili)/i],
    next_step_sw: 'Mwakili au social welfare officer wanaweza kukusaidia kuandaa fomu.',
    citation: `${CITE} §8`,
  },
  {
    id: 'act-who-brings-patient',
    section: '§9',
    topic: 'reception',
    summary_sw:
      'Wanaoruhusiwa kumleta mgonjwa kwenye kituo (§9): Polisi, JP, Social Welfare Officer, kiongozi wa dini, Ward Executive Officer, au Village Executive Officer. Wote hawa wakimwona mtu mwenye matatizo ya akili ambaye HAYUKO chini ya uangalizi mzuri, WATAMLAZA mara moja.',
    summary_en:
      'Who can bring a person (§9): Police officer, justice of peace, social welfare officer, religious leader, ward or village executive officer — any of these who believes a person in their area is mentally disordered and not under proper care shall immediately bring them to a mental health facility.',
    q_patterns: [/(nani.*kumpeleka|who.*bring).*(hospitali.*akili|mental.*facility)/i, /(polisi|police|kiongozi.*dini).*(akili|mental)/i],
    next_step_sw: 'Mzazi/ndugu wanaweza kuhusisha mtaalam, polisi, au mwenyekiti wa kijiji.',
    citation: `${CITE} §9`,
  },
  {
    id: 'act-cruel-treatment-report',
    section: '§9(2)',
    topic: 'reception',
    summary_sw:
      'Iwapo mgonjwa wa akili anaonewa au kupuuzwa (§9(2)): Polisi au mtu yeyote ANALAZIMIKA kutoa taarifa MARA MOJA kwa District Social Welfare Officer. DSWO atafanya tathmini ya kijamii na kushirikiana na kituo cha afya ya akili.',
    summary_en:
      'If a mentally disordered person is cruelly treated or neglected (§9(2)): police or any person shall immediately report to District Social Welfare Officer, who shall conduct social assessment and engage mental health facilities.',
    q_patterns: [/(unyanyaswa|cruelty|abuse|neglect|kupuuzwa).*(akili|mental)/i],
    next_step_sw: 'Piga 116 (Child Helpline) au nenda kwa District Social Welfare Officer.',
    citation: `${CITE} §9(2)`,
  },
  {
    id: 'act-inquiry-procedure',
    section: '§10',
    topic: 'inquiry',
    summary_sw:
      'Mahakama ikipokea petition (§10): kituo cha akili kitafanya uchunguzi mara moja, kitatoa nakala mbili za medical certificates ndani ya masaa 48 — moja na Medical Officer, moja na Mental Health Practitioner. Mahakama itazichunguza, na kama imeridhika kuwa mtu (1) ana matatizo ya akili na (2) ni mtu sahihi kulazwa, itatoa reception order. Au kama ndugu ataingia bond, mahakama inaweza kumpatia ndugu badala ya kulazwa.',
    summary_en:
      'Inquiry (§10): On receiving a petition, the facility shall conduct immediate inquiry and issue 2 medical certificates within 48 hours. Court examines them — if satisfied person is mentally disordered AND proper to admit, makes reception order. May alternatively bond person to a friend/relative.',
    q_patterns: [/(uchunguzi|inquiry|medical certificate).*(akili|mental|mahakama|court)/i],
    next_step_sw: 'Familia inaweza kushiriki katika court inquiry — una haki ya kupinga uamuzi.',
    citation: `${CITE} §10`,
  },
  {
    id: 'act-involuntary-30-90-days',
    section: '§11',
    topic: 'involuntary_admission',
    summary_sw:
      'Involuntary admission (§11) — KIPENGELE MUHIMU: Mahakama inaweza kuamuru kulazwa kwa SIKU 30 KISHA inaweza kuongezewa kwa siku 30 zaidi. LAKINI HAITAZIDI SIKU 90 toka tarehe ya reception order. Baada ya 90 days, lazima Mental Health Practitioner athibitishe upya. Familia ina haki ya kupinga (§11(5)): wakikataa kulazwa kinyume cha sheria, mahakama itamtoa MARA MOJA.',
    summary_en:
      'Involuntary admission (§11) — CRITICAL: Court order initial 30 days, extendable by another 30 days, but NOT EXCEEDING 90 days total from reception order. Beyond 90 days requires fresh certification by mental health practitioner. Family may petition against unlawful admission (§11(5)); court will order immediate discharge if satisfied.',
    q_patterns: [
      /(involuntary|kwa nguvu|nguvu).*(admission|kulazwa)/i,
      /(admission|kulazwa).*(kwa nguvu|nguvu|involuntary)/i,
      /(siku 30|siku 90|30 days|90 days).*(akili|mental)/i,
      /(muda gani.*kulazwa|how long.*admit)/i,
    ],
    next_step_sw: 'Mwakili au Patient Welfare Board wanaweza kusaidia familia kupinga kulazwa kwa nguvu.',
    citation: `${CITE} §11`,
  },
  {
    id: 'act-no-magistrate-fallback',
    section: '§12',
    topic: 'admission',
    summary_sw:
      'Pasipokuwa na hakimu (§12): Iwapo hakuna magistrate, Administrative Officer (DAS au RAS) anaweza kutumia mamlaka ya mahakama kwa muda. Baada ya siku 90, ripoti ya matibabu italetwa mahakamani kuendelea.',
    summary_en:
      'If no magistrate is present (§12): An administrative officer (DAS/RAS) may exercise the court\'s admission powers temporarily. After 90 days, a medical report is brought before the court for continuation.',
    q_patterns: [/(hakuna|absence|hakimu|magistrate|das|ras).*(akili|mental|admission)/i],
    next_step_sw: 'DAS/RAS wa mkoa wako ana mamlaka — sio kupanga kungojea bila kikomo.',
    citation: `${CITE} §12`,
  },
  {
    id: 'act-medical-certificate-rules',
    section: '§14',
    topic: 'certificate',
    summary_sw:
      'Medical certificate (§14): LAZIMA isainwe na Mental Health Practitioner. Lazima ieleze ukweli halisi alivyoona, sio uvumi wa watu wengine — cert iliyojengwa NA TAARIFA ZA WATU WENGINE TU haina nguvu. Lazima ithibitishe mgonjwa: (a) ana matatizo na ni hatari kwake/jamii/mali, au (b) hawezi kujihudumia. HAIRUHUSIWI kupendekeza kulazwa kwenye kituo kisicho na huduma za kutosha.',
    summary_en:
      'Medical certificate (§14): Must be signed by a mental health practitioner. Must state facts personally observed — a cert based wholly on third-party reports has NO effect. Must establish: (a) disorder + danger to self/community/property, OR (b) incapable of self-care. Cannot recommend admission to a facility without adequate treatment capacity.',
    q_patterns: [/(medical certificate|cheti.*matibabu).*(akili|mental)/i],
    next_step_sw: 'Una haki ya kuomba kuona cheti chako au cha ndugu yako.',
    citation: `${CITE} §14`,
  },
  {
    id: 'act-appeals',
    section: '§15',
    topic: 'rights',
    summary_sw:
      'Rufaa (§15): Amri yoyote ya mahakama chini ya Act hii inaweza kufanyiwa appeal kwenye High Court, kufuata utaratibu wa kawaida wa civil appeals. Mahakama ya chini LAZIMA imjulishe mtu yeyote ana ridhaa au asiyeridhika kuhusu HAKI ya rufaa.',
    summary_en:
      'Appeals (§15): Any order under the Act may be appealed to the High Court following civil appeal procedure. The lower court MUST inform any interested or aggrieved person of their right to appeal.',
    q_patterns: [/(rufaa|appeal|high court).*(akili|mental|amri)/i],
    next_step_sw: 'Una haki ya rufaa — High Court inakubali. Mwakili anaweza kusaidia.',
    citation: `${CITE} §15`,
  },

  // ─── Part IV — Mental Health Board ──────────────────────────────────────
  {
    id: 'act-board-composition',
    section: '§16',
    topic: 'board',
    summary_sw:
      'Mental Health Board (§16) ina: (a) Mwenyekiti aliyeteuliwa na Waziri, (b) Commissioner of Social Welfare, (c) Attorney General/mwakilishi, (d) Director of Hospital Services, (e) Medical Officer wa forensic psychiatric hospital, (f) Mkuu wa Mental Health Section ya Wizara, (g) Medical Superintendent wa Hospitali kuu ya Akili, (h) wajumbe 2 wa Patient Welfare Boards, (i) afisa wa kisheria wa Wizara, (j) wajumbe 2 wa sekta binafsi.',
    summary_en:
      'Mental Health Board (§16) members: Minister-appointed Chairman, Commissioner of Social Welfare, AG/rep, Director of Hospital Services, MO of forensic psychiatric hospital, Head of MH Section, Medical Superintendent of leading MH hospital, 2 reps from Patient Welfare Boards, Ministry legal officer, 2 private sector reps.',
    q_patterns: [/(mental health board|board.*akili).*(wanachama|members|composition|nani)/i],
    next_step_sw: 'Mawasiliano ya Board yanapatikana kupitia Wizara ya Afya.',
    citation: `${CITE} §16`,
  },
  {
    id: 'act-board-functions',
    section: '§17',
    topic: 'board',
    summary_sw:
      'Kazi za Mental Health Board (§17): (a) ku-review ripoti za wagonjwa wa hospitali ya forensic; (b) kusikiliza malalamiko ya wagonjwa, ndugu, na wadau; (c) kuamua kuhusu masuala ya wagonjwa; (d) kuamua kuhusu mapendekezo ya kutolewa kwa wahalifu wenye matatizo ya akili; (e) kupendekeza mageuzi ya hali ya kituo; (f) kupokea ripoti za Patient Welfare Board; (g) ku-supervise + monitor huduma za afya ya akili Mainland Tanzania.',
    summary_en:
      'Board functions (§17): review forensic patient reports; hear patients/relatives/third parties; decide patient issues; decide on offender discharge recommendations; recommend facility improvements; receive PWB reports; supervise + monitor MH services in Mainland Tanzania.',
    q_patterns: [/(kazi.*board|board.*function).*(akili|mental)/i],
    next_step_sw: 'Bord inakutana mara nne kwa mwaka angalau — taarifa zinaweza kuwasilishwa.',
    citation: `${CITE} §17`,
  },

  // ─── Part V — Estate management ─────────────────────────────────────────
  {
    id: 'act-estate-management',
    section: '§19-25',
    topic: 'estate',
    summary_sw:
      'Usimamizi wa mali (§19–25): Mzazi, mtoto wa miaka 18+, ndugu, au mtu mwingine mwenye nia anaweza kuomba mahakama kusimamia mali ya mtu mwenye matatizo ya akili. Mahakama inaweza kuteua MANAGER wa mali. Manager: hatakopesha au kuuza mali zisizohamishika bila ruhusa ya mahakama; atatoa ripoti ya robo mwaka. Mali ya thamani isiyozidi TZS 3,000,000 inaweza kushughulikiwa moja kwa moja.',
    summary_en:
      'Estate management (§§19–25): Parent, adult child, friend, relative, or interested person may apply for court order managing the estate. Court may appoint a manager. Manager cannot mortgage/transfer immovable property without express court permission; must submit quarterly reports. Movable property up to TZS 3M may be directly disposed of.',
    q_patterns: [/(mali|estate|property).*(akili|mental|disorder)/i, /(manager|msimamizi).*(mali|estate)/i],
    next_step_sw: 'Wakala au mwakili wa familia anaweza kushauri kuhusu utaratibu wa mahakama.',
    citation: `${CITE} §§19–25`,
  },

  // ─── Part VI — General provisions ───────────────────────────────────────
  {
    id: 'act-facility-establishment',
    section: '§27',
    topic: 'facility',
    summary_sw:
      'Hospitali za akili (§27): Waziri ANAANZISHA hospitali za akili kupitia GN kwenye Gazette. HAIRUHUSIWI mtu yeyote (clinic, home, hospital binafsi) kumlaza mhalifu mwenye matatizo ya akili isipokuwa kituo kimeanzishwa kwa mujibu wa Act hii. Kuvunja: faini >TZS 100,000 au kifungo cha miezi 3, au yote.',
    summary_en:
      'Mental health facilities (§27): Minister establishes by GN in Gazette. No clinic, home, or hospital may receive a mentally disordered offender unless established under this Act. Violation: fine ≥TZS 100,000 or 3 months imprisonment, or both.',
    q_patterns: [/(hospitali.*akili|mental.*facility|kituo).*(anzishwa|establish|register)/i],
    next_step_sw: 'Hospitali zilizothibitishwa ni pamoja na Mirembe (Dodoma), Muhimbili NIMH, KCMC, Bugando.',
    citation: `${CITE} §27`,
  },
  {
    id: 'act-special-care',
    section: '§28',
    topic: 'care',
    summary_sw:
      'Huduma maalum (§28): mtu yeyote anayemhudumia mgonjwa wa akili LAZIMA (a) ahakikishe haki zake na huduma ni za kutosha, (b) ahakikishe HATOROKI. Kila kituo lazima kiwe na medical personnel anayechunguza incidents za kutoroka, na kuchukua hatua za nidhamu kama kuna uzembe. Familia + jamii lazima zihusishwe katika huduma.',
    summary_en:
      'Special care (§28): Anyone caring for a mentally disordered person must ensure rights + treatment are adequate AND prevent absconding. Every facility must have medical personnel investigating absconding + applying punitive action for staff negligence. Family + community must be involved.',
    q_patterns: [/(huduma maalum|special care|kutoroka|abscond).*(akili|mental)/i],
    next_step_sw: 'Familia ina haki ya kushirikishwa katika mpango wa huduma — uliza incharge.',
    citation: `${CITE} §28`,
  },
  {
    id: 'act-patient-welfare-board',
    section: '§29 + First Schedule',
    topic: 'board',
    summary_sw:
      'Patient Welfare Board (§29): Waziri anaweza kuanzisha PWB katika kila mkoa. Inajumuisha: Regional Administrative Secretary (Mwenyekiti), Regional Medical Officer (Katibu), RSWO, MP wa eneo la hospitali, Regional Prisons Officer, Regional Nursing Officer, mratibu wa afya ya akili, mwakilishi wa jamii, APHFTA, mwakilishi wa mashirika ya haki za binadamu. Kazi: kutembelea hospitali kila miezi 6, kupokea malalamiko, kusaidia kutatua matatizo, kuhakikisha haki za binadamu.',
    summary_en:
      'Patient Welfare Board (§29 + First Schedule): Minister may establish PWB in every region. Composition: RAS (Chair), RMO (Secretary), RSWO, MP of catchment, Regional Prisons Officer, Regional Nursing Officer, MH coordinator, community rep, APHFTA rep, human rights org rep. Functions: visit hospitals every 6 months, receive complaints, resolve issues, uphold dignity + human rights.',
    q_patterns: [/(patient welfare board|pwb|bodi.*ustawi)/i],
    next_step_sw: 'PWB ya mkoa wako ina mkutano kila miezi 6 — unaweza kuwasiliana kwa RAS.',
    citation: `${CITE} §29 + First Schedule`,
  },
  {
    id: 'act-national-council',
    section: '§§30-31',
    topic: 'governance',
    summary_sw:
      'National Council for Mental Health (§§30–31): Director of Hospital Services ni Mwenyekiti. Inajumuisha: psychiatrist mwandamizi, Director wa MH Hospital, Director of Preventive Services, head of postgraduate psychiatry training, NGO ya human rights, polisi mwandamizi, prisons, TAMISEMI, Primary Education, youth, psychiatry nurse, social welfare, NGO ya wagonjwa, Disaster Management ya PMO. Kazi: kufuatilia hali ya afya ya akili Mainland TZ, kuwashauri Waziri, kukuza mahusiano ya sekta, kukuza utafiti, kutathmini sheria.',
    summary_en:
      'National Council for Mental Health (§§30–31): Chaired by Director of Hospital Services. Members include senior psychiatrist, MH Hospital Director, Director of Preventive Services, head of postgraduate psychiatry, human-rights NGO rep, senior police + prisons officer, PMO-RALG rep, Director of Primary Education, youth ministry rep, senior psychiatric nurse, senior social welfare official, MH patient NGO rep, Disaster Management Department. Functions: monitor MH status Mainland TZ; advise Minister; cross-sector coordination; research; periodic legislation review.',
    q_patterns: [/(national council|baraza.*kitaifa).*(akili|mental)/i],
    next_step_sw: 'Council inakutana mara 4 kwa mwaka.',
    citation: `${CITE} §§30–31`,
  },
  {
    id: 'act-bond-relative',
    section: '§33',
    topic: 'discharge',
    summary_sw:
      'Bond ya ndugu (§33): Ndugu au rafiki anaweza kuomba mahakama kumtoa mgonjwa aliyelazwa, akihudumiwe na ndugu/rafiki. Mahakama ikishauriana na Officer In-Charge na kupokea bond (na/bila sureties), inaweza kutoa amri ya kutolewa.',
    summary_en:
      'Bond by relative (§33): Relative/friend may apply to court for patient to be delivered to their care. Court, after consulting Officer In-Charge and receiving bond (with or without sureties), may order discharge.',
    q_patterns: [/(bond|dhamana|ndugu kuchukua).*(akili|mental|hospitali)/i],
    next_step_sw: 'Mwakili au social welfare officer wanaweza kuandaa bond.',
    citation: `${CITE} §33`,
  },
  {
    id: 'act-readmission-abscond',
    section: '§34',
    topic: 'admission',
    summary_sw:
      'Re-admission baada ya kutoroka (§34): Mgonjwa aliyethibitishwa na kupokelewa kwenye kituo cha akili anaweza kulazwa hadi atolewe au kuruhusiwa kisheria. AKITOROKA, anaweza kushikwa tena na kurudishwa kwenye kituo.',
    summary_en:
      'Re-admission after absconding (§34): A duly certified patient may be retained until lawfully discharged. If they abscond, they may be re-admitted and conveyed back to the facility.',
    q_patterns: [/(toroka|abscond|kurudisha|readmit).*(akili|mental|hospitali)/i],
    next_step_sw: 'Familia ina jukumu la kushirikiana na hospitali na polisi kwa usalama.',
    citation: `${CITE} §34`,
  },
  {
    id: 'act-in-camera',
    section: '§35',
    topic: 'rights',
    summary_sw:
      'Mahakama kufanyika faragha (§35): Mahakama yoyote chini ya Act hii inaweza kufanyika faragha (in camera) kwa hiari ya mahakama. Mtu anayehusika anaweza kuwakilishwa na mtu yeyote afaaye au mahakama itamteua mtu wa kumwakilisha.',
    summary_en:
      'In-camera proceedings (§35): Court may sit in camera. The person concerned may be represented by any suitable person, or court appoints a fit and proper person.',
    q_patterns: [/(in camera|faragha|siri).*(mahakama|court).*(akili|mental)/i],
    next_step_sw: 'Una haki ya kuwakilishwa — mahakama itakuteua mtu kama huna mwakili.',
    citation: `${CITE} §35`,
  },
  {
    id: 'act-penalty',
    section: '§37',
    topic: 'penalty',
    summary_sw:
      'ADHABU (§37): Mtu yeyote anayejihusisha na: (a) kulaza mtu KIBAYA, (b) kumsaidia mhalifu wa akili kutoroka, au (c) kufanya UKATILI / UNYANYASAJI / KUPUUZA mgonjwa wa akili — anatenda kosa. Adhabu: KIFUNGO cha mwaka MMOJA au FAINI ya angalau TZS 500,000 au YOTE.',
    summary_en:
      'PENALTY (§37): Any person who participates in wrongful admission, assists a mentally disordered offender to escape, OR commits cruelty/abuse/neglect against a mentally disordered person commits an offence. Penalty: 1 year imprisonment or fine of NOT LESS than TZS 500,000 or both.',
    q_patterns: [/(adhabu|penalty|faini).*(akili|mental|act 2008)/i, /(unyanyaswa|abuse|cruelty).*(akili|mental).*(adhabu|kosa)/i],
    next_step_sw: 'Ripoti ukatili kwa polisi, DSWO, au Mental Health Board.',
    citation: `${CITE} §37`,
  },
  {
    id: 'act-foreign-certified',
    section: '§36',
    topic: 'admission',
    summary_sw:
      'Mtanzania aliyethibitishwa nje ya nchi (§36): Mtanzania anayethibitishwa kuwa na matatizo ya akili kwa mujibu wa sheria za nchi nyingine na anayepokelewa Tanzania, ATAPOKELEWA MARA MOJA kwenye kituo cha akili na kushughulikiwa kwa mujibu wa Act hii.',
    summary_en:
      'Foreign-certified Tanzanian (§36): A Tanzanian citizen found mentally disordered under another country\'s laws and received in Tanzania shall be immediately admitted and dealt with under this Act.',
    q_patterns: [/(nje ya nchi|foreign|outside).*(akili|mental|tanzania)/i],
    next_step_sw: 'Mahakama na Wizara ya Afya watasaidia uratibu wa kuvuka mpaka.',
    citation: `${CITE} §36`,
  },
  {
    id: 'act-good-faith',
    section: '§40',
    topic: 'rights',
    summary_sw:
      'Ulinzi wa wahudumu (§40): Hakuna kesi ya jinai au madai itakayofunguliwa dhidi ya mtu yeyote kutokana na lolote alilolifanya kwa NIA NJEMA katika utekelezaji wa kazi yake chini ya Act hii.',
    summary_en:
      'Good faith protection (§40): No civil or criminal proceedings shall lie against any person for anything done in good faith under the authority or purported authority of this Act.',
    q_patterns: [/(good faith|nia njema).*(akili|mental|act)/i],
    next_step_sw: 'Inalinda wahudumu wa afya wanaofanya kazi vizuri.',
    citation: `${CITE} §40`,
  },
  {
    id: 'act-repeal',
    section: '§41',
    topic: 'history',
    summary_sw:
      'Repeal (§41): Mental Diseases Act ya zamani imefutwa. Lakini regulations, orders, vibali, na maamuzi yaliyofanywa chini ya Act ya zamani vinabaki kufuatwa hadi vifutwe au kubadilishwa chini ya Act mpya.',
    summary_en:
      'Repeal (§41): The Mental Diseases Act is repealed. Subsidiary legislation, permits, decisions, and acts done under the repealed Act remain enforceable until revoked/replaced under this Act.',
    q_patterns: [/(mental diseases|act ya zamani|old.*act).*(repeal|futwa|history)/i],
    next_step_sw: 'Act ya 2008 ndiyo ya sasa hivi. GN No. 122/2016 inayoitumia §38.',
    citation: `${CITE} §41`,
  },
]

/** Find the best-matching Act entry for a query, or null. */
export function findActAnswer(query: string): ActEntry | null {
  const q = query.toLowerCase()
  for (const e of TZ_MH_ACT_2008) {
    for (const rx of e.q_patterns) {
      if (rx.test(q)) return e
    }
  }
  return null
}

/** Rafiki-style shaped reply. */
export function askMHAct2008(query: string): {
  domain: string
  respond: string
  next_step: string
  citation: string
} | null {
  const hit = findActAnswer(query)
  if (!hit) return null
  return {
    domain: `Tanzania Mental Health Act 2008 · ${hit.section}`,
    respond: hit.summary_sw,
    next_step: `Hatua: ${hit.next_step_sw}`,
    citation: hit.citation,
  }
}
