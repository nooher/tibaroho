import { useState } from 'react'
import { JEWEL, NEUTRAL, RADII, TYPE, TEXT, CREAM } from '../../../lib/glass'
import { PageShell, Card } from '../components/Shell'
import { Pill } from '../components/Pill'
import { listDocs, saveDoc, deleteDoc, listCircle, uid, type DocItem } from '../data/store'
import { useLang } from '../../../lib/i18n/Provider'

const KINDS: Array<{ id: DocItem['kind']; sw: string }> = [
  { id: 'referral', sw: 'Rufaa' },
  { id: 'prescription', sw: 'Vidonge' },
  { id: 'lab', sw: 'Maabara' },
  { id: 'note', sw: 'Kumbukumbu' },
  { id: 'other', sw: 'Nyingine' },
]

export default function DocsPage() {
  const { t } = useLang()
  const [docs, setDocs] = useState<DocItem[]>(() => listDocs())
  const circle = listCircle()
  const [draft, setDraft] = useState<Partial<DocItem>>({ kind: 'referral', sharedWith: [] })
  const [fileMime, setFileMime] = useState('')

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader()
    r.onload = () => { setDraft((d) => ({ ...d, dataUrl: String(r.result), title: d.title || f.name })); setFileMime(f.type) }
    r.readAsDataURL(f)
  }

  function commit() {
    if (!draft.dataUrl || !draft.title) return
    const d: DocItem = {
      id: uid(),
      uploadedAt: new Date().toISOString(),
      title: draft.title,
      kind: (draft.kind || 'other') as DocItem['kind'],
      dataUrl: draft.dataUrl,
      mime: fileMime || 'application/octet-stream',
      sharedWith: draft.sharedWith || [],
    }
    saveDoc(d); setDocs(listDocs())
    setDraft({ kind: 'referral', sharedWith: [] }); setFileMime('')
  }

  function toggleShare(docId: string, memberId: string) {
    const d = docs.find((x) => x.id === docId); if (!d) return
    const sharedWith = d.sharedWith.includes(memberId)
      ? d.sharedWith.filter((m) => m !== memberId)
      : [...d.sharedWith, memberId]
    saveDoc({ ...d, sharedWith }); setDocs(listDocs())
  }

  return (
    <PageShell title={t('mimi.docs.page-title', 'Hifadhi yangu')} subtitle={t('mimi.docs.subtitle', 'Rufaa, vidonge, na ripoti — zote mahali pamoja, zinazoshirikiwa kwa ridhaa.')} back={{ to: '/mimi' }}>
      <Card jewel={JEWEL.tealRoho}>
        <Pill tone="teal">{t('mimi.docs.upload-new', 'Pakia nyaraka mpya')}</Pill>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 14 }}>
          <input placeholder={t('mimi.docs.doc-title-ph', 'Kichwa cha nyaraka')} value={draft.title || ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })} aria-label={t('mimi.docs.title-aria', 'Kichwa')} style={inp} />
          <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as DocItem['kind'] })} aria-label={t('mimi.docs.kind-aria', 'Aina ya nyaraka')} style={inp}>
            {KINDS.map((k) => <option key={k.id} value={k.id}>{k.sw}</option>)}
          </select>
          <label style={{ ...inp, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {draft.dataUrl ? t('mimi.docs.file-ready', '✓ Faili tayari') : t('mimi.docs.choose-file', 'Chagua faili')}
            <input type="file" accept="image/*,application/pdf" onChange={onFile} style={{ display: 'none' }} aria-label={t('mimi.docs.upload-file', 'Pakia faili')} />
          </label>
          <button onClick={commit} disabled={!draft.dataUrl || !draft.title} style={{ padding: '10px 18px', borderRadius: RADII.chip, background: JEWEL.goldHope, color: NEUTRAL.ink, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: draft.dataUrl && draft.title ? 1 : 0.5 }}>
            {t('mimi.docs.save', 'Hifadhi')}
          </button>
        </div>
      </Card>

      <h2 style={{ fontFamily: TYPE.serif, fontSize: 26, letterSpacing: TYPE.tighterTrack, margin: '28px 0 14px' }}>{t('mimi.docs.mine', 'Nyaraka zangu')}</h2>
      {docs.length === 0 && <p style={{ color: TEXT.muted }}>{t('mimi.docs.empty', 'Bado hakuna nyaraka.')}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {docs.map((d) => (
          <Card key={d.id} jewel={JEWEL.indigoWisdom}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Pill tone="indigo">{KINDS.find((k) => k.id === d.kind)?.sw}</Pill>
                <h3 style={{ fontFamily: TYPE.serif, fontSize: 18, margin: '8px 0 2px', letterSpacing: TYPE.tighterTrack }}>{d.title}</h3>
                <p style={{ margin: 0, color: TEXT.muted, fontSize: 12 }}>{new Date(d.uploadedAt).toLocaleString('sw-TZ')}</p>
              </div>
              <button onClick={() => { deleteDoc(d.id); setDocs(listDocs()) }} aria-label={`${t('mimi.docs.delete', 'Futa')} ${d.title}`} style={{ background: 'transparent', border: 'none', color: JEWEL.maroonCrisis, cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <a href={d.dataUrl} download={d.title} style={{ padding: '8px 14px', borderRadius: RADII.chip, background: 'rgba(250,245,229,0.85)', border: '1px solid rgba(11,9,8,0.10)', color: TEXT.body, textDecoration: 'none', fontSize: 12 }}>{t('mimi.docs.download', '↓ Pakua')}</a>
              <a href={d.dataUrl} target="_blank" rel="noreferrer" style={{ padding: '8px 14px', borderRadius: RADII.chip, background: 'rgba(250,245,229,0.85)', border: '1px solid rgba(11,9,8,0.10)', color: TEXT.body, textDecoration: 'none', fontSize: 12 }}>{t('mimi.docs.open', '↗ Fungua')}</a>
            </div>
            {circle.length > 0 && (
              <>
                <p style={{ margin: '14px 0 6px', fontSize: 12, color: TEXT.muted }}>{t('mimi.docs.share-with', 'Shiriki na:')}</p>
                {circle.map((m) => (
                  <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 13 }}>
                    <input type="checkbox" checked={d.sharedWith.includes(m.id)} onChange={() => toggleShare(d.id, m.id)} aria-label={`${t('mimi.docs.share-with-one', 'Shiriki na')} ${m.name}`} />
                    {m.name} <span style={{ color: TEXT.muted, fontSize: 11 }}>({m.relation_sw})</span>
                  </label>
                ))}
              </>
            )}
          </Card>
        ))}
      </div>
    </PageShell>
  )
}

const inp: React.CSSProperties = {
  padding: 10, borderRadius: RADII.card,
  background: CREAM.milk,
  border: '1px solid rgba(11,9,8,0.22)',
  color: TEXT.body, fontSize: 14, fontFamily: TYPE.sans,
}
