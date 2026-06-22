# tibaroho — admin backend extensions

Per [admin-roadmap](../../docs/admin-roadmap.md) (see IRMP for the canonical version), this app now ships the full backend for the @laetoli/admin canonical shell.

## What's included

1. **SQL migration** — `migrations/20260622000010_admin_extensions.sql`
   Creates 6 new tables (api_keys, broadcasts, export_jobs,
   impersonation_sessions, tenant_branding, admin_audit) with RLS
   keyed to this app's admin-role predicate
   (`(role::text in ('admin','executive','provider'))` on `tr_users`).

2. **Edge functions** — `functions/admin-invite-user`,
   `admin-suspend-user`, `admin-reset-mfa`, `admin-revoke-sessions`.
   Each verifies caller is admin, calls Supabase auth-admin API with
   the service-role key, writes a row to admin_audit.

## Deployment (one-time per app)

```bash
# 1. Apply migration via Supabase Studio (SQL editor)
# 2. Set the service-role key in edge function secrets:
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
# 3. Deploy the four functions:
supabase functions deploy admin-invite-user
supabase functions deploy admin-suspend-user
supabase functions deploy admin-reset-mfa
supabase functions deploy admin-revoke-sessions
```

After deployment, `/admin/v2` Users module fully works — invite,
suspend, reset MFA, end all sessions all hit live backend.

## Auditing

Every admin mutation writes a row to `admin_audit` via the service
role. `admin_audit` is append-only (UPDATE/DELETE blocked by trigger);
admin users can SELECT but not modify.

## Author
tr_users role check: `(role::text in ('admin','executive','provider'))`
Dr. Ally A. Nooher, MD, MPS-HIT · Laetoli (T) Ltd
