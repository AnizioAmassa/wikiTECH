/**
 * Validação completa dos perfis, independente do Astro:
 *  1. nome do arquivo em kebab-case
 *  2. frontmatter válido segundo o schema Zod (formato de cada tipo)
 *  3. unicidade do par (tipo, valor) normalizado, exceto para `primo`
 *
 * Usada por `npm run check-ids` e pela integração que faz o build falhar.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { pessoaSchema } from '../schemas/pessoa';
import { TIPOS_UNICOS, chaveIdentificador, type TipoIdentificador } from './normalizar';

export const PASTA_PESSOAS = 'src/content/pessoas';

export type ResultadoVerificacao = {
  arquivos: number;
  erros: string[];
};

const NOME_ARQUIVO = /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

export function verificarPerfis(raiz: string = process.cwd()): ResultadoVerificacao {
  const pasta = path.join(raiz, PASTA_PESSOAS);
  const erros: string[] = [];
  if (!fs.existsSync(pasta)) return { arquivos: 0, erros };

  const arquivos = fs.readdirSync(pasta).filter((f) => f.endsWith('.md')).sort();
  const vistos = new Map<string, { tipo: TipoIdentificador; valor: string | number; arquivos: string[] }>();

  for (const nome of arquivos) {
    const rel = `${PASTA_PESSOAS}/${nome}`;
    const problemas: string[] = [];
    const registrar = () => problemas.length && erros.push(`${rel}\n${problemas.map((p) => `    ${p}`).join('\n')}`);

    if (!NOME_ARQUIVO.test(nome)) {
      problemas.push('nome do arquivo: use só letras minúsculas sem acento, números e hífens (ex.: ana-souza.md)');
    }

    let dados: unknown;
    try {
      dados = matter(fs.readFileSync(path.join(pasta, nome), 'utf8')).data;
    } catch (e) {
      problemas.push(`frontmatter YAML ilegível: ${(e as Error).message.split('\n')[0]}`);
      registrar();
      continue;
    }

    const r = pessoaSchema.safeParse(dados);
    if (!r.success) {
      for (const i of r.error.issues) problemas.push(`${i.path.length ? i.path.join('.') : '(raiz)'}: ${i.message}`);
    }
    registrar();
    if (!r.success) continue;

    const { tipo, valor } = r.data.identificador;
    if (!TIPOS_UNICOS.includes(tipo)) continue;
    const chave = `${tipo}:${chaveIdentificador(tipo, valor)}`;
    const atual = vistos.get(chave);
    if (atual) atual.arquivos.push(rel);
    else vistos.set(chave, { tipo, valor, arquivos: [rel] });
  }

  for (const { tipo, valor, arquivos: lista } of vistos.values()) {
    if (lista.length > 1) {
      erros.push(
        `Identificador duplicado (${tipo}: "${valor}") em ${lista.length} perfis:\n` +
          lista.map((a) => `    ${a}`).join('\n') +
          `\n    A comparação ignora maiúsculas, acentos e espaços. Quem chegou depois precisa escolher outro.`,
      );
    }
  }

  return { arquivos: arquivos.length, erros };
}

export function formatarErros(erros: string[]): string {
  return erros.map((e) => `✖ ${e}`).join('\n\n');
}
