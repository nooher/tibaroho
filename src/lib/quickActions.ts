/**
 * Quick-actions registry — "from anywhere, do X in 1-2 clicks".
 *
 * Wired into TopNav as a small "+" button (visible peer to the keyboard
 * Cmd-K command palette). Each action carries a Swahili-first label and
 * a route the app should navigate to.
 */

export interface QuickAction {
  id: string
  label_sw: string
  label_en: string
  /** Glyph / icon character. Kept simple to avoid extra deps. */
  glyph: string
  /** Where to go. Internal route (react-router). */
  to: string
  /** Optional grouping label — shown as a small section header. */
  group_sw: string
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'phq9',
    label_sw: 'Chukua PHQ-9',
    label_en: 'Take PHQ-9',
    glyph: '✓',
    to: '/mimi/vipimo/phq9',
    group_sw: 'Vipimo',
  },
  {
    id: 'gad7',
    label_sw: 'Chukua GAD-7',
    label_en: 'Take GAD-7',
    glyph: '✓',
    to: '/mimi/vipimo/gad7',
    group_sw: 'Vipimo',
  },
  {
    id: 'mood',
    label_sw: 'Andika hisia',
    label_en: 'Log mood',
    glyph: '◐',
    to: '/mimi',
    group_sw: 'Mimi',
  },
  {
    id: 'journal',
    label_sw: 'Fungua shajara',
    label_en: 'Open journal',
    glyph: '✎',
    to: '/mimi/shajara',
    group_sw: 'Mimi',
  },
  {
    id: 'pumzi',
    label_sw: 'Anza Pumzi',
    label_en: 'Start breathing',
    glyph: '◯',
    to: '/pumzi',
    group_sw: 'Hatua',
  },
  {
    id: 'rafiki',
    label_sw: 'Zungumza na Rafiki',
    label_en: 'Open Rafiki chat',
    glyph: '✦',
    to: '/rafiki',
    group_sw: 'Hatua',
  },
  {
    id: 'book',
    label_sw: 'Weka miadi',
    label_en: 'Book appointment',
    glyph: '⌖',
    to: '/mimi/ratiba/weka',
    group_sw: 'Huduma',
  },
  {
    id: 'crisis',
    label_sw: 'Dharura — msaada',
    label_en: 'Crisis support',
    glyph: '!',
    to: '/mimi/dharura',
    group_sw: 'Dharura',
  },
  {
    id: 'gundua',
    label_sw: 'Tafuta mtaalam',
    label_en: 'Find a clinician',
    glyph: '⌕',
    to: '/gundua',
    group_sw: 'Huduma',
  },
  {
    id: 'huduma',
    label_sw: 'Katalogi ya huduma',
    label_en: 'Service catalogue',
    glyph: '☰',
    to: '/huduma',
    group_sw: 'Huduma',
  },
]

export function listQuickActions(): QuickAction[] {
  return QUICK_ACTIONS
}
