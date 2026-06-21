-- Tumaini demo personas — 10 real auth.users so the persona chips on the
-- entrance perform a real signInWithPassword and end up with a genuine
-- Supabase session. Password is shared across all demo accounts:
--   Tumaini2026!
-- Idempotent: skips rows that already exist (email is unique in auth.users).

do $$
declare
  demo_password text := 'Tumaini2026!';
  demo_hash     text;
  rec record;
  new_auth_id uuid;
begin
  -- bcrypt hash of the shared demo password.
  demo_hash := extensions.crypt(demo_password, extensions.gen_salt('bf'));

  for rec in
    select * from (values
      ('maria',    'maria@tumaini.demo',     'Maria Mwakini',            'patient'),
      ('asha',     'asha@tumaini.demo',      'Dr. Asha Mwema',           'provider'),
      ('salima',   'salima@tumaini.demo',    'Bibi Salima Issa',         'provider'),
      ('kalumuna', 'kalumuna@tumaini.demo',  'Mr. Kalumuna',             'employer'),
      ('komba',    'komba@tumaini.demo',     'Mama Asha Komba',          'school'),
      ('mtumbe',   'mtumbe@tumaini.demo',    'Dr. Mtumbe',               'researcher'),
      ('ps',       'ps.health@tumaini.demo', 'Hon. PS-Health',           'admin'),
      ('nooher',   'nooher@tumaini.demo',    'Dr. Ally A. Nooher',       'admin'),
      ('baloh',    'baloh@tumaini.demo',     'Dr. Jure Baloh',           'researcher'),
      ('mpya',     'mpya@tumaini.demo',      'Mtumiaji Mpya',            'patient')
    ) as t(slug, email, display, role_v)
  loop
    -- Insert into auth.users if not already present.
    if not exists (select 1 from auth.users where email = rec.email) then
      new_auth_id := extensions.gen_random_uuid();
      insert into auth.users (
        instance_id, id, aud, role,
        email, encrypted_password,
        email_confirmed_at, confirmation_sent_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change
      ) values (
        '00000000-0000-0000-0000-000000000000',
        new_auth_id,
        'authenticated',
        'authenticated',
        rec.email,
        demo_hash,
        now(),
        now(),
        jsonb_build_object('provider','email','providers',array['email']),
        jsonb_build_object('persona', rec.slug, 'display_name', rec.display),
        now(),
        now(),
        '', '', '', ''
      );

      -- Insert matching auth.identities row (PKCE login needs this).
      insert into auth.identities (
        id, user_id, provider, provider_id,
        identity_data,
        last_sign_in_at, created_at, updated_at
      ) values (
        extensions.gen_random_uuid(),
        new_auth_id,
        'email',
        new_auth_id::text,
        jsonb_build_object('sub', new_auth_id::text, 'email', rec.email, 'email_verified', true),
        now(), now(), now()
      );
    else
      new_auth_id := (select id from auth.users where email = rec.email);
    end if;

    -- Mirror into tr_users (idempotent).
    insert into tr_users (auth_id, role, display_name, lang, region)
    values (
      new_auth_id,
      rec.role_v::tr_role,
      rec.display,
      'sw',
      'Dar'
    )
    on conflict (auth_id) do update
      set display_name = excluded.display_name,
          role         = excluded.role;
  end loop;
end$$;
