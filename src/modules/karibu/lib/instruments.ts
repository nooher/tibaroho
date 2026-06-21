// karibu/lib/instruments.ts — validated screening instruments in Swahili.
// PHQ-9, GAD-7, AUDIT (short 10-item), C-SSRS short, EPDS, CRAFFT.
// validated_sw: false means we paraphrased faithfully (no published sw validation).

export interface Item {
  id: string;
  text_sw: string;
  text_en: string;
}

export interface ScaleChoice {
  label_sw: string;
  value: number;
}

export interface Instrument {
  id: 'phq9' | 'gad7' | 'audit' | 'cssrs' | 'epds' | 'crafft';
  name_sw: string;
  scale: ScaleChoice[];
  items: Item[];
  source: string;
  validated_sw: boolean;
}

const FREQ4: ScaleChoice[] = [
  { label_sw: 'Hapana kabisa', value: 0 },
  { label_sw: 'Siku chache', value: 1 },
  { label_sw: 'Zaidi ya nusu ya siku', value: 2 },
  { label_sw: 'Karibu kila siku', value: 3 },
];

export const PHQ9: Instrument = {
  id: 'phq9', name_sw: 'PHQ-9 — Mfadhaiko', scale: FREQ4, source: 'Kroenke & Spitzer 2001', validated_sw: false,
  items: [
    { id: 'phq1', text_sw: 'Kupungua kwa hamu au furaha katika mambo', text_en: 'Little interest or pleasure in doing things' },
    { id: 'phq2', text_sw: 'Kuhisi huzuni, kuvunjika moyo, au hopeless', text_en: 'Feeling down, depressed, or hopeless' },
    { id: 'phq3', text_sw: 'Shida ya kulala, kulala sana, au kuamka mapema', text_en: 'Trouble sleeping' },
    { id: 'phq4', text_sw: 'Kuhisi uchovu au kukosa nguvu', text_en: 'Feeling tired or having little energy' },
    { id: 'phq5', text_sw: 'Kukosa hamu ya kula au kula kupita kiasi', text_en: 'Poor appetite or overeating' },
    { id: 'phq6', text_sw: 'Kujiona vibaya, kushindwa, au kuwakatisha tamaa wengine', text_en: 'Feeling bad about yourself' },
    { id: 'phq7', text_sw: 'Shida ya kuwa makini (kusoma, kazi, mazungumzo)', text_en: 'Trouble concentrating' },
    { id: 'phq8', text_sw: 'Kusonga/kuzungumza polepole sana au kutotulia', text_en: 'Moving or speaking so slowly, or being fidgety' },
    { id: 'phq9', text_sw: 'Mawazo ya kuwa bora ungekufa au kujidhuru', text_en: 'Thoughts of death or self-harm' },
  ],
};

export const GAD7: Instrument = {
  id: 'gad7', name_sw: 'GAD-7 — Wasiwasi', scale: FREQ4, source: 'Spitzer 2006', validated_sw: false,
  items: [
    { id: 'gad1', text_sw: 'Kuhisi wasiwasi, kushindwa kupumzika', text_en: 'Feeling nervous, anxious, or on edge' },
    { id: 'gad2', text_sw: 'Kushindwa kudhibiti mawazo yenye wasiwasi', text_en: 'Not being able to stop or control worrying' },
    { id: 'gad3', text_sw: 'Kuwa na wasiwasi sana kuhusu mambo mbalimbali', text_en: 'Worrying too much about different things' },
    { id: 'gad4', text_sw: 'Shida ya kupumzika', text_en: 'Trouble relaxing' },
    { id: 'gad5', text_sw: 'Kuwa na fadhaa kiasi cha kushindwa kukaa kimya', text_en: 'Being so restless it is hard to sit still' },
    { id: 'gad6', text_sw: 'Kukasirika au kuudhika kwa urahisi', text_en: 'Becoming easily annoyed or irritable' },
    { id: 'gad7', text_sw: 'Kuhisi hofu kana kwamba jambo baya litatokea', text_en: 'Feeling afraid as if something awful might happen' },
  ],
};

export const AUDIT: Instrument = {
  id: 'audit', name_sw: 'AUDIT — Pombe', source: 'WHO Babor 2001', validated_sw: false,
  scale: [
    { label_sw: '0', value: 0 }, { label_sw: '1', value: 1 }, { label_sw: '2', value: 2 }, { label_sw: '3', value: 3 }, { label_sw: '4', value: 4 },
  ],
  items: [
    { id: 'a1', text_sw: 'Mara ngapi kwa wiki unakunywa pombe? (0=kamwe, 4=kila siku)', text_en: 'Frequency of drinking' },
    { id: 'a2', text_sw: 'Vinywaji vingapi vya kawaida unakunywa siku ya kunywa? (0=1-2, 4=10+)', text_en: 'Number of drinks per day' },
    { id: 'a3', text_sw: 'Mara ngapi unakunywa 6+ vinywaji siku moja? (0=kamwe, 4=kila siku)', text_en: 'Frequency of heavy drinking' },
    { id: 'a4', text_sw: 'Mara ngapi umeshindwa kuacha kunywa ulipoanza?', text_en: 'Impaired control' },
    { id: 'a5', text_sw: 'Mara ngapi pombe imekuzuia kufanya kazi/wajibu?', text_en: 'Failure to meet obligations' },
    { id: 'a6', text_sw: 'Mara ngapi umeanza kunywa asubuhi kupunguza unyaufu?', text_en: 'Morning drinking' },
    { id: 'a7', text_sw: 'Mara ngapi umejutia baada ya kunywa?', text_en: 'Guilt after drinking' },
    { id: 'a8', text_sw: 'Mara ngapi umesahau yaliyotokea ulipokuwa umelewa?', text_en: 'Blackouts' },
    { id: 'a9', text_sw: 'Je, wewe au mtu mwingine umewahi kujidhuru kutokana na pombe yako? (0=hapana, 2=ndio, kabla, 4=ndio mwaka huu)', text_en: 'Alcohol-related injury' },
    { id: 'a10', text_sw: 'Je, ndugu/daktari amewahi kukushauri kupunguza? (0=hapana, 2=ndio, kabla, 4=ndio mwaka huu)', text_en: 'Others have advised cutting down' },
  ],
};

export const CSSRS: Instrument = {
  id: 'cssrs', name_sw: 'C-SSRS Fupi — Usalama', source: 'Posner 2011', validated_sw: false,
  scale: [
    { label_sw: 'Hapana', value: 0 }, { label_sw: 'Ndio', value: 1 },
  ],
  items: [
    { id: 'c1', text_sw: 'Je, umewahi kutamani ungekufa au usingeamka?', text_en: 'Wish to be dead' },
    { id: 'c2', text_sw: 'Umekuwa na mawazo ya kujiua katika mwezi mmoja uliopita?', text_en: 'Suicidal thoughts past month' },
    { id: 'c3', text_sw: 'Umefikiria jinsi gani ungejiua?', text_en: 'Method considered' },
    { id: 'c4', text_sw: 'Una nia ya kufanya hayo mawazo?', text_en: 'Intent to act' },
    { id: 'c5', text_sw: 'Una mpango wa kufanya, au umeanza kufanya maandalizi?', text_en: 'Plan or preparatory acts' },
  ],
};

export const EPDS: Instrument = {
  id: 'epds', name_sw: 'EPDS — Mama mjamzito/aliyezaa', source: 'Cox 1987', validated_sw: false,
  scale: [
    { label_sw: '0', value: 0 }, { label_sw: '1', value: 1 }, { label_sw: '2', value: 2 }, { label_sw: '3', value: 3 },
  ],
  items: [
    { id: 'e1', text_sw: 'Nimeweza kucheka na kuona upande wa kuchekesha wa mambo', text_en: 'Able to laugh and see the funny side' },
    { id: 'e2', text_sw: 'Nimeweza kufurahia mambo', text_en: 'Looked forward with enjoyment' },
    { id: 'e3', text_sw: 'Nimejilaumu mwenyewe pasipo lazima jambo lilipoenda vibaya', text_en: 'Blamed myself unnecessarily' },
    { id: 'e4', text_sw: 'Nimekuwa na wasiwasi pasipo sababu', text_en: 'Anxious or worried for no reason' },
    { id: 'e5', text_sw: 'Nimehisi hofu au kupatwa na wasiwasi', text_en: 'Scared or panicky' },
    { id: 'e6', text_sw: 'Mambo yamenikusanyikia (sijaweza)', text_en: 'Things have been getting on top of me' },
    { id: 'e7', text_sw: 'Nimekuwa na huzuni kiasi cha kukosa usingizi', text_en: 'Unhappy — difficulty sleeping' },
    { id: 'e8', text_sw: 'Nimehisi huzuni au taabu', text_en: 'Sad or miserable' },
    { id: 'e9', text_sw: 'Nimekuwa na huzuni mpaka nimelia', text_en: 'Unhappy and crying' },
    { id: 'e10', text_sw: 'Wazo la kujidhuru limenijia', text_en: 'Thought of harming myself' },
  ],
};

export const CRAFFT: Instrument = {
  id: 'crafft', name_sw: 'CRAFFT — Vijana (12–21)', source: 'Knight 2002', validated_sw: false,
  scale: [
    { label_sw: 'Hapana', value: 0 }, { label_sw: 'Ndio', value: 1 },
  ],
  items: [
    { id: 'cr1', text_sw: 'C — Umewahi kuwa kwenye gari linaloendeshwa na mtu (au wewe) aliyetumia pombe/dawa?', text_en: 'Car' },
    { id: 'cr2', text_sw: 'R — Unatumia pombe/dawa kupumzika (Relax) au kujihisi vizuri?', text_en: 'Relax' },
    { id: 'cr3', text_sw: 'A — Unatumia pombe/dawa ukiwa peke yako (Alone)?', text_en: 'Alone' },
    { id: 'cr4', text_sw: 'F — Umewahi kusahau (Forget) ulichofanya ulipotumia pombe/dawa?', text_en: 'Forget' },
    { id: 'cr5', text_sw: 'F — Familia/marafiki (Friends) wamekuwakuambia upunguze?', text_en: 'Friends' },
    { id: 'cr6', text_sw: 'T — Umewahi kuingia kwenye matatizo (Trouble) kutokana na pombe/dawa?', text_en: 'Trouble' },
  ],
};
