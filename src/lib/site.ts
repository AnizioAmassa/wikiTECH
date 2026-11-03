import { getCollection, type CollectionEntry } from 'astro:content';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

/** Link da Wikita (ITA), que inspirou este projeto. Preencha quando tiver o endereço. */
export const WIKITA_URL: string | null = null;

/** Monta um link respeitando o `base` do astro.config. */
export function url(caminho = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${caminho.replace(/^\//, '')}`;
}

export type Pessoa = CollectionEntry<'pessoas'>;
export type PaginaWiki = CollectionEntry<'wiki'>;

const porNome = (a: Pessoa, b: Pessoa) => a.data.nome.localeCompare(b.data.nome, 'pt-BR');

export async function todasPessoas(): Promise<Pessoa[]> {
  return (await getCollection('pessoas')).sort(porNome);
}

export async function pessoasPorTurma(): Promise<Map<number, Pessoa[]>> {
  const mapa = new Map<number, Pessoa[]>();
  for (const p of await todasPessoas()) {
    mapa.set(p.data.turma, [...(mapa.get(p.data.turma) ?? []), p]);
  }
  return new Map([...mapa].sort(([a], [b]) => b - a));
}

// ---------- datas de edição (via git) ----------

let datasGit: Map<string, Date> | undefined;

function carregarDatasGit(): Map<string, Date> {
  const mapa = new Map<string, Date>();
  try {
    const saida = execFileSync('git', ['log', '--format=@@%cI', '--name-only', '--', 'src/content'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    let data: Date | undefined;
    for (const linha of saida.split('\n')) {
      if (linha.startsWith('@@')) data = new Date(linha.slice(2));
      else if (linha && data && !mapa.has(linha)) mapa.set(linha, data);
    }
  } catch {
    // fora de um repositório git: cai no mtime do arquivo
  }
  return mapa;
}

/** Data do último commit que tocou o arquivo (ou mtime, se ainda não commitado). */
export function ultimaEdicao(filePath: string | undefined): Date {
  if (!filePath) return new Date(0);
  datasGit ??= carregarDatasGit();
  const rel = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
  const doGit = datasGit.get(rel);
  if (doGit) return doGit;
  try {
    return fs.statSync(filePath).mtime;
  } catch {
    return new Date(0);
  }
}

export type Edicao = { titulo: string; href: string; tipo: 'Perfil' | 'Wiki'; data: Date };

export async function ultimasEdicoes(limite = 8): Promise<Edicao[]> {
  const pessoas = (await getCollection('pessoas')).map((p) => ({
    titulo: `${p.data.nome} (${p.data.apelido})`,
    href: url(`pessoas/${p.id}/`),
    tipo: 'Perfil' as const,
    data: ultimaEdicao(p.filePath),
  }));
  const wiki = (await getCollection('wiki')).map((w) => ({
    titulo: w.data.titulo,
    href: url(`wiki/${w.id}/`),
    tipo: 'Wiki' as const,
    data: ultimaEdicao(w.filePath),
  }));
  return [...pessoas, ...wiki].sort((a, b) => b.data.getTime() - a.data.getTime()).slice(0, limite);
}

export const formatarData = (d: Date) =>
  d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo' });
