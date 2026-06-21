/**
 * Tanzanian health insurance / community schemes accepted by mental-health
 * providers in TBHOS. Names + brief notes (Swahili first, English second).
 */

export type InsuranceId =
  | 'nhif'
  | 'aar'
  | 'jubilee'
  | 'resolution'
  | 'strategis'
  | 'britam'
  | 'cash'

export interface Insurance {
  id: InsuranceId
  name: string
  noteSw: string
  noteEn: string
  /** Hex color for chip accent — drawn from jewel palette. */
  accent: string
}

export const INSURANCES: Insurance[] = [
  {
    id: 'nhif',
    name: 'NHIF',
    noteSw: 'Bima ya Taifa ya Afya — wanachama wa serikali na sekta isiyo rasmi.',
    noteEn: 'National Health Insurance Fund — public and informal-sector members.',
    accent: '#1A3E44',
  },
  {
    id: 'aar',
    name: 'AAR',
    noteSw: 'Bima ya AAR — vifurushi vya kibinafsi na vya makampuni.',
    noteEn: 'AAR Insurance — individual and corporate cover.',
    accent: '#1F3A6E',
  },
  {
    id: 'jubilee',
    name: 'Jubilee',
    noteSw: 'Jubilee Health — vifurushi vya afya ya akili kupitia ufadhili wa makampuni.',
    noteEn: 'Jubilee Health — mental-health benefits via corporate cover.',
    accent: '#5E1F3E',
  },
  {
    id: 'resolution',
    name: 'Resolution',
    noteSw: 'Resolution Insurance — vifurushi vya familia na watu binafsi.',
    noteEn: 'Resolution Insurance — family and individual cover.',
    accent: '#B8951F',
  },
  {
    id: 'strategis',
    name: 'Strategis',
    noteSw: 'Strategis Insurance — afya ya akili kwa wafanyakazi wa makampuni.',
    noteEn: 'Strategis Insurance — corporate employee mental health.',
    accent: '#0F2A2E',
  },
  {
    id: 'britam',
    name: 'Britam',
    noteSw: 'Britam Health — bima ya afya kwa watu binafsi na vikundi.',
    noteEn: 'Britam Health — individual and group health cover.',
    accent: '#1A3E44',
  },
  {
    id: 'cash',
    name: 'Pesa Taslimu',
    noteSw: 'Malipo ya moja kwa moja — pesa taslimu au M-Pesa.',
    noteEn: 'Direct pay — cash or M-Pesa.',
    accent: '#B8951F',
  },
]

export function findInsurance(id: InsuranceId): Insurance | undefined {
  return INSURANCES.find((i) => i.id === id)
}
