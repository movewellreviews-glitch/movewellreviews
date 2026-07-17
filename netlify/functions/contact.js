import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const name = String(body.name || '').slice(0, 200);
  const email = String(body.email || '').trim().toLowerCase();
  const message = String(body.message || '').slice(0, 5000);

  if (!EMAIL_RE.test(email) || !message.trim()) {
    return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { error } = await supabase.from('contact_messages').insert({ name, email, message });

  if (error) {
    return new Response(JSON.stringify({ error: 'Could not send message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // TODO (optional): forward to an email service (e.g. Resend, Postmark) here
  // so you get notified immediately instead of checking Supabase manually.

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = {
  path: '/.netlify/functions/contact',
};
