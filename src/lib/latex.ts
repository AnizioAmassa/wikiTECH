/**
 * LaTeX inline em textos curtos do frontmatter (identificador `objeto`, `bio`).
 * O corpo Markdown das páginas usa remark-math + rehype-katex; aqui tratamos
 * strings soltas, delimitadas por `$...$`. Use `\$` para um cifrão literal.
 */
import katex from 'katex';

export type Trecho = { math: boolean; conteudo: string };

export function dividirLatex(texto: string): Trecho[] {
  const trechos: Trecho[] = [];
  let atual = '';
  let emMath = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (c === '\\' && texto[i + 1] === '$') {
      atual += emMath ? '\\$' : '$';
      i++;
    } else if (c === '$') {
      if (atual) trechos.push({ math: emMath, conteudo: atual });
      atual = '';
      emMath = !emMath;
    } else {
      atual += c;
    }
  }
  if (emMath) throw new Error('delimitador $ sem par: feche a fórmula com outro $');
  if (atual) trechos.push({ math: false, conteudo: atual });
  return trechos;
}

/** Devolve a mensagem de erro do LaTeX, ou null se tudo renderiza. */
export function erroLatex(texto: string): string | null {
  try {
    for (const t of dividirLatex(texto)) {
      if (t.math) katex.renderToString(t.conteudo, { throwOnError: true });
    }
    return null;
  } catch (e) {
    return (e instanceof Error ? e.message : String(e)).replace(/\u0332/g, '');
  }
}

const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** HTML seguro: texto escapado + fórmulas renderizadas pelo KaTeX. */
export function renderizarLatex(texto: string): string {
  return dividirLatex(texto)
    .map((t) => (t.math ? katex.renderToString(t.conteudo, { throwOnError: false }) : escapar(t.conteudo)))
    .join('');
}

/** Versão em texto puro (para <title>, atributos, etc.). */
export function textoPuro(texto: string): string {
  return dividirLatex(texto)
    .map((t) => t.conteudo)
    .join('');
}
