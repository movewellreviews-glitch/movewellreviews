import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Server-rendered pages use the anon key + RLS "public read published" policies,
// so it is safe to ship this client to build-time/SSR code. Never import the
// service_role key here — that only belongs in netlify/functions/*.js.
export const supabase = createClient(url, anonKey);
