import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({
    pattern: '[^_]*.md',
    base: './source/content/projects',
  }),
  schema: z.object({
    name: z.string(),
    anchor: z.string(),
    link: z.string(),
    category: z.string(),
    role: z.string().optional(),
    repo: z.string().optional(),
    npm: z.string().optional(),
    stats: z.string().optional(),
    highlight: z.boolean().default(false),
    order: z.number().default(99),
  }),
})

const writeups = defineCollection({
  loader: glob({
    pattern: '[^_]*.md',
    base: './source/content/writeups',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
})

const thoughts = defineCollection({
  loader: glob({
    pattern: '[^_]*.md',
    base: './source/content/thoughts',
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
  }),
})

export const collections = { projects, writeups, thoughts }
