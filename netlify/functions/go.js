import { createClient } from '@supabase/supabase-js';

// Server-side only — never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// /go/:affiliateSlug -> looks up the real affiliate URL in Supabase, logs a
// first-party (no-PII) click event, then 302-redirects. Keeping the real
// destination in the database (not in the page HTML) is what makes this a
// "cloaked" affiliate link — a common, TOS-compliant pattern for Amazon
// Associates and most other affiliate networks.
export default async (req, context) => {
  const affiliateSlug = context.params.affiliateSlug;

  if (!affiliateSlug) {
    return new Response('Not found', { status: 404 });
  }

  const { data: product, error } = await supabase
    .from('products')
    .select('affiliate_url, is_published')
    .eq('affiliate_slug', affiliateSlug)
    .maybeSingle();

  if (error || !product || !product.is_published) {
    return Response.redirect(new URL('/404', req.url), 302);
  }

  // Best-effort click log; never block the redirect on logging failure.
  try {
    await supabase.from('click_events').insert({
      affiliate_slug: affiliateSlug,
      referrer_path: req.headers.get('referer') || null,
      user_agent: req.headers.get('user-agent') || null,
    });
  } catch {
    // ignore logging failures
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: product.affiliate_url,
      'Cache-Control': 'no-store',
    },
  });
};

export const config = {
  path: '/go/:affiliateSlug',
};
