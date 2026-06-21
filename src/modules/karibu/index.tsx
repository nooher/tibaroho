// karibu/index.tsx — Karibu onboarding wizard shell.

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { CREAM, JEWEL, NEUTRAL, RADII, TEXT, TYPE, TZ_FLAG, hexToRgba } from '../../lib/glass';
import { loadProfile, saveProfile, markCompleteAsync, type KaribuProfile } from './lib/storage';
import Step1Watajulianaye from './screens/Step1Watajulianaye';
import Step2Sababu from './screens/Step2Sababu';
import Step3Hali from './screens/Step3Hali';
import Step4Vipimo from './screens/Step4Vipimo';
import Step5Maisha from './screens/Step5Maisha';
import Step6Mapendeleo from './screens/Step6Mapendeleo';
import Step7Malengo from './screens/Step7Malengo';
import Done from './screens/Done';

const TOTAL = 8;

export default function Karibu() {
  const nav = useNavigate();
  const [profile, setProfile] = useState<KaribuProfile>(() => loadProfile());
  const [step, setStep] = useState<number>(1);
  const [voice, setVoice] = useState<boolean>(false);
  const [confirmSkip, setConfirmSkip] = useState<boolean>(false);

  useEffect(() => { saveProfile(profile); }, [profile]);

  const next = (): void => setStep((s) => Math.min(TOTAL, s + 1));
  const back = (): void => setStep((s) => Math.max(1, s - 1));

  const update = (patch: Partial<KaribuProfile>): void => {
    setProfile((p) => ({ ...p, ...patch }));
  };

  const finish = (): void => {
    // Persist to Supabase (consents + lang/region/faith) in the background;
    // the wizard already marks complete locally so the navigation is instant.
    void markCompleteAsync(profile);
    nav('/mimi', { replace: true });
  };

  const dots = useMemo(() => {
    const arr: CSSProperties[] = [];
    for (let i = 1; i <= TOTAL; i++) {
      arr.push({
        width: i === step ? 28 : 8,
        height: 8,
        borderRadius: 999,
        background: i <= step ? JEWEL.tealMwenza : hexToRgba(NEUTRAL.ink, 0.18),
        transition: 'all 220ms',
      });
    }
    return arr;
  }, [step]);

  return (
    <main style={{
      minHeight: '100vh', background: CREAM.milk, color: NEUTRAL.ink,
      fontFamily: TYPE.sans, paddingBottom: 80,
    }}>
      <FlagRibbon />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 20px 0' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontFamily: TYPE.serif, fontSize: 22, letterSpacing: TYPE.tightTrack, color: JEWEL.tealMwenza }}>
            Karibu — Tumaini
          </div>
          <button
            type="button"
            aria-label={voice ? 'Zima sauti' : 'Washa sauti'}
            onClick={() => setVoice((v) => !v)}
            style={{
              padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
              border: `1px solid ${JEWEL.tealMwenza}`, background: voice ? JEWEL.tealMwenza : 'transparent',
              color: voice ? CREAM.milk : JEWEL.tealMwenza, cursor: 'pointer',
            }}
          >
            {voice ? 'Sauti: imewashwa' : 'Sauti: imezimwa'}
          </button>
        </header>

        <div role="progressbar" aria-label={`Hatua ${step} kati ya ${TOTAL}`}
          style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 22 }}>
          {dots.map((s, i) => <div key={i} style={s} />)}
          <span style={{ fontSize: 12, marginLeft: 8, color: TEXT.muted }}>Hatua {step} / {TOTAL}</span>
        </div>

        {step === 1 && <Step1Watajulianaye profile={profile} update={update} next={next} />}
        {step === 2 && <Step2Sababu profile={profile} update={update} next={next} back={back} />}
        {step === 3 && <Step3Hali profile={profile} update={update} next={next} back={back} />}
        {step === 4 && <Step4Vipimo profile={profile} update={update} next={next} back={back} />}
        {step === 5 && <Step5Maisha profile={profile} update={update} next={next} back={back} />}
        {step === 6 && <Step6Mapendeleo profile={profile} update={update} next={next} back={back} />}
        {step === 7 && <Step7Malengo profile={profile} update={update} next={next} back={back} />}
        {step === 8 && <Done profile={profile} finish={finish} />}

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          {!confirmSkip ? (
            <button
              type="button"
              onClick={() => setConfirmSkip(true)}
              style={{ background: 'none', border: 'none', color: TEXT.hint, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Ruka utangulizi
            </button>
          ) : (
            <div style={{
              background: CREAM.cream, borderRadius: RADII.card, padding: 14,
              border: `1px solid ${JEWEL.goldHope}`, fontSize: 13,
            }}>
              <p style={{ margin: '0 0 8px' }}>
                Ukiruka, Mwenza atakukaribia kwa ujumla zaidi — utapoteza mapendekezo yaliyobinafsishwa.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button type="button" onClick={() => setConfirmSkip(false)} style={ghost()}>Rudi</button>
                <button type="button" onClick={finish} style={prim()}>Ndio, ruka</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function FlagRibbon() {
  return (
    <div aria-hidden style={{ display: 'flex', height: 3 }}>
      <div style={{ flex: 1, background: TZ_FLAG.green }} />
      <div style={{ flex: 1, background: TZ_FLAG.yellow }} />
      <div style={{ flex: 1, background: TZ_FLAG.black }} />
      <div style={{ flex: 1, background: TZ_FLAG.yellow }} />
      <div style={{ flex: 1, background: TZ_FLAG.blue }} />
    </div>
  );
}

function prim(): CSSProperties {
  return { padding: '8px 16px', borderRadius: 999, background: JEWEL.tealMwenza, color: CREAM.milk, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
}
function ghost(): CSSProperties {
  return { padding: '8px 16px', borderRadius: 999, background: 'transparent', color: JEWEL.tealMwenza, border: `1px solid ${JEWEL.tealMwenza}`, fontSize: 13, fontWeight: 600, cursor: 'pointer' };
}
