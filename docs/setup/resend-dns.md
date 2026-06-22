# Resend domain verification for `laetoli.tz` on Kilihost

Resend will not deliver mail from `noreply@laetoli.tz` until the domain
ownership and SPF/DKIM signature records are published in DNS. Kilihost
is the registrar for `laetoli.tz`, so the records go in their DNS console.

## 1 — Add the domain in Resend

1. Open [resend.com](https://resend.com) → **Domains** → **Add Domain**
2. Enter `laetoli.tz`
3. Region: **EU (Ireland)** is the closest to TZ; pick **US** only if you
   already have a Resend account in that region.
4. Resend now shows you 4 DNS records to add.

## 2 — Open Kilihost DNS

1. [kilihost.com/billing](https://kilihost.com/billing) → log in
2. **Domains** → **My Domains** → find `laetoli.tz` → **Manage**
3. Click **DNS Management** (sometimes labelled "Manage DNS" or "Nameserver
   Management" — pick the one that lists individual A/MX/TXT records, not
   just nameservers).

> If Kilihost shows you nameservers pointing somewhere other than them
> (e.g. `ns1.kilihost.com`), DNS for `laetoli.tz` lives at that provider —
> add the records there instead.

## 3 — Add Resend's four records

Resend will show you the exact values; the **types and hostnames** look
like this (the value strings are placeholders — copy the real ones from
Resend):

| Type  | Host / Name                              | Value (example)                                  | TTL  |
|-------|------------------------------------------|---------------------------------------------------|------|
| TXT   | `send.laetoli.tz`                        | `v=spf1 include:amazonses.com ~all`               | 1800 |
| MX    | `send.laetoli.tz` (priority 10)          | `feedback-smtp.eu-west-1.amazonses.com`           | 1800 |
| TXT   | `resend._domainkey.laetoli.tz`           | `p=MIGfMA0GCSqGSIb3DQEBAQUA…` (DKIM public key)   | 1800 |
| TXT   | `_dmarc.laetoli.tz` (optional, recommended) | `v=DMARC1; p=none; rua=mailto:dmarc@laetoli.tz` | 1800 |

> On Kilihost the **Host/Name** field is sometimes relative (just `send`
> instead of `send.laetoli.tz`) and sometimes absolute. If you see existing
> records like `mail` or `www`, follow the same convention as them.

Save each record.

## 4 — Tell Resend to verify

Back in Resend → your domain page → **Verify DNS**. Kilihost propagates
within 5–60 minutes. When each row turns green, the domain is verified.

## 5 — Generate the API key

Resend → **API Keys** → **Create API Key**
- Permission: **Sending access** (full access only if you also send via
  the dashboard)
- Domain scope: `laetoli.tz`
- Copy the key (starts with `re_…`) — Resend will not show it again.

## 6 — Wire it into TABHOS

Set the two secrets on the Supabase project (Dashboard → Edge Functions →
Secrets, or via CLI):

```bash
supabase secrets set TABHOS_RESEND_API_KEY=re_...
supabase secrets set TABHOS_FROM_EMAIL='TABHOS <noreply@laetoli.tz>'
```

Then deploy the email function (already coded — `notify-provider-decision`):

```bash
bash scripts/deploy-edge-functions.sh
# or just:
supabase functions deploy notify-provider-decision
```

## 7 — Smoke test

In the Ndani admin inbox, click **Thibitisha** on any pending provider
application. The function fires; the provider's email inbox should receive
the approval message in Swahili (or English, depending on their `lang`
preference on `tr_users`). The log in Supabase Functions → Logs will
show `status: 'sent'` with the Resend message id.

If you see `status: 'skipped', reason: 'resend_not_configured'`, the
secrets didn't make it onto the function — re-run `supabase secrets list`
to confirm.

## What does NOT need to change

- `tibaroho.vercel.app` build URL — keeps working as the build artifact
- Vercel project name — stays `tibaroho`
- GitHub repo — stays `nooher/tibaroho`
- `nuha.mutungi@gmail.com` git commit author — required for Vercel team
  membership; do not switch back to `noreply@laetoli.tz` for git authors
