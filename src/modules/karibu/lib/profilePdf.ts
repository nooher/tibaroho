// karibu/lib/profilePdf.ts — print a 1-page profile via a styled hidden div.

import type { KaribuProfile } from './storage';
import { classifyRisk } from './risk';
import { recommend } from './recommend';

export function printProfile(p: KaribuProfile): void {
  const risk = classifyRisk(p);
  const rec = recommend(p);
  const name = p.step1?.name ?? 'Rafiki';
  const region = p.step1?.region ?? '—';
  const age = p.step1?.age ?? '—';

  const html = `
<!doctype html>
<html lang="sw"><head><meta charset="utf-8"><title>Profaili — ${name}</title>
<style>
  @page { size: A4; margin: 18mm; }
  body { font-family: Georgia, serif; color: #0B0908; background: #FAF5E5; margin: 0; padding: 24px; }
  h1 { margin: 0 0 4px; font-size: 28px; letter-spacing: -0.5px; }
  h2 { margin: 18px 0 6px; font-size: 16px; border-bottom: 1px solid #1A3E44; padding-bottom: 4px; color: #1A3E44; }
  .meta { color: #1A3E44; font-size: 13px; margin-bottom: 12px; }
  .tier { display: inline-block; padding: 4px 10px; border-radius: 999px; color: #fff; font-size: 12px; font-weight: 700; }
  .tier-chini { background: #1EB53A; }
  .tier-wastani { background: #FCD116; color: #000; }
  .tier-juu { background: #B8951F; }
  .tier-dharura { background: #5E1F3E; }
  ul { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.5; }
  .source { color: #1A3E44; font-size: 11px; opacity: 0.7; margin-top: 18px; border-top: 1px solid #1A3E44; padding-top: 6px; }
  .flag { height: 4px; display: flex; margin-bottom: 16px; }
  .flag>div { flex: 1; }
  .flag-g { background: #1EB53A; } .flag-y { background: #FCD116; } .flag-k { background: #000; } .flag-b { background: #00A3DD; }
</style></head><body>
<div class="flag"><div class="flag-g"></div><div class="flag-y"></div><div class="flag-k"></div><div class="flag-y"></div><div class="flag-b"></div></div>
<h1>Profaili ya TABHOS — ${escapeHtml(name)}</h1>
<div class="meta">Umri: ${age} · Mkoa: ${escapeHtml(region)} · Tarehe: ${new Date().toLocaleDateString('sw-TZ')}</div>
<div class="tier tier-${risk.tier}">Hatari: ${risk.tier.toUpperCase()}</div>

<h2>Sababu za hatari</h2>
<ul>${risk.reasons_sw.length ? risk.reasons_sw.map((r) => `<li>${escapeHtml(r)}</li>`).join('') : '<li>Hakuna alama kubwa za hatari.</li>'}</ul>

<h2>Vipimo</h2>
<ul>
  ${p.step4 ? `
  <li>PHQ-9: ${p.step4.phq9.total} / 27</li>
  <li>GAD-7: ${p.step4.gad7.total} / 21</li>
  <li>AUDIT: ${p.step4.audit.total} / 40</li>
  <li>C-SSRS: ${p.step4.cssrs.total} / 5</li>
  ${p.step4.epds ? `<li>EPDS: ${p.step4.epds.total} / 30</li>` : ''}
  ${p.step4.crafft ? `<li>CRAFFT: ${p.step4.crafft.total} / 6</li>` : ''}
  ` : '<li>Bado havijachukuliwa.</li>'}
</ul>

<h2>Hali za kiafya</h2>
<ul>${(p.step3?.conditions ?? []).length ? (p.step3?.conditions ?? []).map((c) => `<li>${escapeHtml(c)}</li>`).join('') : '<li>Hakuna iliyotajwa.</li>'}</ul>

<h2>Trackers zilizopendekezwa</h2>
<ul>${rec.trackers.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>

<h2>Mpango wa huduma</h2>
<ul>${rec.care_plan.map((c) => `<li><strong>${escapeHtml(c.title_sw)}:</strong> ${escapeHtml(c.body_sw)}</li>`).join('')}</ul>

<div class="source">Chanzo: ${escapeHtml(risk.source)} · TABHOS — Laetoli (T) Ltd · Si utambuzi wa kimatibabu.</div>
</body></html>`;

  const w = window.open('', '_blank', 'width=720,height=900');
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
  setTimeout(() => { try { w.focus(); w.print(); } catch { /* noop */ } }, 250);
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch] ?? ch));
}
