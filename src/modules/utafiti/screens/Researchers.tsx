import type React from 'react'
import { useEffect, useState } from 'react'
import { Card, Table, Td } from '../../_shared/Layout'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, hexToRgba } from '../../../lib/glass'
import { list, insert } from '../../../lib/db'
import type { TrAuditLog, TrUser } from '../../../lib/db'
import { getMeId } from '../../../lib/me'
import { useLang } from '../../../lib/i18n/Provider'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)

interface Application {
  id: string
  name: string
  affiliation: string
  irbLetter: string
  protocol: string
  mou: string
  scope: string
  status: 'Submitted' | 'Approved' | 'Rejected'
  ts: string
}

const KEY = 'tumaini.utafiti.researchers'

const INITIAL: Application[] = [
  { id: 'R-001', name: 'Dr. Mariam Selemani', affiliation: 'MUHAS Dept. of Psychiatry', irbLetter: 'MUHAS-IRB-2026-04-PSY-022', protocol: 'depression_followup_v2.pdf', mou: 'MOU-MUHAS-2026.pdf', scope: 'PHQ-9 + GAD-7 de-identified (TR-001)', status: 'Approved', ts: '2026-05-12' },
  { id: 'R-002', name: 'Prof. Jure Baloh', affiliation: 'UAMS HSSR', irbLetter: 'UAMS-IRB-26-04-1129', protocol: 'cfir_secondary_v1.pdf', mou: 'MOU-UAMS-2026.pdf', scope: 'CFIR + RE-AIM aggregate (TR-002)', status: 'Approved', ts: '2026-04-30' },
  { id: 'R-003', name: 'Dr. Faraja Mosha', affiliation: 'NIMR Mwanza', irbLetter: 'Pending', protocol: 'rural_subgroup_v1.pdf', mou: 'In review', scope: 'Rural subgroup PHQ-9', status: 'Submitted', ts: '2026-06-10' },
]

const AUDIT = [
  { ts: '2026-06-20 14:22', actor: 'mariam@muhas', q: 'SELECT phq9_score FROM tr_outcomes WHERE protocol=\'TR-001\' AND week=12' },
  { ts: '2026-06-20 09:48', actor: 'baloh@uams.edu', q: 'EXPORT cfir_assessments WHERE protocol=\'TR-002\'' },
  { ts: '2026-06-19 22:11', actor: 'mariam@muhas', q: 'SELECT count(*) FROM tr_consents WHERE active=true' },
  { ts: '2026-06-19 18:03', actor: 'baloh@uams.edu', q: 'AGG fidelity_session BY provider' },
  { ts: '2026-06-18 11:30', actor: 'mariam@muhas', q: 'SELECT gad7_mean BY week FROM tr_outcomes' },
]

function loadCache(): Application[] {
  try {
    const r = localStorage.getItem(KEY)
    return r ? (JSON.parse(r) as Application[]) : INITIAL
  } catch { return INITIAL }
}

function writeCache(items: Application[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* quota */ }
}

interface AppMeta extends Omit<Application, 'id' | 'ts'> { ts?: string }

function rowToApp(row: TrAuditLog, idx: number): Application {
  const m = (row.meta ?? {}) as Partial<AppMeta>
  return {
    id: row.entity_id ?? `R-${String(idx + 1).padStart(3, '0')}`,
    name: m.name ?? '—',
    affiliation: m.affiliation ?? '—',
    irbLetter: m.irbLetter ?? '',
    protocol: m.protocol ?? '',
    mou: m.mou ?? '',
    scope: m.scope ?? '',
    status: m.status ?? 'Submitted',
    ts: (row.at ?? '').slice(0, 10),
  }
}

export default function Researchers(): React.JSX.Element {
  const { t } = useLang()
  const [apps, setApps] = useState<Application[]>(INITIAL)
  const [researcherUsers, setResearcherUsers] = useState<TrUser[]>([])
  const [form, setForm] = useState<Omit<Application, 'id' | 'status' | 'ts'>>({
    name: '', affiliation: '', irbLetter: '', protocol: '', mou: '', scope: '',
  })

  useEffect(() => {
    setApps(loadCache())
    let mounted = true
    void (async () => {
      try {
        const rows = (await list('tr_audit_log', { entity: 'researcher_application' })) as TrAuditLog[]
        // Reduce to one row per entity_id (latest wins for status).
        const byId = new Map<string, TrAuditLog>()
        for (const r of rows.sort((a, b) => (a.at ?? '') > (b.at ?? '') ? 1 : -1)) {
          if (r.entity_id) byId.set(r.entity_id, r)
        }
        const restored: Application[] = [...byId.values()].map(rowToApp)
        if (mounted && restored.length) {
          setApps(restored)
          writeCache(restored)
        }
      } catch { /* offline */ }

      // Pull approved researcher tr_users.
      try {
        const users = (await list('tr_users', { role: 'researcher' })) as TrUser[]
        if (mounted) setResearcherUsers(users)
      } catch { /* offline */ }
    })()
    return () => { mounted = false }
  }, [])

  const persist = (next: Application[]): void => {
    setApps(next)
    writeCache(next)
  }

  const writeAudit = async (a: Application, action: string): Promise<void> => {
    try {
      const actor = await getMeId().catch(() => undefined)
      await insert('tr_audit_log', {
        actor_id: actor,
        action,
        entity: 'researcher_application',
        entity_id: a.id,
        meta: a,
        at: new Date().toISOString(),
      })
    } catch { /* offline */ }
  }

  const submit = (): void => {
    if (!form.name || !form.affiliation) return
    const fresh: Application = {
      ...form, id: `R-${String(apps.length + 1).padStart(3, '0')}`,
      status: 'Submitted', ts: new Date().toISOString().slice(0, 10),
    }
    persist([...apps, fresh])
    void writeAudit(fresh, 'researcher.application.submit')
    setForm({ name: '', affiliation: '', irbLetter: '', protocol: '', mou: '', scope: '' })
  }

  const act = (id: string, status: 'Approved' | 'Rejected'): void => {
    const next = apps.map((a) => a.id === id ? { ...a, status } : a)
    persist(next)
    const updated = next.find((a) => a.id === id)
    if (updated) void writeAudit(updated, status === 'Approved' ? 'researcher.application.approve' : 'researcher.application.reject')
  }

  return (
    <>
      <Card title={t('utafiti.researchers.app_title', 'Maombi ya mtafiti wa nje')} accent={BRAND.green}>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: TEXT.muted }}>
          {t('utafiti.researchers.app_intro', 'Watafiti wa nje wanawasilisha MoU, barua ya IRB, na itifaki ya utafiti. Maombi yanapitishwa na timu ya Ndani kabla ya kupata scoped query access.')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 12 }}>
          {([
            ['name', t('utafiti.researchers.f.name', 'Jina kamili')],
            ['affiliation', t('utafiti.researchers.f.affiliation', 'Taasisi')],
            ['irbLetter', t('utafiti.researchers.f.irb_letter', 'IRB approval letter (jina la faili)')],
            ['protocol', t('utafiti.researchers.f.protocol', 'Itifaki ya utafiti (jina la faili)')],
            ['mou', t('utafiti.researchers.f.mou', 'MoU (jina la faili)')],
            ['scope', t('utafiti.researchers.f.scope', 'Ufikiaji unaohitajika (scope)')],
          ] as const).map(([k, lbl]) => (
            <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: TEXT.muted }}>
              {lbl}
              <input type="text" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                style={{ padding: '8px 10px', borderRadius: 8, background: CREAM.milk, border: `1px solid ${ink(0.22)}`, color: TEXT.body, fontSize: 13 }} />
            </label>
          ))}
        </div>
        <button onClick={submit} style={{
          padding: '10px 16px', borderRadius: RADII.chip, background: BRAND.green,
          color: TEXT.onJewel, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>{t('utafiti.researchers.submit', 'Wasilisha ombi')}</button>
      </Card>

      <Card title={t('utafiti.researchers.queue', 'Foleni ya ukaguzi')} accent={BRAND.yellow}>
        <Table headers={['#', t('utafiti.researchers.col.name', 'Jina'), t('utafiti.researchers.col.aff', 'Taasisi'), 'IRB', t('utafiti.researchers.col.scope', 'Scope'), t('utafiti.researchers.col.status', 'Hali'), t('utafiti.researchers.col.action', 'Hatua')]}>
          {apps.map((a) => (
            <tr key={a.id}>
              <Td style={{ color: TEXT.body }}><strong>{a.id}</strong></Td>
              <Td style={{ color: TEXT.body }}>{a.name}</Td>
              <Td style={{ color: TEXT.body }}>{a.affiliation}</Td>
              <Td style={{ color: TEXT.muted }}><code style={{ fontSize: 11 }}>{a.irbLetter || '—'}</code></Td>
              <Td style={{ color: TEXT.muted, fontSize: 12 }}>{a.scope}</Td>
              <Td style={{
                color: a.status === 'Approved' ? BRAND.green : a.status === 'Rejected' ? TEXT.heading : BRAND.yellow,
                fontWeight: 600,
              }}>{a.status}</Td>
              <Td>
                {a.status === 'Submitted' ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => act(a.id, 'Approved')} style={{
                      padding: '6px 10px', borderRadius: 999, background: BRAND.green, color: TEXT.onJewel,
                      border: 'none', fontSize: 11, cursor: 'pointer',
                    }}>{t('utafiti.researchers.approve', 'Kubali')}</button>
                    <button onClick={() => act(a.id, 'Rejected')} style={{
                      padding: '6px 10px', borderRadius: 999, background: BRAND.ink, color: TEXT.onJewel,
                      border: 'none', fontSize: 11, cursor: 'pointer',
                    }}>{t('utafiti.researchers.reject', 'Kataa')}</button>
                  </div>
                ) : '—'}
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title={t('utafiti.researchers.approved_title', 'Watafiti waliokubaliwa — scoped query access')} accent={BRAND.blue}>
        <Table headers={[t('utafiti.researchers.col.researcher', 'Mtafiti'), t('utafiti.researchers.col.aff', 'Taasisi'), t('utafiti.researchers.col.access', 'Ufikiaji')]}>
          {apps.filter((a) => a.status === 'Approved').map((a) => (
            <tr key={a.id}>
              <Td style={{ color: TEXT.body }}>{a.name}</Td>
              <Td style={{ color: TEXT.body }}>{a.affiliation}</Td>
              <Td style={{ color: TEXT.muted, fontSize: 12 }}>{a.scope}</Td>
            </tr>
          ))}
        </Table>
      </Card>

      {researcherUsers.length > 0 ? (
        <Card title={`${t('utafiti.researchers.active_accounts', 'Watafiti wenye akaunti hai')} (${researcherUsers.length})`} accent={BRAND.green}>
          <Table headers={[t('utafiti.researchers.col.name', 'Jina'), t('utafiti.researchers.col.lang', 'Lugha'), t('utafiti.researchers.col.region', 'Mkoa')]}>
            {researcherUsers.map((u) => (
              <tr key={u.id}>
                <Td style={{ color: TEXT.body }}><strong>{u.display_name ?? '—'}</strong></Td>
                <Td style={{ color: TEXT.muted }}>{u.lang}</Td>
                <Td style={{ color: TEXT.muted }}>{u.region ?? '—'}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      ) : null}

      <Card title={t('utafiti.researchers.audit_title', 'Audit log — query za hivi karibuni (20)')} accent={NEUTRAL.ink}>
        <Table headers={[t('utafiti.researchers.col.time', 'Wakati'), t('utafiti.researchers.col.researcher', 'Mtafiti'), 'Query']}>
          {AUDIT.map((e, i) => (
            <tr key={i}>
              <Td style={{ color: TEXT.muted }}>{e.ts}</Td>
              <Td style={{ color: TEXT.body }}>{e.actor}</Td>
              <Td><code style={{ fontSize: 11, color: TEXT.muted }}>{e.q}</code></Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
