-- Ejecuta esto en el proyecto existente de Supabase para respaldar la página de rifa.
-- Usa un flujo de autenticación respaldado por base de datos:
-- - las contraseñas se hashean del lado del servidor con pgcrypto
-- - las sesiones se guardan del lado del servidor y se referencian con un token del navegador
-- - la validación se aplica en SQL, no solo en el frontend

create extension if not exists pgcrypto;

create table if not exists public.rifa_accounts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  signup_date timestamptz not null default now(),
  entered boolean not null default true,
  participant_number bigint generated always as identity unique
);

create table if not exists public.rifa_sessions (
  token_hash text primary key,
  account_id uuid not null references public.rifa_accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '180 days')
);

create index if not exists rifa_sessions_account_id_idx on public.rifa_sessions (account_id);

alter table public.rifa_accounts enable row level security;
alter table public.rifa_sessions enable row level security;

create or replace function public.rifa_normalize_email(p_email text)
returns text
language sql
immutable
as $$
  select lower(btrim(coalesce(p_email, '')));
$$;

create or replace function public.rifa_is_valid_email(p_email text)
returns boolean
language sql
immutable
as $$
  select p_email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$';
$$;

create or replace function public.rifa_hash_session_token(p_token text)
returns text
language sql
immutable
as $$
  select encode(extensions.digest(coalesce(p_token, ''), 'sha256'), 'hex');
$$;

create or replace function public.rifa_generate_session_token()
returns text
language sql
volatile
as $$
  select encode(extensions.gen_random_bytes(32), 'hex');
$$;

create or replace function public.rifa_get_current_account(p_session_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account record;
  v_token_hash text := public.rifa_hash_session_token(p_session_token);
begin
  if coalesce(p_session_token, '') = '' then
    return null;
  end if;

  select a.id, a.email, a.signup_date, a.entered, a.participant_number
    into v_account
  from public.rifa_sessions s
  join public.rifa_accounts a on a.id = s.account_id
  where s.token_hash = v_token_hash
    and s.expires_at > now();

  if not found then
    delete from public.rifa_sessions where token_hash = v_token_hash;
    return null;
  end if;

  return jsonb_build_object(
    'account',
    jsonb_build_object(
      'id', v_account.id,
      'email', v_account.email,
      'signup_date', v_account.signup_date,
      'entered', v_account.entered,
      'participant_number', v_account.participant_number
    )
  );
end;
$$;

create or replace function public.rifa_register_account(p_email text, p_password text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := public.rifa_normalize_email(p_email);
  v_password text := coalesce(p_password, '');
  v_account public.rifa_accounts%rowtype;
  v_token text;
begin
  if not public.rifa_is_valid_email(v_email) then
    raise exception 'Ingresa un correo electrónico válido.';
  end if;

  if length(v_password) < 8 then
    raise exception 'La contraseña debe tener al menos 8 caracteres.';
  end if;

  if exists(select 1 from public.rifa_accounts where email = v_email) then
    raise exception 'Este correo ya tiene una cuenta. Inicia sesión.';
  end if;

  insert into public.rifa_accounts (email, password_hash, entered)
  values (v_email, extensions.crypt(v_password, extensions.gen_salt('bf')), true)
  returning * into v_account;

  v_token := public.rifa_generate_session_token();

  insert into public.rifa_sessions (token_hash, account_id)
  values (public.rifa_hash_session_token(v_token), v_account.id);

  return jsonb_build_object(
    'sessionToken', v_token,
    'account',
    jsonb_build_object(
      'id', v_account.id,
      'email', v_account.email,
      'signup_date', v_account.signup_date,
      'entered', v_account.entered,
      'participant_number', v_account.participant_number
    )
  );
end;
$$;

create or replace function public.rifa_login_account(p_email text, p_password text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := public.rifa_normalize_email(p_email);
  v_password text := coalesce(p_password, '');
  v_account public.rifa_accounts%rowtype;
  v_token text;
begin
  if not public.rifa_is_valid_email(v_email) then
    raise exception 'Ingresa un correo electrónico válido.';
  end if;

  if length(v_password) < 8 then
    raise exception 'La contraseña debe tener al menos 8 caracteres.';
  end if;

  select *
    into v_account
    from public.rifa_accounts
  where email = v_email
    and password_hash = extensions.crypt(v_password, password_hash);

  if not found then
    raise exception 'Correo o contraseña incorrectos.';
  end if;

  v_token := public.rifa_generate_session_token();

  insert into public.rifa_sessions (token_hash, account_id)
  values (public.rifa_hash_session_token(v_token), v_account.id);

  return jsonb_build_object(
    'sessionToken', v_token,
    'account',
    jsonb_build_object(
      'id', v_account.id,
      'email', v_account.email,
      'signup_date', v_account.signup_date,
      'entered', v_account.entered,
      'participant_number', v_account.participant_number
    )
  );
end;
$$;

create or replace function public.rifa_logout_account(p_session_token text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.rifa_sessions
  where token_hash = public.rifa_hash_session_token(p_session_token);
$$;

create or replace function public.get_rifa_entrants_count()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint from public.rifa_accounts;
$$;

grant execute on function public.rifa_get_current_account(text) to anon, authenticated;
grant execute on function public.rifa_register_account(text, text) to anon, authenticated;
grant execute on function public.rifa_login_account(text, text) to anon, authenticated;
grant execute on function public.rifa_logout_account(text) to anon, authenticated;
grant execute on function public.get_rifa_entrants_count() to anon, authenticated;
