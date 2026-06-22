// route_awareness.ts — Mwenza is aware of which screen the user is on
// and offers route-specific help.

import { useLocation } from 'react-router-dom';

export interface RoutePreference {
  route: RegExp;
  suggest_sw: string;
  suggest_en: string;
  offers: string[];
}

export const ROUTE_PREFERENCES: RoutePreference[] = [
  {
    route: /^\/mimi\/screen/,
    suggest_sw: 'Tunaweza kupita pamoja katika PHQ-9 au GAD-7 polepole.',
    suggest_en: 'We can walk through PHQ-9 or GAD-7 together gently.',
    offers: ['Anza PHQ-9', 'Anza GAD-7', 'Eleza alama zangu'],
  },
  {
    route: /^\/pumzi/,
    suggest_sw: 'Nikuongoze kupitia mafunzo ya pumzi sasa hivi?',
    suggest_en: 'Shall I coach you through a breathing session right now?',
    offers: ['Pumzi 4-7-8', 'Mlinganisho 5-5', 'Sanduku 4-4-4-4'],
  },
  {
    route: /^\/mimi\/journal/,
    suggest_sw: 'Tunaweza kuandika hisia zako za leo. Niambie unayohisi.',
    suggest_en: 'We can capture how you feel today. Tell me.',
    offers: ['Andika hisia', 'Tia alama ya hisia', 'Ongeza shukrani'],
  },
  {
    route: /^\/miradi/,
    suggest_sw: 'Naweza kukueleza programu — PM+, CETA, IPT, t-CBT — ipi inakufaa.',
    suggest_en: 'I can explain programs — PM+, CETA, IPT, t-CBT — and which fits.',
    offers: ['PM+ ni nini?', 'CETA ni nini?', 'Friendship Bench'],
  },
  {
    route: /^\/maalum/,
    suggest_sw: 'Kwa hali maalum, naweza kukutuma kwa rasilimali sahihi.',
    suggest_en: 'For special situations, I can route you to the right resources.',
    offers: ['Perinatal', 'HIV', 'Saratani', 'Wakimbizi'],
  },
  {
    route: /^\/wataalam/,
    suggest_sw: 'Naweza kukusaidia kupata mtaalam karibu nawe.',
    suggest_en: 'I can help you find a clinician nearby.',
    offers: ['Madaktari karibu', 'Washauri', 'Mhudumu wa imani'],
  },
  {
    route: /^\/$/,
    suggest_sw: 'Karibu TABHOS. Niambie ungependa kuanzia wapi.',
    suggest_en: 'Welcome to TABHOS. Tell me where you would like to start.',
    offers: ['Najisikia vibaya', 'Nipime', 'Nifundishe kupumua'],
  },
];

export function findPreferenceForPath(pathname: string): RoutePreference | null {
  for (const p of ROUTE_PREFERENCES) {
    if (p.route.test(pathname)) return p;
  }
  return null;
}

export function useCurrentRoute(): {
  pathname: string;
  preference: RoutePreference | null;
} {
  const location = useLocation();
  return {
    pathname: location.pathname,
    preference: findPreferenceForPath(location.pathname),
  };
}
