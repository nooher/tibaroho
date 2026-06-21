/**
 * CFIR 2.0 — Damschroder et al. 2022 (Implementation Science).
 * 5 domains, 39 constructs. Definitions paraphrased from the published
 * codebook. LMIC adaptation notes reflect Tanzania behavioral-health
 * implementation context (Muhimbili / Mirembe / Dodoma RH).
 */

export interface CfirConstruct {
  id: string
  name: string
  swahili: string
  definition: string
  lmicAdaptation: string
}

export interface CfirDomain {
  id: string
  name: string
  swahili: string
  constructs: CfirConstruct[]
}

export const CFIR_DOMAINS: CfirDomain[] = [
  {
    id: 'innovation',
    name: 'Innovation Domain',
    swahili: 'Uvumbuzi',
    constructs: [
      {
        id: 'inn-source',
        name: 'Innovation Source',
        swahili: 'Chanzo cha uvumbuzi',
        definition: 'Perception of whether the innovation comes from a trusted, credible source — internally developed or externally introduced.',
        lmicAdaptation: 'Locally developed PM+/IPT adaptations carry more legitimacy than externally parachuted protocols; co-design with MUHAS, NIMR, MoH is essential.',
      },
      {
        id: 'inn-evidence',
        name: 'Innovation Evidence-base',
        swahili: 'Ushahidi wa kisayansi',
        definition: 'Strength and quality of evidence supporting the belief that the innovation will produce desired outcomes.',
        lmicAdaptation: 'Few RCTs run in Swahili-speaking settings; rely on WHO mhGAP + regional pragmatic trials, flag external validity gaps.',
      },
      {
        id: 'inn-relative-adv',
        name: 'Innovation Relative Advantage',
        swahili: 'Faida ya kulinganisha',
        definition: 'Stakeholders perceive the innovation to be better than current practice or an alternative solution.',
        lmicAdaptation: 'Compared to routine outpatient psychiatry the lay-provider model offers reach but requires demonstrating non-inferiority on PHQ-9 remission.',
      },
      {
        id: 'inn-adaptability',
        name: 'Innovation Adaptability',
        swahili: 'Ubadilikaji',
        definition: 'Degree to which the innovation can be modified, tailored, or reinvented to meet local needs.',
        lmicAdaptation: 'Session language, idioms of distress (e.g., "msongo wa mawazo"), and faith integration vary by region; document core vs adaptable components.',
      },
      {
        id: 'inn-trialability',
        name: 'Innovation Trialability',
        swahili: 'Uwezo wa kujaribiwa',
        definition: 'Degree to which the innovation can be tested or piloted on a limited basis and undone if needed.',
        lmicAdaptation: 'Phase-in by ward or CHW cluster; pre-implementation pilot of 2 facilities before scale to 10.',
      },
      {
        id: 'inn-complexity',
        name: 'Innovation Complexity',
        swahili: 'Uchanganyifu',
        definition: 'Perceived difficulty of implementation reflected by duration, scope, intricacy, and number of steps.',
        lmicAdaptation: 'PHQ-9 + GAD-7 + PM+ workflow with weekly supervision is moderately complex for non-specialist staff; simplify documentation.',
      },
      {
        id: 'inn-design',
        name: 'Innovation Design',
        swahili: 'Muundo wa uvumbuzi',
        definition: 'Perceived excellence in how the innovation is bundled, packaged, presented, and assembled.',
        lmicAdaptation: 'Workbook in Kiswahili sanifu plus pictographic supports for low-literacy participants; tablet UI follows TBHOS design system.',
      },
      {
        id: 'inn-cost',
        name: 'Innovation Cost',
        swahili: 'Gharama',
        definition: 'Costs of the innovation including purchase, opportunity, indirect, and implementation costs.',
        lmicAdaptation: 'Per-session marginal cost ~$8 USD; training + supervision cost dominates first-year budget. Track against THE-FUND and PEPFAR-MH thresholds.',
      },
    ],
  },
  {
    id: 'outer',
    name: 'Outer Setting',
    swahili: 'Mazingira ya nje',
    constructs: [
      {
        id: 'out-critical-incidents',
        name: 'Critical Incidents',
        swahili: 'Matukio muhimu',
        definition: 'Large-scale, transient events affecting implementation (e.g., pandemics, leadership transitions).',
        lmicAdaptation: 'Track election cycles, donor-cycle shifts (PEPFAR, Global Fund), and post-COVID workforce attrition.',
      },
      {
        id: 'out-local-attitudes',
        name: 'Local Attitudes',
        swahili: 'Mitazamo ya jamii',
        definition: 'Sociocultural values and beliefs in the local community surrounding the innovation.',
        lmicAdaptation: 'Stigma toward biomedical mental-health framing remains high; faith-leader engagement and Swahili idioms of distress required.',
      },
      {
        id: 'out-local-conditions',
        name: 'Local Conditions',
        swahili: 'Hali ya eneo',
        definition: 'Economic, environmental, political, technological conditions in which the innovation is implemented.',
        lmicAdaptation: 'Intermittent power/internet at peripheral facilities; offline-first design required; M-Pesa for reimbursement.',
      },
      {
        id: 'out-partnerships',
        name: 'Partnerships & Connections',
        swahili: 'Ushirikiano',
        definition: 'Formal and informal networks linking the implementing entity to outside organizations.',
        lmicAdaptation: 'MoH, MUHAS, NIMR, PORALG, faith networks (BAKWATA, TEC) — co-implementation memoranda required.',
      },
      {
        id: 'out-policies',
        name: 'Policies & Laws',
        swahili: 'Sera na sheria',
        definition: 'Legislation, regulations, mandates, recommendations, and guidelines that affect implementation.',
        lmicAdaptation: 'Mental Health Act 2008, NCD Strategy 2021–2026, Data Protection Act 2022 — align consent and data residency.',
      },
      {
        id: 'out-financing',
        name: 'Financing',
        swahili: 'Ufadhili',
        definition: 'Funding from outside the implementing entity for the innovation and its delivery.',
        lmicAdaptation: 'NHIF coverage of mental-health is limited; donor co-financing (Wellcome, NIH-Fogarty) bridges gap; sustainability plan needed.',
      },
      {
        id: 'out-external-pressure',
        name: 'External Pressure',
        swahili: 'Shinikizo la nje',
        definition: 'Pressure from external sources (peers, performance measures, public reporting, competition).',
        lmicAdaptation: 'SDG 3.4 reporting, WHO mhGAP Forum benchmarks, and donor performance frameworks create modest pressure.',
      },
    ],
  },
  {
    id: 'inner',
    name: 'Inner Setting',
    swahili: 'Mazingira ya ndani',
    constructs: [
      {
        id: 'in-structural-characteristics',
        name: 'Structural Characteristics',
        swahili: 'Sifa za muundo',
        definition: 'Infrastructure, physical layout, age, maturity, size of the implementing entity.',
        lmicAdaptation: 'Regional referral hospitals have outpatient psychiatric clinics; district hospitals usually do not — workflow differs by tier.',
      },
      {
        id: 'in-relational',
        name: 'Relational Connections',
        swahili: 'Mahusiano',
        definition: 'Nature and quality of formal and informal interactions, networks, and relationships within the entity.',
        lmicAdaptation: 'Cross-cadre trust between psychiatrists, COs, nurses, CHWs varies; relational mapping required pre-launch.',
      },
      {
        id: 'in-communications',
        name: 'Communications',
        swahili: 'Mawasiliano',
        definition: 'Quality, frequency, and modes of communication channels within the entity.',
        lmicAdaptation: 'WhatsApp is dominant clinical comms channel; formal email is rare — privacy concerns must be addressed.',
      },
      {
        id: 'in-culture',
        name: 'Culture',
        swahili: 'Utamaduni wa kazi',
        definition: 'Shared values, beliefs, norms, assumptions, and behavioral patterns in the entity.',
        lmicAdaptation: 'Hierarchical decision-making and seniority norms; champion-led roll-out works better than peer-driven.',
      },
      {
        id: 'in-tension-change',
        name: 'Tension for Change',
        swahili: 'Hitaji la mabadiliko',
        definition: 'Degree to which stakeholders perceive the current situation as intolerable or needing change.',
        lmicAdaptation: 'High patient burden + visible suicide cases create tension; surface this with baseline incidence data.',
      },
      {
        id: 'in-compatibility',
        name: 'Compatibility',
        swahili: 'Ulinganifu',
        definition: 'Tangible fit between the innovation and existing workflows and systems.',
        lmicAdaptation: 'PHQ-9 screening integrates with HMIS DHIS2 indicators if mapped; PM+ session length must fit ~30-min OPD slots.',
      },
      {
        id: 'in-relative-priority',
        name: 'Relative Priority',
        swahili: 'Kipaumbele',
        definition: 'Shared perception of the importance of implementation within the entity.',
        lmicAdaptation: 'Mental health competes with HIV, TB, MNCH priorities; require explicit hospital-leadership endorsement.',
      },
      {
        id: 'in-incentives',
        name: 'Incentive Systems',
        swahili: 'Mfumo wa motisha',
        definition: 'Tangible (financial) and intangible (recognition, status) incentives for adoption.',
        lmicAdaptation: 'Per-session lay-provider stipends needed; non-monetary recognition (certificates, supervision letters) also valued.',
      },
      {
        id: 'in-mission-alignment',
        name: 'Mission Alignment',
        swahili: 'Mwafaka wa dhamira',
        definition: 'Degree to which the innovation aligns with the overarching mission of the entity.',
        lmicAdaptation: 'Mental health framed within UHC and NCD strategy aligns with current MoH priorities.',
      },
      {
        id: 'in-available-resources',
        name: 'Available Resources',
        swahili: 'Rasilimali zilizopo',
        definition: 'Level of resources organizationally dedicated to implementation and ongoing operations.',
        lmicAdaptation: 'Tablet availability, private counseling rooms, and reliable referral routes vary widely across the 6–10 facilities.',
      },
      {
        id: 'in-access-knowledge',
        name: 'Access to Knowledge & Information',
        swahili: 'Ufikiaji wa elimu',
        definition: 'Ease of access to digestible information about the innovation.',
        lmicAdaptation: 'In-app Kiswahili supervision content + offline TibaAI port reduces dependence on live trainer availability.',
      },
      {
        id: 'in-learning-climate',
        name: 'Learning Climate',
        swahili: 'Mazingira ya kujifunza',
        definition: 'Climate where staff feel essential, valued, and safe to try new methods.',
        lmicAdaptation: 'Psychological safety in supervision sessions is critical; structured group reflection > individual audit.',
      },
    ],
  },
  {
    id: 'individuals',
    name: 'Individuals Domain',
    swahili: 'Watu binafsi',
    constructs: [
      {
        id: 'ind-high-level-leaders',
        name: 'High-level Leaders',
        swahili: 'Viongozi wa juu',
        definition: 'Senior leaders responsible for funding and broad strategic decisions.',
        lmicAdaptation: 'Permanent Secretary MoH, Regional Medical Officers, and University leadership endorsements gate scale-up.',
      },
      {
        id: 'ind-mid-level-leaders',
        name: 'Mid-level Leaders',
        swahili: 'Viongozi wa kati',
        definition: 'Managers responsible for day-to-day operations and implementation oversight.',
        lmicAdaptation: 'Hospital matrons, head COs, and OPD in-charges drive frontline adoption.',
      },
      {
        id: 'ind-opinion-leaders',
        name: 'Opinion Leaders',
        swahili: 'Wenye ushawishi',
        definition: 'Individuals with informal influence on attitudes and beliefs of colleagues.',
        lmicAdaptation: 'Senior nurses and faith chaplains often shape peer attitudes more than formal leaders.',
      },
      {
        id: 'ind-implementation-leads',
        name: 'Implementation Leads',
        swahili: 'Wenye kuongoza utekelezaji',
        definition: 'Individuals leading the implementation effort at the site.',
        lmicAdaptation: 'Identify and protect 20% effort for a site implementation lead from launch through month 12.',
      },
      {
        id: 'ind-innovation-deliverers',
        name: 'Innovation Deliverers',
        swahili: 'Watoa huduma',
        definition: 'Individuals directly delivering the innovation to recipients.',
        lmicAdaptation: 'Lay providers, COs, and nurses; document baseline mental-health competence and ongoing fidelity.',
      },
      {
        id: 'ind-innovation-recipients',
        name: 'Innovation Recipients',
        swahili: 'Walengwa wa uvumbuzi',
        definition: 'Individuals receiving the innovation (patients, clients).',
        lmicAdaptation: 'Adults 18+ with PHQ-9 ≥ 10; exclude active psychosis, mania, acute suicidality (refer).',
      },
      {
        id: 'ind-other-implementation-supports',
        name: 'Other Implementation Support',
        swahili: 'Wasaidizi wengine',
        definition: 'Other individuals supporting implementation (trainers, data managers).',
        lmicAdaptation: 'Data clerks, biostatisticians, and NIMR research assistants form the backbone of data quality.',
      },
    ],
  },
  {
    id: 'process',
    name: 'Implementation Process',
    swahili: 'Mchakato wa utekelezaji',
    constructs: [
      {
        id: 'pro-teaming',
        name: 'Teaming',
        swahili: 'Kuunda timu',
        definition: 'Joining together to create a temporary or stable team that delivers the innovation.',
        lmicAdaptation: 'Site implementation team: lead + 2 deliverers + 1 data clerk + 1 faith liaison.',
      },
      {
        id: 'pro-assess-needs',
        name: 'Assessing Needs',
        swahili: 'Kutathmini hitaji',
        definition: 'Collecting information on patient/clinician needs and preferences related to the innovation.',
        lmicAdaptation: 'Pre-launch needs assessment with PHQ-9 prevalence sample + qualitative interviews at each facility.',
      },
      {
        id: 'pro-assess-context',
        name: 'Assessing Context',
        swahili: 'Kutathmini mazingira',
        definition: 'Collecting information on barriers, facilitators, and inner/outer setting factors before and during implementation.',
        lmicAdaptation: 'CFIR rapid assessment at month 0, 6, 12; report back to site teams as actionable feedback.',
      },
      {
        id: 'pro-planning',
        name: 'Planning',
        swahili: 'Kupanga',
        definition: 'Developing a scheme, method, or design to put the innovation into practice.',
        lmicAdaptation: 'Site-specific implementation plans with named roles, timeline, supervision cadence.',
      },
      {
        id: 'pro-tailoring',
        name: 'Tailoring Strategies',
        swahili: 'Kurekebisha mikakati',
        definition: 'Tailoring implementation strategies to address specific barriers and leverage facilitators.',
        lmicAdaptation: 'Match ERIC-defined strategies to CFIR barriers identified at each site.',
      },
      {
        id: 'pro-engaging',
        name: 'Engaging',
        swahili: 'Kushirikisha',
        definition: 'Attracting and involving appropriate individuals in implementation.',
        lmicAdaptation: 'Multi-stakeholder launch meeting + monthly site dialogue forum + patient advisory group.',
      },
      {
        id: 'pro-doing',
        name: 'Doing',
        swahili: 'Kutekeleza',
        definition: 'Carrying out or accomplishing the implementation as planned.',
        lmicAdaptation: 'Weekly fidelity checks; ad-hoc supervision visits within 72h of flagged sessions.',
      },
      {
        id: 'pro-reflecting',
        name: 'Reflecting & Evaluating',
        swahili: 'Kutafakari na kutathmini',
        definition: 'Collecting and discussing quantitative and qualitative data about progress, quality, and outcomes.',
        lmicAdaptation: 'Quarterly site learning collaboratives; share RE-AIM dashboards across facilities.',
      },
    ],
  },
]

export const CFIR_CONSTRUCT_COUNT: number = CFIR_DOMAINS.reduce(
  (acc, d) => acc + d.constructs.length, 0,
)
