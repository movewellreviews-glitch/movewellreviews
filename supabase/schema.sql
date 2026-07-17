-- MoveWell Reviews — Supabase schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query) once per project.
--
-- Products, reviews, and blog posts are NOT stored here anymore — they live
-- as Markdown files in the GitHub repo (src/content/products, src/content/blog),
-- edited through the CMS at /admin. Supabase is only used for things that are
-- genuinely live/dynamic: affiliate click tracking, newsletter signups, and
-- contact form messages.
--
-- If you have an older project with `products`, `reviews`, or `categories`
-- tables from a previous version of this schema, they're safe to drop —
-- nothing in the site reads from them anymore:
--   drop table if exists reviews;
--   drop table if exists products;
--   drop table if exists categories;

create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- Affiliate click log (first-party, no PII) — powers /go/[slug] redirect route
-- ─────────────────────────────────────────────
create table if not exists click_events (
  id uuid primary key default uuid_generate_v4(),
  affiliate_slug text not null,
  referrer_path text,
  user_agent text,
  created_at timestamptz default now()
);

create index if not exists idx_click_events_slug on click_events(affiliate_slug);

-- ─────────────────────────────────────────────
-- Newsletter subscribers (from /netlify/functions/subscribe.js)
-- ─────────────────────────────────────────────
create table if not exists subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  source_path text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Contact form submissions (from /netlify/functions/contact.js)
-- ─────────────────────────────────────────────
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table click_events enable row level security;
alter table subscribers enable row level security;
alter table contact_messages enable row level security;

-- click_events: the /go/[slug] route runs server-side using the public anon
-- key and inserts a click record on every redirect — allow public INSERT
-- only (no SELECT/UPDATE/DELETE), which is the standard safe pattern for
-- write-only analytics logging.
create policy "public can log clicks" on click_events for insert with check (true);

-- subscribers and contact_messages: no public policy — only written via
-- Netlify Functions using the SUPABASE_SERVICE_ROLE_KEY (server-side only,
-- never exposed to the browser), which bypasses RLS entirely.
