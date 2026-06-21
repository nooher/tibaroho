import type React from 'react'
import { useMemo, useState } from 'react'
import { Card, Table, Td } from '../../_shared/Layout'
import { BRAND, TZ_FLAG, hexToRgba, RADII, TEXT } from '../../../lib/glass'
import { useLang } from '../../../lib/i18n/Provider'

interface Payout { id: string; provider: string; amount: number; date: string; method: 'M-Pesa' | 'Bank' | 'Airtel Money' }
interface Settlement { id: string; insurer: string; amount: number; date: string; status: 'received' | 'pending' }
interface Grant { id: string; donor: string; program: string; awarded: number; spent: number; remaining: number; closeDate: string }

const PAYOUTS: Payout[] = [
  { id: 'po-001', provider: 'Dr. Asha Mwema',     amount: 1_350_000, date: '2026-06-21', method: 'M-Pesa' },
  { id: 'po-002', provider: 'Bibi Salima M.',     amount:   432_000, date: '2026-06-21', method: 'M-Pesa' },
  { id: 'po-003', provider: 'Dr. Tatu Ngonyani',  amount: 2_050_000, date: '2026-06-21', method: 'Bank' },
  { id: 'po-004', provider: 'Sister Furaha L.',   amount:   336_000, date: '2026-06-22', method: 'Airtel Money' },
  { id: 'po-005', provider: 'Dr. Hamadi Juma',    amount: 1_260_000, date: '2026-06-22', method: 'M-Pesa' },
  { id: 'po-006', provider: 'Sheikh Yunus M.',    amount:   220_000, date: '2026-06-22', method: 'M-Pesa' },
]
const SETTLEMENTS: Settlement[] = [
  { id: 'st-001', insurer: 'NHIF',       amount: 28_400_000, date: '2026-06-18', status: 'received' },
  { id: 'st-002', insurer: 'AAR',        amount:  4_120_000, date: '2026-06-19', status: 'received' },
  { id: 'st-003', insurer: 'Jubilee',    amount:  6_840_000, date: '2026-06-25', status: 'pending'  },
  { id: 'st-004', insurer: 'Resolution', amount:  2_180_000, date: '2026-06-20', status: 'received' },
  { id: 'st-005', insurer: 'Strategis',  amount:    960_000, date: '2026-06-26', status: 'pending'  },
]
const GRANTS: Grant[] = [
  { id: 'g-wt',  donor: 'Wellcome Trust',             program: 'MH Discovery Award — TR-001',    awarded: 1_840_000_000, spent: 412_000_000, remaining: 1_428_000_000, closeDate: '2029-03-31' },
  { id: 'g-gcc', donor: 'Grand Challenges Canada',    program: 'Saving Brains — perinatal',       awarded:   620_000_000, spent: 188_000_000, remaining:   432_000_000, closeDate: '2027-09-30' },
  { id: 'g-mq',  donor: 'MQ Mental Health Research',  program: 'Implementation — schools',        awarded:   295_000_000, spent:  98_000_000, remaining:   197_000_000, closeDate: '2027-06-30' },
]

const MONTHLY_PL: { month: string; revenue: number; cogs: number; opex: number }[] = [
  { month: 'Jan', revenue: 18_200_000, cogs:  4_100_000, opex: 22_800_000 },
  { month: 'Feb', revenue: 21_400_000, cogs:  4_800_000, opex: 22_100_000 },
  { month: 'Mar', revenue: 24_900_000, cogs:  5_300_000, opex: 23_400_000 },
  { month: 'Apr', revenue: 27_800_000, cogs:  5_900_000, opex: 24_100_000 },
  { month: 'May', revenue: 31_600_000, cogs:  6_400_000, opex: 24_800_000 },
  { month: 'Jun', revenue: 34_200_000, cogs:  7_100_000, opex: 25_100_000 },
]

function fmt(n: number): string { return `TZS ${n.toLocaleString()}` }

export default function Finance(): React.JSX.Element {
  const { t } = useLang()
  const [payoutSel, setPayoutSel] = useState<Record<string, boolean>>({})
  const totalPayout = useMemo(
    () => PAYOUTS.filter((p) => payoutSel[p.id] ?? true).reduce((s, p) => s + p.amount, 0),
    [payoutSel],
  )
  const totalIncoming = SETTLEMENTS.reduce((s, x) => s + x.amount, 0)
  const totalGrants = GRANTS.reduce((s, g) => s + g.remaining, 0)

  const ytdRevenue = MONTHLY_PL.reduce((s, m) => s + m.revenue, 0)
  const ytdCogs    = MONTHLY_PL.reduce((s, m) => s + m.cogs, 0)
  const ytdOpex    = MONTHLY_PL.reduce((s, m) => s + m.opex, 0)
  const ytdNet     = ytdRevenue - ytdCogs - ytdOpex

  // Cost dashboards (rough mock — pure compute)
  const sessionsCompleted = 2_184
  const phq9PointsReduced = 8_950
  const costPerSession = Math.round((ytdCogs + ytdOpex) / sessionsCompleted)
  const costPerPhq9Point = Math.round((ytdCogs + ytdOpex) / phq9PointsReduced)

  return (
    <>
      <Card title={t('ndani.fin.overview_title', 'Fedha — mtazamo wa jumla')}>
        <p style={{ marginTop: 0 }}>
          {t('ndani.fin.overview_body', 'Foleni ya malipo kwa wahudumu (M-Pesa/Airtel/Bank), malipo yanayoingia kutoka kwa wabima, ledger ya ufadhili, na hesabu ya gharama kwa kila kipindi na kila pointi ya PHQ-9 iliyoshushwa.')}
        </p>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 12 }}>
          <Kpi label={t('ndani.fin.kpi.selected_payout', 'Malipo yaliyochaguliwa')}  value={fmt(totalPayout)}   accent={TZ_FLAG.green} />
          <Kpi label={t('ndani.fin.kpi.incoming', 'Yanayoingia (wabima)')}    value={fmt(totalIncoming)} accent={TZ_FLAG.blue} />
          <Kpi label={t('ndani.fin.kpi.grants_left', 'Ufadhili uliosalia')}      value={fmt(totalGrants)}   accent={TZ_FLAG.yellow} />
          <Kpi label={t('ndani.fin.kpi.net_ytd', 'Net YTD')}                 value={fmt(ytdNet)}        accent={ytdNet >= 0 ? TZ_FLAG.green : TZ_FLAG.yellow} />
        </div>
      </Card>

      <Card title={t('ndani.fin.payouts_title', 'Foleni ya malipo — wahudumu')}>
        <Table headers={[t('ndani.fin.col.pick', 'Chagua'), t('ndani.fin.col.provider', 'Mhudumu'), t('ndani.fin.col.amount', 'Kiasi'), t('ndani.fin.col.date', 'Tarehe'), t('ndani.fin.col.method', 'Njia')]}>
          {PAYOUTS.map((p) => (
            <tr key={p.id}>
              <Td>
                <input type="checkbox"
                  aria-label={`Chagua ${p.provider}`}
                  checked={payoutSel[p.id] ?? true}
                  onChange={(e) => setPayoutSel((s) => ({ ...s, [p.id]: e.target.checked }))} />
              </Td>
              <Td><strong>{p.provider}</strong></Td>
              <Td>{fmt(p.amount)}</Td>
              <Td>{p.date}</Td>
              <Td>{p.method}</Td>
            </tr>
          ))}
        </Table>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button aria-label={t('ndani.fin.send_aria', 'Tuma malipo yaliyochaguliwa')}
            style={{
              padding: '10px 18px', borderRadius: RADII.chip,
              background: BRAND.green, color: TEXT.onJewel, border: 'none',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
            {t('ndani.fin.send_button', 'Tuma malipo')} ({fmt(totalPayout)})
          </button>
        </div>
      </Card>

      <Card title={t('ndani.fin.incoming_title', 'Malipo yanayoingia — wabima')}>
        <Table headers={[t('ndani.fin.col.insurer', 'Bima'), t('ndani.fin.col.amount', 'Kiasi'), t('ndani.fin.col.date', 'Tarehe'), t('ndani.fin.col.status', 'Hali')]}>
          {SETTLEMENTS.map((s) => (
            <tr key={s.id}>
              <Td><strong>{s.insurer}</strong></Td>
              <Td>{fmt(s.amount)}</Td>
              <Td>{s.date}</Td>
              <Td>
                <span style={{
                  padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: s.status === 'received' ? TZ_FLAG.green : TZ_FLAG.yellow,
                  color: s.status === 'received' ? '#fff' : BRAND.ink,
                }}>{s.status === 'received' ? t('ndani.fin.status.received', 'Imepokelewa') : t('ndani.fin.status.pending', 'Inasubiri')}</span>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title={t('ndani.fin.grants_title', 'Ledger ya ufadhili')}>
        <Table headers={[t('ndani.fin.col.donor', 'Mfadhili'), t('ndani.fin.col.program', 'Programu'), t('ndani.fin.col.awarded', 'Iliyotolewa'), t('ndani.fin.col.spent', 'Iliyotumika'), t('ndani.fin.col.remaining', 'Iliyobaki'), t('ndani.fin.col.closes', 'Inafungwa')]}>
          {GRANTS.map((g) => (
            <tr key={g.id}>
              <Td><strong>{g.donor}</strong></Td>
              <Td>{g.program}</Td>
              <Td>{fmt(g.awarded)}</Td>
              <Td>{fmt(g.spent)}</Td>
              <Td style={{ color: TZ_FLAG.green }}>{fmt(g.remaining)}</Td>
              <Td>{g.closeDate}</Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title={t('ndani.fin.pl_title', 'P&L ya kila mwezi (YTD)')}>
        <Table headers={[t('ndani.fin.col.month', 'Mwezi'), t('ndani.fin.col.revenue', 'Mapato'), t('ndani.fin.col.cogs', 'COGS'), t('ndani.fin.col.opex', 'OpEx'), t('ndani.fin.col.net', 'Net')]}>
          {MONTHLY_PL.map((m) => {
            const net = m.revenue - m.cogs - m.opex
            return (
              <tr key={m.month}>
                <Td><strong>{m.month}</strong></Td>
                <Td>{fmt(m.revenue)}</Td>
                <Td>{fmt(m.cogs)}</Td>
                <Td>{fmt(m.opex)}</Td>
                <Td style={{ color: net >= 0 ? TZ_FLAG.green : BRAND.yellow }}>{fmt(net)}</Td>
              </tr>
            )
          })}
        </Table>
      </Card>

      <Card title={t('ndani.fin.cost_title', 'Vipimo vya gharama')}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <Kpi label="Gharama kwa kipindi"            value={fmt(costPerSession)}   accent={TZ_FLAG.blue} sub={`${sessionsCompleted.toLocaleString()} vipindi`} />
          <Kpi label="Gharama kwa pointi ya PHQ-9"    value={fmt(costPerPhq9Point)} accent={TZ_FLAG.yellow} sub={`${phq9PointsReduced.toLocaleString()} pointi`} />
          <Kpi label="Gharama kwa msajili mpya"       value={fmt(38_400)}           accent={TZ_FLAG.green} sub="benchmark wa WHO mhGAP" />
        </div>
      </Card>
    </>
  )
}

function Kpi({ label, value, accent, sub }: { label: string; value: string; accent: string; sub?: string }): React.JSX.Element {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: RADII.card,
      background: hexToRgba(accent, 0.14),
      border: `1px solid ${hexToRgba(accent, 0.35)}`,
    }}>
      <div style={{
        fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase',
        color: TEXT.muted, fontWeight: 700,
      }}>{label}</div>
      <div className="serif" style={{
        marginTop: 6, fontSize: 22, color: TEXT.heading, letterSpacing: '-0.4px', lineHeight: 1.1,
      }}>{value}</div>
      {sub ? <div style={{ marginTop: 4, fontSize: 11, color: TEXT.muted }}>{sub}</div> : null}
    </div>
  )
}
