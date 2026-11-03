// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import checkIds from './src/integrations/check-ids.ts';

// O site é publicado em https://wikitech.github.io (raiz do domínio).
// Para publicar em um subcaminho (ex.: usuario.github.io/wikitech), defina
// SITE_URL e BASE_PATH no ambiente, ex.: BASE_PATH=/wikitech
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://wikitech.github.io',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  // a compressão do Astro 7 come o espaço entre texto e links em quebras de linha
  compressHTML: false,
  integrations: [checkIds()],
  markdown: {
    // remark/rehype (em vez do Sätteri, padrão do Astro 7) para usar remark-math + KaTeX
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
});
