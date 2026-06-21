// experts/faithInformed.ts — opt-in faith-informed support. Respects user choice.

import type { FaithPreference, RafikiAnswer, RafikiExpert, RafikiQuery } from '../types';

const RX = /(mungu|allah|imani|sala|dua|dini|faith|prayer|god|religion|christian|muslim|kanisa|msikiti|mzee wa imani)/i;

const CHRISTIAN_SW =
  'Katika imani ya Kikristo: "Njoo kwangu wewe uliyechoka — nitakupumzisha" (Mt 11:28). ' +
  'Sala inaweza kuwa nafasi ya kupumzika hisia zako mbele za Mungu. ' +
  'Kanisa pia linaweza kuwa familia ya msaada — usione aibu kuomba msaada.';

const CHRISTIAN_EN =
  'In Christian faith: "Come to me, all you who are weary, and I will give you rest" (Matt 11:28). ' +
  'Prayer can be a place to lay down feelings before God. ' +
  'The church can also be a support family — do not be ashamed to ask for help.';

const MUSLIM_SW =
  'Katika imani ya Kiislamu: "Hakika baada ya dhiki kuna faraja" (Qur\'an 94:6). ' +
  'Dua na sala tano zinaweza kuwa nguzo ya utulivu. ' +
  'Mtume Muhammad (S.A.W) alisema: "Funga mguu wa ngamia wako kisha mtegemee Allah" — ' +
  'tafuta msaada wa kibinadamu pia, sio dua peke yake.';

const MUSLIM_EN =
  'In Islamic faith: "Indeed, with hardship comes ease" (Qur\'an 94:6). ' +
  'Du\'a and the five prayers can be pillars of calm. ' +
  'The Prophet (PBUH) said: "Tie your camel, then trust in Allah" — ' +
  'seek human help too, not du\'a alone.';

const TRADITIONAL_SW =
  'Katika mila zetu, ukoo na wahenga ni sehemu ya afya. ' +
  'Kuzungumza na wazee, kushiriki sherehe, na kuheshimu mizizi yako vinaweza kuponya. ' +
  'Tunaheshimu mila — pia tunaheshimu sayansi ya afya ya akili. Zinaweza kwenda pamoja.';

const TRADITIONAL_EN =
  'In our traditions, lineage and elders are part of health. ' +
  'Talking to elders, participating in ceremonies, honoring your roots can heal. ' +
  'We respect tradition — and we respect mental-health science. They can go together.';

const MULTI_SW =
  'Heshima kwa imani zote. Tunaweza kuchanganya: sala/dua, jamii, na sayansi ya afya ya akili. ' +
  'Niambie ni mtazamo gani unaokufaa zaidi sasa hivi.';

const MULTI_EN =
  'Respect to all faiths. We can combine: prayer, community, and mental-health science. ' +
  'Tell me which perspective suits you most right now.';

export const faithInformedExpert: RafikiExpert = {
  id: 'roho-faith',
  domain: 'faithInformed',
  label: 'Imani',
  match(q) {
    // Opt-in: only fire when user explicitly mentions faith or sets a preference (not 'none').
    if (q.faith && q.faith !== 'none' && RX.test(q.text)) return 0.85;
    if (q.faith && q.faith !== 'none') return 0.4;
    if (RX.test(q.text)) return 0.5;
    return 0;
  },
  answer(q): RafikiAnswer {
    const pref: FaithPreference = q.faith ?? 'multi';
    let sw: string;
    let en: string;
    switch (pref) {
      case 'christian':
        sw = CHRISTIAN_SW; en = CHRISTIAN_EN; break;
      case 'muslim':
        sw = MUSLIM_SW; en = MUSLIM_EN; break;
      case 'traditional':
        sw = TRADITIONAL_SW; en = TRADITIONAL_EN; break;
      case 'none':
        sw = 'Umeniambia hutaki mtazamo wa kidini — naheshimu hivyo. Tukae kwenye stadi za kawaida.';
        en = 'You told me you do not want a religious lens — I respect that. Let us stay with standard skills.';
        break;
      case 'multi':
      default:
        sw = MULTI_SW; en = MULTI_EN;
    }
    return {
      domain: 'faithInformed',
      expert: 'roho-faith',
      mode: q.mode ?? 'mwenza',
      confidence: 'high',
      text: { sw, en },
      sources: [{ label: 'Faith-Informed MH — Pargament' }, { label: 'WHO Spiritual Care' }],
      followUps: ['Niunganishe na mzee wa imani', 'Rudi kwenye stadi za kawaida'],
    };
  },
};
