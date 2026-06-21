import type React from 'react'
import { useMemo, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Card, Filter, ModuleShell, Table, Td, type SubNav } from '../_shared/Layout'
import { JEWEL, TEXT, hexToRgba } from '../../lib/glass'
import { PROGRAMS } from '../miradi/data/programs'

/* ─────────────────────────── catalogue data ─────────────────────────────── */

interface Assessment {
  slug: string; name_sw: string; name_en: string; items: number
  domain: string; ageRange: string; notes_sw: string
}
const ASSESSMENTS: Assessment[] = [
  { slug: 'phq9', name_sw: 'PHQ-9', name_en: 'Patient Health Questionnaire-9', items: 9, domain: 'Unyogovu', ageRange: '≥13', notes_sw: 'Imethibitishwa kwa Kiswahili.' },
  { slug: 'gad7', name_sw: 'GAD-7', name_en: 'Generalized Anxiety Disorder-7', items: 7, domain: 'Wasiwasi', ageRange: '≥13', notes_sw: 'Imethibitishwa kwa Kiswahili.' },
  { slug: 'pcl5', name_sw: 'PCL-5', name_en: 'PTSD Checklist (DSM-5)', items: 20, domain: 'PTSD', ageRange: '≥18', notes_sw: 'Tafsiri ya Kiswahili inahitaji uthibitisho wa kitamaduni.' },
  { slug: 'audit', name_sw: 'AUDIT', name_en: 'Alcohol Use Disorders Identification Test', items: 10, domain: 'Pombe', ageRange: '≥18', notes_sw: 'WHO; tafsiri rasmi ya Kiswahili ipo.' },
  { slug: 'assist', name_sw: 'ASSIST', name_en: 'Alcohol, Smoking and Substance Involvement Screening Test', items: 8, domain: 'Madawa', ageRange: '≥18', notes_sw: 'WHO.' },
  { slug: 'k10', name_sw: 'K10', name_en: 'Kessler Psychological Distress', items: 10, domain: 'Dhiki ya jumla', ageRange: '≥18', notes_sw: '' },
  { slug: 'epds', name_sw: 'EPDS', name_en: 'Edinburgh Postnatal Depression Scale', items: 10, domain: 'Mama/Mimba', ageRange: 'Mama', notes_sw: 'Kupima unyogovu wa baada ya kujifungua.' },
  { slug: 'cssrs', name_sw: 'C-SSRS', name_en: 'Columbia Suicide Severity Rating Scale', items: 6, domain: 'Mawazo ya kujidhuru', ageRange: 'Wote', notes_sw: 'Kioo cha dharura.' },
  { slug: 'crafft', name_sw: 'CRAFFT', name_en: 'CRAFFT (adolescent substance use)', items: 9, domain: 'Vijana/Madawa', ageRange: '12-21', notes_sw: '' },
  { slug: 'sdq', name_sw: 'SDQ', name_en: 'Strengths and Difficulties Questionnaire', items: 25, domain: 'Watoto', ageRange: '4-17', notes_sw: 'Toleo la mzazi, mwalimu, na mtoto.' },
  { slug: 'mini', name_sw: 'M.I.N.I.', name_en: 'Mini International Neuropsychiatric Interview', items: 130, domain: 'Tathmini ya kina', ageRange: '≥18', notes_sw: 'Hutumiwa na wahudumu.' },
  { slug: 'whodas', name_sw: 'WHODAS', name_en: 'WHO Disability Assessment Schedule', items: 12, domain: 'Utendaji', ageRange: '≥18', notes_sw: '' },
]

interface CarePlanTemplate { slug: string; name_sw: string; for_: string; steps: string[] }
const CARE_PLANS: CarePlanTemplate[] = [
  { slug: 'mild_depression', name_sw: 'Unyogovu mdogo', for_: 'PHQ-9 5-9', steps: ['Elimu ya kisaikolojia', 'Behavioural activation (PM+ S3)', 'Mapitio kwa wiki 2', 'Tathmini PHQ-9 kwa wiki 4'] },
  { slug: 'moderate_depression', name_sw: 'Unyogovu wa wastani', for_: 'PHQ-9 10-14', steps: ['PM+ kamili (vikao 5)', 'Mhudumu mara moja kwa wiki', 'PHQ-9 kila wiki 2', 'Tathmini dawa baada ya wiki 4 kama hakuna mabadiliko'] },
  { slug: 'severe_depression', name_sw: 'Unyogovu mkali + dawa', for_: 'PHQ-9 ≥15', steps: ['Tathmini ya C-SSRS', 'Rufaa kwa daktari (psychiatrist)', 't-CBT au IPT', 'Mpango wa usalama'] },
  { slug: 'panic_anxiety', name_sw: 'Wasiwasi + panic', for_: 'GAD-7 ≥10', steps: ['Pumzi ya tumbo', 't-CBT vikao 8', 'Mapitio ya kafeini/usingizi'] },
  { slug: 'ptsd_basic', name_sw: 'PTSD — msingi', for_: 'PCL-5 ≥33', steps: ['CETA vikao 8 + exposure', 'Kama mtaalamu yupo: EMDR', 'Mpango wa usalama'] },
  { slug: 'sud_brief', name_sw: 'Matumizi mabaya — brief', for_: 'AUDIT 8-15', steps: ['MI vikao 4', 'Tathmini upya AUDIT kwa wiki 4', 'Rufaa kama AUDIT ≥16'] },
  { slug: 'perinatal', name_sw: 'Mama wa mtoto mchanga', for_: 'EPDS ≥10', steps: ['IPT-perinatal', 'Mshauri wa mama-mtoto', 'Kuthibitisha usalama wa mtoto'] },
  { slug: 'crisis_safety', name_sw: 'Mpango wa usalama (dharura)', for_: 'C-SSRS ≥3', steps: ['Ondoa njia za kujidhuru', 'Andika ishara za onyo', 'Orodha ya watu wa kupiga', 'Hotline 116 (mtoto) / 199 (dharura ya afya)'] },
]

const ICD11_CHAPTER6: { code: string; label_sw: string; label_en: string }[] = [
  { code: '6A00', label_sw: 'Matatizo ya akili katika utoto', label_en: 'Neurodevelopmental disorders' },
  { code: '6A20', label_sw: 'Skizofrenia na matatizo ya psychotic', label_en: 'Schizophrenia or other primary psychotic disorders' },
  { code: '6A60', label_sw: 'Matatizo ya mood — bipolar', label_en: 'Bipolar or related disorders' },
  { code: '6A70', label_sw: 'Matatizo ya unyogovu', label_en: 'Depressive disorders' },
  { code: '6B00', label_sw: 'Matatizo ya wasiwasi', label_en: 'Anxiety or fear-related disorders' },
  { code: '6B20', label_sw: 'OCD na yanayohusiana', label_en: 'Obsessive-compulsive or related disorders' },
  { code: '6B40', label_sw: 'Mafadhaiko maalum (PTSD)', label_en: 'Disorders specifically associated with stress' },
  { code: '6B60', label_sw: 'Matatizo ya dissociative', label_en: 'Dissociative disorders' },
  { code: '6B80', label_sw: 'Matatizo ya kula', label_en: 'Feeding or eating disorders' },
  { code: '6C40', label_sw: 'Matatizo ya matumizi ya pombe', label_en: 'Disorders due to alcohol use' },
  { code: '6C50', label_sw: 'Matatizo ya matumizi ya madawa', label_en: 'Disorders due to substance use' },
]

const INSURERS = [
  { name: 'NHIF', covers_mh: 'Sehemu ya wagonjwa wa nje + dawa za PHC', notes_sw: 'Inakubali huduma katika vituo vilivyosajiliwa.' },
  { name: 'Jubilee', covers_mh: 'Vikao vya outpatient (kwa idhini)', notes_sw: 'Bima ya kibinafsi.' },
  { name: 'Strategis', covers_mh: 'Vikao vya outpatient', notes_sw: 'Bima ya kibinafsi.' },
  { name: 'AAR', covers_mh: 'Vikao vya outpatient + telehealth', notes_sw: 'Bima ya kibinafsi.' },
  { name: 'Britam', covers_mh: 'Vikao vya outpatient', notes_sw: 'Bima ya kibinafsi.' },
]

const REFERRAL_PATHS = [
  { from: 'Self → TBHOS', to: 'Mhudumu wa kawaida (lay)', when_sw: 'Dhiki ya kawaida, PHQ-9 < 15' },
  { from: 'Mhudumu wa kawaida', to: 'Mtaalamu wa afya ya akili', when_sw: 'Hakuna jibu baada ya vikao 5, au PHQ-9 ≥15' },
  { from: 'Mtaalamu', to: 'Hospitali ya rufaa (Muhimbili / Mirembe)', when_sw: 'Psychosis, hatari ya kujidhuru, au matatizo ya kimwili' },
  { from: 'Yeyote', to: '199 / 112', when_sw: 'Dharura ya kweli (C-SSRS ≥4 au kujidhuru sasa)' },
]

/* ─────────────────────────── sub-screens ────────────────────────────────── */

function Overview(): React.JSX.Element {
  return (
    <Card title="Huduma ya TBHOS">
      Huduma ndipo unapata kila kitu kinachopatikana — tathmini ({ASSESSMENTS.length}),
      mipango ya tiba ({PROGRAMS.length}), mifano ya care plan ({CARE_PLANS.length}),
      ICD-11, bima zinazohusika, na njia za rufaa. Tumia kichupo kuongoza utafiti wako.
    </Card>
  )
}

function Assessments(): React.JSX.Element {
  const [q, setQ] = useState('')
  const filtered = useMemo(() =>
    ASSESSMENTS.filter((a) => `${a.name_sw} ${a.name_en} ${a.domain}`.toLowerCase().includes(q.toLowerCase())),
    [q],
  )
  return (
    <>
      <Filter value={q} onChange={setQ} placeholder="Tafuta tathmini…" />
      <Card title={`Tathmini (${filtered.length})`}>
        <Table headers={['Jina', 'Maelezo', 'Maswali', 'Eneo', 'Umri']}>
          {filtered.map((a) => (
            <tr key={a.slug}>
              <Td><strong>{a.name_sw}</strong></Td>
              <Td>{a.name_en}<br /><small style={{ color: TEXT.muted }}>{a.notes_sw}</small></Td>
              <Td>{a.items}</Td>
              <Td>{a.domain}</Td>
              <Td>{a.ageRange}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}

function ProgramsTable(): React.JSX.Element {
  return (
    <Card title={`Mipango ya tiba (${PROGRAMS.length})`}>
      <Table headers={['Jina', 'Vikao', 'Kwa nani', 'Modaliti', 'Gharama']}>
        {PROGRAMS.map((p) => (
          <tr key={p.id}>
            <Td><strong>{p.name_sw}</strong><br /><small style={{ color: TEXT.muted }}>{p.name_en}</small></Td>
            <Td>{p.sessions.length}</Td>
            <Td>{p.audience}</Td>
            <Td>{p.modality}</Td>
            <Td>BURE</Td>
          </tr>
        ))}
      </Table>
    </Card>
  )
}

function CarePlans(): React.JSX.Element {
  return (
    <Card title="Mifano ya Care Plan">
      {CARE_PLANS.map((c) => (
        <div key={c.slug} style={{ borderTop: `1px solid rgba(11,9,8,0.10)`, padding: '14px 0' }}>
          <div className="serif" style={{ fontSize: 18, color: TEXT.heading }}>{c.name_sw}</div>
          <div style={{ fontSize: 12, color: TEXT.muted, marginBottom: 6 }}>Kigezo: {c.for_}</div>
          <ol style={{ margin: '0 0 0 18px' }}>{c.steps.map((s) => <li key={s} style={{ fontSize: 14 }}>{s}</li>)}</ol>
        </div>
      ))}
    </Card>
  )
}

function Icd(): React.JSX.Element {
  return (
    <Card title="ICD-11 — Sura ya 6 (Afya ya Akili)">
      <Table headers={['Code', 'Kiswahili', 'English']}>
        {ICD11_CHAPTER6.map((r) => (
          <tr key={r.code}><Td><code>{r.code}</code></Td><Td>{r.label_sw}</Td><Td>{r.label_en}</Td></tr>
        ))}
      </Table>
      <p style={{ marginTop: 12, fontSize: 12, color: TEXT.muted }}>
        Marejeo kamili: <a href="https://icd.who.int/" target="_blank" rel="noreferrer" style={{ color: TEXT.link }}>icd.who.int</a>
      </p>
    </Card>
  )
}

function Insurance(): React.JSX.Element {
  return (
    <Card title="Bima — Afya ya Akili">
      <Table headers={['Bima', 'Inafidia nini', 'Maelezo']}>
        {INSURERS.map((i) => (
          <tr key={i.name}><Td><strong>{i.name}</strong></Td><Td>{i.covers_mh}</Td><Td>{i.notes_sw}</Td></tr>
        ))}
      </Table>
    </Card>
  )
}

function Referrals(): React.JSX.Element {
  return (
    <Card title="Njia za Rufaa">
      <Table headers={['Kutoka', 'Kwenda', 'Lini']}>
        {REFERRAL_PATHS.map((r, idx) => (
          <tr key={idx}><Td>{r.from}</Td><Td><strong>{r.to}</strong></Td><Td>{r.when_sw}</Td></tr>
        ))}
      </Table>
    </Card>
  )
}

const SUBS: SubNav[] = [
  { to: '.', label: 'Mwongozo' },
  { to: 'tathmini', label: 'Tathmini' },
  { to: 'mipango', label: 'Mipango' },
  { to: 'care-plan', label: 'Care Plans' },
  { to: 'icd11', label: 'ICD-11' },
  { to: 'bima', label: 'Bima' },
  { to: 'rufaa', label: 'Rufaa' },
]

export default function Huduma(): React.JSX.Element {
  return (
    <ModuleShell slug="huduma" subs={SUBS}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="tathmini" element={<Assessments />} />
        <Route path="mipango" element={<ProgramsTable />} />
        <Route path="care-plan" element={<CarePlans />} />
        <Route path="icd11" element={<Icd />} />
        <Route path="bima" element={<Insurance />} />
        <Route path="rufaa" element={<Referrals />} />
      </Routes>
    </ModuleShell>
  )
}
