-- MoveWell Reviews — Supabase schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query) once per project.

create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- Categories (Walking Pads, Massage Guns, Compression, Foam Rollers, etc.)
-- ─────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Products (individual items reviewed)
-- ─────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  category_id uuid references categories(id) on delete set null,
  brand text not null,
  name text not null,
  tagline text,
  image_url text,
  gallery jsonb default '[]',            -- array of extra image URLs
  specs jsonb default '{}',              -- { "speed_range": "0.5-4 mph", "weight_capacity": "265 lbs", ... }
  pros jsonb default '[]',               -- array of strings
  cons jsonb default '[]',               -- array of strings
  rating numeric(2,1) default 0,         -- editorial rating 0-5, set manually — never scraped/faked
  best_for text,                         -- e.g. "Best budget pick", "Best for small apartments"
  affiliate_slug text unique not null,   -- used by /go/[affiliate_slug] redirect, e.g. "amazon-walkingpad-a1"
  affiliate_network text default 'amazon', -- amazon | shareasale | impact | cj | direct
  affiliate_url text not null,           -- real destination URL (kept server-side, never hardcode prices from this)
  price_note text,                       -- e.g. "Check current price" — do NOT hardcode a static price (Amazon TOS)
  is_published boolean default false,
  published_at timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_published on products(is_published);

-- ─────────────────────────────────────────────
-- Long-form review content per product (1:1)
-- ─────────────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid unique references products(id) on delete cascade,
  author text default 'MoveWell Reviews Team',
  summary text,
  body_html text,               -- rendered review body (write in Markdown elsewhere, store rendered HTML or MD here)
  testing_methodology text,     -- REQUIRED for FTC compliance: how you actually tested / evaluated it
  last_updated timestamptz default now(),
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Blog / buying-guide content (top-of-funnel SEO)
-- ─────────────────────────────────────────────
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body_html text,
  cover_image_url text,
  author text default 'MoveWell Reviews Team',
  is_published boolean default false,
  published_at timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Affiliate click log (first-party, no PII) — powers /go/[slug] redirect function
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
-- Newsletter subscribers (optional, from /netlify/functions/subscribe.js)
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
-- Row Level Security: public site only ever needs read access to published
-- content via the anon key. Writes/admin happen via the Supabase dashboard
-- or service_role key from Netlify functions only.
-- ─────────────────────────────────────────────
alter table categories enable row level security;
alter table products enable row level security;
alter table reviews enable row level security;
alter table blog_posts enable row level security;
alter table click_events enable row level security;
alter table subscribers enable row level security;
alter table contact_messages enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read published products" on products for select using (is_published = true);
create policy "public read reviews of published products" on reviews for select using (
  exists (select 1 from products p where p.id = reviews.product_id and p.is_published = true)
);
create policy "public read published blog posts" on blog_posts for select using (is_published = true);

-- click_events and subscribers: no public select/insert policy here.
-- Netlify functions write to them using the SUPABASE_SERVICE_ROLE_KEY
-- (server-side only, never exposed to the browser), which bypasses RLS.

-- ─────────────────────────────────────────────
-- Seed data (placeholders — replace with real products/copy before launch)
-- ─────────────────────────────────────────────
insert into categories (slug, name, description) values
  ('walking-pads', 'Walking Pads', 'Under-desk treadmills and compact walking pads for home offices.'),
  ('massage-guns', 'Massage Guns', 'Percussion therapy devices for muscle recovery.'),
  ('compression', 'Compression Recovery', 'Pneumatic compression boots and sleeves.'),
  ('foam-rollers', 'Foam Rollers & Mobility', 'Foam rollers, mobility balls, and stretching tools.')
on conflict (slug) do nothing;

-- Example placeholder product — duplicate this pattern for real products.
insert into products (
  slug, category_id, brand, name, tagline, image_url, specs, pros, cons,
  rating, best_for, affiliate_slug, affiliate_network, affiliate_url, price_note, is_published, published_at
) values (
  'example-walking-pad-1',
  (select id from categories where slug = 'walking-pads'),
  'ExampleBrand',
  'Example Walking Pad Pro',
  'Placeholder tagline — replace before launch',
  '/images/placeholder-product.svg',
  '{"speed_range": "0.5–3.8 mph", "weight_capacity": "265 lbs", "noise_level": "~50 dB", "dimensions_folded": "45 x 27 x 6 in"}',
  '["Placeholder pro #1", "Placeholder pro #2"]',
  '["Placeholder con #1"]',
  4.2,
  'Best overall (placeholder)',
  'amazon-example-walking-pad-1',
  'amazon',
  'https://www.amazon.com/REPLACE-WITH-REAL-AFFILIATE-LINK',
  'Check current price',
  false,
  null
) on conflict (slug) do nothing;
