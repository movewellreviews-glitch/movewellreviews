import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string().nullable().optional(),
    coverImage: z.string().nullable().optional(),
    author: z.string().default('MoveWell Reviews Team'),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(true),
    seo: z
      .object({
        title: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        keyword: z.string().nullable().optional(),
      })
      .nullable().optional(),
  }),
});

// Keep in sync with HUBS in src/consts.js
const CATEGORIES = [
  'walking-pads',
  'treadmills',
  'massage-guns',
  'compression',
  'foam-rollers',
  'home-gym',
  'strength',
  'wearables',
  'wellness-tech',
] as const;

const products = defineCollection({
  type: 'content',
  schema: z.object({
    brand: z.string(),
    name: z.string(),
    category: z.enum(CATEGORIES),
    tagline: z.string().nullable().optional(),
    coverImage: z.string().nullable().optional(),
    gallery: z.array(z.string()).default([]),
    rating: z.number().min(0).max(5).default(0),
    bestFor: z.string().nullable().optional(),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    affiliateNetwork: z.string().default('amazon'),
    affiliateUrl: z.string(),
    priceNote: z.string().default('Check current price'),
    testingMethodology: z.string().nullable().optional(),
    author: z.string().default('MoveWell Reviews Team'),
    publishDate: z.coerce.date(),
    published: z.boolean().default(false),
    seo: z
      .object({
        title: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        keyword: z.string().nullable().optional(),
      })
      .nullable().optional(),
  }),
});

export const collections = { blog, products };
export { CATEGORIES };
