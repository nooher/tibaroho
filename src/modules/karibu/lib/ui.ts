// karibu/lib/ui.ts — shared style helpers for the wizard.

import type { CSSProperties } from 'react';
import { CREAM, JEWEL, NEUTRAL, RADII, TEXT, TYPE, hexToRgba } from '../../../lib/glass';

export const cardStyle: CSSProperties = {
  background: CREAM.milk,
  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
  borderRadius: RADII.sheet,
  padding: 22,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 0 rgba(11,9,8,0.04), 0 14px 32px rgba(11,9,8,0.06)',
};

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: RADII.chip,
  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`,
  background: CREAM.ivory,
  color: NEUTRAL.ink,
  fontSize: 15,
  fontFamily: TYPE.sans,
  fontStyle: 'normal',
};

export const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: JEWEL.tealMwenza,
  marginBottom: 6,
  letterSpacing: TYPE.tightTrack,
};

export function chipStyle(active: boolean): CSSProperties {
  return {
    padding: '8px 14px',
    borderRadius: 999,
    border: `1px solid ${active ? JEWEL.tealMwenza : hexToRgba(NEUTRAL.ink, 0.12)}`,
    background: active ? JEWEL.tealMwenza : CREAM.ivory,
    color: active ? CREAM.milk : NEUTRAL.ink,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: TYPE.sans,
    transition: 'all 160ms',
  };
}

export function primaryBtn(): CSSProperties {
  return {
    padding: '12px 22px',
    borderRadius: RADII.chip,
    background: JEWEL.tealMwenza,
    color: CREAM.milk,
    border: 'none',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: TYPE.sans,
  };
}

export function ghostBtn(): CSSProperties {
  return {
    padding: '12px 22px',
    borderRadius: RADII.chip,
    background: 'transparent',
    color: JEWEL.tealMwenza,
    border: `1px solid ${JEWEL.tealMwenza}`,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: TYPE.sans,
  };
}

export const titleStyle: CSSProperties = {
  fontFamily: TYPE.serif,
  fontSize: 28,
  letterSpacing: TYPE.tighterTrack,
  lineHeight: TYPE.headLeading,
  margin: '0 0 8px',
  color: NEUTRAL.ink,
  fontStyle: 'normal',
};

export const subStyle: CSSProperties = {
  margin: '0 0 18px',
  color: TEXT.muted,
  fontSize: 14,
  lineHeight: 1.5,
};
