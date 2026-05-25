import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing. ' +
      'Add them to estafeta/.env and restart `npm run dev` before submitting the form.',
  );
}

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const REDELIVERY_TABLE = 'redelivery_requests';
