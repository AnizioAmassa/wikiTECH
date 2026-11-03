import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { pessoaSchema } from './schemas/pessoa';
import { wikiSchema } from './schemas/wiki';

const pessoas = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pessoas' }),
  schema: pessoaSchema,
});

const wiki = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/wiki' }),
  schema: wikiSchema,
});

export const collections = { pessoas, wiki };
