# WikIMPA

A wiki feita pelos alunos do IMPA Tech, inspirada na Wikita do ITA. Além do apelido, cada aluno
escolhe um **identificador**: uma palavra, um primo, um patrono ou um objeto matemático.

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
├── components/  layouts/  pages/  styles/
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

O site está configurado para `https://wikitech.github.io` (raiz do domínio, `base: '/'`). No GitHub, um
endereço `<nome>.github.io` na raiz só existe para um repositório chamado exatamente `<nome>.github.io`
dentro da conta ou organização `<nome>`. Ou seja, **é preciso que este código esteja no repositório
`wikitech/wikitech.github.io`**.

Se o site for publicado em um subcaminho (ex.: `anizioamassa.github.io/wikiTECH`), defina as variáveis
no passo de build do workflow:

```yaml
      - name: Construir o site (Astro + Pagefind)
        run: npm run build
        env:
          SITE_URL: https://anizioamassa.github.io
          BASE_PATH: /wikiTECH
```
