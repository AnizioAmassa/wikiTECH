import { z } from 'astro/zod';

export const CATEGORIAS = {
  cultura: 'Cultura',
  tradicoes: 'Tradições',
  disciplinas: 'Disciplinas',
  dicas: 'Dicas',
  glossario: 'Glossário',
} as const;

export type Categoria = keyof typeof CATEGORIAS;

export const wikiSchema = z.strictObject({
  titulo: z.string({ error: 'titulo é obrigatório' }).trim().min(2).max(100),
  categoria: z.enum(Object.keys(CATEGORIAS) as [Categoria, ...Categoria[]], {
    error: `categoria deve ser uma de: ${Object.keys(CATEGORIAS).join(', ')}`,
  }),
  descricao: z.string().trim().max(200).optional(),
});
