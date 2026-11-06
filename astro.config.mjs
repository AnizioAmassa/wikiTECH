// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import checkPerfis from './src/integrations/check-perfis.ts';

// No CI, SITE_URL e BASE_PATH vêm do actions/configure-pages
// (ex.: https://anizioamassa.github.io + /wikiTECH). Localmente, o site roda na raiz.
const base = process.env.BASE_PATH || '/';

/** Prefixa o `base` em links absolutos do Markdown: [x](/sobre) → /wikiTECH/sobre */
function rehypeBaseLinks() {
  const prefixo = base.replace(/\/$/, '');
  /** @param {any} no */
  const visitar = (no) => {
    const href = no.properties?.href;
    if (no.tagName === 'a' && typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') && prefixo) {
      no.properties.href = prefixo + href;
    }
    no.children?.forEach(visitar);
  };
  return (/** @type {any} */ arvore) => visitar(arvore);
}

export default defineConfig({
  site: process.env.SITE_URL || 'https://anizioamassa.github.io',
  base,
  trailingSlash: 'ignore',
  // a compressão do Astro 7 come o espaço entre texto e links em quebras de linha
  compressHTML: false,
  integrations: [checkPerfis()],
  markdown: {
    // remark/rehype (em vez do Sätteri, padrão do Astro 7) para usar remark-math + KaTeX
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeBaseLinks],
    }),
  },
});
