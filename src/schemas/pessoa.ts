/**
 * Schema do perfil de aluno (src/content/pessoas/*.md).
 * Usado pelo Astro (content.config.ts) e pelo `npm run check-ids`.
 */
import { z } from 'astro/zod';
import { ehBloqueada } from '../lib/palavras-bloqueadas';
import { erroLatex } from '../lib/latex';
import { FORMATO_PALAVRA } from '../lib/normalizar';

export const ENFASES = ['Matemática', 'Física', 'Computação', 'Dados', 'Ciclo Básico'] as const;

export const PRIMEIRA_TURMA = 2024;

const latexValido = (campo: string) => (valor: string, ctx: z.RefinementCtx) => {
  const erro = erroLatex(valor);
  if (erro) ctx.addIssue({ code: 'custom', message: `LaTeX inválido em ${campo}: ${erro}` });
};

/** O identificador (opcional) é uma palavra única escolhida pelo próprio aluno. */
export const identificadorSchema = z
  .string({ error: 'identificador deve ser uma palavra (ex.: identificador: Girassol)' })
  .trim()
  .min(2, 'o identificador deve ter pelo menos 2 letras')
  .max(30, 'o identificador deve ter no máximo 30 letras')
  .regex(FORMATO_PALAVRA, 'o identificador deve ser UMA palavra, só com letras (hífen permitido, sem espaços ou números)')
  .refine((v) => !ehBloqueada(v), 'essa palavra não é permitida: escolha outra');

export const pessoaSchema = z.strictObject(
  {
    nome: z.string({ error: 'nome é obrigatório' }).trim().min(2, 'nome muito curto').max(80, 'nome muito longo'),
    turma: z
      .number({ error: 'turma é obrigatória e deve ser o ano de entrada, sem aspas (ex.: turma: 2025)' })
      .int('turma deve ser um ano')
      .min(PRIMEIRA_TURMA, `turma deve ser ${PRIMEIRA_TURMA} ou depois`)
      .max(new Date().getFullYear() + 1, 'turma está no futuro'),
    apelido: z.string({ error: 'apelido deve ser um texto' }).trim().min(1, 'apelido vazio: apague a linha se não tiver').max(40, 'apelido muito longo').optional(),
    enfase: z.enum(ENFASES, { error: `enfase deve ser uma de: ${ENFASES.join(', ')}` }).optional(),
    identificador: identificadorSchema.optional(),
    bio: z.string().trim().max(280, 'bio deve ter no máximo 280 caracteres').superRefine(latexValido('bio')).optional(),
  },
  {
    error: (iss) =>
      iss.code === 'unrecognized_keys'
        ? `campo não permitido: ${iss.keys.join(', ')}` +
          (iss.keys.some((k) => /foto|imagem|image|photo/i.test(k)) ? ' (fotos não são aceitas)' : '')
        : undefined,
  },
);

export type Pessoa = z.infer<typeof pessoaSchema>;
