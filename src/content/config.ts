import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    coverImage: z.string().optional(),
    author: z.string().default('MoveWell Reviews Team'),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(true),
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        keyword: z.string().optional(),
      })
      .optional(),
  }),
});

const CATEGORIES = ['walking-pads', 'massage-guns', 'compression', 'foam-rollers'] as const;

const products = defineCollection({
  type: 'content',
  schema: z.object({
    brand: z.string(),
    name: z.string(),
    category: z.enum(CATEGORIES),
    tagline: z.string().optional(),
    coverImage: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    rating: z.number().min(0).max(5).default(0),
    bestFor: z.string().optional(),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    affiliateNetwork: z.string().default('amazon'),
    affiliateUrl: z.string(),
    priceNote: z.string().default('Check current price'),
    testingMethodology: z.string().optional(),
    author: z.string().default('MoveWell Reviews Team'),
    publishDate: z.coerce.date(),
    published: z.boolean().default(false),
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        keyword: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { blog, products };
export { CATEGORIES };
