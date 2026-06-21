// trackers/index.tsx — central tracker catalog + entry/views router.

import { useMemo, useState, type ReactNode } from 'react';
import { CREAM, JEWEL, NEUTRAL, RADII, TYPE, TEXT, hexToRgba } from '../../../lib/glass';
import { activeTrackers, setActiveTrackers, type TrackerId } from './types';
import DawaEntry from './dawa/Entry'; import DawaViews from './dawa/Views';
import DialysisEntry from './dialysis/Entry'; import DialysisViews from './dialysis/Views';
import HivEntry from './hiv/Entry'; import HivViews from './hiv/Views';
import SukariEntry from './sukari/Entry'; import SukariViews from './sukari/Views';
import ShinikizoEntry from './shinikizo/Entry'; import ShinikizoViews from './shinikizo/Views';
import SarataniEntry from './saratani/Entry'; import SarataniViews from './saratani/Views';
import MoodEntry from './mood/Entry'; import MoodViews from './mood/Views';
import PumziEntry from './pumzi/Entry'; import PumziViews from './pumzi/Views';
import MaumivuEntry from './maumivu/Entry'; import MaumivuViews from './maumivu/Views';
import TamaaEntry from './tamaa/Entry'; import TamaaViews from './tamaa/Views';
import MimbaEntry from './mimba/Entry'; import MimbaViews from './mimba/Views';
import MtotoEntry from './mtoto/Entry'; import MtotoViews from './mtoto/Views';
import BidiiEntry from './bidii/Entry'; import BidiiViews from './bidii/Views';

interface Spec {
  id: TrackerId; name_sw: string; for_sw: string;
  Entry: () => ReactNode; Views: () => ReactNode; source: string;
}

const TRACKERS: Spec[] = [
  { id: 'mood', name_sw: 'Hisia', for_sw: 'Kila mtu — chaguo la msingi', Entry: MoodEntry, Views: MoodViews, source: 'PHQ-9 daily proxy' },
  { id: 'dawa', name_sw: 'Dawa', for_sw: 'Watu wanaotumia dawa', Entry: DawaEntry, Views: DawaViews, source: 'TMDA' },
  { id: 'shinikizo', name_sw: 'Shinikizo', for_sw: 'Shinikizo la juu', Entry: ShinikizoEntry, Views: ShinikizoViews, source: 'NICE NG136' },
  { id: 'sukari', name_sw: 'Sukari', for_sw: 'Kisukari', Entry: SukariEntry, Views: SukariViews, source: 'WHO PEN' },
  { id: 'hiv', name_sw: 'VVU', for_sw: 'Watu wenye VVU', Entry: HivEntry, Views: HivViews, source: 'NACP Tanzania' },
  { id: 'dialysis', name_sw: 'Dialysis', for_sw: 'Watu walio kwenye dialysis', Entry: DialysisEntry, Views: DialysisViews, source: 'KDIGO 2018' },
  { id: 'saratani', name_sw: 'Saratani', for_sw: 'Watu wenye saratani', Entry: SarataniEntry, Views: SarataniViews, source: 'WHO Cancer' },
  { id: 'pumzi', name_sw: 'Pumzi', for_sw: 'Wasiwasi / pumu', Entry: PumziEntry, Views: PumziViews, source: 'WHO mhGAP + GINA' },
  { id: 'maumivu', name_sw: 'Maumivu', for_sw: 'Maumivu sugu', Entry: MaumivuEntry, Views: MaumivuViews, source: 'WHO Pain Ladder' },
  { id: 'tamaa', name_sw: 'Tamaa', for_sw: 'Mapambano ya vileo', Entry: TamaaEntry, Views: TamaaViews, source: 'Miller & Rollnick MI' },
  { id: 'mimba', name_sw: 'Mimba', for_sw: 'Mama mjamzito', Entry: MimbaEntry, Views: MimbaViews, source: 'WHO ANC 2016' },
  { id: 'mtoto', name_sw: 'Mtoto', for_sw: 'Walezi wa watoto', Entry: MtotoEntry, Views: MtotoViews, source: 'EPI Tanzania' },
  { id: 'bidii', name_sw: 'Bidii', for_sw: 'Bidii ya mwili', Entry: BidiiEntry, Views: BidiiViews, source: 'WHO PA Guidelines' },
];

export default function TrackersIndex() {
  const [active, setActive] = useState<TrackerId[]>(() => activeTrackers());
  const [mode, setMode] = useState<'catalog' | 'today'>('today');

  const activeSpecs = useMemo(() => TRACKERS.filter((t) => active.includes(t.id)), [active]);

  const toggle = (id: TrackerId): void => {
    const next = active.includes(id) ? active.filter((x) => x !== id) : [...active, id];
    setActive(next);
    setActiveTrackers(next);
  };

  return (
    <main style={{
      minHeight: '100vh', background: CREAM.milk, color: NEUTRAL.ink,
      fontFamily: TYPE.sans, paddingBottom: 80,
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h1 style={{ fontFamily: TYPE.serif, fontSize: 32, letterSpacing: TYPE.tighterTrack, margin: 0 }}>Vifuatiliaji</h1>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => setMode('today')} style={tabBtn(mode === 'today')}>Leo</button>
            <button type="button" onClick={() => setMode('catalog')} style={tabBtn(mode === 'catalog')}>Katalogi</button>
          </div>
        </header>

        {mode === 'today' && (
          <>
            {activeSpecs.length === 0 ? (
              <div style={{ ...glassCard, textAlign: 'center' }}>
                <p style={{ margin: 0 }}>Hakuna kifuatiliaji kilichowashwa. Fungua katalogi kuongeza.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                {activeSpecs.map((s) => (
                  <div key={s.id}>
                    <s.Entry />
                    <s.Views />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {mode === 'catalog' && (
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {TRACKERS.map((t) => {
              const on = active.includes(t.id);
              return (
                <button key={t.id} type="button" onClick={() => toggle(t.id)} aria-pressed={on} style={{
                  textAlign: 'left', padding: 14, borderRadius: RADII.card, cursor: 'pointer',
                  background: on ? JEWEL.tealMwenza : CREAM.milk,
                  color: on ? CREAM.milk : NEUTRAL.ink,
                  border: `1px solid ${on ? JEWEL.tealMwenza : hexToRgba(NEUTRAL.ink, 0.1)}`,
                }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{t.name_sw}</div>
                  <div style={{ fontSize: 12, color: on ? CREAM.milk : TEXT.muted, marginTop: 2 }}>Kwa: {t.for_sw}</div>
                  <div style={{ fontSize: 10, color: on ? CREAM.milk : TEXT.muted, marginTop: 6 }}>Chanzo: {t.source}</div>
                  <div style={{ fontSize: 11, marginTop: 8, fontWeight: 600 }}>{on ? '✓ imewashwa' : '+ Washa'}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

const glassCard = {
  background: CREAM.milk, borderRadius: RADII.sheet, padding: 22,
  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
};

function tabBtn(active: boolean) {
  return {
    padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
    border: `1px solid ${JEWEL.tealMwenza}`,
    background: active ? JEWEL.tealMwenza : 'transparent',
    color: active ? CREAM.milk : JEWEL.tealMwenza,
    cursor: 'pointer',
  };
}
