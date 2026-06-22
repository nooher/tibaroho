/**
 * Provider self-onboarding wizard — /sajili-kama-mtaalam.
 *
 * Real clinicians, lay counsellors, faith leaders, school counsellors, and
 * NGO outreach workers fill this out to join TABHOS's directory. Result:
 *   1. tr_providers row (verified = false)
 *   2. tr_provider_credentials row (status = pending)
 * Admin reviews via Ndani console; once verified=true, the provider shows
 * up in Gundua's live directory and patients can book them.
 *
 * Honesty: we do not have a credentials storage bucket yet, so license
 * documents are referenced by license number + a note that Laetoli will
 * follow up by email for the physical/scanned document. This keeps the
 * sign-up path short while preserving the audit chain.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BRAND, CREAM, JEWEL, NEUTRAL, TEXT, TYPE, hexToRgba } from '../../lib/glass'
import { useLang } from '../../lib/i18n/Provider'
import { hasBackend, supabase } from '../../lib/supabase'

type ProviderKind = 'clinician' | 'lay_counsellor' | 'faith' | 'school' | 'ngo'
type Modality = 'virtual' | 'in_person' | 'hybrid' | 'asynchronous'

interface Form {
  displayName: string
  kind: ProviderKind
  licenseAuthority: string
  licenseNumber: string
  bioSw: string
  bioEn: string
  languages: string[]
  regions: string[]
  modalities: Modality[]
  feeDefault: number
  acceptsInsurance: string[]
  contactPhone: string
}

const KIND_OPTIONS: { v: ProviderKind; sw: string; en: string }[] = [
  { v: 'clinician',      sw: 'Daktari (Psychiatrist · GP-MH · Psychologist)', en: 'Clinician (Psychiatrist · GP-MH · Psychologist)' },
  { v: 'lay_counsellor', sw: 'Lay counsellor (Friendship Bench, CHW)',        en: 'Lay counsellor (Friendship Bench, CHW)' },
  { v: 'faith',          sw: 'Mhudumu wa imani (Sheikh, Pastor, Mch.)',       en: 'Faith counsellor (Sheikh, Pastor, Reverend)' },
  { v: 'school',         sw: 'Mshauri wa shule',                              en: 'School counsellor' },
  { v: 'ngo',            sw: 'NGO outreach',                                  en: 'NGO outreach worker' },
]

const LANG_OPTIONS = [
  { v: 'sw',         label: 'Kiswahili' },
  { v: 'en',         label: 'English' },
  { v: 'sw_mtaa',    label: 'Sheng / mtaa' },
  { v: 'ar',         label: 'العربية' },
  { v: 'fr',         label: 'Français' },
  { v: 'lugha_alama',label: 'Lugha ya Alama (TSL)' },
]

const REGIONS = [
  'Arusha','Dar es Salaam','Dodoma','Geita','Iringa','Kagera','Katavi','Kigoma',
  'Kilimanjaro','Lindi','Manyara','Mara','Mbeya','Morogoro','Mtwara','Mwanza',
  'Njombe','Pwani','Rukwa','Ruvuma','Shinyanga','Simiyu','Singida','Songwe',
  'Tabora','Tanga','Pemba Kaskazini','Pemba Kusini','Unguja Kaskazini','Unguja Kusini','Unguja Mjini',
]

const MODALITY_OPTIONS: { v: Modality; sw: string; en: string }[] = [
  { v: 'virtual',      sw: 'Mtandaoni (video/simu)', en: 'Virtual (video/phone)' },
  { v: 'in_person',    sw: 'Ana kwa ana (kliniki)',  en: 'In person (clinic)' },
  { v: 'hybrid',       sw: 'Mchanganyiko',           en: 'Hybrid' },
  { v: 'asynchronous', sw: 'Ujumbe (sio realtime)',  en: 'Asynchronous messaging' },
]

const INSURANCE_OPTIONS = ['NHIF', 'Jubilee', 'Strategis', 'AAR', 'Resolution']

const LICENSE_HINT: Record<ProviderKind, { authority: string; numberHint: string }> = {
  clinician:      { authority: 'MCT (Medical Council of Tanganyika)', numberHint: 'MCT-XXXXX' },
  lay_counsellor: { authority: 'TCDA / Friendship Bench training',     numberHint: 'TCDA-XXXX au cert. ID' },
  faith:          { authority: 'BAKWATA / TEC / ELCT / synod',         numberHint: 'Synod ref. au herein' },
  school:         { authority: 'NACTE / Ministry of Education',        numberHint: 'NACTE-XXXX' },
  ngo:            { authority: 'Registered NGO (TANGO)',               numberHint: 'NGO registration #' },
}

const defaultForm: Form = {
  displayName: '',
  kind: 'clinician',
  licenseAuthority: LICENSE_HINT.clinician.authority,
  licenseNumber: '',
  bioSw: '',
  bioEn: '',
  languages: ['sw'],
  regions: ['Dar es Salaam'],
  modalities: ['virtual'],
  feeDefault: 0,
  acceptsInsurance: [],
  contactPhone: '',
}

export default function SajiliMtaalam() {
  const { t, lang } = useLang()
  const nav = useNavigate()
  const [form, setForm] = useState<Form>(defaultForm)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    if (!hasBackend || !supabase) { setSignedIn(false); return }
    void supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)))
  }, [])

  const toggle = (arr: string[], v: string): string[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
  const toggleMod = (arr: Modality[], v: Modality): Modality[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

  const onKindChange = (k: ProviderKind): void => {
    setForm({ ...form, kind: k, licenseAuthority: LICENSE_HINT[k].authority })
  }

  const canSubmit = Boolean(
    form.displayName.trim() &&
    form.licenseNumber.trim() &&
    form.languages.length > 0 &&
    form.regions.length > 0 &&
    form.modalities.length > 0,
  )

  const submit = async (): Promise<void> => {
    setError(null)
    if (!hasBackend || !supabase) {
      setError(t('sajili.err.no_backend', 'Backend bado haijasanidiwa — tafadhali jaribu tena baadaye.'))
      return
    }
    setSubmitting(true)
    try {
      const { data: auth } = await supabase.auth.getUser()
      const authId = auth.user?.id
      if (!authId) {
        setError(t('sajili.err.not_signed_in', 'Tafadhali ingia kwanza, kisha rudi kujisajili.'))
        nav('/welcome')
        return
      }

      // 1. Find or create the tr_users row for this auth user.
      let { data: userRow } = await supabase
        .from('tr_users').select('*').eq('auth_id', authId).maybeSingle()

      if (!userRow) {
        const ins = await supabase.from('tr_users').insert({
          auth_id: authId,
          role: 'provider',
          display_name: form.displayName,
          lang: lang === 'en' ? 'en' : 'sw',
          region: form.regions[0],
        }).select('*').single()
        if (ins.error) throw ins.error
        userRow = ins.data
      } else {
        // Promote to provider role if needed; refresh display name + region.
        await supabase.from('tr_users')
          .update({ role: 'provider', display_name: form.displayName, region: form.regions[0] })
          .eq('id', userRow.id)
      }

      // 2. Insert tr_providers row (verified = false).
      const provIns = await supabase.from('tr_providers').insert({
        user_id: userRow.id,
        kind: form.kind,
        bio_sw: form.bioSw || null,
        bio_en: form.bioEn || null,
        languages: form.languages,
        regions: form.regions,
        fee_default: form.feeDefault,
        accepts_insurance: form.acceptsInsurance,
        modalities: form.modalities,
        verified: false,
      }).select('id').single()
      if (provIns.error) throw provIns.error

      // 3. Insert pending credential.
      const credIns = await supabase.from('tr_provider_credentials').insert({
        provider_id: provIns.data.id,
        kind: 'license',
        status: 'pending',
        issued_by: form.licenseAuthority,
        document_url: form.licenseNumber, // store ref# in document_url for v1
      })
      if (credIns.error) throw credIns.error

      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return <SuccessCard onHome={() => nav('/', { replace: true })} />
  }

  if (signedIn === false) {
    return <SignInGate onGo={() => nav('/welcome', { replace: true })} />
  }

  return (
    <main style={{
      minHeight: '100vh', background: CREAM.milk, color: NEUTRAL.ink,
      fontFamily: TYPE.sans, paddingBottom: 64,
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 22px 0' }}>
        <header style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.green, fontWeight: 700, marginBottom: 6 }}>
            TABHOS · {t('sajili.title_kicker', 'Jisajili kama mtaalam')}
          </div>
          <h1 style={{ margin: 0, fontFamily: TYPE.serif, fontSize: 28, color: TEXT.heading, letterSpacing: '-0.4px' }}>
            {t('sajili.h1', 'Karibu — wewe ni mtoa-huduma?')}
          </h1>
          <p style={{ marginTop: 10, color: TEXT.body, fontSize: 14, lineHeight: 1.55 }}>
            {t('sajili.lede', 'Jaza maombi mafupi. Tukithibitisha leseni yako, watumiaji wataweza kukubook Gundua. Hatua zote ni 4.')}
          </p>
          <div style={{ display: 'flex', gap: 6, marginTop: 18 }}>
            {[1,2,3,4].map((i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 999,
                background: i <= step ? BRAND.green : hexToRgba(NEUTRAL.ink, 0.12),
              }} />
            ))}
          </div>
        </header>

        <section style={cardStyle}>
          {step === 1 && <StepBasics form={form} setForm={setForm} t={t} onKindChange={onKindChange} />}
          {step === 2 && <StepLicense form={form} setForm={setForm} t={t} />}
          {step === 3 && <StepReachAndFee form={form} setForm={setForm} t={t} toggle={toggle} toggleMod={toggleMod} />}
          {step === 4 && <StepReview form={form} t={t} />}

          {error && (
            <div role="alert" style={{ marginTop: 14, fontSize: 13, color: '#8C2222', background: 'rgba(140,34,34,0.08)', border: '1px solid rgba(140,34,34,0.25)', borderRadius: 8, padding: '8px 12px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22, gap: 10, flexWrap: 'wrap' }}>
            <button type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s))}
              style={ghostBtn(step === 1)}
            >
              ← {t('sajili.back', 'Rudi')}
            </button>
            {step < 4 ? (
              <button type="button" onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)} style={primaryBtn(false)}>
                {t('sajili.next', 'Endelea')} →
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={!canSubmit || submitting} style={primaryBtn(!canSubmit || submitting)}>
                {submitting ? t('sajili.sending', 'Inatuma…') : t('sajili.submit', 'Tuma maombi')}
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

// ── Steps ───────────────────────────────────────────────────────────────────

interface StepProps {
  form: Form
  setForm: (f: Form) => void
  t: (k: string, fb: string) => string
}

function StepBasics({ form, setForm, t, onKindChange }: StepProps & { onKindChange: (k: ProviderKind) => void }) {
  return (
    <div>
      <h2 style={h2}>{t('sajili.step1.h', 'Wewe ni nani?')}</h2>
      <Field label={t('sajili.step1.name', 'Jina lako kamili')}>
        <input style={inputStyle} value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Dr. Asha Mwema" />
      </Field>
      <Field label={t('sajili.step1.kind', 'Aina ya mtoa-huduma')}>
        <div style={{ display: 'grid', gap: 8 }}>
          {KIND_OPTIONS.map((k) => (
            <button key={k.v} type="button" onClick={() => onKindChange(k.v)} aria-pressed={form.kind === k.v}
              style={pickerBtn(form.kind === k.v)}>
              <span>{k.sw}</span>
              <span style={{ fontSize: 11, color: TEXT.muted, fontWeight: 500 }}>{k.en}</span>
            </button>
          ))}
        </div>
      </Field>
      <Field label={t('sajili.step1.phone', 'Simu (WhatsApp)')}>
        <input style={inputStyle} value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="+255 7XX XXX XXX" />
      </Field>
    </div>
  )
}

function StepLicense({ form, setForm, t }: StepProps) {
  const hint = LICENSE_HINT[form.kind]
  return (
    <div>
      <h2 style={h2}>{t('sajili.step2.h', 'Leseni / Cheti')}</h2>
      <p style={{ marginTop: -8, color: TEXT.muted, fontSize: 13 }}>
        {t('sajili.step2.lede', 'Tutathibitisha kabla ya kuonyesha jina lako Gundua. Hatutachapisha hadi tutakaposhasoma.')}
      </p>
      <Field label={t('sajili.step2.authority', 'Mamlaka inayotoa leseni')}>
        <input style={inputStyle} value={form.licenseAuthority} onChange={(e) => setForm({ ...form, licenseAuthority: e.target.value })} placeholder={hint.authority} />
      </Field>
      <Field label={t('sajili.step2.number', 'Namba ya leseni / cheti')}>
        <input style={inputStyle} value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} placeholder={hint.numberHint} />
      </Field>
      <p style={{ fontSize: 12, color: TEXT.hint, marginTop: 10 }}>
        {t('sajili.step2.doc_note', 'Tutawasiliana kupitia barua pepe kupata nakala ya cheti. Hatuhitaji upload kwa sasa.')}
      </p>
    </div>
  )
}

function StepReachAndFee({
  form, setForm, t, toggle, toggleMod,
}: StepProps & {
  toggle: (arr: string[], v: string) => string[]
  toggleMod: (arr: Modality[], v: Modality) => Modality[]
}) {
  return (
    <div>
      <h2 style={h2}>{t('sajili.step3.h', 'Unawafikiaje wagonjwa?')}</h2>
      <Field label={t('sajili.step3.lang', 'Lugha unazoongea (chagua zote zinazokuhusu)')}>
        <ChipRow values={LANG_OPTIONS.map((l) => ({ v: l.v, label: l.label }))} selected={form.languages} onToggle={(v) => setForm({ ...form, languages: toggle(form.languages, v) })} />
      </Field>
      <Field label={t('sajili.step3.regions', 'Mkoa(s) unaohudumia')}>
        <ChipRow values={REGIONS.map((r) => ({ v: r, label: r }))} selected={form.regions} onToggle={(v) => setForm({ ...form, regions: toggle(form.regions, v) })} />
      </Field>
      <Field label={t('sajili.step3.modality', 'Jinsi unavyotoa huduma')}>
        <ChipRow
          values={MODALITY_OPTIONS.map((m) => ({ v: m.v, label: m.sw }))}
          selected={form.modalities}
          onToggle={(v) => setForm({ ...form, modalities: toggleMod(form.modalities, v as Modality) })}
        />
      </Field>
      <Field label={t('sajili.step3.fee', 'Ada (TZS) kwa kikao cha dakika 45')}>
        <input type="number" min={0} step={1000} style={inputStyle}
          value={form.feeDefault}
          onChange={(e) => setForm({ ...form, feeDefault: Number(e.target.value) || 0 })}
          placeholder="0 = bure" />
        <p style={{ fontSize: 11, color: TEXT.hint, marginTop: 4 }}>
          {t('sajili.step3.fee_hint', 'TABHOS haichukui asilimia — wagonjwa wanakulipa moja kwa moja.')}
        </p>
      </Field>
      <Field label={t('sajili.step3.insurance', 'Bima unazoazima')}>
        <ChipRow values={INSURANCE_OPTIONS.map((i) => ({ v: i, label: i }))} selected={form.acceptsInsurance} onToggle={(v) => setForm({ ...form, acceptsInsurance: toggle(form.acceptsInsurance, v) })} />
      </Field>
      <Field label={t('sajili.step3.bio_sw', 'Wasifu mfupi (Kiswahili)')}>
        <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          value={form.bioSw}
          onChange={(e) => setForm({ ...form, bioSw: e.target.value })}
          placeholder={t('sajili.step3.bio_sw_ph', 'Mfano: Daktari wa akili nimefanya kazi MNH miaka 8. Naangazia sonona na wasiwasi.')} />
      </Field>
    </div>
  )
}

function StepReview({ form, t }: { form: Form; t: (k: string, fb: string) => string }) {
  return (
    <div>
      <h2 style={h2}>{t('sajili.step4.h', 'Hakiki + tuma')}</h2>
      <p style={{ color: TEXT.muted, fontSize: 13, marginTop: -6 }}>
        {t('sajili.step4.lede', 'Hakikisha kila kitu kiko sawa. Unaweza kurudi nyuma kubadilisha.')}
      </p>
      <dl style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 18, rowGap: 8, fontSize: 13 }}>
        <dt style={dtSt}>Jina</dt><dd style={ddSt}>{form.displayName || '—'}</dd>
        <dt style={dtSt}>Aina</dt><dd style={ddSt}>{KIND_OPTIONS.find((k) => k.v === form.kind)?.sw}</dd>
        <dt style={dtSt}>Leseni</dt><dd style={ddSt}>{form.licenseNumber || '—'} <span style={{ color: TEXT.muted }}>({form.licenseAuthority})</span></dd>
        <dt style={dtSt}>Simu</dt><dd style={ddSt}>{form.contactPhone || '—'}</dd>
        <dt style={dtSt}>Lugha</dt><dd style={ddSt}>{form.languages.join(', ')}</dd>
        <dt style={dtSt}>Mikoa</dt><dd style={ddSt}>{form.regions.join(', ')}</dd>
        <dt style={dtSt}>Modality</dt><dd style={ddSt}>{form.modalities.join(', ')}</dd>
        <dt style={dtSt}>Ada</dt><dd style={ddSt}>{form.feeDefault === 0 ? 'Bure' : `TZS ${form.feeDefault.toLocaleString()}`}</dd>
        <dt style={dtSt}>Bima</dt><dd style={ddSt}>{form.acceptsInsurance.length ? form.acceptsInsurance.join(', ') : '—'}</dd>
      </dl>
      <p style={{ marginTop: 16, fontSize: 12, color: TEXT.hint, lineHeight: 1.55 }}>
        {t('sajili.step4.legal', 'Kwa kutuma, unakubali kwamba taarifa zako ni za kweli. Tutawasiliana ndani ya siku 5 za kazi. Hadi uthibitishwe, jina lako halitokei kwa wagonjwa.')}
      </p>
    </div>
  )
}

function SuccessCard({ onHome }: { onHome: () => void }) {
  const { t } = useLang()
  return (
    <main style={{ minHeight: '100vh', background: CREAM.milk, color: NEUTRAL.ink, fontFamily: TYPE.sans, display: 'grid', placeItems: 'center' }}>
      <div style={{ maxWidth: 520, padding: '40px 28px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: BRAND.green, color: CREAM.milk, display: 'grid', placeItems: 'center', margin: '0 auto 18px', fontSize: 30, fontWeight: 800 }}>✓</div>
        <h1 style={{ margin: 0, fontFamily: TYPE.serif, fontSize: 26, color: TEXT.heading }}>
          {t('sajili.done.h', 'Maombi yako yamepokelewa')}
        </h1>
        <p style={{ marginTop: 12, color: TEXT.body, fontSize: 14, lineHeight: 1.6 }}>
          {t('sajili.done.body', 'Tutathibitisha leseni yako ndani ya siku 5 za kazi. Ukishakaguliwa, jina lako litaonekana Gundua na wagonjwa wataweza kukubook. Tutakutumia barua pepe wakati hadhi yako ya akaunti inapobadilika.')}
        </p>
        <button onClick={onHome} style={{ marginTop: 24, padding: '12px 24px', borderRadius: 999, background: BRAND.green, color: CREAM.milk, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          {t('sajili.done.home', 'Rudi nyumbani')}
        </button>
      </div>
    </main>
  )
}

function SignInGate({ onGo }: { onGo: () => void }) {
  const { t } = useLang()
  return (
    <main style={{ minHeight: '100vh', background: CREAM.milk, color: NEUTRAL.ink, fontFamily: TYPE.sans, display: 'grid', placeItems: 'center' }}>
      <div style={{ maxWidth: 460, padding: '32px 28px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontFamily: TYPE.serif, fontSize: 24, color: TEXT.heading }}>
          {t('sajili.gate.h', 'Ingia kwanza')}
        </h1>
        <p style={{ marginTop: 12, color: TEXT.body, fontSize: 14, lineHeight: 1.55 }}>
          {t('sajili.gate.body', 'Lazima uwe na akaunti ili kujisajili kama mtaalam. Rudi welcome screen, jisajili au ingia, kisha rudi hapa.')}
        </p>
        <button onClick={onGo} style={{ marginTop: 22, padding: '10px 22px', borderRadius: 999, background: BRAND.green, color: CREAM.milk, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          {t('sajili.gate.cta', 'Nenda welcome')}
        </button>
      </div>
    </main>
  )
}

// ── Atoms ───────────────────────────────────────────────────────────────────

interface ChipRowValues { v: string; label: string }
function ChipRow({ values, selected, onToggle }: { values: ChipRowValues[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {values.map((v) => {
        const active = selected.includes(v.v)
        return (
          <button key={v.v} type="button" onClick={() => onToggle(v.v)} aria-pressed={active}
            style={{
              padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
              border: `1px solid ${active ? BRAND.green : hexToRgba(NEUTRAL.ink, 0.18)}`,
              background: active ? BRAND.green : CREAM.milk,
              color: active ? CREAM.milk : NEUTRAL.ink,
              cursor: 'pointer',
            }}
          >
            {v.label}
          </button>
        )
      })}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT.muted, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: CREAM.ivory,
  borderRadius: 18,
  padding: '24px 22px',
  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
  boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', fontSize: 14,
  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
  borderRadius: 10, background: CREAM.milk, color: NEUTRAL.ink,
  fontFamily: 'inherit', outline: 'none',
}
const h2: React.CSSProperties = { fontFamily: TYPE.serif, fontSize: 20, margin: '0 0 14px', color: TEXT.heading, fontWeight: 700 }
const dtSt: React.CSSProperties = { color: TEXT.muted, fontWeight: 600 }
const ddSt: React.CSSProperties = { color: NEUTRAL.ink, margin: 0 }
function ghostBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: '10px 18px', borderRadius: 999, background: 'transparent',
    border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
    color: disabled ? TEXT.hint : NEUTRAL.ink,
    fontWeight: 600, fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }
}
function primaryBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: '10px 22px', borderRadius: 999, background: BRAND.green,
    color: CREAM.milk, border: 'none', fontWeight: 700, fontSize: 14,
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1,
  }
}
function pickerBtn(active: boolean): React.CSSProperties {
  return {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
    padding: '12px 14px', borderRadius: 12, textAlign: 'left' as const,
    border: `1px solid ${active ? BRAND.green : hexToRgba(NEUTRAL.ink, 0.15)}`,
    background: active ? hexToRgba(BRAND.green, 0.08) : CREAM.milk,
    color: NEUTRAL.ink, fontSize: 14, fontWeight: 600, cursor: 'pointer',
    transition: 'all 160ms',
  }
}
// JEWEL imported for potential future styling — kept to avoid unused-import churn
void JEWEL
