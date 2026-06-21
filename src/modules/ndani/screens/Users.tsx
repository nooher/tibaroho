import type React from 'react'
import { useEffect, useState } from 'react'
import { PageHeader, Section, Pill, GhostButton, DangerButton, PrimaryButton } from '../components/AdminShell'
import DataTable from '../components/DataTable'
import ActionConfirm from '../components/ActionConfirm'
import { list, update, remove } from '../../../lib/db'
import type { TrUser } from '../../../lib/db'
import { JEWEL, hexToRgba, TEXT } from '../../../lib/glass'
import { auditEvent } from '../audit'

interface UserRow extends TrUser { status?: string }

const SEED: UserRow[] = [
  { id: 'u1', role: 'patient',    display_name: 'Mteja A', lang: 'sw',     region: 'Dar es Salaam', status: 'active' },
  { id: 'u2', role: 'patient',    display_name: 'Mteja B', lang: 'sw_mtaa',region: 'Mwanza',        status: 'active' },
  { id: 'u3', role: 'provider',   display_name: 'Dr. Asha Mwema', lang: 'sw', region: 'Dar es Salaam', status: 'active' },
  { id: 'u4', role: 'researcher', display_name: 'Prof. J. Baloh',  lang: 'en', region: 'Arkansas',      status: 'active' },
  { id: 'u5', role: 'school',     display_name: 'Shule ya Kati',   lang: 'sw', region: 'Arusha',        status: 'locked' },
  { id: 'u6', role: 'admin',      display_name: 'Ops Team',        lang: 'en', region: 'Dar es Salaam', status: 'active' },
  { id: 'u7', role: 'patient',    display_name: 'Mteja C',          lang: 'sw', region: 'Mwanza',        status: 'active' },
  { id: 'u8', role: 'employer',   display_name: 'Kampuni X EAP',    lang: 'sw', region: 'Dodoma',        status: 'active' },
]

export default function Users(): React.JSX.Element {
  const [rows, setRows] = useState<UserRow[]>([])
  const [sel, setSel] = useState<UserRow | null>(null)
  const [confirm, setConfirm] = useState<{ open: boolean; mode: 'lock' | 'unlock' | 'anonymise' | 'delete' | 'reset_mfa'; row?: UserRow }>({ open: false, mode: 'lock' })

  useEffect(() => {
    void list('tr_users').then((r) => setRows(r.length ? (r as UserRow[]) : SEED)).catch(() => setRows(SEED))
  }, [])

  const openConfirm = (mode: 'lock' | 'unlock' | 'anonymise' | 'delete' | 'reset_mfa', row: UserRow): void => {
    setConfirm({ open: true, mode, row })
  }

  const apply = async (): Promise<void> => {
    const r = confirm.row
    if (!r) return
    if (confirm.mode === 'delete') {
      try { await remove('tr_users', r.id) } catch { /* offline */ }
      setRows(rows.filter((x) => x.id !== r.id))
    } else if (confirm.mode === 'anonymise') {
      const patched = { ...r, display_name: 'Anonymised user', status: 'anonymised' }
      try { await update('tr_users', r.id, patched) } catch { /* offline */ }
      setRows(rows.map((x) => x.id === r.id ? patched : x))
    } else if (confirm.mode === 'lock' || confirm.mode === 'unlock') {
      const next = confirm.mode === 'lock' ? 'locked' : 'active'
      const patched = { ...r, status: next }
      try { await update('tr_users', r.id, patched as Partial<TrUser>) } catch { /* offline */ }
      setRows(rows.map((x) => x.id === r.id ? patched : x))
    } else if (confirm.mode === 'reset_mfa') {
      // no-op locally; audit captures the intent
    }
    await auditEvent(`user.${confirm.mode}`, 'tr_users', r.id, { prior: r })
  }

  const exportUser = (r: UserRow): void => {
    const blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `user-${r.id}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageHeader title="Watumiaji" subtitle="Wagonjwa, wahudumu, watafiti, shule, waajiri, wasimamizi." />
      <Section title="Tafuta na chuja">
        <DataTable<UserRow>
          columns={[
            { key: 'display_name', label: 'Jina', sortable: true },
            { key: 'role',         label: 'Jukumu', sortable: true, render: (r) => <Pill tone="info">{r.role}</Pill> },
            { key: 'lang',         label: 'Lugha' },
            { key: 'region',       label: 'Mkoa', sortable: true },
            { key: 'status',       label: 'Hali', render: (r) => (
              <Pill tone={r.status === 'active' ? 'good' : r.status === 'locked' ? 'bad' : 'neutral'}>{r.status ?? 'active'}</Pill>
            )},
          ]}
          rows={rows}
          searchKeys={['display_name', 'role', 'region']}
          filters={[
            { label: 'Jukumu', key: 'role', options: ['patient', 'provider', 'researcher', 'school', 'employer', 'admin'] },
            { label: 'Mkoa',   key: 'region', options: ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma'] },
          ]}
          onRowClick={(r) => setSel(r)}
        />
      </Section>

      {sel ? (
        <Section title={`Mtumiaji — ${sel.display_name}`} right={<GhostButton onClick={() => setSel(null)}>Funga</GhostButton>}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 12, marginBottom: 16 }}>
            <KV k="ID" v={sel.id} />
            <KV k="Jukumu" v={sel.role} />
            <KV k="Lugha" v={sel.lang} />
            <KV k="Mkoa" v={sel.region ?? '—'} />
            <KV k="Hali" v={sel.status ?? 'active'} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {sel.status === 'locked'
              ? <PrimaryButton onClick={() => openConfirm('unlock', sel)}>Fungua</PrimaryButton>
              : <GhostButton onClick={() => openConfirm('lock', sel)}>Funga akaunti</GhostButton>}
            <GhostButton onClick={() => openConfirm('reset_mfa', sel)}>Reset MFA</GhostButton>
            <GhostButton onClick={() => exportUser(sel)}>Export data</GhostButton>
            <DangerButton onClick={() => openConfirm('anonymise', sel)}>Anonymise (DPA)</DangerButton>
            <DangerButton onClick={() => openConfirm('delete', sel)}>Futa</DangerButton>
          </div>
          <h4 style={{ marginTop: 18, marginBottom: 6, color: TEXT.heading }}>Safari ya mtumiaji</h4>
          <Timeline events={[
            { ts: '2026-06-20 09:01', label: 'Usajili wa awali' },
            { ts: '2026-06-20 09:15', label: 'PHQ-9 = 14 (wastani)' },
            { ts: '2026-06-21 18:32', label: 'Kipindi cha 1/8 — PM+' },
            { ts: '2026-06-27 19:00', label: 'PHQ-9 = 9 (chini)' },
          ]} />
        </Section>
      ) : null}

      <ActionConfirm
        open={confirm.open}
        title={
          confirm.mode === 'delete'    ? 'Futa mtumiaji?' :
          confirm.mode === 'anonymise' ? 'Anonymise mtumiaji?' :
          confirm.mode === 'lock'      ? 'Funga akaunti?' :
          confirm.mode === 'unlock'    ? 'Fungua akaunti?' :
                                         'Reset MFA?'
        }
        description={
          confirm.mode === 'delete'
            ? 'Hatua hii itafuta rekodi zote zinazohusiana na mtumiaji. Haiwezi kurudishwa nyuma.'
            : 'Hatua hii itaingia kwenye audit log ikiwa na sababu uliyotoa.'
        }
        destructive={confirm.mode === 'delete' || confirm.mode === 'anonymise' || confirm.mode === 'lock'}
        action={confirm.mode}
        entity="tr_users"
        entity_id={confirm.row?.id}
        prior={confirm.row}
        onConfirm={apply}
        onClose={() => setConfirm({ open: false, mode: 'lock' })}
      />
    </>
  )
}

function KV({ k, v }: { k: string; v: string }): React.JSX.Element {
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: TEXT.muted, fontWeight: 700 }}>{k}</div>
      <div style={{ fontSize: 14, color: TEXT.body, marginTop: 2 }}>{v}</div>
    </div>
  )
}

function Timeline({ events }: { events: { ts: string; label: string }[] }): React.JSX.Element {
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: 0, borderLeft: `2px solid ${hexToRgba(JEWEL.tealMwenza, 0.25)}` }}>
      {events.map((e, i) => (
        <li key={i} style={{ position: 'relative', paddingLeft: 16, marginBottom: 10 }}>
          <span style={{
            position: 'absolute', left: -6, top: 4, width: 10, height: 10, borderRadius: 999,
            background: JEWEL.tealMwenza,
          }} />
          <div style={{ fontSize: 11, color: TEXT.muted }}>{e.ts}</div>
          <div style={{ fontSize: 14, color: TEXT.body }}>{e.label}</div>
        </li>
      ))}
    </ol>
  )
}
