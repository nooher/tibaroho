// trackers/common.tsx — shared entry-form chrome and small UI primitives.

import { useState, type CSSProperties, type ReactNode } from 'react';
import { CREAM, JEWEL, NEUTRAL, RADII, TYPE, hexToRgba } from '../../../lib/glass';
import { newId, saveReading, type Reading, type TrackerId } from './types';

const inputBase: CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: RADII.chip,
  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`, background: CREAM.ivory,
  color: NEUTRAL.ink, fontSize: 15, fontFamily: TYPE.sans, fontStyle: 'normal',
};

export function NumberField({ label, value, onChange, step = 1, unit }: {
  label: string; value: number; onChange: (v: number) => void; step?: number; unit?: string;
}) {
  return (
    <label style={{ display: 'block', marginBottom: 10 }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: JEWEL.tealMwenza, marginBottom: 6 }}>
        {label}{unit ? ` (${unit})` : ''}
      </span>
      <input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} style={inputBase} />
    </label>
  );
}

export function TextField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <label style={{ display: 'block', marginBottom: 10 }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: JEWEL.tealMwenza, marginBottom: 6 }}>
        {label}
      </span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputBase} />
    </label>
  );
}

export function TextArea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <label style={{ display: 'block', marginBottom: 10 }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: JEWEL.tealMwenza, marginBottom: 6 }}>
        {label}
      </span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
        style={{ ...inputBase, resize: 'vertical', fontFamily: TYPE.sans }} />
    </label>
  );
}

export function Chips<V extends string>({ label, options, value, onChange, multi = false }: {
  label: string; options: { v: V; label: string }[]; value: V[] | V; onChange: (v: V[] | V) => void; multi?: boolean;
}) {
  const arr: V[] = Array.isArray(value) ? value : [value];
  const toggle = (v: V): void => {
    if (!multi) { onChange(v); return; }
    onChange(arr.includes(v) ? arr.filter((x) => x !== v) as V[] : [...arr, v]);
  };
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: JEWEL.tealMwenza, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map((o) => {
          const active = arr.includes(o.v);
          return (
            <button key={o.v} type="button" onClick={() => toggle(o.v)} aria-pressed={active}
              style={{
                padding: '6px 12px', borderRadius: 999, fontSize: 13, cursor: 'pointer',
                border: `1px solid ${active ? JEWEL.tealMwenza : hexToRgba(NEUTRAL.ink, 0.12)}`,
                background: active ? JEWEL.tealMwenza : CREAM.ivory,
                color: active ? CREAM.milk : NEUTRAL.ink,
              }}>{o.label}</button>
          );
        })}
      </div>
    </div>
  );
}

export function VoiceButton({ onTranscript: _ot }: { onTranscript?: (text: string) => void }) {
  // TODO wire to src/lib/rafiki/voice.ts when available
  const [armed, setArmed] = useState(false);
  return (
    <button type="button" onClick={() => setArmed((v) => !v)}
      aria-label={armed ? 'Sitisha sauti' : 'Anza sauti'}
      style={{
        padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
        border: `1px solid ${JEWEL.indigoWisdom}`,
        background: armed ? JEWEL.indigoWisdom : 'transparent',
        color: armed ? CREAM.milk : JEWEL.indigoWisdom, cursor: 'pointer', marginBottom: 10,
      }}>
      {armed ? 'Sitisha 🎙' : 'Ongea kwa sauti 🎙'}
    </button>
  );
}

export function SaveBar({ onSave, disabled }: { onSave: () => void; disabled?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
      <button type="button" onClick={onSave} disabled={disabled} style={{
        padding: '10px 22px', borderRadius: 999, background: JEWEL.tealMwenza, color: CREAM.milk,
        border: 'none', fontSize: 14, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}>Hifadhi</button>
    </div>
  );
}

export function Card({ children, jewel = JEWEL.tealMwenza }: { children: ReactNode; jewel?: string }) {
  return (
    <div style={{
      background: CREAM.milk, border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
      borderRadius: RADII.sheet, padding: 18, marginBottom: 14,
      borderLeft: `3px solid ${jewel}`,
      boxShadow: '0 1px 0 rgba(11,9,8,0.04), 0 8px 22px rgba(11,9,8,0.04)',
    }}>{children}</div>
  );
}

export function useReading<R extends Reading>(id: TrackerId): (r: Omit<R, 'id' | 'ts'>) => void {
  return (partial) => {
    const reading = { ...partial, id: newId(), ts: new Date().toISOString() } as unknown as R;
    saveReading<R>(id, reading);
  };
}
