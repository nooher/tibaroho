#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# Run a Lighthouse audit against the public TABHOS deploy (or a custom URL)
# and save the HTML + JSON reports under reports/.
#
# Usage:
#   bash scripts/lighthouse.sh                            # default https://laetoli.tz/tabhos
#   bash scripts/lighthouse.sh https://tibaroho.vercel.app/mimi
#   LIGHTHOUSE_PRESET=desktop bash scripts/lighthouse.sh  # desktop instead of mobile
# ----------------------------------------------------------------------------
set -euo pipefail

URL="${1:-https://tibaroho.vercel.app}"
PRESET="${LIGHTHOUSE_PRESET:-mobile}"
TS="$(printf '%(%Y%m%d-%H%M%S)T\n' -1)"
OUT_DIR="reports/lighthouse"
SLUG="$(echo "$URL" | sed -E 's|https?://||; s|[^A-Za-z0-9]+|_|g')"
PREFIX="${OUT_DIR}/${TS}_${PRESET}_${SLUG}"

mkdir -p "$OUT_DIR"

if ! command -v lighthouse >/dev/null 2>&1; then
  echo "Installing lighthouse via npx…"
  npx --yes -p lighthouse lighthouse --version
fi

echo "Auditing $URL ($PRESET)…"
npx --yes -p lighthouse lighthouse "$URL" \
  --preset="$PRESET" \
  --output=html --output=json \
  --output-path="$PREFIX" \
  --quiet --chrome-flags="--headless=new --no-sandbox --disable-gpu"

JSON="$PREFIX.report.json"
if [ -f "$JSON" ]; then
  # Extract the four headline scores using node so we don't depend on jq.
  node -e "
    const r = require('fs').readFileSync('$JSON', 'utf8');
    const j = JSON.parse(r);
    const c = j.categories;
    const fmt = v => v === null || v === undefined ? 'n/a' : Math.round(v*100);
    console.log('');
    console.log('Performance     ', fmt(c.performance.score));
    console.log('Accessibility   ', fmt(c.accessibility.score));
    console.log('Best Practices  ', fmt(c['best-practices'].score));
    console.log('SEO             ', fmt(c.seo.score));
    if (c.pwa) console.log('PWA             ', fmt(c.pwa.score));
    console.log('');
    console.log('Full HTML: $PREFIX.report.html');
  "
fi
