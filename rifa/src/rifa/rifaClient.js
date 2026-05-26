import { supabase } from '../lib/supabase.js';

export const RIFA_SESSION_KEY = 'rifa_session_token';
export const RIFA_ACCOUNT_FN = 'rifa_get_current_account';
export const RIFA_REGISTER_FN = 'rifa_register_account';
export const RIFA_LOGIN_FN = 'rifa_login_account';
export const RIFA_LOGOUT_FN = 'rifa_logout_account';
export const RIFA_COUNT_FN = 'get_rifa_entrants_count';

function readStoredSessionToken() {
  return window.localStorage.getItem(RIFA_SESSION_KEY);
}

function storeSessionToken(token) {
  window.localStorage.setItem(RIFA_SESSION_KEY, token);
}

function clearSessionToken() {
  window.localStorage.removeItem(RIFA_SESSION_KEY);
}

export async function loadRifaSession() {
  if (!supabase) return { session: null, error: new Error('Supabase no está configurado.') };

  const token = readStoredSessionToken();
  if (!token) return { session: null, error: null };

  const { data, error } = await supabase.rpc(RIFA_ACCOUNT_FN, { p_session_token: token });
  if (error || !data?.account) {
    clearSessionToken();
    return { session: null, error };
  }

  return { session: { token, account: data.account }, error: null };
}

export async function loadRifaCount() {
  if (!supabase) return { count: null, error: new Error('Supabase no está configurado.') };
  const { data, error } = await supabase.rpc(RIFA_COUNT_FN);
  return { count: data == null ? null : Number(data), error };
}

export async function createRifaAccount({ email, password }) {
  if (!supabase) return { data: null, error: new Error('Supabase no está configurado.') };

  const { data, error } = await supabase.rpc(RIFA_REGISTER_FN, {
    p_email: email,
    p_password: password,
  });

  if (!error && data?.sessionToken) storeSessionToken(data.sessionToken);
  return { data, error };
}

export async function signInRifa({ email, password }) {
  if (!supabase) return { data: null, error: new Error('Supabase no está configurado.') };

  const { data, error } = await supabase.rpc(RIFA_LOGIN_FN, {
    p_email: email,
    p_password: password,
  });

  if (!error && data?.sessionToken) storeSessionToken(data.sessionToken);
  return { data, error };
}

export async function signOutRifa() {
  if (!supabase) return { error: new Error('Supabase no está configurado.') };

  const token = readStoredSessionToken();
  if (token) await supabase.rpc(RIFA_LOGOUT_FN, { p_session_token: token });
  clearSessionToken();
  return { error: null };
}
