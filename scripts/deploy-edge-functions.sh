#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# TABHOS — deploy every Supabase edge function in one command.
#
# Run from repo root: `bash scripts/deploy-edge-functions.sh`
# Assumes `supabase link --project-ref ihjkgvhstzgaxddptaot` has already
# been run and `supabase login` is current.
# ----------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v supabase >/dev/null 2>&1; then
  echo "supabase CLI not found — run: npm install -g supabase" >&2
  exit 1
fi

FUNCTIONS=(
  telehealth-token
  sms-send
  phq9-score
  notify-provider-decision
  mpesa-b2c-payout
)

echo "Deploying ${#FUNCTIONS[@]} edge functions to project tibaroho…"
for fn in "${FUNCTIONS[@]}"; do
  if [ ! -d "supabase/functions/$fn" ]; then
    echo "  ⚠  skip $fn — directory not found"
    continue
  fi
  echo "  → $fn"
  supabase functions deploy "$fn" --no-verify-jwt
done

echo ""
echo "Listing functions:"
supabase functions list

cat <<'EOF'

────────────────────────────────────────────────────────────────────────
Secrets you still need to set (Dashboard → Edge Functions → Secrets, or:
  supabase secrets set KEY=value):

  Resend (provider verification email):
    TABHOS_RESEND_API_KEY     re_…
    TABHOS_FROM_EMAIL         'TABHOS <noreply@laetoli.tz>'

  Jitsi (telehealth):
    TUMAINI_JITSI_SECRET      <JWT_APP_SECRET>
    TUMAINI_JITSI_DOMAIN      telehealth.laetoli.tz
    TUMAINI_JITSI_APP_ID      tabhos

  M-Pesa B2C (provider payouts):
    TABHOS_MPESA_BASE_URL     https://apigw.selcommobile.com
    TABHOS_MPESA_API_KEY      <selcom api key>
    TABHOS_MPESA_API_SECRET   <selcom api secret>
    TABHOS_MPESA_SHORTCODE    <paybill>
    TABHOS_MPESA_RAIL         selcom

  SMS aggregator (Beem default; sms-send checks env at runtime):
    TABHOS_SMS_API_KEY        <beem api key>
    TABHOS_SMS_SECRET         <beem secret>
    TABHOS_SMS_SENDER         TABHOS

After setting secrets, verify with:
  supabase secrets list
────────────────────────────────────────────────────────────────────────
EOF
