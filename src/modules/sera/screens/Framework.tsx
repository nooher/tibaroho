import { Card, Table, Td } from '../../_shared/Layout'
import { JEWEL, CREAM, NEUTRAL, TEXT, hexToRgba } from '../../../lib/glass'
import { useLang } from '../../../lib/i18n/Provider'
import { REGIONS, FRAMEWORK_LABEL } from '../data'

const MILESTONES: { id: string; name_sw: string; status: 'done' | 'active' | 'planned' }[] = [
  { id: 'mou',         name_sw: 'MoU ya msingi na WAUT',                      status: 'done' },
  { id: 'tech',        name_sw: 'Tathmini ya kiufundi ya TABHOS',              status: 'done' },
  { id: 'security',    name_sw: 'Ukaguzi wa usalama (NIDC + e-Gov Authority)', status: 'active' },
  { id: 'pilot',       name_sw: 'Awamu ya majaribio — mikoa 6',               status: 'active' },
  { id: 'training',    name_sw: 'Mafunzo ya watoa-huduma (lay counsellors)',  status: 'active' },
  { id: 'scaleup',     name_sw: 'Upanuzi wa kitaifa (26 mikoa)',              status: 'planned' },
  { id: 'integration', name_sw: 'Ushirikiano kamili na NHIF + ICD-11',         status: 'planned' },
  { id: 'parliament',  name_sw: 'Wasilisho kwa Bunge — ripoti ya kwanza',     status: 'planned' },
]

const WORKFLOW: { stage: string; owner: string; eta: string }[] = [
  { stage: 'Hati ya wizara (Wizara ya Afya)', owner: 'Katibu Mkuu — Afya',  eta: 'Robo ya 1' },
  { stage: 'Ukaguzi wa kiufundi (e-Gov)',     owner: 'NIDC',                  eta: 'Robo ya 1' },
  { stage: 'Mapitio ya kisheria',              owner: 'AG Chambers',          eta: 'Robo ya 2' },
  { stage: 'Idhini ya Baraza la Mawaziri',     owner: 'Baraza la Mawaziri',   eta: 'Robo ya 2' },
  { stage: 'Saini ya makubaliano ya kitaifa',  owner: 'Waziri wa Afya',       eta: 'Robo ya 3' },
  { stage: 'Uwasilishaji wa ripoti ya Bunge', owner: 'Kamati ya UKIMWI/Afya',eta: 'Robo ya 4' },
]

const STATUS_COLOR = {
  done:    JEWEL.tealMwenza,
  active:  JEWEL.goldHope,
  planned: hexToRgba(NEUTRAL.ink, 0.32),
} as const

export default function SeraFramework() {
  const { t } = useLang()
  const signed = REGIONS.filter((r) => r.framework === 'signed').length
  const inProgress = REGIONS.filter((r) => r.framework === 'inProgress').length
  const pending = REGIONS.filter((r) => r.framework === 'pending').length

  return (
    <>
      <Card title={t('sera.fw.status-title', 'Hali ya Makubaliano — kwa Mkoa')} accent={JEWEL.indigoWisdom}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
          <Pill label={t('sera.fw.signed', 'Imesainiwa')} count={signed} color={FRAMEWORK_LABEL.signed.color} />
          <Pill label={t('sera.fw.inprogress', 'Inaendelea')} count={inProgress} color={FRAMEWORK_LABEL.inProgress.color} />
          <Pill label={t('sera.fw.pending', 'Inasubiri')} count={pending} color={FRAMEWORK_LABEL.pending.color} />
        </div>
        <Table headers={[t('sera.fw.h.region', 'Mkoa'), t('sera.fw.h.status', 'Hali')]}>
          {REGIONS.map((r) => (
            <tr key={r.id}>
              <Td><strong style={{ color: JEWEL.tealDeep }}>{r.name}</strong></Td>
              <Td>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 12, fontWeight: 600, color: FRAMEWORK_LABEL[r.framework].color,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: FRAMEWORK_LABEL[r.framework].color }} />
                  {FRAMEWORK_LABEL[r.framework].sw}
                </span>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title={t('sera.fw.milestones-title', 'Hatua za Utekelezaji')} accent={JEWEL.goldHope}>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {MILESTONES.map((m, i) => (
            <li
              key={m.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 14px', borderRadius: 12, marginBottom: 8,
                background: CREAM.ivory,
                border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.06)}`,
              }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: 999,
                background: STATUS_COLOR[m.status], color: '#FAF5E5',
                display: 'grid', placeItems: 'center',
                fontSize: 12, fontWeight: 700,
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, color: TEXT.body, fontSize: 14, fontWeight: 500 }}>{m.name_sw}</span>
              <span style={{
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700,
                color: STATUS_COLOR[m.status],
              }}>
                {m.status === 'done' ? t('sera.fw.s.done', 'Imekamilika') : m.status === 'active' ? t('sera.fw.s.active', 'Inaendelea') : t('sera.fw.s.planned', 'Imepangwa')}
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <Card title={t('sera.fw.workflow-title', 'Mfumo wa Kazi — Wizara ya Afya')} accent={JEWEL.tealMwenza}>
        <Table headers={[t('sera.fw.h.stage', 'Hatua'), t('sera.fw.h.owner', 'Mhusika'), t('sera.fw.h.eta', 'Muda')]}>
          {WORKFLOW.map((w, i) => (
            <tr key={i}>
              <Td><strong>{w.stage}</strong></Td>
              <Td>{w.owner}</Td>
              <Td style={{ fontVariantNumeric: 'tabular-nums' }}>{w.eta}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}

function Pill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{
      padding: '10px 16px', borderRadius: 14,
      background: hexToRgba(color, 0.1),
      border: `1px solid ${hexToRgba(color, 0.32)}`,
      display: 'inline-flex', alignItems: 'baseline', gap: 10,
    }}>
      <span style={{
        fontFamily: "'Georgia', serif", fontSize: 24, fontWeight: 700,
        color, letterSpacing: '-0.3px',
      }}>
        {count}
      </span>
      <span style={{ fontSize: 12, fontWeight: 600, color: TEXT.body }}>{label}</span>
    </div>
  )
}
