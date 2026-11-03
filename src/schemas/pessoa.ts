/**
 * Schema do perfil de aluno (src/content/pessoas/*.md).
 * Usado pelo Astro (content.config.ts) e pelo `npm run check-ids`.
 */
import { z } from 'astro/zod';
import { ehPrimo } from '../lib/primos';
import { ehBloqueada } from '../lib/palavras-bloqueadas';
import { erroLatex } from '../lib/latex';
import { TIPOS } from '../lib/normalizar';

export const ENFASES = ['Matemática', 'Física', 'Computação', 'Dados', 'Ciclo Básico'] as const;

export const PRIMEIRA_TURMA = 2025;

const latexValido = (campo: string) => (valor: string, ctx: z.RefinementCtx) => {
  const erro = erroLatex(valor);
  if (erro) ctx.addIssue({ code: 'custom', message: `LaTeX inválido em ${campo}: ${erro}` });
};

const palavra = z.object({
  tipo: z.literal('palavra'),
  valor: z
    .string({ error: 'a palavra deve ser um texto' })
    .trim()
    .min(2, 'a palavra deve ter pelo menos 2 letras')
    .max(30, 'a palavra deve ter no máximo 30 letras')
    .regex(/^\p{L}+(?:-\p{L}+)*$/u, 'deve ser UMA palavra, só com letras (hífen permitido, sem espaços ou números)')
    .refine((v) => !ehBloqueada(v), 'essa palavra não é permitida: escolha outra'),
});

const primo = z.object({
  tipo: z.literal('primo'),
  valor: z
    .number({ error: 'o primo deve ser um número sem aspas (ex.: valor: 37)' })
    .int('o primo deve ser um número inteiro')
    .refine(ehPrimo, { error: (iss) => `${iss.input} não é primo` }),
});

const patrono = z.object({
  tipo: z.literal('patrono'),
  valor: z
    .string({ error: 'o patrono deve ser um texto' })
    .trim()
    .min(3, 'o nome do patrono deve ter pelo menos 3 caracteres')
    .max(80, 'o nome do patrono deve ter no máximo 80 caracteres')
    .regex(/^\p{L}[\p{L}\p{M} .'’-]*$/u, 'o patrono deve ser o nome de um(a) matemático(a), ex.: "Emmy Noether"'),
});

const objeto = z.object({
  tipo: z.literal('objeto'),
  valor: z
    .string({ error: 'o objeto deve ser um texto' })
    .trim()
    .min(3, 'descreva o objeto com pelo menos 3 caracteres')
    .max(200, 'a descrição do objeto deve ter no máximo 200 caracteres')
    .superRefine(latexValido('identificador.valor')),
});

export const identificadorSchema = z.discriminatedUnion('tipo', [palavra, primo, patrono, objeto], {
  error: (iss) =>
    iss.code === 'invalid_union' ? `tipo deve ser um de: ${TIPOS.join(', ')}` : undefined,
});

export const pessoaSchema = z.strictObject(
  {
    nome: z.string({ error: 'nome é obrigatório' }).trim().min(2, 'nome muito curto').max(80, 'nome muito longo'),
    turma: z
      .number({ error: 'turma é obrigatória e deve ser o ano de entrada, sem aspas (ex.: turma: 2025)' })
      .int('turma deve ser um ano')
      .min(PRIMEIRA_TURMA, `turma deve ser ${PRIMEIRA_TURMA} ou depois`)
      .max(new Date().getFullYear() + 1, 'turma está no futuro'),
    apelido: z.string({ error: 'apelido é obrigatório' }).trim().min(1, 'apelido vazio').max(40, 'apelido muito longo'),
    enfase: z.enum(ENFASES, { error: `enfase deve ser uma de: ${ENFASES.join(', ')}` }).optional(),
    identificador: identificadorSchema,
    bio: z.string().trim().max(280, 'bio deve ter no máximo 280 caracteres').superRefine(latexValido('bio')).optional(),
  },
  {
    error: (iss) =>
      iss.code === 'unrecognized_keys'
        ? `campo não permitido: ${iss.keys.join(', ')} (fotos não são aceitas no MVP)`
        : undefined,
  },
);

export type Pessoa = z.infer<typeof pessoaSchema>;
export type Identificador = z.infer<typeof identificadorSchema>;
