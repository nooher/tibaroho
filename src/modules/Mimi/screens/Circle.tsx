import { useState } from 'react'
import { JEWEL, NEUTRAL, RADII, TYPE, TEXT, CREAM } from '../../../lib/glass'
import { PageShell, Card } from '../components/Shell'
import { Pill } from '../components/Pill'
import { listCircle, saveMember, removeMember, uid, type CircleMember } from '../data/store'
import { useLang } from '../../../lib/i18n/Provider'

const RELATIONS = ['Mzazi', 'Mwenzi', 'Ndugu', 'Rafiki', 'Mtaalamu', 'Mlezi']

const EMPTY_CONSENTS: CircleMember['consents'] = {
  viewMoods: false, viewAssessments: false, viewCarePlan: false, notifyCrisis: true,
}

export default function CirclePage() {
  const { t } = useLang()
  const [list, setList] = useState<CircleMember[]>(() => listCircle())
  const [draft, setDraft] = useState<Partial<CircleMember>>({ relation_sw: 'Rafiki', consents: EMPTY_CONSENTS })

  function invite() {
    if (!draft.name) return
    const m: CircleMember = {
      id: uid(),
      name: String(draft.name),
      relation_sw: String(draft.relation_sw || 'Rafiki'),
      phone: draft.phone, email: draft.email,
      consents: draft.consents || EMPTY_CONSENTS,
      invitedAt: new Date().toISOString(),
    }
    saveMember(m); setList(listCircle())
    setDraft({ relation_sw: 'Rafiki', consents: EMPTY_CONSENTS })
  }

  function toggleConsent(id: string, k: keyof CircleMember['consents']) {
    const m = list.find((x) => x.id === id); if (!m) return
    const next = { ...m, consents: { ...m.consents, [k]: !m.consents[k] } }
    saveMember(next); setList(listCircle())
  }

  return (
    <PageShell title={t('mimi.circle.page-title', 'Watu wangu')} subtitle={t('mimi.circle.subtitle', 'Mduara wa familia na walezi — wewe unadhibiti ridhaa.')} back={{ to: '/mimi' }}>
      <Card jewel={JEWEL.tealRoho}>
        <Pill tone="teal">{t('mimi.circle.invite-new', 'Alika mtu mpya')}</Pill>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 14 }}>
          <input placeholder={t('mimi.circle.name-ph', 'Jina')} value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} aria-label={t('mimi.circle.name-aria', 'Jina la mwaliko')} style={inp} />
          <select value={draft.relation_sw} onChange={(e) => setDraft({ ...draft, relation_sw: e.target.value })} aria-label={t('mimi.circle.relation-aria', 'Uhusiano')} style={inp}>
            {RELATIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <input placeholder={t('mimi.circle.phone-ph', 'Simu (hiari)')} value={draft.phone || ''} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} aria-label={t('mimi.circle.phone-aria', 'Namba ya simu')} style={inp} />
          <input placeholder={t('mimi.circle.email-ph', 'Barua pepe (hiari)')} value={draft.email || ''} onChange={(e) => setDraft({ ...draft, email: e.target.value })} aria-label={t('mimi.circle.email-aria', 'Barua pepe')} style={inp} />
          <button onClick={invite} style={{ padding: '10px 18px', borderRadius: RADII.chip, background: JEWEL.goldHope, color: NEUTRAL.ink, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{t('mimi.circle.invite', 'Alika')}</button>
        </div>
      </Card>

      <h2 style={{ fontFamily: TYPE.serif, fontSize: 26, letterSpacing: TYPE.tighterTrack, margin: '28px 0 12px' }}>{t('mimi.circle.my-circle', 'Mduara wangu')}</h2>
      {list.length === 0 && <p style={{ color: TEXT.muted }}>{t('mimi.circle.empty', 'Bado hujamwalika mtu yeyote.')}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {list.map((m) => (
          <Card key={m.id} jewel={JEWEL.indigoWisdom}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <h3 style={{ fontFamily: TYPE.serif, fontSize: 20, margin: 0, letterSpacing: TYPE.tighterTrack }}>{m.name}</h3>
                <p style={{ margin: '2px 0', color: TEXT.muted, fontSize: 13 }}>{m.relation_sw}</p>
                <p style={{ margin: 0, color: TEXT.muted, fontSize: 12 }}>{m.phone || m.email || '—'}</p>
              </div>
              <button onClick={() => { removeMember(m.id); setList(listCircle()) }} aria-label={`${t('mimi.circle.remove', 'Ondoa')} ${m.name}`} style={{ background: 'transparent', border: 'none', color: JEWEL.maroonCrisis, cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <p style={{ margin: '14px 0 8px', fontSize: 12, color: TEXT.muted }}>{t('mimi.circle.can-see', 'Wanaweza kuona:')}</p>
            {(['viewMoods', 'viewAssessments', 'viewCarePlan', 'notifyCrisis'] as const).map((k) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13 }}>
                <input type="checkbox" checked={m.consents[k]} onChange={() => toggleConsent(m.id, k)} aria-label={LABELS[k]} />
                {LABELS[k]}
              </label>
            ))}
          </Card>
        ))}
      </div>
    </PageShell>
  )
}

const LABELS: Record<keyof CircleMember['consents'], string> = {
  viewMoods: 'Vipimo vya hisia',
  viewAssessments: 'Matokeo ya vipimo',
  viewCarePlan: 'Mpango wa huduma',
  notifyCrisis: 'Arifa ya dharura',
}
const inp: React.CSSProperties = {
  padding: 10, borderRadius: RADII.card,
  background: CREAM.milk,
  border: '1px solid rgba(11,9,8,0.22)',
  color: TEXT.body, fontSize: 14, fontFamily: TYPE.sans,
}
