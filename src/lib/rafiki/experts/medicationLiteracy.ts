// experts/medicationLiteracy.ts — Swahili medication education + adherence support.

import type { RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

interface MedEntry {
  keys: string[];
  swName: string;
  use: { sw: string; en: string };
  side: { sw: string; en: string };
  adherence: { sw: string; en: string };
}

const MEDS: MedEntry[] = [
  {
    keys: ['fluoxetine', 'prozac'],
    swName: 'Fluoxetine (Prozac)',
    use: {
      sw: 'Hutumika kutibu unyogovu na wasiwasi. Inachukua wiki 2-6 kuanza kufanya kazi — usikate tamaa mapema.',
      en: 'Used to treat depression and anxiety. Takes 2-6 weeks to start working — do not stop too early.',
    },
    side: {
      sw: 'Madhara: kichefuchefu, kukosa usingizi, hamu ndogo, kupungua kwa hamu ya ngono. Kawaida hupotea baada ya wiki 2.',
      en: 'Side-effects: nausea, sleep issues, low appetite, low libido. Usually fade after 2 weeks.',
    },
    adherence: {
      sw: 'Inywe kila siku asubuhi na chakula. Usiache ghafla — punguza polepole pamoja na daktari.',
      en: 'Take daily in the morning with food. Do not stop suddenly — taper with your doctor.',
    },
  },
  {
    keys: ['sertraline', 'zoloft'],
    swName: 'Sertraline (Zoloft)',
    use: {
      sw: 'Kwa unyogovu, OCD, PTSD, na hofu ya kijamii. Wiki 2-6 kuonyesha matokeo.',
      en: 'For depression, OCD, PTSD, social anxiety. 2-6 weeks to show results.',
    },
    side: {
      sw: 'Madhara: kuhara, kichefuchefu, kuumwa na kichwa, kukosa usingizi.',
      en: 'Side-effects: diarrhoea, nausea, headache, insomnia.',
    },
    adherence: {
      sw: 'Inywe pamoja na chakula. Usiache ghafla — kuna dalili za kuondoka (dizziness, kuwasha).',
      en: 'Take with food. Do not stop suddenly — discontinuation symptoms (dizziness, tingles) can occur.',
    },
  },
  {
    keys: ['amitriptyline'],
    swName: 'Amitriptyline',
    use: {
      sw: 'Dawa ya zamani ya unyogovu (TCA). Pia hutumika kwa maumivu sugu na usingizi.',
      en: 'Older antidepressant (TCA). Also used for chronic pain and sleep.',
    },
    side: {
      sw: 'Madhara: usingizi, kinywa kukauka, kuvimbiwa, uzito kuongezeka. Hatari kwa moyo katika kipimo kikubwa.',
      en: 'Side-effects: drowsiness, dry mouth, constipation, weight gain. Cardiac risk in overdose.',
    },
    adherence: {
      sw: 'Inywe usiku — itasaidia usingizi. Hifadhi mahali pasipofikika kwa watoto.',
      en: 'Take at night — helps sleep. Store away from children.',
    },
  },
  {
    keys: ['diazepam', 'valium'],
    swName: 'Diazepam (Valium)',
    use: {
      sw: 'Hupunguza wasiwasi mkali — tumia kwa muda mfupi tu (wiki 2-4). Hatari ya uraibu.',
      en: 'Reduces acute anxiety — short-term use only (2-4 weeks). Risk of dependence.',
    },
    side: {
      sw: 'Madhara: usingizi, kupungua kwa makini, kuanguka (kwa wazee). Usichanganye na pombe.',
      en: 'Side-effects: drowsiness, reduced focus, falls (in elderly). Do not mix with alcohol.',
    },
    adherence: {
      sw: 'Punguza polepole — usiache ghafla. Daktari atakuongoza.',
      en: 'Taper slowly — never stop abruptly. Your doctor will guide you.',
    },
  },
  {
    keys: ['haloperidol', 'olanzapine', 'risperidone'],
    swName: 'Antipsychotic (kwa psychosis)',
    use: {
      sw: 'Hutumika kutibu psychosis na mania. Mara nyingi katika magonjwa ya kisaikolojia makali.',
      en: 'Used to treat psychosis and mania. Often in severe psychiatric conditions.',
    },
    side: {
      sw: 'Madhara: usingizi, kutetemeka, uzito, sukari kupanda. Daktari atafuatilia.',
      en: 'Side-effects: drowsiness, tremor, weight gain, blood sugar issues. Doctor will monitor.',
    },
    adherence: {
      sw: 'Endelea hata ukijihisi vizuri — kuacha kunaweza kuleta urejeo.',
      en: 'Continue even when you feel better — stopping risks relapse.',
    },
  },
];

const RX = /(dawa|medicine|medication|pill|kidonge|prozac|fluoxetine|sertraline|amitriptyline|diazepam|valium|olanzapine|haloperidol|risperidone)/i;

function find(text: string): MedEntry | null {
  const t = text.toLowerCase();
  for (const m of MEDS) if (m.keys.some((k) => t.includes(k))) return m;
  return null;
}

export const medicationLiteracyExpert: RafikiExpert = {
  id: 'roho-medication',
  domain: 'medicationLiteracy',
  label: 'Dawa',
  match(q) {
    if (find(q.text)) return 0.8;
    if (RX.test(q.text)) return 0.6;
    return 0;
  },
  answer(q): RafikiAnswer {
    const m = find(q.text);
    if (!m) {
      return {
        domain: 'medicationLiteracy',
        expert: 'roho-medication',
        mode: q.mode ?? 'mfunzi',
        confidence: 'low',
        text: {
          sw:
            'Naweza kueleza dawa nyingi za afya ya akili: fluoxetine, sertraline, amitriptyline, ' +
            'diazepam, olanzapine. Niambie jina la dawa yako.',
          en:
            'I can explain many mental-health medications: fluoxetine, sertraline, amitriptyline, ' +
            'diazepam, olanzapine. Tell me your medication name.',
        },
        sources: [{ label: 'WHO Essential Medicines' }],
      };
    }
    return {
      domain: 'medicationLiteracy',
      expert: 'roho-medication',
      mode: q.mode ?? 'mfunzi',
      confidence: 'high',
      text: {
        sw: `${m.swName}\n\nMatumizi: ${m.use.sw}\n\nMadhara: ${m.side.sw}\n\nKuendeleza: ${m.adherence.sw}\n\n*Hii ni elimu — si maagizo. Mzungumze na daktari wako kabla ya kubadili chochote.*`,
        en: `${m.swName}\n\nUse: ${m.use.en}\n\nSide-effects: ${m.side.en}\n\nAdherence: ${m.adherence.en}\n\n*This is education — not a prescription. Talk to your doctor before changing anything.*`,
      },
      sources: [
        { label: 'WHO Essential Medicines for MH' },
        { label: 'BNF', ref: 'British National Formulary' },
      ],
      followUps: ['Nikumbushe kunywa dawa', 'Nieleze interactions na dawa nyingine'],
    };
  },
};
