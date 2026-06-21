import type React from 'react'
import { useEffect, useState } from 'react'
import { PageHeader, Section, Pill, GhostButton } from '../components/AdminShell'
import KpiCard, { KpiGrid } from '../components/KpiCard'
import DataTable from '../components/DataTable'
import { list } from '../../../lib/db'
import { JEWEL, TEXT } from '../../../lib/glass'
import { useLang } from '../../../lib/i18n/Provider'

interface InboxItem { id: string; kind: string; subject: string; age: string; priority: 'high' | 'med' | 'low' }
interface HealthRow { id: string; service: string; status: 'OK' | 'DEGRADED' | 'DOWN'; latency: string }

const INBOX: InboxItem[] = [
  { id: 'i1', kind: 'Kuthibitisha mhudumu', subject: 'Dr. Asha Mwema (MD)', age: '2 siku', priority: 'high' },
  { id: 'i2', kind: 'IRB inasubiri', subject: 'TR-003 — Cost-effectiveness v1.0', age: '5 siku', priority: 'high' },
  { id: 'i3', kind: 'Refund inasubiri', subject: 'Mteja #842 — TZS 25,000', age: '1 siku', priority: 'med' },
  { id: 'i4', kind: 'Malalamiko', subject: 'Provider v17 — kuchelewa', age: '3 saa', priority: 'med' },
  { id: 'i5', kind: 'IPV alert', subject: 'Mkoa wa Mwanza — kesi 2', age: '20 dakika', priority: 'high' },
]

const HEALTH: HealthRow[] = [
  { id: 'h1', service: 'Database (Supabase)', status: 'OK', latency: '42ms' },
  { id: 'h2', service: 'API gateway', status: 'OK', latency: '88ms' },
  { id: 'h3', service: 'Mwenza AI engine', status: 'OK', latency: '210ms' },
  { id: 'h4', service: 'M-Pesa integration', status: 'OK', latency: '340ms' },
  { id: 'h5', service: 'NHIF endpoint', status: 'DEGRADED', latency: '1.8s' },
  { id: 'h6', service: 'SMS gateway', status: 'OK', latency: '120ms' },
]

const WEEK_ENROL = [42, 58, 71, 64, 80, 95, 112]
const WEEK_SCREEN = [120, 145, 132, 178, 201, 188, 240]
const WEEK_REMISS = [4, 6, 5, 8, 11, 9, 14]
const WEEK_CRISIS = [2, 1, 3, 2, 4, 2, 3]

export default function Dashboard(): React.JSX.Element {
  const { t } = useLang()
  const [counts, setCounts] = useState({ users: 0, providers: 0, programs: 0 })
  useEffect(() => {
    void Promise.all([list('tr_users'), list('tr_providers'), list('tr_programs')]).then(([u, p, pr]) => {
      setCounts({ users: u.length, providers: p.length, programs: pr.length })
    }).catch(() => undefined)
  }, [])
  return (
    <>
      <PageHeader
        title={t('ndani.dash.title', 'Dashibodi')}
        subtitle={t('ndani.dash.subtitle', 'Mwongozo wa wakati halisi — afya ya jukwaa zima.')}
        actions={<GhostButton>{t('ndani.dash.refresh', 'Burudisha')}</GhostButton>}
      />
      <KpiGrid>
        <KpiCard label={t('ndani.dash.kpi.users', 'Watumiaji')} value={counts.users || 18_420} hint={t('ndani.dash.kpi.users_hint', '+412 wiki hii')} accent={JEWEL.tealMwenza} />
        <KpiCard label={t('ndani.dash.kpi.providers', 'Wahudumu')} value={counts.providers || 287} hint={t('ndani.dash.kpi.providers_hint', '14 wanasubiri')} accent={JEWEL.goldHope} />
        <KpiCard label={t('ndani.dash.kpi.programs', 'Programu')} value={counts.programs || 12} hint={t('ndani.dash.kpi.programs_hint', '2 mpya')} accent={JEWEL.indigoWisdom} />
        <KpiCard label={t('ndani.dash.kpi.studies', 'Tafiti zinazoendelea')} value={3} hint={t('ndani.dash.kpi.studies_hint', '1 IRB inasubiri')} accent={JEWEL.indigoWisdom} />
        <KpiCard label={t('ndani.dash.kpi.signups', 'Usajili leo')} value={68} hint={t('ndani.dash.kpi.signups_hint', 'lengo 60')} accent={JEWEL.tealMwenza} trend={WEEK_ENROL} />
        <KpiCard label={t('ndani.dash.kpi.crisis_open', 'Dharura wazi')} value={3} hint={t('ndani.dash.kpi.crisis_hint', 'zote zimepokelewa')} accent={JEWEL.maroonCrisis} trend={WEEK_CRISIS} />
        <KpiCard label={t('ndani.dash.kpi.pending_pay', 'Malipo yanasubiri')} value="TZS 4.2M" hint={t('ndani.dash.kpi.pending_pay_hint', '42 wahudumu')} accent={JEWEL.goldHope} />
        <KpiCard label={t('ndani.dash.kpi.irb_pending', 'IRB inasubiri')} value={1} hint="TR-003" accent={JEWEL.indigoWisdom} />
      </KpiGrid>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <Section title={t('ndani.dash.trend_title', 'Mwenendo wa wiki')}>
          <Trend label={t('ndani.dash.trend.signups', 'Usajili')} data={WEEK_ENROL} color={JEWEL.tealMwenza} />
          <Trend label={t('ndani.dash.trend.screen', 'Tathmini (PHQ-9/GAD-7)')} data={WEEK_SCREEN} color={JEWEL.indigoWisdom} />
          <Trend label={t('ndani.dash.trend.remission', 'Kupona (remission)')} data={WEEK_REMISS} color={JEWEL.goldHope} />
          <Trend label={t('ndani.dash.trend.crisis', 'Matukio ya dharura')} data={WEEK_CRISIS} color={JEWEL.maroonCrisis} />
        </Section>

        <Section title={t('ndani.dash.health_title', 'Afya ya jukwaa')}>
          <DataTable<HealthRow>
            columns={[
              { key: 'service', label: t('ndani.dash.col.service', 'Huduma') },
              { key: 'status', label: t('ndani.dash.col.status', 'Hali'), render: (r) => (
                <Pill tone={r.status === 'OK' ? 'good' : r.status === 'DEGRADED' ? 'warn' : 'bad'}>{r.status}</Pill>
              )},
              { key: 'latency', label: t('ndani.dash.col.latency', 'Latency') },
            ]}
            rows={HEALTH}
            pageSize={10}
          />
        </Section>
      </div>

      <Section title={t('ndani.dash.inbox_title', 'Inbox — hatua zinazohitajika')}>
        <DataTable<InboxItem>
          columns={[
            { key: 'kind', label: t('ndani.dash.col.kind', 'Aina') },
            { key: 'subject', label: t('ndani.dash.col.subject', 'Mada') },
            { key: 'age', label: t('ndani.dash.col.age', 'Umri') },
            { key: 'priority', label: t('ndani.dash.col.priority', 'Kipaumbele'), render: (r) => (
              <Pill tone={r.priority === 'high' ? 'bad' : r.priority === 'med' ? 'warn' : 'neutral'}>{r.priority}</Pill>
            )},
          ]}
          rows={INBOX}
          searchKeys={['kind', 'subject']}
        />
      </Section>
    </>
  )
}

function Trend({ label, data, color }: { label: string; data: number[]; color: string }): React.JSX.Element {
  const max = Math.max(...data, 1)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: TEXT.muted, marginBottom: 4 }}>
        <span>{label}</span><span>{data[data.length - 1]}</span>
      </div>
      <svg viewBox={`0 0 ${data.length * 16} 36`} style={{ width: '100%', height: 32 }} aria-hidden>
        {data.map((v, i) => (
          <rect key={i}
            x={i * 16 + 2} y={36 - (v / max) * 32}
            width={12} height={(v / max) * 32}
            fill={color} rx={2}
          />
        ))}
      </svg>
    </div>
  )
}
