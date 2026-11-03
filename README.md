# WikiTECH

Uma wiki **não oficial**, feita por alunos do IMPA Tech. Além do apelido, cada aluno escolhe um
**identificador**: uma palavra, um primo, um patrono ou um objeto matemático.

> **Aviso:** a WikiTECH é um projeto independente de alunos. Não é um site oficial do IMPA nem do
> IMPA Tech, não tem vínculo com a instituição e não fala em nome dela. "IMPA" e "IMPA Tech" são
> citados só para dizer de onde vêm os autores.

**Créditos:** a ideia é inspirada na **Wikita**, a wiki feita pelos alunos do ITA. Todo o crédito pela
ideia original é deles. (Para linkar a Wikita no site, preencha `WIKITA_URL` em `src/lib/site.ts`.)

Cada página é um arquivo Markdown neste repositório, e toda contribuição entra por pull request.
Para criar o seu perfil, leia o [CONTRIBUTING.md](CONTRIBUTING.md).

## Stack

- [Astro 7](https://astro.build) com content collections (schemas em Zod)
- [KaTeX](https://katex.org) para LaTeX (`remark-math` + `rehype-katex` no Markdown; o identificador `objeto` e a `bio` também aceitam `$...$`)
- [Pagefind](https://pagefind.app) para busca client-side
- GitHub Pages via GitHub Actions

## Rodando localmente

Requer Node 22 ou superior.

```bash
npm install
npm run dev          # http://localhost:4321
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run check-ids` | Valida o formato de todos os perfis e a unicidade dos identificadores |
| `npm run build` | Gera o site em `dist/` e o índice de busca do Pagefind |
| `npm run preview` | Serve o `dist/` (use para testar a busca, que não funciona no `dev`) |

## Estrutura

```
src/
├── content/
│   ├── pessoas/*.md        # perfis (um arquivo por aluno, criado pelo próprio)
│   └── wiki/*.md           # páginas gerais: cultura, tradições, disciplinas, dicas, glossário
├── content.config.ts       # coleções do Astro
├── schemas/                # schemas Zod de perfil e de página da wiki
├── lib/
│   ├── normalizar.ts       # normalização e regra de unicidade (também roda no navegador)
│   ├── verificar-perfis.ts # validação completa (usada pelo script e pelo build)
│   ├── latex.ts            # LaTeX inline em campos do frontmatter
│   ├── primos.ts
│   ├── palavras-bloqueadas.ts
│   └── site.ts             # helpers de páginas (links, datas de edição via git)
├── integrations/check-ids.ts  # faz o `astro build` falhar se houver erro nos perfis
├── components/  layouts/  styles/
├── pages/                  # inclui /sobre (aviso de site não oficial + créditos)
scripts/check-ids.ts        # `npm run check-ids`
.github/workflows/site.yml  # valida todo PR; publica a main no GitHub Pages
```

## Regras de validação

O build **falha** se qualquer perfil:

- tiver um campo inválido (ex.: `turma` antes de 2025, `enfase` fora da lista, primo que não é primo, LaTeX quebrado);
- tiver um campo desconhecido (ex.: `foto`, já que não aceitamos fotos no MVP);
- usar um identificador `palavra`, `patrono` ou `objeto` que já pertença a outro perfil. A comparação ignora
  maiúsculas, acentos e espaços (no `objeto`, todos os espaços são ignorados). **Primos podem repetir.**

As mensagens de erro dizem qual arquivo e qual campo estão errados:

```
✖ src/content/pessoas/fulano.md
    identificador.valor: 15 não é primo
```

## Deploy

O workflow `.github/workflows/site.yml` faz o seguinte:

- em **todo PR**: roda `npm run check-ids` e `npm run build`;
- na **main**: faz o mesmo e publica no GitHub Pages.

Para ativar o deploy, vá em **Settings → Pages** do repositório e, em *Source*, escolha **GitHub Actions**.

### Domínio

O site é publicado em **https://anizioamassa.github.io/wikiTECH/**.

Não há nada fixo no código: no CI, o passo `actions/configure-pages` descobre a URL do Pages e passa
`SITE_URL` e `BASE_PATH` para o build. Se o repositório mudar de nome ou de dono, ou ganhar um
domínio próprio, o site se ajusta sozinho. Localmente, o site roda na raiz (`/`).

Links internos no Markdown podem ser escritos como absolutos (`[Identificadores](/identificadores)`):
o build acrescenta o prefixo `/wikiTECH` automaticamente.
