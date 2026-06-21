// federated.ts — adapter layer that lets Mwenza federate to sister Laetoli engines
// (TibaAI clinical, TibaFigo renal, TibaAfya meds, TibaMama perinatal) without an
// external LLM. Each adapter holds a small but real Swahili KB and exposes ask().
// TODO port the full engines from their respective repos when monorepo lands.

export interface FederatedContext {
  faith?: 'none' | 'christian' | 'muslim' | 'traditional' | 'multi';
  conditions?: string[];
  trimester?: number;
  age?: number;
}

export interface FederatedReply {
  ack: string;
  respond: string;
  next_step: string;
  source: string;
}

interface KbEntry {
  match: RegExp;
  respond_sw: string;
  next_sw: string;
  source: string;
}

function pickKb(kb: KbEntry[], q: string): KbEntry | null {
  for (const k of kb) if (k.match.test(q)) return k;
  return null;
}

// ── TibaAI — sovereign clinical reasoner ────────────────────────────────────
// TODO port full TibaAI engine (32 conditions, 18 drugs, 13 labs, sw/en/sw_mtaa)
const TIBAAI_KB: KbEntry[] = [
  { match: /(homa|fever|joto)/i,
    respond_sw: 'Homa ndefu zaidi ya siku 3 inaweza kuwa malaria, typhoid, au maambukizi mengine. Pima mRDT na uangalie joto la mwili.',
    next_sw: 'Nenda kituo cha afya kwa mRDT na uchunguzi wa damu.',
    source: 'Tanzania STG 2023 (NTLP/IMCI)' },
  { match: /(kifua kikuu|tb|kikohozi kwa wiki)/i,
    respond_sw: 'Kikohozi cha wiki 2+ na kupungua uzito ni dalili ya TB. Pima sputum (GeneXpert).',
    next_sw: 'Tuma kwa TB clinic ya wilaya kwa GeneXpert.',
    source: 'NTLP Tanzania 2023' },
  { match: /(vvu|hiv|ukimwi)/i,
    respond_sw: 'VVU inadhibitiwa vyema kwa ART ya kila siku. Lengo: viral load isiyoonekana = haisambaai (U=U).',
    next_sw: 'CTC kwa kuanza/kurejea ART na cotrimoxazole.',
    source: 'NACP Tanzania ART Guidelines 2023' },
  { match: /(malaria)/i,
    respond_sw: 'Malaria isiyokuwa kali inatibiwa kwa ALu (artemether-lumefantrine) siku 3. Malaria kali → IV artesunate.',
    next_sw: 'mRDT + dose ya kwanza ya ALu kituo cha afya.',
    source: 'Tanzania NMCP STG 2023' },
];

// ── TibaFigo — sovereign renal reasoner ─────────────────────────────────────
// TODO port full TibaFigo (CKD calculators, drug-renal interactions, EPO dosing, ask.ts)
const TIBAFIGO_KB: KbEntry[] = [
  { match: /(figo|kidney|ckd|renal)/i,
    respond_sw: 'Afya ya figo: kunywa maji vya kutosha, dhibiti shinikizo na sukari, epuka NSAIDs za muda mrefu. Pima eGFR kila mwaka kama una hatari.',
    next_sw: 'Pima creatinine + urinalysis kituo cha afya.',
    source: 'KDIGO 2024 + Tanzania STG' },
  { match: /(dialysis|dialisi|mashine ya damu)/i,
    respond_sw: 'Dialysis ya hemodialysis ni kawaida mara 3 kwa wiki. Lengo: dry weight, K <5.5, fosforasi 3-5, Hb 10-11.',
    next_sw: 'Andika ulaji wa maji + uzito kabla na baada kwa kila session.',
    source: 'KDIGO Hemodialysis 2018 + TibaFigo' },
  { match: /(epo|erythropoietin|damu kidogo|anemia)/i,
    respond_sw: 'EPO inatumika CKD anemia. Hakikisha iron stores zimejaa kwanza (ferritin >100, TSAT >20%) — vinginevyo EPO haifanyi kazi.',
    next_sw: 'Pima ferritin + TSAT kabla ya EPO.',
    source: 'KDIGO Anemia 2012 + TibaFigo EPO module' },
  { match: /(maji|fluid|kunywa maji)/i,
    respond_sw: 'CKD hatua 4-5/dialysis: kikomo cha maji ~1L/siku + mkojo uliotoka jana. Hesabu mboga za maji (supu, ndizi, matunda).',
    next_sw: 'Pima uzito kila asubuhi kabla ya kifungua-kinywa.',
    source: 'KDIGO + TibaFigo fluid module' },
];

// ── TibaAfya — meds/pharmacy/interactions ───────────────────────────────────
// TODO port full TibaAfya meds DB + interaction graph
const TIBAAFYA_KB: KbEntry[] = [
  { match: /(dawa|medication|kumeza|niliruka)/i,
    respond_sw: 'Kuruka dosi moja: meza mara tu unapokumbuka isipokuwa ni karibu na dosi inayofuata — usichukue dosi mbili. Andika kila ruka kwenye tracker.',
    next_sw: 'Weka kikumbusho cha simu kwa wakati huo huo kila siku.',
    source: 'TMDA + Tanzania STG' },
  { match: /(mwingiliano|interaction|pamoja na)/i,
    respond_sw: 'Mwingiliano wa dawa ni hatari kweli — hasa Rifampicin x ARVs, Warfarin x antibiotics, na opioids x benzodiazepines. Mwambie mfamasia/daktari dawa zote unazotumia.',
    next_sw: 'Lete kifurushi cha dawa zote kwenye ziara ijayo.',
    source: 'TMDA + WHO drug interactions' },
  { match: /(madhara|side effect)/i,
    respond_sw: 'Madhara mengi yanapungua baada ya wiki 2. Madhara hatari (mzio, kupumua kwa shida, manjano) — sitisha na nenda kituo cha afya.',
    next_sw: 'Ripoti madhara makubwa kwa adr@tmda.go.tz.',
    source: 'TMDA Pharmacovigilance' },
];

// ── TibaMama — perinatal/maternal/early childhood ───────────────────────────
// TODO port full TibaMama (ANC schedule, EPDS, kicks counter, postpartum recovery)
const TIBAMAMA_KB: KbEntry[] = [
  { match: /(mimba|pregnant|tumbo lina mtoto)/i,
    respond_sw: 'Mimba salama: ANC visit 8 (WHO 2016), folic acid 5mg, iron, tetanus, malaria prophylaxis (IPTp), VVU + syphilis screening.',
    next_sw: 'Anza ANC kabla ya wiki 12.',
    source: 'WHO ANC 2016 + Tanzania RCH' },
  { match: /(huzuni baada ya kujifungua|postpartum|baby blues|epds)/i,
    respond_sw: 'Postpartum depression inaathiri 1 kati ya 7. EPDS ≥10 → fuatilia, ≥13 → tathmini ya kliniki. Si dosari yako.',
    next_sw: 'Chukua kipimo cha EPDS na uongee na CHW au mkunga.',
    source: 'EPDS (Cox 1987) + WHO mhGAP' },
  { match: /(mtoto|child|milestone|chanjo|immunization)/i,
    respond_sw: 'Ratiba ya chanjo Tanzania: BCG kuzaliwa, OPV/Penta/PCV/Rota wiki 6/10/14, Measles miezi 9 + 18.',
    next_sw: 'Lete kadi ya chanjo kwenye ziara ya RCH.',
    source: 'EPI Tanzania 2023' },
  { match: /(kicks|kupiga|mwendo wa mtoto)/i,
    respond_sw: 'Mwendo wa mtoto huanza wiki 18-22. Tarajia kicks 10 ndani ya saa 2 baada ya kula. Kupungua ghafla → nenda kituo cha uzazi.',
    next_sw: 'Lala upande wa kushoto na hesabu kicks.',
    source: 'WHO Maternal Care + Tanzania STG' },
];

function genericReply(domain: string, source: string): FederatedReply {
  return {
    ack: 'Nakusikia.',
    respond: `${domain} haina jibu maalum kwa swali hilo bado. Lakini niko nawe — niambie zaidi.`,
    next_step: 'Hatua: Niulize kwa undani zaidi au tuongee na mtaalamu wa karibu.',
    source,
  };
}

function ask(kb: KbEntry[], query: string, _ctx: FederatedContext, fallbackDomain: string, fallbackSrc: string): FederatedReply {
  const hit = pickKb(kb, query);
  if (!hit) return genericReply(fallbackDomain, fallbackSrc);
  return {
    ack: 'Nakusikia.',
    respond: hit.respond_sw,
    next_step: `Hatua: ${hit.next_sw}`,
    source: hit.source,
  };
}

export const federated = {
  tibaai: {
    domain: 'clinical',
    ask: (q: string, ctx: FederatedContext = {}): FederatedReply =>
      ask(TIBAAI_KB, q, ctx, 'TibaAI', 'TibaAI engine (Tanzania STG)'),
  },
  tibafigo: {
    domain: 'renal',
    ask: (q: string, ctx: FederatedContext = {}): FederatedReply =>
      ask(TIBAFIGO_KB, q, ctx, 'TibaFigo', 'TibaFigo engine (KDIGO)'),
  },
  tibaafya: {
    domain: 'meds',
    ask: (q: string, ctx: FederatedContext = {}): FederatedReply =>
      ask(TIBAAFYA_KB, q, ctx, 'TibaAfya', 'TibaAfya engine (TMDA)'),
  },
  tibamama: {
    domain: 'perinatal',
    ask: (q: string, ctx: FederatedContext = {}): FederatedReply =>
      ask(TIBAMAMA_KB, q, ctx, 'TibaMama', 'TibaMama engine (WHO + RCH)'),
  },
};

// ── Routing helpers ─────────────────────────────────────────────────────────

export function detectFederatedDomain(text: string): keyof typeof federated | null {
  const t = text.toLowerCase();
  if (/(vvu|hiv|ukimwi|art|cd4|viral load)/i.test(t)) return 'tibaai';
  if (/(figo|kidney|ckd|dialysis|dialisi|creatinine|epo)/i.test(t)) return 'tibafigo';
  if (/(dawa|medication|kumeza|niliruka|mwingiliano|interaction|madhara)/i.test(t)) return 'tibaafya';
  if (/(mimba|pregnant|epds|baby blues|kicks|chanjo|mtoto)/i.test(t)) return 'tibamama';
  return null;
}
