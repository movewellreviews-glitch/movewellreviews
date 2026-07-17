import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    coverImage: z.string().optional(),
    author: z.string().default('MoveWell Reviews Team'),
    publishDate: z.date(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { blog };
