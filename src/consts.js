// ---------------------------------------------------------------------------
// Site-wide configuration — single source of truth.
// ---------------------------------------------------------------------------

export const SITE = {
  name: 'MoveWell Reviews',
  domain: 'movewellreviews.com',
  url: 'https://movewellreviews.com',
  tagline: 'Honest, hands-on reviews of the gear that helps you move and recover.',
  description:
    'Independent, hands-on reviews and buying guides for walking pads, treadmills, massage guns, home-gym equipment, and fitness wearables — so you can move more and recover better.',
  contactEmail: 'hello@movewellreviews.com',
  twitter: '',
  founded: 2026,
};

// ---------------------------------------------------------------------------
// LEGAL / BUSINESS INFO — REPLACE THE [PLACEHOLDERS] BEFORE LAUNCH.
// These feed the Privacy Policy, Terms, Contact, and Do-Not-Sell pages that
// the US market (FTC, CCPA/CPRA) expects to show a real, reachable operator.
// ---------------------------------------------------------------------------
export const LEGAL = {
  entity: '[YOUR LEGAL NAME OR LLC]', // e.g. "MoveWell Media LLC"
  ownerType: 'company', // 'company' | 'individual'
  addressLine1: '[STREET ADDRESS]',
  addressLine2: '[CITY, STATE ZIP]',
  governingState: '[STATE]', // e.g. "California" — governs Terms of Use
  privacyEmail: 'privacy@movewellreviews.com',
  legalEmail: 'legal@movewellreviews.com',
  // Set to true only once you actually run interest-based/behavioral ads that
  // "share" data. It toggles the CCPA "Do Not Sell or Share" surfaces.
  sharesDataForAds: false,
};

// ---------------------------------------------------------------------------
// CATEGORY TAXONOMY
// Each product has one `category`. Categories are grouped into 4 "hubs" that
// drive navigation, the homepage, and the /best/<hub> landing pages.
// Accent keys map to CSS color variables defined in BaseLayout.
// ---------------------------------------------------------------------------
export const HUBS = [
  {
    slug: 'walking-pads',
    label: 'Walking Pads & Treadmills',
    short: 'Walking Pads',
    tag: 'Move',
    accent: 'move',
    categories: ['walking-pads', 'treadmills'],
    blurb:
      'Under-desk walking pads and folding treadmills that fit a real room — so you move while you work.',
    intro:
      'Every walking pad and treadmill goes through the same test: measured noise at 2 mph next to a laptop mic, wobble under load, folding-mechanism durability, and app/remote reliability over two weeks of daily use.',
  },
  {
    slug: 'recovery',
    label: 'Recovery & Massage',
    short: 'Recovery',
    tag: 'Recover',
    accent: 'recover',
    categories: ['massage-guns', 'compression', 'foam-rollers'],
    blurb:
      'Massage guns, compression boots, and mobility tools that undo a long day at the desk or a hard training session.',
    intro:
      'Each device is used consistently after training for at least two weeks. We look at perceived soreness reduction, build quality, measured stall force and amplitude, battery life, and noise.',
  },
  {
    slug: 'strength',
    label: 'Home Gym & Strength',
    short: 'Home Gym',
    tag: 'Strength',
    accent: 'strength',
    categories: ['home-gym', 'strength'],
    blurb:
      'Adjustable dumbbells, racks, benches, and resistance gear for building strength without a gym membership.',
    intro:
      'We load, drop, and live with every piece of strength equipment — checking adjustment speed, plate wobble, footprint, weight increments, and how it holds up to months of real reps.',
  },
  {
    slug: 'wearables',
    label: 'Wearables & Wellness Tech',
    short: 'Wearables',
    tag: 'Track',
    accent: 'wearable',
    categories: ['wearables', 'wellness-tech'],
    blurb:
      'Fitness watches, rings, smart scales, and sleep trackers — tested for accuracy, battery, and whether the data is actually useful.',
    intro:
      'We wear each tracker 24/7 for weeks, cross-check heart-rate and step accuracy against reference devices, and judge whether the companion app turns numbers into habits worth keeping.',
  },
];

// Flat category -> human label lookups.
export const CATEGORY_LABELS = {
  'walking-pads': 'Walking Pads',
  treadmills: 'Treadmills',
  'massage-guns': 'Massage Guns',
  compression: 'Compression Recovery',
  'foam-rollers': 'Foam Rollers & Mobility',
  'home-gym': 'Home Gym',
  strength: 'Strength & Weights',
  wearables: 'Fitness Wearables',
  'wellness-tech': 'Sleep & Wellness Tech',
};

// All valid category slugs, derived from the hubs (keep content/config.ts in sync).
export const ALL_CATEGORIES = HUBS.flatMap((h) => h.categories);

export function hubForCategory(category) {
  return HUBS.find((h) => h.categories.includes(category)) ?? HUBS[0];
}

export function accentForCategory(category) {
  return hubForCategory(category).accent;
}

// ---------------------------------------------------------------------------
// NAVIGATION
// ---------------------------------------------------------------------------
export const NAV_LINKS = [
  ...HUBS.map((h) => ({ href: `/best/${h.slug}`, label: h.short })),
  { href: '/blog', label: 'Blog' },
];

export const FOOTER_LEGAL = [
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
  { href: '/accessibility', label: 'Accessibility' },
  { href: '/do-not-sell', label: 'Do Not Sell or Share' },
];

export const FOOTER_SITE = [
  { href: '/about', label: 'About Us' },
  { href: '/reviews', label: 'All Reviews' },
  { href: '/compare', label: 'Compare' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

// Shown near the top of every commercial page. Required by FTC 16 CFR Part 255 —
// disclosures must be "clear and conspicuous," not buried only in a footer link.
export const DISCLOSURE_SHORT =
  'MoveWell Reviews is reader-supported. As an Amazon Associate and participant in other affiliate programs, we earn from qualifying purchases at no extra cost to you. This does not influence our ratings.';

// ---------------------------------------------------------------------------
// INTEGRATIONS — paste your endpoints after signing up (static-site friendly).
// Newsletter + contact run through Formspree so no server is needed on Hostinger.
// Create free forms at https://formspree.io and paste the form IDs below.
// ---------------------------------------------------------------------------
export const FORMS = {
  newsletterEndpoint: 'https://formspree.io/f/YOUR_NEWSLETTER_ID',
  contactEndpoint: 'https://formspree.io/f/YOUR_CONTACT_ID',
};
